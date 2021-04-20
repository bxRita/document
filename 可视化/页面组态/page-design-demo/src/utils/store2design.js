/*
 * FilePath: \src\utils\store2design.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 10:00:54
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

// 将页面组件扁平化到一个数组中
const flatPageList = (list, resultArr) => {
  let len = list.length
  for (let i = 0; i < len; i++) {
    let item = list[i],
      hasSubList = item.subProp
    if (hasSubList) {
      flatPageList(item[hasSubList], resultArr)
      item.id && resultArr.push(item)
    } else {
      if (item.list && item.list.length) {
        flatPageList(item.list, resultArr)
      }
      item.id && resultArr.push(item)
    }
  }
}

// 获取当前页面所有组件
export function getPageAllWidget(list) {
  let result = []
  flatPageList(list, result)
  return result
}

// 从页面组件列表中查找对应组件
export const getWidgetPropById = (pageList, id) => {
  let result = []
  flatPageList(pageList, result)
  return result.find(item => item.id === id)
}

// 更新组件属性值
export function updateWidgetPropById(pageList, paramObj) {
  const { widgetId, propId, val } = paramObj
  let item = getWidgetPropById(pageList, widgetId)

  let props = propId.match(/\w+|\d+/g)
  props && (item[props[0]][props[1]] = val)
}
