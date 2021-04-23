/*
 * FilePath: \src\configuration\component\chart\charts-bar.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 16:23:10
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import commonConfig from '@/configuration/common/basis'
import {
  chartTitle,
  chartLegend,
  chartGrid,
  chartxAxis,
  chartyAxis,
  chartTooltip
} from '@/configuration/common/chart'
import { WidgetComponentName } from '@/constants'
export const chartsBarConfig = {
  key: WidgetComponentName.ECHARTS_BAR,
  type: 'chart',
  props: {
    chartConfig: {
      title: { ...chartTitle },
      legend: { ...chartLegend },
      grid: { ...chartGrid },
      xAxis: { ...chartxAxis },
      yAxis: { ...chartyAxis },
      tooltip: { ...chartTooltip },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '柱状图',
    height: 300,
    width: '100%',
    iconname: 'icontubiaozhuzhuangtu'
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

export default chartsBarConfig
