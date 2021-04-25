/*
 * FilePath: \src\api\apollo\clients\client-options.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:30:19
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

/**
 * apollo client default options
 */
const options = {
  watchQuery: {
    // errorPolicy: 'none',
    fetchPolicy: 'no-cache'
  },
  query: {
    // errorPolicy: 'none',
    fetchPolicy: 'no-cache'
  },
  mutate: {
    errorPolicy: 'none',
    fetchPolicy: 'no-cache'
  }
}

export default options
