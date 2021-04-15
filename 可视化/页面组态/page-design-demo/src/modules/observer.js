/*
 * FilePath: \src\modules\observer.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 15:59:31
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

/**
 * 事件订阅，发布
 */
export default class Observer {
  constructor() {
    this.event = {}
  }
  /**
   * 监听事件
   * @param {String} name 监听事件名称
   * @param {Function} fn 监听事件回调
   */
  on(name, fn) {
    if (typeof fn !== 'function') {
      return new Error('Parameter error,The second argument must be a function')
    }
    if (!this.event[name]) {
      this.event[name] = []
      this.event[name].push(fn)
    } else {
      this.event[name].push(fn)
    }

    return this
  }
  once(name, fn) {
    this.off(name)
    this.on(name, fn)
  }
  /**
   * 删除监听事件
   * @param {String} name 关闭监听事件名称
   */
  off(name) {
    if (this.event[name]) {
      for (let i in this.event) {
        if (name === i) {
          delete this.event[i]
        }
      }
    }
    return this
  }
  /**
   * 触发事件
   * @param {String} name 触发事件名称
   * @param {[]} arg 参数
   */
  trigger(name, arg) {
    if (this.event[name] && Array.isArray(this.event[name])) {
      let event = this.event[name].slice()
      for (let i = 0, len = event.length; i < len; i++) {
        if (typeof event[i] === 'function') {
          event[i].apply(null, [arg])
        }
      }
    }
  }
}
