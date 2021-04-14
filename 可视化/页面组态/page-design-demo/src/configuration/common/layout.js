/*
 * FilePath: \src\configuration\common\layout.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 15:53:37
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
export const layoutConfig = {
  compType: 'layout',
  style: {},
  options: [
    {
      label: '组件信息',
      type: 'title'
    },
    {
      id: 'id',
      label: '组件ID',
      type: 'input',
      options: {
        disabled: true
      }
    }
  ]
}

export default layoutConfig
