module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }], '@babel/preset-env'],
  /**
   * 为了能够在vue环境中加载module.exports导出的模块
   * 原因详见 https://github.com/vuejs/vue-cli/issues/2746
   * 用途详见 https://babeljs.io/docs/en/options#sourcetype
   */
  sourceType: 'unambiguous',
  plugins: ['graphql-tag']
}
