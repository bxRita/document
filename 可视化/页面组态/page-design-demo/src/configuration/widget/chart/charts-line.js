/*
 * FilePath: \src\configuration\component\chart\charts-line.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 15:54:12
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
export const chartsLineConfig = {
  key: WidgetComponentName.ECHARTS_LINE,
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
          name: '系列1',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ]
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '折线图',
    height: 300,
    width: '100%',
    iconname: 'iconzhexiantu'
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

export default chartsLineConfig
