/*
 * FilePath: \src\store\modules\event\index.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 09:57:24
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { getWidgetPropById } from '@/utils/store2design'
import { UPDATE_WIDGET_EVENT } from '@/store/mutation-types'
export default {
  mutations: {
    [UPDATE_WIDGET_EVENT]: (state, payload) => {
      const { widgetId, modify } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)

      const propId = modify.id,
        eventObj = modify.value
      let ary = propId.match(/\w+|\d+/g),
        last = ary.pop()
      let obj = ary.reduce((a, b) => a[b], item)
      if (obj) {
        let temp = {}
        for (let key in eventObj) {
          temp[key] = eventObj[key].toString()
        }

        obj[last] = temp
      }
    }
  },
  actions: {
    // 更新组件事件
    updateWidgetEvent({ commit }, payload) {
      commit(UPDATE_WIDGET_EVENT, payload)
    }
  }
}
