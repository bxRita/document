/*
 * FilePath: \src\store\modules\widget\select.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-16 14:22:05
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { getWidgetPropById } from '@/utils/store2design'

import {
  ADD_WIDGET_DATA_ITEM,
  DELETE_WIDGET_DATA_ITEM,
  UPDATE_WIDGET_DATA_ITEM
} from '@/store/mutation-types'

export default {
  mutations: {
    [UPDATE_WIDGET_DATA_ITEM]: (state, payload) => {
      const { widgetId, propId, propName, val, idx } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)

      let matchs = propId.match(/\w+|\d+/g),
        len = matchs.length
      let optionItem =
        len === 1 ? item[matchs[0]][idx] : item[matchs[0]][matchs[1]][idx]

      if (optionItem) {
        optionItem[propName] = val
      }
    },
    [DELETE_WIDGET_DATA_ITEM]: (state, payload) => {
      const { widgetId, propId, idx } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)

      let matchs = propId.match(/\w+|\d+/g),
        len = matchs.length
      if (len === 1) {
        item[matchs[0]].splice(idx, 1)
      }

      if (len === 2) {
        item[matchs[0]][matchs[1]].splice(idx, 1)
      }
    },
    [ADD_WIDGET_DATA_ITEM]: (state, payload) => {
      const { widgetId, propId, val } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)

      let matchs = propId.match(/\w+|\d+/g),
        len = matchs.length
      if (len === 1) {
        item[matchs[0]].push(val)
      }
      if (len === 2) {
        item[matchs[0]][matchs[1]].push(val)
      }
    }
  },
  actions: {
    // select 组件静态数据源 添加选项值
    addWidgetDataItem({ commit }, payload) {
      commit(ADD_WIDGET_DATA_ITEM, payload)
    },
    // select 组件静态数据源  删除数据项
    deleteWidgetDataItem({ commit }, payload) {
      commit(DELETE_WIDGET_DATA_ITEM, payload)
    },
    // select 组件静态数据源  删除数据项
    updateWidgetDataItem({ commit }, payload) {
      commit(UPDATE_WIDGET_DATA_ITEM, payload)
    }
  }
}
