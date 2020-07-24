/*
 * FilePath: \12-01binary.js
 * Project: demo
 * CreatedAt: 2020-07-24 14:15:38
 * CreatedBy: bx
 * Copyright: (c) 2020
 * Task: #1
 * Write a description of the code here.
 */

/**
 * 二分查找
 *
 * Author: nameczz
 */
// 数组必须有序 不存在重复
const biaryFind = (sortedArr, target) => {
  if (sortedArr.length === 0) return -1
  let low = 0
  let high = sortedArr.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (target === sortedArr[mid]) {
      return mid
    } else if (target < sortedArr[mid]) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  return -1
}
const arr = [1, 4, 5, 6, 7, 8, 10, 11, 23, 42, 44, 54, 56, 77, 102]
console.log(biaryFind(arr, 44))
console.log(biaryFind(arr, 1))
console.log(biaryFind(arr, 102))
console.log(biaryFind(arr, 1111))