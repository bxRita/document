/*
 * FilePath: \src\configuration\common\basis.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:27:44
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
// 组件基础通用配置
export const basisCommonConfig = {
  compType: 'basis',
  style: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '#EBEEF5',
    backgroundColor: '#fff'
  },
  custom: {
    width: 200,
    height: 200,
    x: 0,
    y: 0,
    autoView: {
      x: 0,
      y: 0,
      w: 24,
      h: 2
    },
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
  },
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
    },
    {
      id: 'custom.name',
      label: '组件类型',
      type: 'input',
      options: {
        disabled: true
      }
    }
  ]
}

export default basisCommonConfig
