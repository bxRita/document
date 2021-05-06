/*
 * FilePath: \src\components\widget\index.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-16 14:43:28
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
// 基础组件
import xaInput from '@/components/widget/basis/input.vue'
import xaButton from '@/components/widget/basis/button.vue'
import xaSelect from '@/components/widget/basis/select.vue'
import xaDropdown from '@/components/widget/basis/dropdown.vue'
import xaCheckbox from '@/components/widget/basis/checkbox.vue'
import xaMenu from '@/components/widget/basis/menu.vue'
import xaDatepicker from '@/components/widget/basis/datepicker.vue'
import xaRadio from '@/components/widget/basis/radio.vue'
import xaDatatable from '@/components/widget/basis/datatable.vue'

// 容器组件
import xaCard from '@/components/widget/layout/card.vue'
import xaGrid from '@/components/widget/layout/grid.vue'
import xaTable from '@/components/widget/layout/table.vue'
import xaTabs from '@/components/widget/layout/tabs.vue'
import xaDialog from '@/components/widget/layout/dialog.vue'

// 布局组件
import xaLayoutSimple from '@/components/widget/layout/layout-simple.vue'

// 图表组件
import xaEchartsLine from '@/components/widget/chart/charts-line.vue'
import xaEchartsLineD from '@/components/widget/chart/charts-line-3d.vue'
import xaEchartsBar from '@/components/widget/chart/charts-bar.vue'
import xaEchartsBarD from '@/components/widget/chart/charts-bar-3d.vue'
import xaEchartsMap from '@/components/widget/chart/charts-map.vue'
import xaEchartsMapD from '@/components/widget/chart/charts-map-3d.vue'
import xaEchartsPie from '@/components/widget/chart/charts-pie.vue'
import xaEchartsRadar from '@/components/widget/chart/charts-radar.vue'
import xaEchartsGauge from '@/components/widget/chart/charts-gauge.vue'

export default {
  // 基础组件
  xaInput,
  xaButton,
  xaSelect,
  xaDropdown,
  xaCheckbox,
  xaMenu,
  xaDatepicker,
  xaRadio,
  xaDatatable,
  // 容器布局组件
  xaCard,
  xaGrid,
  xaTable,
  xaTabs,
  xaDialog,
  xaLayoutSimple,
  // 图表组件
  xaEchartsLine,
  xaEchartsLineD,
  xaEchartsBar,
  xaEchartsBarD,
  xaEchartsMap,
  xaEchartsMapD,
  xaEchartsPie,
  xaEchartsRadar,
  xaEchartsGauge
}
