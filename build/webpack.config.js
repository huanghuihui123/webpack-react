const path = require('path')
const os = require('os')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')


const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

console.log(process.env.NODE_ENV)
const isDevMode = process.env.NODE_ENV === 'development'
console.log(isDevMode)

const MiniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: '/',
        hmr: isDevMode
    }
}


module.exports = {
    entry: path.resolve(__dirname, '../src/index.tsx'), // 入口文件
    output: {
        path: path.resolve(__dirname, '../dist'), // 打包后的目录
        filename: 'js/[name].[hash:8].js', // 打包后的文件名称
        chunkFilename: 'js/[name].[hash:8].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    'happypack/loader?id=babel',
                    'happypack/loader?id=ts'
                ],
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=babel']
            },
            {
                test: /\.css$/,
                use: [
                    isDevMode ? 'style-loader' : MiniCssExtractPluginLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                // path: 路径、name: 当前文件名、local: 当前类名、[hash:base64:5]: 截取哈希算法前5位
                                localIdentName: '[name]_[hash:base64:5]_[local]'
                            }
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    isDevMode ? 'style-loader' : MiniCssExtractPluginLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                // path: 路径、name: 当前文件名、local: 当前类名、[hash:base64:5]: 截取哈希算法前5位
                                localIdentName: '[name]_[hash:base64:5]_[local]'
                            }
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ] // 从右向左解析原则
            },
            {
                test: /\.(jpe?g|png|gif|webp)$/i, //图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // 配置 html 模板
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        // 清理 dist 文件夹内残留的上次打包的文件
        new CleanWebpackPlugin(),
        // 把css样式从js文件中提取到单独的css文件中
        new MiniCssExtractPlugin({
            filename: isDevMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: isDevMode ? 'css/[id].css' : 'css/[id].[hash].css'
        }),
        // 抽离第三方模块
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../dll/vendor-manifest.json')
        }),
        new AddAssetHtmlPlugin({ filepath: require.resolve('../dll/vendor.dll.js') }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
        new HappyPack({
            id: 'ts',
            loaders: [
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        transpileOnly: true
                    }
                }
            ],
            threadPool: happyThreadPool
        }),
        new HappyPack({
            // id 标识符，要和 rules 中指定的 id 对应起来
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),
            'pages': path.resolve(__dirname, '../src/pages'),
        },
        extensions: ['.tsx', '.ts', '.js', '.json']
    }
}