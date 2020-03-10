> 该Loader 的使用场景是正确加载针对Fis3 ( http://fis.baidu.com/fis3/docs/user-dev/require.html ）编写的JavaScript ，这些JavaScript 中存在通过注释的方式加载依赖的css 文件。

**install**
```
npm i comment-require-loader --save-dev
```

**use**

webpack.config.js
```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['comment-require-loader'],
        include: [path.resolve(__dirname, 'node_modules/imui')]
      }
    ]
  }
};
```

org file
```
// @require '../style/index.css'
```

output file
```
require('../style/index.css');
```

实际是这个插件用于在 webpack 构建环境里兼容使用 fis3 输出的带有// @require '***' 的文件