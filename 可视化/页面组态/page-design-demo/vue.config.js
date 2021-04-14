const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
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
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://ebr.hollicube.com',
        https: true,
        secure: false,
        changeOrigin: true
      }
    }
  }
}
