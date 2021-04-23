/*
 * 设计面板 grid栅格 相关操作
 * FilePath: \src\store\modules\widget\grid.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 09:49:58
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { getWidgetPropById } from '@/utils/store2design'

import {
  ADD_GRID_COL,
  DELETE_GRID_COL,
  UPDATE_GRID_COL
} from '@/store/mutation-types'

const grid = {
  mutations: {
    [ADD_GRID_COL]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      const { widgetId, col } = payload
      let item = getWidgetPropById(pageWidgetList, widgetId)
      item.columns.push(col)
    },
    [DELETE_GRID_COL]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, payload.widgetId)
      item.columns.splice(payload.colIdx, 1)
    },
    [UPDATE_GRID_COL]: (state, payload) => {
      const { widgetId, colIdx, val } = payload
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, widgetId)
      let updateCol = item.columns[colIdx]
      updateCol.span = val
    }
  },
  actions: {
    addGridCol({ commit }, payload) {
      commit(ADD_GRID_COL, payload)
    },
    deleteGridCol({ commit }, payload) {
      commit(DELETE_GRID_COL, payload)
    },
    updateGridColSpan({ commit }, payload) {
      commit(UPDATE_GRID_COL, payload)
    }
  }
}

export default grid
