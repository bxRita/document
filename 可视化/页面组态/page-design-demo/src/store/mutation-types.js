/*
 * FilePath: \src\store\mutation-types.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-06 16:42:53
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
/**
 * 设计区增加组件
 */
export const ADD_DESIGN_CELL = 'ADD_DESIGN_CELL'

export const UPSERT_DESIGN_CELL = 'UPSERT_DESIGN_CELL'
// 选中组件
export const SET_SELECT_WIDGET = 'SET_SELECT_WIDGET'
// 更新组件属性
export const UPDATE_WIDGET_PROP = 'UPDATE_WIDGET_PROP'
// 删除当前选中组件
export const DELETE_SELECT_WIDGET = 'DELETE_SELECT_WIDGET'
// 复制当前选中组件
export const COPY_SELECT_WIDGET = 'COPY_SELECT_WIDGET'
// 清空设计面板区域
export const RESET_DESIGN_PANEL = 'RESET_DESIGN_PANEL'
export const ADD_SUB_WIDGET_TO_LAYOUT = 'ADD_SUB_WIDGET_TO_LAYOUT'
// 多个元素 拖拽位置更新
export const UPDATE_SUB_WIDGET_TO_LAYOUT = 'UPDATE_SUB_WIDGET_TO_LAYOUT'

// ---------------widget grid begin
export const ADD_GRID_COL = 'ADD_GRID_COL'
export const DELETE_GRID_COL = 'DELETE_GRID_COL'
export const UPDATE_GRID_COL = 'UPDATE_GRID_COL'
// ---------------widget grid end

// ---------------widget tabs begin
export const ADD_TAB_COL = 'ADD_TAB_COL'
export const DELETE_TAB_COL = 'DELETE_TAB_COL'
export const UPDATE_TAB_COL = 'UPDATE_TAB_COL'
// ---------------widget tabs end

// ---------------widget table begin
export const ADD_TABLE_COL = 'ADD_TABLE_COL'
export const ADD_TABLE_ROW = 'ADD_TABLE_ROW'
// ---------------widget table end

// ---------------widget select begin
export const ADD_WIDGET_DATA_ITEM = 'ADD_WIDGET_DATA_ITEM'
export const DELETE_WIDGET_DATA_ITEM = 'DELETE_WIDGET_DATA_ITEM'
export const UPDATE_WIDGET_DATA_ITEM = 'UPDATE_WIDGET_DATA_ITEM'
// ---------------widget select end

// 事件 begin
export const UPDATE_WIDGET_EVENT = 'UPDATE_WIDGET_EVENT'
// 事件 end
