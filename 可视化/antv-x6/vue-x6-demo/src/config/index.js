/*
 * FilePath: \src\config\index.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-01 16:22:40
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

export const ComponentType = {
  E: 'ENUM', // 枚举
  C: 'TABLE', // 类
  I: 'interface', // 接口
  S: 'Scalar' // 标量
}

// 颜色定义
export const color = {
  blue: 'rgb(95, 149, 255)',
  yellow: 'rgb(254, 133, 79)'
}

export const X6CellType = {
  edge: 'edge'
}

// 数据字段中 type分类
export const DICTIONARY_TYPE = {
  BASE_FIELD_TYPE: 'BASE_FIELD_TYPE', // 类别基本字段
  BASE_MODELPRIMARY_TYPE: 'BASE_MODELPRIMARY_TYPE', // 主键类型
  BASE_MODELREL_TYPE: 'BASE_MODELREL_TYPE' // 模型关系
}
