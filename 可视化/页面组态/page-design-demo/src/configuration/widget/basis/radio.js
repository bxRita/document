/*
 * FilePath: \src\configuration\widget\basis\radio.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-21 15:45:00
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const radioConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.RADIO,
  icon: 'icon-button-remove',
  props: {
    defaultValue: '',
    disabled: false,
    name: '',
    radioType: 'radio', // 按钮样式
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
    ],
    size: 'default',
    buttonStyle: 'outline'
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '单选框',
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
      id: 'props.defaultValue',
      label: '默认值',
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
      id: 'props.name',
      label: 'name属性',
      type: 'input'
    },
    {
      id: 'props.size',
      label: '按钮尺寸',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'small',
          label: 'small '
        },
        {
          value: 'large',
          label: 'large'
        }
      ]
    },
    {
      id: 'props.radioType',
      label: '按钮样式',
      type: 'select',
      list: [
        {
          value: 'radio',
          label: '圆圈'
        },
        {
          value: 'button',
          label: '按钮'
        }
      ]
    },
    {
      id: 'props.buttonStyle',
      label: '风格样式',
      type: 'select',
      list: [
        {
          value: 'outline',
          label: '默认'
        },
        {
          value: 'solid',
          label: 'solid'
        }
      ]
    }
  ])
}

export default radioConfig
