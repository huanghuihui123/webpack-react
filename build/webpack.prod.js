const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = merge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',  // 生成简化的 SourceMaps 文件，不包含列信息，只对应到行
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
                cssProcessorOptions: {
                    discardComments: { removeAll: true }
                },
                canPrint: true //是否将插件信息打印到控制台
            }),
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