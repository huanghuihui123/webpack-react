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