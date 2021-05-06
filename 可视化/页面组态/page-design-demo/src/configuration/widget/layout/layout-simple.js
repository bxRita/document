/*
 * FilePath: \src\configuration\widget\layout\layout-simple.js
 * Project: page-design-demo
 * CreatedAt: 2021-05-06 14:12:31
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'
export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.LAYOUT_SIMPLE,
  icon: 'icon-qiapian',
  subProp: 'columns', // 包含子元素的属性名
  columns: [
    {
      key: 'a-layout-header',
      list: []
    },
    {
      key: 'a-layout-content',
      list: []
    },
    {
      key: 'a-layout-footer',
      list: []
    }
  ],
  props: {
    size: 'default'
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '上中下'
  }),
  options: [].concat(layoutConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    }
  ])
}

export default gridConfig
