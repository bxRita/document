/*
 * FilePath: \src\configuration\component\basis\checkbox.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-16 09:12:22
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const checkboxConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.CHECKBOX,
  icon: 'icon-button-remove',
  props: {
    defaultValue: [],
    value: [],
    disabled: false,
    name: 'checkbox_' + new Date().getTime(),
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' }
    ] // 静态数据
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '多选框',
    height: 50,
    width: 100,
    iconname: 'iconanniu',
    linkageEventConfig: [].concat(
      [
        {
          id: 'setDisabled',
          label: '设置组件灰化状态'
        }
      ],
      ...commonConfig.custom.linkageEventConfig
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1', // 组件事件
          eventName: 'change',
          eventDes: '点击触发'
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
      id: 'props.name',
      label: 'name属性',
      type: 'input'
    },
    {
      id: 'props.disabled',
      label: '禁用状态',
      type: 'switch',
      activeText: '启用',
      inactiveText: '禁用'
    },
    {
      id: 'props.options',
      label: '静态数据',
      type: 'selectOption'
    }
  ])
}

export default checkboxConfig
