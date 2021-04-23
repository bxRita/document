/*
 * FilePath: \src\configuration\widget\basis\datepicker.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-20 17:24:52
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const datepickerConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.DATEPICKER,
  icon: 'icon-button-remove',
  props: {
    allowClear: true,
    autoFocus: false,
    disabled: false,
    mode: 'date',
    size: 'default',
    inputReadOnly: false
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '日期选择',
    height: 50,
    width: 100,
    iconname: 'iconanniu',
    linkageEventConfig: [].concat(
      [],
      ...commonConfig.custom.linkageEventConfig
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1', // 组件事件
          eventName: 'panelChange',
          eventDes: '弹出日历和关闭日历的回调'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'panelChange',
          eventDes: '日期面板变化时的回调'
        }
      ],
      ...commonConfig.custom.eventConfig
    ),
    eventListener: {}
  }),
  options: [].concat(commonConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.allowClear',
      label: '显示清除按钮',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.autoFocus',
      label: '自动聚焦',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.disabled',
      label: '禁用状态',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.mode',
      label: '日期模式',
      type: 'select',
      list: [
        {
          value: 'date',
          label: '日期'
        },
        {
          value: 'month',
          label: '月'
        },
        {
          value: 'week',
          label: '周'
        },
        {
          value: 'range',
          label: '区间范围'
        }
      ]
    },
    {
      id: 'props.size',
      label: '大小',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'large',
          label: '大'
        },
        {
          value: 'small',
          label: '小'
        }
      ]
    },
    {
      id: 'props.inputReadOnly',
      label: '输入框只读',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    }
  ])
}

export default datepickerConfig
