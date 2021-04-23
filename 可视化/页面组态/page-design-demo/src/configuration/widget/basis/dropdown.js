/*
 * FilePath: \src\configuration\component\basis\dropdown.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 17:22:04
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const dropdownConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.DROPDOWN,
  icon: 'icon-select',
  props: {
    disabled: false,
    placement: 'bottomLeft',
    trigger: ['hover'],
    options: [
      // 静态数据
      {
        value: '1',
        label: '选项1'
      },
      {
        value: '2',
        label: '选项2'
      }
    ]
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '下拉菜单',
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
          eventName: 'visibleChange',
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
      id: 'props.disabled',
      label: '禁用状态',
      type: 'switch',
      activeText: '启用',
      inactiveText: '禁用'
    },
    {
      id: 'props.placement',
      label: '模式',
      type: 'select',
      list: [
        {
          value: 'bottomLeft',
          label: 'bottomLeft'
        },
        {
          value: 'bottomCenter',
          label: 'bottomCenter '
        },
        {
          value: 'bottomRight',
          label: 'bottomRight'
        },
        {
          value: 'topLeft',
          label: 'topLeft'
        },
        {
          value: 'topCenter',
          label: 'topCenter'
        },
        {
          value: 'topRight',
          label: 'topRight'
        }
      ]
    },
    {
      id: 'props.options',
      label: '静态数据',
      type: 'selectOption'
    }
  ])
}

export default dropdownConfig
