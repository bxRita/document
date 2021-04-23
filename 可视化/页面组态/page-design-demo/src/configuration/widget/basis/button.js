/*
 * 按钮
 * FilePath: \src\configuration\component\basis\button.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:32:46
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const buttonConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.BUTTON,
  icon: 'icon-button-remove',
  props: {
    content: '按钮',
    disabled: false,
    type: 'primary',
    loading: false,
    shape: null,
    block: false,
    size: 'default',
    ghost: false
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '按钮',
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
          eventName: 'click',
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
      id: 'props.content',
      label: '按钮文本',
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
      id: 'props.ghost',
      label: '幽灵属性',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
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
      id: 'props.type',
      label: '按钮类型',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'primary ',
          label: 'primary '
        },
        {
          value: 'dashed',
          label: 'dashed'
        },
        {
          value: 'danger',
          label: 'danger'
        },
        {
          value: 'link',
          label: 'link'
        }
      ]
    }
  ])
}

export default buttonConfig
