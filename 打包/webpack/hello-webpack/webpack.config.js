const path = require("path");
const ExtractTextPlugin = require ('extract-text-webpack-plugin');

module.exports = {
    //Javascript 执行的入口
  entry: "./src/index.js",
  mode: "development",
  output: {
    // 输出文件的名称
    filename: "index.js",
    // 输出文件存放目录
    path: path.resolve(__dirname, "./lib"),
    // 将输出文件都放到dist 目录下
    libraryTarget: 'commonjs2'
  },
  // 通过正则命中所有以react 或者babel-runtime 开头的模块，
  // ／这些模块通过注册在运行环境中的全局变量访问，不能被打包进输出的代码里，防止它们出现多次。
  externals: /^(react|babel-runtime)/,
  module: {
      rules: [
          {
              test: /\.js$/,
              use: ['babel-loader'],
              // 排除node modules 目录下的文件，
              // node modules 目录下的文件都采用了ESS 语法，没必要再通过Bab el 转换。
              exclude: path.resolve(__dirname, 'node_modules')
          },{
            // 增加对css文件的支持
            test: /\.css/,
            // 提取Chunk 中的css 代码到单独的文件中
            use: ExtractTextPlugin.extract({
              use: ['css-loader']
            })
          }
      ]
  },
  plugins: [
    new ExtractTextPlugin({
      // 输出css文件名称
      filename: 'index.css'
    })
  ],
  // 输出sourceMap
  devtool: 'source-map'
};