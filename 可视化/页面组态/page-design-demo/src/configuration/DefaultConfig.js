/*
 * FilePath: \src\configuration\DefaultConfig.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:26:19
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
// 基本控件
import ButtonConfig from '@/configuration/widget/basis/button'
import InputConfig from '@/configuration/widget/basis/input'
import SelectConfig from '@/configuration/widget/basis/select'
import DropdownConfig from '@/configuration/widget/basis/dropdown'
import CheckboxConfig from '@/configuration/widget/basis/checkbox'
import MenuConfig from '@/configuration/widget/basis/menu'
import DatepickerConfig from '@/configuration/widget/basis/datepicker'
import RadioConfig from '@/configuration/widget/basis/radio'
import DatatableConfig from '@/configuration/widget/basis/datatable'
//容器控件
import GridConfig from '@/configuration/widget/layout/grid'
import CardConfig from '@/configuration/widget/layout/card'
import TabsConfig from '@/configuration/widget/layout/tabs'
import TableConfig from '@/configuration/widget/layout/table'
import DialogConfig from '@/configuration/widget/layout/dialog'
// 布局控件
import LayoutSimpleConfig from '@/configuration/widget/layout/layout-simple'
// 图表控件
import ChartsLineConfig from '@/configuration/widget/chart/charts-line'
import ChartsLine3DConfig from '@/configuration/widget/chart/charts-line-3d'
import ChartsBarConfig from '@/configuration/widget/chart/charts-bar'
import ChartsBar3DConfig from '@/configuration/widget/chart/charts-bar-3d'
import ChartsMapConfig from '@/configuration/widget/chart/charts-map'
import ChartsMap3DConfig from '@/configuration/widget/chart/charts-map-3d'
import ChartsPieConfig from '@/configuration/widget/chart/charts-pie'
import ChartsRadarConfig from '@/configuration/widget/chart/charts-radar'
import ChartsGaugeConfig from '@/configuration/widget/chart/charts-gauge'

export default [
  // 基本控件
  ButtonConfig,
  InputConfig,
  SelectConfig,
  DropdownConfig,
  CheckboxConfig,
  MenuConfig,
  DatepickerConfig,
  RadioConfig,
  DatatableConfig,
  // 容器控件
  GridConfig,
  CardConfig,
  TabsConfig,
  TableConfig,
  DialogConfig,
  // 布局控件
  LayoutSimpleConfig,
  // 图表控件
  ChartsLineConfig,
  ChartsLine3DConfig,
  ChartsBarConfig,
  ChartsBar3DConfig,
  ChartsMapConfig,
  ChartsMap3DConfig,
  ChartsPieConfig,
  ChartsRadarConfig,
  ChartsGaugeConfig
]
