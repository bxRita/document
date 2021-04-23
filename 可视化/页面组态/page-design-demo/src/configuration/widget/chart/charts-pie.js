/*
 * FilePath: \src\configuration\component\chart\charts-pie.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 16:44:59
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { WidgetComponentName } from '@/constants'
import commonConfig from '@/configuration/common/basis'
import {
  chartTitle,
  chartLegend,
  chartTooltip
} from '@/configuration/common/chart'

export const chartsPieConfig = {
  key: WidgetComponentName.ECHARTS_PIE,
  type: 'chart',
  props: {
    chartConfig: {
      title: { ...chartTitle },
      legend: { ...chartLegend },
      tooltip: { ...chartTooltip },
      series: [
        {
          name: '饼图数据统计',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '数据1' },
            { value: 310, name: '数据2' },
            { value: 234, name: '数据3' },
            { value: 135, name: '数据4' },
            { value: 1548, name: '数据5' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '饼图',
    height: 300,
    width: '100%',
    iconname: 'iconbingtu'
  }),
  options: [].concat(commonConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.chartConfig',
      label: '',
      type: 'chartStyleSetting'
    }
  ])
}

export default chartsPieConfig
