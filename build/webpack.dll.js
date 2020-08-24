const path = require('path')
const webpack = require('webpack')

module.exports = {
    // 第三方模块
    entry: {
        vendor: ['react', 'react-dom', 'react-router-dom', 'core-js', 'regenerator-runtime']
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