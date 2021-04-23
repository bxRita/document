/*
 * FilePath: \src\configuration\component\layout\card.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 11:21:28
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'
export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.CARD,
  icon: 'icon-qiapian',
  list: [],
  props: {
    title: '卡片标题',
    size: 'default'
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '卡片布局'
  }),
  options: [].concat(layoutConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.title',
      label: '卡片标题',
      type: 'input'
    },
    {
      id: 'props.size',
      label: '卡片尺寸',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认 '
        },
        {
          value: 'small',
          label: 'small '
        }
      ]
    }
  ])
}

export default gridConfig
