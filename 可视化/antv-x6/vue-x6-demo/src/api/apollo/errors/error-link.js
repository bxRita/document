/*
 * FilePath: \src\api\apollo\errors\error-link.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:43:40
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { ApolloLink } from 'apollo-link'
import { isSignError } from './util'
import { GraphQLError } from 'graphql'

/**
 * 拦截所有的错误
 */
const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(res => {
    //拦截除了强制签名外的其他全局error
    //参考http://ebr.hollicube.com/_book/api/error.html
    if (
      res.errors &&
      res.errors.length > 0 &&
      res.errors[0].extensions &&
      res.errors[0].extensions.code &&
      !isSignError(res.errors)
    ) {
      // eslint-disable-next-line no-console
      console.error(res.errors)
      const err = res.errors[0]
      // const code = err.extensions.code
      // const message = err.message
      // if (
      //   code == 'SystemError' ||
      //   code == 'ApolloError' ||
      //   code == 'SyntaxError'
      // ) {
      //   error(i18n.t('common.messages.unknown'))
      // }
      throw new GraphQLError(
        err.message,
        err.nodes,
        err.source,
        err.positions,
        err.action,
        err.originalError,
        err.extensions
      )
    } else {
      return res
    }
  })
})

export default errorLink
