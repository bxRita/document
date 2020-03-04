const path = require("path");

module.exports = {
    //Javascript 执行的入口
  entry: "./main.js",
  mode: "development",
  output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader', 
                  {
                      loader: 'css-loader', 
                      options: {
                        //   minimize: true
                        }
                  }
            ] //如上配置告诉Webpack ， 在遇到以.css 结尾的文件时，先使用css-loader 读取css 文件，再由styleloader 将css 的内容注入JavaScript 里
          }
      ]
  }
};