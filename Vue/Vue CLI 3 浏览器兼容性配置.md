#### browserslist
Vue CLI 3初始化的项目，你会发现有 package.json 文件里的 browserslist 字段 (或一个单独的 .browserslistrc 文件)，指定了项目的目标浏览器的范围。这个值会被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer) 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

通常只需要修改browserslist即可兼容目标浏览器，例如兼容IE10可以做如下配置：
```
"browserslist": [
    "ie 10"
  ]
```
#### Polyfill
一个默认的 Vue CLI 项目会使用 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)，它通过 `@babel/preset-env` 和 `browserslist` 配置来决定项目需要的 polyfill。

默认情况下，它会把 [`useBuiltIns: 'usage'`](https://new.babeljs.io/docs/en/next/babel-preset-env.html#usebuiltins-usage) 传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill。这确保了最终包里 polyfill 数量的最小化。然而，这也意味着**如果其中一个依赖需要特殊的 polyfill，默认情况下 Babel 无法将其检测出来。**

如果有依赖需要 polyfill，你有几种选择：
- 1. 如果确切知道有兼容性问题的依赖包名，可以配置项目根目录下的vue.config.js，将依赖包名添加到transpileDependencies键中，这会为该依赖同时开启语法语法转换和根据使用情况检测 polyfill。例如：
```js
module.exports = {
  transpileDependencies: ["sl-vue-tree"] // 需要编译的依赖包名
}
```
- 2. 如果确切的知道需要转译的语言特性，可以配置根目录下的babel.config.js，为presets的值添加所需要的 polyfill。

```
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ]
}
```
>  如果相关依赖带ES5代码并明确列出所需的polyfill：您可以使用@vue / babel-preset-app的polyfills选项预先包含所需的polyfill。请注意，es6.promise是默认包含的，因为libs依赖Promises是很常见的。

- 3. 然而更多的情况是，我们并不确切的知道项目中引发兼容问题的具体原因，这时还可以配置为根据兼容目标导入所有 polyfill，需要设置babel.config.js为：
```
module.exports = {
  presets: [
    ['@vue/app', {
        useBuiltIns: 'entry'
    }]
  ]
}
```
同时在入口文件（main.js）第一行添加
```
import '@babel/polyfill
```
> 这会根据 browserslist 目标导入所有 polyfill，这样你就不用再担心依赖的 polyfill 问题了，但是因为包含了一些没有用到的 polyfill 所以最终的包大小可能会增加。

[vue-cli 浏览器兼容处理官方文档](https://cli.vuejs.org/zh/guide/browser-compatibility.html#browserslist)
