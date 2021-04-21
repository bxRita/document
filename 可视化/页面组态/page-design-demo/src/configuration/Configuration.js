/*
 * FilePath: \src\configuration\Configuration.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:26:02
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { cloneDeep } from 'lodash'
import DEFAULT_CONFIG from './DefaultConfig'

export default class Configuration {
  constructor(options) {
    this.options = Object.assign([], DEFAULT_CONFIG, options)
  }
  setOption() {}
  getOption(key) {
    if (!key) return cloneDeep(this.options)
    return cloneDeep(this.options.filter(item => item.key === key))
  }
  getDefaultConfig() {
    return cloneDeep(this.options)
  }
}
