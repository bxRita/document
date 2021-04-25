/*
 * FilePath: \src\api\apollo\errors\signature-link.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:43:52
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import SignatureModal from '@/components/signature-form'
import { Observable } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { isSignError } from './util'
import { graphQLResultHasError } from 'apollo-utilities'
/**
 * 签名错误拦截
 */
const signatureLink = onError(err => {
  const operation = err.operation
  // eslint-disable-next-line no-unused-vars
  const response = err.response
  const graphQLErrors = err.graphQLErrors
  const networkError = err.networkError
  const forward = err.forward

  if (networkError) {
    // 服务器端返回未授权时，刷新跳转到登录页面。
    if (networkError.statusCode === 401) {
      // 强制退出
      // logout()
    }
    //nginx 502
    if (networkError.statusCode === 502) {
      // error('服务器正在重启或其它异常，请稍后再试，异常代码502')
    }
  }
  if (graphQLErrors) {
    // 处理签名错误
    if (isSignError(graphQLErrors)) {
      const action = graphQLErrors[0].extensions.exception.action
      const method = graphQLErrors[0].extensions.exception.method
      // 异步处理
      // 参考 https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068
      return new Observable(observer => {
        SignatureModal.show({
          action,
          method,
          // 成功时的回调
          callback: () => {
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            }
            // 签名成功后继续原始操作
            forward(operation).subscribe(subscriber)
          },
          // 取消时的回调
          cancelCallback: () => {
            // 终止执行
            observer.error(err)
          }
        })
      })
    } else {
      // 普通Graphql Errors抛出,包括签名失败
      return graphQLResultHasError(err)
    }
  }
})

export default signatureLink
