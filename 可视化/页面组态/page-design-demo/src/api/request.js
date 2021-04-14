/*
 * FilePath: \src\api\request.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 16:40:28
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import axios from 'axios'
import { message } from 'ant-design-vue'
import { VueAxios } from './axios'

//创建axios实例
const requests = axios.create({
  baseURL: process.env.VUE_APP_API, //基础url,如果是多环境配置这样写，也可以像下面一行的写死。
  timeout: 6000 //请求超时时间
})

//错误处理函数
const err = error => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      message.error(data.message || data.msg)
    }
    if (error.response.status === 401) {
      message.error('你没有权限。')
    }
  }
  return Promise.reject(error)
}

requests.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['token'] = token
  }
  return config
}, err)

requests.interceptors.response.use(response => {
  const res = response.data
  // if (res.code !== 0 && res.code !== 200) {
  //   message.error(res.message || res.msg)
  //   if (res.code === 401 || res.code === 403 || res.code === 999) {
  //     message.error('请登录')
  //   }
  //   return Promise.reject('error')
  // } else {
  return res
  // }
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, requests)
  }
}

export { installer as VueAxios, requests as request }
