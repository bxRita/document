/*
 * FilePath: \src\components\index.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 11:34:00
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import Vue from 'vue'
// 基础组件
import xaInput from './basis/input.vue'
import xaButton from './basis/button.vue'
import xaSelect from './basis/select.vue'

// 布局组件
import xaCard from './layout/card.vue'
import xaGrid from './layout/grid.vue'
import xaTable from './layout/table.vue'
import xaTabs from './layout/tabs.vue'
import xaDialog from './layout/dialog.vue'

// 图表组件
import xaEchartsLine from './chart/charts-line.vue'
import xaEchartsLineD from './chart/charts-line-3d.vue'
import xaEchartsBar from './chart/charts-bar.vue'
import xaEchartsBarD from './chart/charts-bar-3d.vue'
import xaEchartsMap from './chart/charts-map.vue'
import xaEchartsMapD from './chart/charts-map-3d.vue'
import xaEchartsPie from './chart/charts-pie.vue'
import xaEchartsRadar from './chart/charts-radar.vue'
import xaEchartsGauge from './chart/charts-gauge.vue'

// 编辑器
import CodeEditor from './code-editor/CodeEditor.vue'

const plugins = {
  // 基础组件
  xaInput,
  xaButton,
  xaSelect,
  // 容器布局组件
  xaCard,
  xaGrid,
  xaTable,
  xaTabs,
  xaDialog,
  // 图表组件
  xaEchartsLine,
  xaEchartsLineD,
  xaEchartsBar,
  xaEchartsBarD,
  xaEchartsMap,
  xaEchartsMapD,
  xaEchartsPie,
  xaEchartsRadar,
  xaEchartsGauge,
  // 编辑器
  CodeEditor
}

const installComponents = function () {
  Object.keys(plugins).map(item => {
    Vue.component(item, plugins[item])
  })
}

export default installComponents
