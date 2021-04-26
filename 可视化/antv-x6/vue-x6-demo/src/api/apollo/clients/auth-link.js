/*
 * FilePath: \src\api\apollo\clients\auth-link.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:31:03
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { ApolloLink } from 'apollo-link'

const authLink = new ApolloLink((operation, forward) => {
  // const token = localStorage.getItem('tocken')
  const _defHeaders = {
    'x-requested-with': 'XMLHttpRequest'
  }
  // _defHeaders['Authorization'] = token

  operation.setContext(({ headers }) => ({
    headers: {
      ..._defHeaders,
      ...headers
    }
  })) // request拦截器
  return forward(operation).map(response => {
    const context = operation.getContext()
    const {
      response: { headers }
    } = context
    if (headers) {
      // TODO:
    }
    return response
  }) // response拦截器，但是此处并不能对错误响应进行拦截
})

export default authLink
