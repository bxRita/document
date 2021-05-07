<!--
  FilePath: \src\components\widget\basis\datatable.vue
  Project: page-design-demo
  CreatedAt: 2021-04-21 17:19:48
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <a-table
    :style="styles"
    v-bind="options"
    :customRow="customRow"
    :customHeaderRow="customHeaderRow"
    :dataSource="optionList"
    @change="changeEvent"
    :ref="'XaDataTable_' + record.id"
    rowKey="id"
  >
  </a-table>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.DATATABLE,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  data() {
    return {
      // rowSelection: {
      //   type: 'radio',
      //   onChange: (selectedRowKeys, selectedRows) => {
      //     console.log(arguments)
      //   }
      // },
      customRow: record => {
        return {
          props: {
            // 属性
          },
          on: {
            // 事件
            click: this.clickEvent, // 点击行
            dblclick: this.dblclickEvent,
            contextmenu: this.contextmenuEvent
            // mouseenter: this.mouseenterEvent, // 鼠标移入行
            // mouseleave: this.mouseleaveEvent
          }
        }
      },
      customHeaderRow: column => {
        return {
          on: {
            click: () => {}
          }
        }
      }
    }
  },
  methods: {
    /**
     * @description 表格刷新
     */
    refreshTable() {
      this.options.isDynamic = !this.options.isDynamic
    },
    /**
     * @description 点击行
     */
    clickEvent(event) {
      this.eventFunctionHandler('click', event)
    },
    /**
     * @description 分页、排序、筛选变化时触发
     */
    changeEvent(event) {
      this.eventFunctionHandler('change', event)
    },
    /**
     * @description 双击行
     */
    dblclickEvent(event) {
      this.eventFunctionHandler('dblclick', event)
    },
    /**
     * @description 鼠标移入行
     */
    mouseenterEvent(event) {
      this.eventFunctionHandler('mouseenter', event)
    },
    /**
     * @description 鼠标移出行
     */
    mouseleaveEvent(event) {
      this.eventFunctionHandler('mouseleave', event)
    },
    /**
     * @description 鼠标移出行
     */
    contextmenuEvent(event) {
      this.eventFunctionHandler('contextmenu', event)
    }
  }
}
</script>
