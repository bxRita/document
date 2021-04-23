/*
 * FilePath: \src\configuration\component\chart\charts-map.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 16:36:30
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import commonConfig from '@/configuration/common/basis'
import { WidgetComponentName } from '@/constants'
export const chartsMapConfig = {
  key: WidgetComponentName.ECHARTS_MAP,
  type: 'chart',
  props: {
    chartConfig: {}
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '地图',
    height: 300,
    width: '100%',
    iconname: 'iconditu'
  }),
  options: [].concat(commonConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    }
  ])
}

export default chartsMapConfig
