/*
 * FilePath: \src\utils\globalWidgetRef.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-20 11:06:04
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

window.Uidesigner || (window.Uidesigner = {})

window.Uidesigner.$refs = {} // 定义全局可访问的引用
/**
 * @description 添加refs
 * @param {Object} refObj
 */
export function addRefs(refObj) {
  let globalRefs = window.Uidesigner.$refs
  let keys = Object.keys(refObj),
    len = keys.length,
    key

  if (len > 0 && (key = keys[0]) && !globalRefs[key]) {
    globalRefs[key] = refObj[key]
  }
}
