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
import WidgetComp from '@/components/widget'

// 编辑器
import CodeEditor from '@/components/code-editor/CodeEditor.vue'

// 属性相关组件
import WidgetPropComp from '@/components/widget-prop'

const plugins = {
  // 页面组件
  ...WidgetComp,
  // 页面组件属性配置 相关组件
  ...WidgetPropComp,
  // 编辑器
  CodeEditor
}

const installComponents = function () {
  Object.keys(plugins).map(item => {
    Vue.component(item, plugins[item])
  })
}

export default installComponents
