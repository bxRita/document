/*
 * FilePath: \src\store\modules\widget\table.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 13:52:48
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { getWidgetPropById } from '@/utils/store2design'

import { ADD_TABLE_COL, ADD_TABLE_ROW } from '@/store/mutation-types'

export default {
  mutations: {
    [ADD_TABLE_COL]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, payload.widgetId)
      let trs = item.trs,
        len = trs.length
      for (let i = 0; i < len; i++) {
        let tr = trs[i]
        tr.tds.push({
          colspan: 1,
          rowspan: 1,
          list: []
        })
      }
    },
    [ADD_TABLE_ROW]: (state, payload) => {
      let pageWidgetList = state.pageData.list
      let item = getWidgetPropById(pageWidgetList, payload.widgetId)
      let trs = item.trs,
        len = trs.length
      if (len) {
        let sum = trs[len - 1].tds.reduce(function (prev, cur, index, arr) {
          return prev + cur.colspan
        }, 0)

        let newTds = []
        for (let i = 0; i < sum; i++) {
          newTds.push({
            colspan: 1,
            rowspan: 1,
            list: []
          })
        }
        trs.push({
          subProp: 'tds',
          tds: newTds
        })
      } else {
        trs.push({
          subProp: 'tds', // 包含子元素的属性名
          tds: [
            {
              colspan: 1,
              rowspan: 1,
              list: []
            },
            {
              colspan: 1,
              rowspan: 1,
              list: []
            }
          ]
        })
      }
    }
  },
  actions: {
    // 增加tab 列
    addTableCol({ commit }, payload) {
      commit(ADD_TABLE_COL, payload)
    },
    // 删除tab页签
    addTableRow({ commit }, payload) {
      commit(ADD_TABLE_ROW, payload)
    }
  }
}
