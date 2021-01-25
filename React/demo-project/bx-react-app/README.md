项目用到 react 全家桶：react-router、react-redux

UI 组件库：antd

辅助工具：[connected-react-router](https://www.npmjs.com/package/connected-react-router)

出现问题：

```
selectors.js:17 Uncaught Could not find router reducer in state tree, it must be mounted under "router"
```

原因：

- 经排查，是由于 history 的最新版不兼容 connect-react-router 导致。
- history 的最新版为 5.0，而 connect-react-router 使用的 history 版本为 4.7，从而导致 reducer 执行错误。

解决方法：  
不显示安装 history 或者指定老版本 history 进行安装。否则自己安装的 history 是使用 history5
