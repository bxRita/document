/*
仪表盘
 * FilePath: \src\configuration\component\chart\charts-gauge.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 17:02:26
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

export const chartsGaugeConfig = {
  key: WidgetComponentName.ECHARTS_GAUGE,
  type: 'chart',
  props: {
    chartConfig: {
      title: { ...chartTitle },
      legend: { ...chartLegend },
      tooltip: { ...chartTooltip },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: 50, name: '完成率' }]
        }
      ]
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '仪表盘',
    height: 350,
    width: '100%',
    iconname: 'iconyibiaopan'
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

export default chartsGaugeConfig
