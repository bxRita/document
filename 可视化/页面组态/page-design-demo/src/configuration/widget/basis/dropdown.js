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

export const buttonConfig = {
  type: commonConfig.compType,
  key: 'xaDropdown',
  icon: 'icon-select',
  props: {
    disabled: false,
    placement: 'bottomLeft',
    trigger: ['hover'],
    isDynamic: false, // 是否加载服务url数据
    chooseFields: '',
    dynamicUrl: '/api/pass/appResource/systemNameText', // 服务url接口地址
    options: [
      // 静态数据
      {
        value: '1',
        label: '选项1'
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
          id: 'setDisplay',
          label: '获取组件显示隐藏'
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
      activeText: '禁用',
      inactiveText: '启用'
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
      id: 'props.isDynamic',
      label: '动态加载',
      type: 'switch',
      activeText: '否',
      inactiveText: '是'
    },
    {
      id: 'props.options',
      label: '静态数据',
      type: 'selectOption'
    },
    {
      id: 'props.dynamicUrl',
      label: 'url地址',
      type: 'dynamicUrl'
    },
    {
      id: 'props.chooseFields',
      label: '筛选字段',
      type: 'input',
      placeholder: '字段属性用.隔开'
    }
  ])
}

export default buttonConfig
