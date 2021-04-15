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
  ],
  custom: {
    // 联动事件配置
    linkageEventConfig: [
      {
        id: 'setDisplay',
        label: '获取组件显示隐藏'
      }
    ],
    // 组件事件配置
    eventConfig: [
      {
        eventType: '1',
        eventName: 'created',
        eventDes: '组件实例初始化完成'
      },
      {
        eventType: '1',
        eventName: 'mounted',
        eventDes: '组件元素挂载完成'
      },
      {
        eventType: '3',
        eventName: 'customEvent',
        eventDes: '组件自定义事件'
      }
    ],
    eventListener: {} // 组件监听事件数据
  }
}

export default layoutConfig
