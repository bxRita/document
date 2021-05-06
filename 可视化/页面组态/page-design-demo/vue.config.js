const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
    // 增加在线编辑器插件
    config
      .plugin('MonacoWebpackPlugin')
      .use(require('monaco-editor-webpack-plugin'))
  },
  outputDir: 'dist',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff',
          'layout-color': '#9867f7'
        },
        strictMath: false,
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8089,
    proxy: {
      '/api': {
        target: 'http://ebr.hollicube.com',
        https: true,
        secure: false,
        changeOrigin: true
      },
      '/data': {
        target: 'http://ebr.hollicube.com',
        https: true,
        secure: false,
        changeOrigin: true
      }
    }
  }
}
