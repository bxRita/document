/*
 * FilePath: \src\configuration\common\page.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:27:55
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
export const pageConfig = {
  style: {
    background: '#fbfbfb',
    w: 1366,
    h: 768,
    layoutStyle: '1' // 1 固定布局 2: 自适应布局
  },
  options: [
    {
      label: '提示:宽度大小建议为1920,1600,1366,1440,1280',
      type: 'tips',
      hidden: false
    },
    {
      id: 'style.layoutStyle',
      label: '布局方式',
      type: 'select',
      list: [
        {
          label: '固定布局',
          value: '1'
        },
        {
          label: '自适应布局',
          value: '2'
        }
      ]
    },
    {
      id: 'style.w',
      label: '宽',
      hidden: false,
      type: 'inputNumber'
    },
    {
      id: 'style.h',
      label: '高',
      hidden: false,
      type: 'inputNumber'
    }
  ]
}

export default pageConfig
