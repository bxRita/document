/*
 * FilePath: \src\utils\EventBus.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-17 18:44:32
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

const EventBus = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  install(Vue) {
    if (this.installed) {
      return
    }
    this.installed = true

    Object.defineProperties(Vue.prototype, {
      $bus: {
        get: function get() {
          return new Vue()
        }
      }
    })
  }
}

export { EventBus }
