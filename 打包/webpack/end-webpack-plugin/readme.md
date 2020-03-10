> 该插件的名称为EndWebpackPlugin ，作用是在Webpack 即将退出时再附加一些额外的操作，例如在Webpack 成功编译和输出了文件后执行发布操作，将输出的文件上传到服务器。同时该插件还能区分Webpack 构建是否执行成功。

#### end hook after webpack is done

**install**

```
npm i end-webpack-plugin --save-dev
```

**use**

```js
 new EndWebpackPlugin(stats => {
        console.info('after webpack all done',stats)
    } , err => {
        console.error('after webpack exit with error',err)        
    })
```

