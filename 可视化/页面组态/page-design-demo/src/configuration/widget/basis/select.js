/*
 * FilePath: \src\configuration\component\basis\select.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 15:15:30
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const buttonConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.SELECT,
  icon: 'icon-select',
  props: {
    defaultValue: '',
    allowClear: false,
    disabled: false,
    dropdownStyle: null,
    mode: null,
    placeholder: '请选择',
    customStyle: '',
    showArrow: true,
    size: 'default',
    isDynamic: false, // 是否加载服务url数据
    dynamicCfg: {
      url: '/api/pass/appResource/systemNameText', // 服务url接口地址
      type: 'get',
      pageSize: 30,
      orderBy: null,
      orderDesc: false,
      chooseFields: 'data',
      valueField: 'value',
      labelField: 'label',
      params: []
    },
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
    name: '下拉框',
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
      id: 'props.placeholder',
      label: 'placeholder',
      type: 'input'
    },
    {
      id: 'props.allowClear',
      label: '支持清除',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.showArrow',
      label: '展示箭头',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.disabled',
      label: '禁用状态',
      type: 'switch',
      activeText: '启用',
      inactiveText: '禁用'
    },
    {
      id: 'props.mode',
      label: '模式',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'multiple',
          label: 'multiple '
        },
        {
          value: 'tags',
          label: 'tags'
        },
        {
          value: 'combobox',
          label: 'combobox'
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
          label: 'large '
        },
        {
          value: 'small',
          label: 'small'
        }
      ]
    },
    {
      id: 'props.isDynamic',
      label: '动态加载',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.options',
      label: '静态数据',
      type: 'selectOption'
    },
    {
      id: 'props.dynamicCfg',
      label: '数据集',
      type: 'dynamicCfg'
    }
  ])
}

export default buttonConfig
