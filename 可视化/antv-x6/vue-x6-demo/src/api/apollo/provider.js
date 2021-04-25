/*
 * FilePath: \src\api\apollo\provider.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:20:24
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { base, system } from './clients'

/**
 * Apollo Provider实例
 */
const provider = new VueApollo({
  clients: {
    system,
    base
  },
  defaultClient: base,
  defaultOptions: {
    $query: {
      loadingKey: 'loading',
      // 缓存策略
      // cache-first,cache-and-network,network-only,cache-only,no-cache
      fetchPolicy: 'no-cache'
    }
  },
  // Watch loading state for all queries
  // See 'Smart Query > options > watchLoading' for detail
  watchLoading(isLoading, countModifier) {
    // eslint-disable-next-line no-console
    console.log(
      `Global loading [isLoading]=${isLoading} [countModifier]=${countModifier}`
    )
  },
  errorHandler(error) {
    // eslint-disable-next-line no-console
    console.log(
      '%cError',
      'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
      error.message
    )
  }
})

Vue.use(VueApollo)

export default provider
