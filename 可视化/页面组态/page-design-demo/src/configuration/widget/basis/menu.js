/*
 * FilePath: \src\configuration\common\menu.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-20 15:02:09
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const menuConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.MENU,
  icon: 'icon-button-remove',
  props: {
    mode: 'inline',
    multiple: false,
    selectable: true,
    theme: 'light',
    defaultOpenKeys: [],
    inlineIndent: 24,
    defaultSelectedKeys: [],
    dynamicCfg: {
      url: '/api/pass/appResource/systemNameText', // 服务url接口地址
      type: 'get',
      pageSize: 30,
      orderBy: null,
      orderDesc: false,
      chooseFields: '',
      valueField: 'value',
      labelField: 'label',
      params: [],
      parentKey: 'parentId',
      topParentVal: '-1'
    },
    options: [
      {
        label: '一级',
        value: '1',
        parentId: '-1',
        icon: 'mail'
      },
      {
        label: '二级',
        value: '2',
        parentId: '-1',
        icon: 'setting'
      },
      {
        label: '二级-1',
        value: '21',
        parentId: '2'
      },
      {
        label: '二级-2',
        value: '22',
        parentId: '2'
      },
      {
        label: '三级',
        value: '3',
        parentId: '-1',
        icon: 'appstore'
      },
      {
        label: '三级-1',
        value: '31',
        parentId: '3'
      }
    ]
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '导航菜单',
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
          eventName: 'click',
          eventDes: '点击触发'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'select',
          eventDes: '选择触发'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'deselect',
          eventDes: '取消选择触发'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'openChange',
          eventDes: '展开菜单触发'
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
      id: 'props.selectable',
      label: '允许选中',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.multiple',
      label: '允许多选',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.mode',
      label: '按钮尺寸',
      type: 'select',
      list: [
        {
          value: 'vertical',
          label: '垂直'
        },
        {
          value: 'horizontal',
          label: '水平'
        },
        {
          value: 'inline',
          label: '内嵌'
        }
      ]
    },
    {
      id: 'props.theme',
      label: '主题颜色',
      type: 'select',
      list: [
        {
          value: 'light',
          label: 'light'
        },
        {
          value: 'dark ',
          label: 'dark '
        }
      ]
    }
  ])
}

export default menuConfig
