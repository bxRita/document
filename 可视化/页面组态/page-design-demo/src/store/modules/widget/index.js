/*
 * FilePath: \src\store\modules\widget\index.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 10:54:53
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import gridCfg from './grid' // 设计面板右侧 grid相关属性配置修改更新
import tabCfg from './tab' // 设计面板右侧 tab相关属性配置修改更新
import tableCfg from './table' // 设计面板右侧 table相关属性配置修改更新
import selectCfg from './select' // 设计面板右侧 Select 动态数据 相关属性配置修改更新

export default {
  mutations: {
    ...gridCfg.mutations,
    ...tabCfg.mutations,
    ...tableCfg.mutations,
    ...selectCfg.mutations
  },
  actions: {
    ...gridCfg.actions,
    ...tabCfg.actions,
    ...tableCfg.actions,
    ...selectCfg.actions
  }
}
