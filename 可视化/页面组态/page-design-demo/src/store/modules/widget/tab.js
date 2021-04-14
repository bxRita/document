/*
 * FilePath: \src\store\modules\widget\tab.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 11:01:03
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { getWidgetPropById } from '@/utils/store2design'

import {
  ADD_TAB_COL,
  DELETE_TAB_COL,
  UPDATE_TAB_COL
} from '@/store/mutation-types'

const grid = {
  mutations: {
    [ADD_TAB_COL]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, payload.widgetId)
      const RANDOM = parseInt(Math.random() * 100)
      item.columns.push({
        value: `${new Date().getTime()}`,
        label: `选项${RANDOM}`,
        list: []
      })
    },
    [DELETE_TAB_COL]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, payload.widgetId)
      item.columns.splice(payload.colIdx, 1)
    },
    [UPDATE_TAB_COL]: (state, payload) => {
      const { widgetId, colIdx, val, propKey } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)
      let updateCol = item.columns[colIdx]
      updateCol[propKey] = val
    }
  },
  actions: {
    // 增加tab 列
    addTabCol({ commit }, payload) {
      commit(ADD_TAB_COL, payload)
    },
    // 删除tab页签
    deleteTabCol({ commit }, payload) {
      commit(DELETE_TAB_COL, payload)
    },
    // 更新tab key值
    updateTabProp({ commit }, payload) {
      commit(UPDATE_TAB_COL, payload)
    }
  }
}

export default grid
