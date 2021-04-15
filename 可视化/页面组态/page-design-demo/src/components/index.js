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

// 业务组件

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
  // 业务组件
  xaDialog,
  // 编辑器
  CodeEditor
}

const installComponents = function () {
  Object.keys(plugins).map(item => {
    Vue.component(item, plugins[item])
  })
}

export default installComponents
