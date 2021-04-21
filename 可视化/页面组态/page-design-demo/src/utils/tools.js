/*
 * FilePath: \src\utils\tools.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:24:41
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
export const uuid = () => {
  return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const types = data => {
  return Object.prototype.toString.call(data)
}

export const throttle = function (func, wait, options) {
  var timeout, context, args, result
  var previous = 0
  if (!options) options = {}

  var later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  var throttled = function () {
    var now = Date.now()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export const isMobile750 = (function () {
  return (
    !!navigator.userAgent.match(
      /(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ) && document.body.offsetWidth <= 750
  )
})()

// 驼峰转换下划线
export const toLine = name => name.replace(/([A-Z])/g, '-$1').toLowerCase()
// 首字母大写
export const firstUpperCase = ([first, ...rest]) =>
  first.toUpperCase() + rest.join('')
// 组件classname
export const classnames = data => {
  let classNames = []
  Object.keys(data).map(item => {
    if (data[item]) {
      classNames.push(item)
    }
  })
  return classNames.join(' ')
}
/**
 * @description 生成组件id
 * @param {String} key 组件类型
 * @returns
 */
export const generateId = key => {
  return key + '_' + new Date().getTime()
}

/**
 * @description 根据界面配置获取请求条件
 * @param {Object} condition
 * @returns
 */
export function getHttpConfigByCondition(condition) {
  const { url, type, pageSize, orderBy, orderDesc, params } = condition
  let paramData = {
    pageSize,
    orderBy,
    orderDesc
  }

  params.map(item => {
    paramData[item.key] = item.value
  })

  let httpCfg = {
    method: type,
    url
  }

  if (type == 'get') {
    httpCfg.params = paramData
  } else {
    httpCfg.data = paramData
  }

  return httpCfg
}

/**
 * @description 将数组 转换成树型结构
 * @param {Array} list 待转换的数据
 * @param {String} parentKey 父节点的key
 * @param {String} valueKey 树节点的值key
 * @param {String} parentVal 父节点的值
 * @param {String} labelKey 树节点的文本key
 */
export function transArrToTree(
  list,
  parentKey,
  valueKey = 'value',
  parentVal = '-1'
) {
  let len = list.length,
    obj = {},
    result = []
  list.map(item => {
    obj[item[valueKey]] = item
  })

  for (let i = 0; i < len; i++) {
    let pid = list[i][parentKey]
    if (parentVal == pid) {
      result.push(list[i])
      continue
    }

    if (obj[pid].children) {
      obj[pid].children.push(list[i])
    } else {
      obj[pid].children = [list[i]]
    }
  }

  return result
}
