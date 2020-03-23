const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //Javascript 执行的入口
  entry: "./main.js",
  mode: "development",
  output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
  },
  // devtool: 'source-map',
  module: {
      rules: [
        // ---------test Loader-------
          // {
          //     test: /\.css$/,
          //     use: [
          //         'style-loader', 
          //         {
          //             loader: 'css-loader', 
          //             options: {
          //               //   minimize: true
          //               }
          //         }
          //   ] //如上配置告诉Webpack ， 在遇到以.css 结尾的文件时，先使用css-loader 读取css 文件，再由styleloader 将css 的内容注入JavaScript 里
          // }

          // --------test plugin-------
          {
            test: /\.css/,
            loaders: ExtractTextPlugin.extract({
              //转换.css 文件需要使用的Loader
              use: ['css-loader']
            })
          }
      ]
  },
  plugins: [
    new ExtractTextPlugin({
      // filename: `[name]_[hash:8].css` // 从.js 文件中提取出来的.css 文件的名称
      filename: `[name]_style.css` // 暂时为了方便在html文件中引入css 采用固定格式文件名
    })
  ]
};