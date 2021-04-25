/*
 * FilePath: \src\api\apollo\clients\system.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:27:13
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import linkOptions from './link-options'
import defaultOptions from './client-options'
import authLink from './auth-link'
import { systemEndpoint } from '@/api/apollo/endpoints'
import { errorLink, signatureLink } from '../errors'

/**
 * 基础功能Link
 */
const link = createHttpLink({
  uri: systemEndpoint,
  ...linkOptions
})

/**
 * 基础功能Client
 */
const system = new ApolloClient({
  link: errorLink.concat(signatureLink.concat(authLink.concat(link))),
  cache: new InMemoryCache(),
  defaultOptions
})

export default system
