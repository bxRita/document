/*
 * FilePath: \src\store\modules\design.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-06 16:43:53
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import {
  ADD_DESIGN_CELL,
  UPSERT_DESIGN_CELL,
  SET_SELECT_WIDGET,
  UPDATE_WIDGET_PROP,
  DELETE_SELECT_WIDGET,
  COPY_SELECT_WIDGET,
  RESET_DESIGN_PANEL,
  ADD_SUB_WIDGET_TO_LAYOUT,
  UPDATE_SUB_WIDGET_TO_LAYOUT
} from '../mutation-types'
import {
  updateWidgetPropById,
  getWidgetPropById,
  getPageAllWidget
} from '@/utils/store2design'
import { cloneDeep } from 'lodash'
import widgetCfg from './widget' // 设计面板右侧 grid相关属性配置修改更新
import eventCfg from './event' // 设计面板右侧 事件相关属性配置修改更新
import { WidgetComponentName } from '@/constants'

const design = {
  namespaced: true,
  state: {
    /**
     * 设计界面pageData的JSON数据结构样例如：
     * {
     *    config: { // config 表示页面属性配置
     *      "layout": "horizontal"
     *    },
     *    list: [ // list表示子元素列表
     *      {
     *        id: "xabutton_634534",
     *        key: "xabutton",
     *        style: {},
     *        props: {
     *          type: "primary",
     *          size: "mini",
     *          disabled: false
     *        },
     *        options: {
     *          id: "custom.name"
     *          type: "input"
     *          label: "组件名"
     *        },
     *        custom: {
     *          eventConfig: [],
     *          eventListener: {}
     *        }
     *      }
     *    ]
     * }
     */
    pageData: {
      list: [], // 设计面板子元素
      config: {
        layout: 'horizontal',
        labelCol: {
          xs: 4,
          sm: 4,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4
        },
        wrapperCol: {
          xs: 18,
          sm: 18,
          md: 18,
          lg: 18,
          xl: 18,
          xxl: 18
        },
        hideRequiredMark: false,
        customStyle: ''
      }
    },
    currentSelectItem: null,
    widgetPropUpdate: null
  },
  getters: {
    widgetPropUpdate: state => state.widgetPropUpdate, // 选中组件属性更新后 需要在设计面板上更新组件
    currentSelectItem: state => state.currentSelectItem,
    pageData: state => state.pageData,
    pageConfig: state => state.pageData.config, // 页面属性
    compList: state => state.pageData.list, // 页面组件
    getWidgetById: state => id => {
      return getWidgetPropById(state.pageData.list, id)
    },
    getAllWidget: state => () => {
      return getPageAllWidget(state.pageData.list)
    }
  },
  mutations: {
    ...widgetCfg.mutations,
    ...eventCfg.mutations,
    // 设计面板添加组件
    [ADD_DESIGN_CELL]: (state, payload) => {
      state.pageData.list.push(payload)
      state.currentSelectItem = payload // 设置新增项为当前选中项
    },
    [UPSERT_DESIGN_CELL]: (state, payload) => {
      state.pageData.list.push(payload)

      state.currentSelectItem = payload // 设置新增项为当前选中项
    },
    [SET_SELECT_WIDGET]: (state, payload) => {
      state.currentSelectItem = payload
    },
    [COPY_SELECT_WIDGET]: state => {
      const currentSelectWidget = state.currentSelectItem
      const traverse = array => {
        array.forEach((element, index) => {
          // 容器组件
          if (element.subProp) {
            element[element.subProp].forEach(item => {
              if (item.subProp) {
                item[item.subProp].forEach(i => {
                  traverse(i.list)
                })
              } else {
                traverse(item.list)
              }
            })
          }
          // 子列表
          if (element.list) {
            traverse(element.list)
          }

          if (element.id === currentSelectWidget.id) {
            let cloneNode = cloneDeep(element)
            array.splice(
              index + 1,
              0,
              Object.assign(cloneNode, {
                id: `${element.key}_${new Date().getTime()}`
              })
            )
          }
        })
      }

      traverse(state.pageData.list)
    },
    [DELETE_SELECT_WIDGET]: state => {
      const currentSelectWidget = state.currentSelectItem

      const traverse = array => {
        array = array.filter((element, index) => {
          if (element.subProp) {
            element[element.subProp].forEach(item => {
              if (item.subProp) {
                item[item.subProp].forEach(i => {
                  i.list = traverse(i.list)
                })
              } else {
                item.list = traverse(item.list)
              }
            })
          }

          if (element.list) {
            element.list = traverse(element.list)
          }

          // 校验是否是当前选中组件
          if (element.id !== currentSelectWidget.id) {
            return true
          } else {
            let len = array.length
            state.currentSelectItem =
              len === 1
                ? { id: null }
                : len - 1 > index
                ? array[index + 1]
                : array[index - 1] // 选中其它组件
            return false
          }
        })

        return array
      }

      state.pageData.list = traverse(state.pageData.list)
    },
    [UPDATE_WIDGET_PROP]: (state, payload) => {
      const widgetId = payload.widgetId
      updateWidgetPropById(state.pageData.list, payload)
      state.widgetPropUpdate = `${widgetId}-${new Date().getTime()}`
    },
    [RESET_DESIGN_PANEL]: (state, payload) => {
      state.pageData.list = []
    },
    // 更新组件到 布局或容器组件
    [UPDATE_SUB_WIDGET_TO_LAYOUT]: (state, payload) => {
      const { parentWidget, idxObj, newList } = payload
      let tr
      const idx = idxObj?.idx,
        pidx = idxObj?.pidx
      if (!parentWidget) {
        // 一级 组件
        state.pageData.list = newList
      } else {
        // 子组件
        let cur = getWidgetPropById(state.pageData.list, parentWidget.id)
        switch (cur.key) {
          case WidgetComponentName.GRID:
          case WidgetComponentName.TABS:
          case WidgetComponentName.LAYOUT_SIMPLE:
            cur[cur.subProp][idx].list = newList
            break
          case WidgetComponentName.TABLE:
            tr = cur[cur.subProp][pidx]
            tr[tr.subProp][idx].list = newList
            break
          default:
            cur.list = newList
            break
        }
      }
    },
    // 添加子组件到 布局或容器组件
    [ADD_SUB_WIDGET_TO_LAYOUT]: (state, payload) => {
      const { parentWidget, toAddWidget, idxObj, widgetIdx } = payload
      let tr
      const idx = idxObj?.idx,
        pidx = idxObj?.pidx

      let cur = getWidgetPropById(state.pageData.list, parentWidget.id)
      switch (cur.key) {
        case WidgetComponentName.GRID:
        case WidgetComponentName.TABS:
        case WidgetComponentName.LAYOUT_SIMPLE:
          cur[cur.subProp][idx].list.splice(widgetIdx, 0, toAddWidget)
          break
        case WidgetComponentName.TABLE:
          tr = cur[cur.subProp][pidx]
          tr[tr.subProp][idx].list.splice(widgetIdx, 0, toAddWidget)
          break
        default:
          cur.list.splice(widgetIdx, 0, toAddWidget)
          break
      }
    }
  },
  actions: {
    ...widgetCfg.actions,
    ...eventCfg.actions,
    updateSubWidgetToLayout({ commit }, payload) {
      commit(UPDATE_SUB_WIDGET_TO_LAYOUT, payload)
    },
    addSubWidgetToLayout({ commit }, payload) {
      commit(ADD_SUB_WIDGET_TO_LAYOUT, payload)
    },
    /**
     * 更新组件属性值
     * @param {*} param0
     * @param {*} payload {widgetId，propId，val}
     */
    updateWidgetProp({ commit }, payload) {
      commit(UPDATE_WIDGET_PROP, payload)
    },
    addWidget({ commit }, payload) {
      commit(ADD_DESIGN_CELL, payload)
    },
    upsertWidget({ commit }, payload) {
      commit(UPSERT_DESIGN_CELL, payload)
    },
    /**
     * @description 设置组件选中
     * @param {*} param0
     * @param {*} payload
     */
    setSelectedWidget({ commit }, payload) {
      commit(SET_SELECT_WIDGET, payload)
    },
    /**
     * @description 删除当前已选择的节点
     * @param {*} param0
     * @param {*} payload
     */
    deleteSelectedWidget({ commit }, payload) {
      commit(DELETE_SELECT_WIDGET, payload)
    },
    /**
     * @description 复制当前已选择的节点
     * @param {*} param0
     * @param {*} payload
     */
    copySelectedWidget({ commit }, payload) {
      commit(COPY_SELECT_WIDGET, payload)
    },
    /**
     * @description 清空当前的设计面板区
     * @param {*} param0
     * @param {*} payload
     */
    resetDesignPanel({ commit }, payload) {
      commit(RESET_DESIGN_PANEL, payload)
    }
  }
}

export default design
