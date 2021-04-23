/*
 * 输入框
 * FilePath: \src\configuration\component\basis\input.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:35:24
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const inputConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.INPUT,
  icon: 'icon-write',
  props: {
    type: 'text',
    defaultValue: '',
    size: 'default',
    placeholder: '输入框',
    disabled: false,
    readonly: false,
    prefix: '',
    suffix: '',
    maxLength: 20
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '输入框',
    height: 50,
    iconname: 'iconinput',
    linkageEventConfig: [].concat(
      [
        {
          id: 'getCurrentValue',
          label: '获取组件当前值'
        },
        {
          id: 'setCurrentValue',
          label: '设置组件当前值'
        }
      ],
      [...commonConfig.custom.linkageEventConfig]
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1',
          eventName: 'change',
          eventDes: '失去焦点或回车触发'
        },
        {
          eventType: '1',
          eventName: 'pressEnter',
          eventDes: '按下回车触发'
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
      id: 'props.value',
      label: '当前值',
      type: 'input'
    },
    {
      id: 'props.type',
      label: '类型',
      type: 'select',
      list: [
        {
          value: 'text',
          label: 'text'
        },
        {
          value: 'password',
          label: 'password'
        },
        {
          value: 'textarea',
          label: 'textarea'
        },
        {
          value: 'url',
          label: 'url'
        },
        {
          value: 'email',
          label: 'email'
        },
        {
          value: 'date',
          label: 'date'
        },
        {
          value: 'number',
          label: 'number'
        },
        {
          value: 'tel',
          label: 'tel'
        }
      ]
    },
    {
      id: 'props.size',
      label: '尺寸',
      type: 'select',
      list: [
        {
          value: 'default',
          label: 'default'
        },
        {
          value: 'large',
          label: 'large'
        },
        {
          value: 'small',
          label: 'small'
        }
      ]
    },
    {
      id: 'props.placeholder',
      label: '占位文本',
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
      id: 'props.readonly',
      label: '只读',
      type: 'switch'
    },
    {
      id: 'props.fontSize',
      label: '文字大小',
      type: 'inputNumber',
      options: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER
      }
    }
  ])
}

export default inputConfig
