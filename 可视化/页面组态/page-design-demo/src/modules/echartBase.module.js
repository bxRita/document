/*
 * FilePath: \src\modules\echartBase.module.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 15:59:11
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import * as echarts from 'echarts'
import 'echarts-gl'
import Observable from '@/modules/observer'

export default class EchartBase extends Observable {
  constructor() {
    super()
    this.echartInstance = null
  }
  getEcharsInstance() {
    return this.echartInstance
  }
  resize() {
    this.echartInstance && this.echartInstance.resize()
  }
  registerMap(json) {
    echarts.registerMap('china', json)
  }
  load(options, parent, theme) {
    if (!options) {
      return
    }
    if (this.echartInstance) {
      this.echartInstance.clear()
    } else {
      this.echartInstance = echarts.init(parent, theme)
    }
    this.setOption(options)
  }
  setDataSource() {}
  setOption(options) {
    this.option = options
    this.echartInstance && this.echartInstance.setOption(options)
  }
  getOption() {
    return this.option ? this.option : {}
  }
  destroy() {
    this.echartInstance && this.echartInstance.clear()
    this.echartInstance = null
  }
}
