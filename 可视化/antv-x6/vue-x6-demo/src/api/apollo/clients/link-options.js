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
  /**
   * credentials项，其有3个值：
   * omit: 默认值，忽略cookie的发送
   * same-origin: 表示cookie只能同域发送，不能跨域发送
   * include: cookie既可以同域发送，也可以跨域发送
   *
   * fetch默认对服务端通过Set-Cookie头设置的cookie也会忽略，若想选择接受来自服务端的cookie信息，也必须要配置credentials选项；
   */
  credentials: 'omit', //FIXME: 'include',
  fetchOptions: {
    credentials: 'omit' //FIXME: 'include'
  }
}

export default options
