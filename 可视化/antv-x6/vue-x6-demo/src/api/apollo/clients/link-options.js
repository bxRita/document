/*
 * FilePath: \src\api\apollo\clients\link-options.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:29:54
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import fetch from 'unfetch'
/**
 * 默认Apollo Link 配置
 */
const options = {
  fetch,
  credentials: 'include',
  fetchOptions: {
    credentials: 'include'
  }
}

export default options
