[vue-apollo官网](https://vue-apollo.netlify.com/zh-cn/guide/#%E4%BB%80%E4%B9%88%E6%98%AF-graphql%EF%BC%9F)

### 什么是 Apollo?
[Apollo](https://www.apollographql.com/) 是通过社区力量帮助你在应用中使用 GraphQL 的一套工具。它的 [客户端](https://www.apollographql.com/client) 和 [服务端](https://www.apollographql.com/server) 都非常有名。Apollo 由 [Meteor 开发团队](https://www.meteor.io/) 开发和支持。

#### Apollo Client安装
1、安装依赖：
```
npm install --save vue-apollo graphql apollo-client apollo-link apollo-link-http apollo-cache-inmemory graphql-tag
```
或
```
yarn add vue-apollo graphql apollo-client apollo-link apollo-link-http apollo-cache-inmemory graphql-tag
```
2、在你的应用中创建一个 ApolloClient 实例：
```
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// 与 API 的 HTTP 连接
const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  uri: 'http://localhost:3020/graphql',
})

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})
```
3、安装插件到 Vue
```
import Vue from 'vue'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
```
4、Apollo provider
Provider 保存了可以在接下来被所有子组件使用的 Apollo 客户端实例。
```
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
```
使用 `apolloProvider `选项将它添加到你的应用程序：
```
new Vue({
  el: '#app',
  // 像 vue-router 或 vuex 一样注入 apolloProvider
  apolloProvider,
  render: h => h(App),
})
```

### 基本使用
####  查询
在 apollo 对象中添加一个属性（需要通过 Apollo 的查询结果提供数据的 Vue 属性）。每一个属性都将创建一个智能查询

##### 简单查询
1、首先在服务端添加相应的 schema 和解析器：
```
export const schema = `
type Query {
  hello: String
}

schema {
  query: Query
}
`

export const resolvers = {
  Query: {
    hello (root, args, context) {
      return 'Hello world!'
    },
  },
}
```
2、接下来使用 gql 编写你的 GraphQL 查询：
```
<template>
  <div class="apollo">
    <h3>Hello</h3>
    <p>
      {{hello}}
    </p>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    // 简单的查询，将更新 'hello' 这个 vue 属性
    hello: gql`{hello}`,
  },
  data() {
    return {
      // data 钩子中初始化你的 apollo 数据
      hello: ''
    }
  }
}
</script>

```
##### 带参数的查询
可以通过在对象中声明 query 和 variables 将变量（读取参数）添加到 gql 查询中：
```
// Apollo 具体选项
apollo: {
  // 带参数的查询
  ping: {
    // gql 查询
    query: gql`query PingMessage($message: String!) {
      ping(message: $message)
    }`,
    // 静态参数
    variables: {
      message: 'Meow',
    },
    fetchPolicy: 'cache-and-network'
  },
},
```
你可以在这个对象中使用 apollo 的 `watchQuery` 中的选项，比如：
- fetchPolicy
-  pollInterval
-  notifyOnNetworkStatusChange
.....
更多细节，请查看[apollo文档](https://www.apollographql.com/docs/react/api/apollo-client/#ApolloClient.watchQuery)

如果要为`watchQuery`，`query`或`mutate`提供的选项设置应用范围的默认值，可以将它们作为defaultOptions对象传递给ApolloClient实例，如：
```
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
        fetchPolicy: 'network-only'
     },
     query: {
        fetchPolicy: 'network-only'
     },
     mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'none'
     }
  }
})
```
> 这些选项将与每个请求提供的选项合并




####  变更
```
// todo
```




### 问题点&解决方案：
1、如何实现apollo 提交token校验完后，继续处理之前的request:
https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068



---- 待完善