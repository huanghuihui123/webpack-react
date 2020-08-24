## 使用 webpack 搭建 React 环境

### 创建项目，初始化 npm
```
mkdir webpack-study && cd webpack-study
npm init -y
```

### 安装 webpack
```
npm install webpack webpack-cli --save-dev
```

### 在 package.json 文件添加以下命令
```
"scripts": {
    "dev": "webpack --config build/webpack.config.js"
}
```

### 创建 build/webpack.config.js，配置入口和打包目录
```
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'), // 入口文件
    output: {
        path: path.resolve(__dirname, '../dist'), // 打包后的目录
        filename: 'js/[name].[hash:8].js', // 打包后的文件名称
        chunkFilename: 'js/[name].[hash:8].js',
        publicPath: '/'
    }
}
```

### 安装 html-webpack-plugin，配置 html 模板
```
npm i -D html-webpack-plugin
```
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    ...
    plugins: [
        // 配置 html 模板
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        })
        ...
    ]
}
```

### 安装 clean-webpack-plugin，清理 dist 文件夹内残留的上次打包的文件
```
npm i -D clean-webpack-plugin
```
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    ...
    plugins: [
        ...
        // 清理 dist 文件夹内残留的上次打包的文件
        new CleanWebpackPlugin()
        ...
    ]
}
```

### 用 babel 转义js文件
```
npm install --save-dev babel-loader @babel/core @babel/preset-env
npm install core-js regenerator-runtime
```
code-js: JavaScript标准库的polyfill (promise，symbols等)。
regenerator-runtime: 当使用 generators/async 函数时，需要引入该插件。

```
// 公共 bable 配置
const babelOptions = {
    presets: [
        [
            '@babel/preset-env',
            {
                // 根据源码和target 自动引入polyfill，此时不需要在app入口引入 polyfill
                useBuiltIns: 'usage',
                corejs: 3,
            }
        ]
    ],
    cacheDirectory: true
}

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            }
        ]
    }
}
```

### 加载 CSS
```
npm install --save-dev style-loader css-loader
```

```
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    }
}
```
### 加载 LESS
```
npm install --save-dev less less-loader
```

```
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ] // 从右向左解析原则
            }
        ]
    }
}
```

### 为 CSS 添加浏览器前缀
```
npm install --save-dev postcss-loader autoprefixer
```

在项目根目录下创建一个 postcss.config.js 文件:
```
module.exports = {
    plugins: [require('autoprefixer')] 
}
```

### 加载图片、字体、媒体等文件
```
npm install --save-dev file-loader url-loader
```
```
module.exports = {
    module: {
        rules: [
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
    }
}
```

### 配置 webpack-dev-server 进行热更新
```
npm install --save-dev webpack-dev-server
```
```
module.exports = {
    ...
    devServer: {
        port: 3000,
        compress: true, // 为每个静态文件开启 gzip
        contentBase: '../dist',
        historyApiFallback: true, // 当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容
    },
    plugins: [
        new Webpack.NamedModulesPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ]
})
```

### 区分开发环境和生产环境
```
npm install --save-dev cross-env
npm install --save-dev webpack-merge
```
1. 创建 build/webpack.dev.js:
```
const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 3000,
        compress: true, // 为每个静态文件开启 gzip
        contentBase: '../dist',
        historyApiFallback: true, // 当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容
    },
    plugins: [
        new Webpack.NamedModulesPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ]
})
```
2. 创建 build/webpack.prod.js:
```
const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

module.exports = merge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',  // 生成简化的 SourceMaps 文件，不包含列信息，只对应到行
    ...
})
```
3. 修改 package.json:
```
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --hot --config build/webpack.dev.js --open",
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.prod.js",
  },
```

### 把 css 样式从 js 文件中提取到单独的 css 文件中
```
npm install --save-dev mini-css-extract-plugin
```

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDevMode = process.env.NODE_ENV === 'development'

const MiniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: '../dist/css/',
        hmr: isDevMode
    }
}

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    isDevMode? 'style-loader': MiniCssExtractPluginLoader,
                    ...
                ]
            },
                        {
                test: /\.less$/,
                use: [
                    isDevMode? 'style-loader': MiniCssExtractPluginLoader,
                    ...
                ]
            },
        ]
    },
    plugins: [
        ...
        // 把css样式从js文件中提取到单独的css文件中
        new MiniCssExtractPlugin({
            filename: isDevMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevMode ? '[id].css' : '[id].[hash].css'
        }),
        ...
    ]
}
```

### 优化和压缩 CSS
```
npm install --save-dev optimize-css-assets-webpack-plugin
npm install cssnano --save-dev
```

在 webpack.prod.js 文件添加配置:
```
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(webpackConfig, {
    ...
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
                cssProcessorOptions: {
                    discardComments: { removeAll: true }
                },
                canPrint: true //是否将插件信息打印到控制台
            })
        ],
    },
})
```

### 优化和压缩 js
```
npm install --save-dev webpack-parallel-uglify-plugin
```
当 webpack 有多个 JS 文件需要输出和压缩时，ParallelUglifyPlugin 会开启多个子进程，并行处理多个子任务。
在 webpack.prod.js 文件添加配置:
```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = merge(webpackConfig, {
    ...
    optimization: {
        minimizer: [
            ...
            new ParallelUglifyPlugin({
                cacheDir: '.cache/',
                uglifyJS: {
                    warnings: false, // 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出
                    output: {
                        comments: false, // 是否保留代码中的注释，默认为保留
                        beautify: false // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出
                    },
                    compress: {
                        drop_console: true // 是否删除代码中所有的console语句，默认为不删除
                    }
                }
            })
        ],
    },
})
```

### 加载 Typescript 文件
```
npm install --save-dev ts-loader typescript
```
在 webpack.config.js 文件添加配置:

```
module.exports = {
    ...
    module: {
        entry: path.resolve(__dirname, '../src/index.tsx'), // 入口文件
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    'ts-loader'
                ]
            },
            ...
        ]
    }
}
```

### 缩小文件的搜索范围
* alias: 配置别名，减少搜索范围
* extensions: webpack会根据extensions定义的后缀查找文件(频率较高的文件类型优先写在前面)
```
resolve: {
    alias: {
        '@': path.resolve(__dirname, '../src'),
        'assets': path.resolve('src/assets'),
        'components': path.resolve('src/components')
    },
    extensions: ['.tsx', '.ts', '.js', '.json']
}
```

### 使用 DllPlugin 和 DllReferencePlugin 抽离第三方模块，提高打包的速度
```
npm i --save-dev add-asset-html-webpack-plugin
```

* 新增 webpack.dll.js 文件：
```
const path = require('path')
const webpack = require('webpack')

module.exports = {
    // 你想要打包的模块的数组
    entry: {
        vendor: ['react']
    },
    output: {
        path: path.resolve(__dirname, '../dll'), // 打包后文件输出的位置
        filename: '[name].dll.js',
        library: '[name]_library'
        // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../dll/[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        })
    ]
}
```

* 在package.json中配置如下命令:
```
"dll": "webpack --config build/webpack.dll.js"
```

* 在 webpack.config.js 中增加以下代码:
```
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
...
plugins: [
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../dll/vendor-manifest.json')
    }),
    new AddAssetHtmlPlugin({ filepath: require.resolve('../dll/vendor.dll.js') })
]
...
```

### 使用 HappyPack 开启多进程 Loader 转换
```
npm install --save-dev happypack
npm install --save-dev fork-ts-checker-webpack-plugin
```
作用：将任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间；
适用于比较复杂的大中型项目，使用 happypack 才能看到比较明显的构建速度提升，否则反而延长了项目的构建速度；

```
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    'happypack/loader?id=babel',
                    'happypack/loader?id=ts'
                ]
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=babel']
            }
        ]
    },
    plugins: [
       ...
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
            loaders: [
                {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            ],
            threadPool: happyThreadPool
        }),
    ]
}

```