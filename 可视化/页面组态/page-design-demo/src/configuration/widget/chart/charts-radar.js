/*
 * FilePath: \src\configuration\component\chart\charts-radar.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 16:52:43
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import commonConfig from '@/configuration/common/basis'
import {
  chartTitle,
  chartLegend,
  chartTooltip
} from '@/configuration/common/chart'
import { WidgetComponentName } from '@/constants'

export const chartsRadarConfig = {
  key: WidgetComponentName.ECHARTS_RADAR,
  type: 'chart',
  props: {
    chartConfig: {
      title: { ...chartTitle },
      legend: { ...chartLegend },
      tooltip: { ...chartTooltip },
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '销售（sales）', max: 6500 },
          { name: '管理（Administration）', max: 16000 },
          { name: '信息技术（Information Techology）', max: 30000 },
          { name: '客服（Customer Support）', max: 38000 },
          { name: '研发（Development）', max: 52000 },
          { name: '市场（Marketing）', max: 25000 }
        ]
      },
      series: [
        {
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: '预算分配（Allocated Budget）'
            },
            {
              value: [5000, 14000, 28000, 31000, 42000, 21000],
              name: '实际开销（Actual Spending）'
            }
          ]
        }
      ]
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '雷达图',
    height: 300,
    width: '100%',
    iconname: 'iconleidatu'
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

export default chartsRadarConfig
