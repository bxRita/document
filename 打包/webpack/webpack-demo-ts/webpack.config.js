const path = require('path');
module.exports = {
   //Javascript 执行的入口
   entry: "./main",
   mode: "development",
   output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
     filename: "bundle.js",
     path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
   },
    resolve: {
        // 先尝试以ts为后缀的typeScript源码文件
        extensions: ['.ts','.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    devtool: 'source-map' // 输出sourcemap以方便在浏览器里调试typeScript代码
}