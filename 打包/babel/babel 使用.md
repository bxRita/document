
### Babel 是什么？
#### Babel 是一个 JavaScript 编译器
Babel 是一个工具链，主要用于将 ECMAScript 2015+ （ES6+）版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：
- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
- 源码转换 (codemods)

Babel 通过语法转换器来支持新版本的 JavaScript 语法。

### Babel用法
- 1. 方法一：引入js文件
```
<script src="browser.min.js" charset="utf-8"></script>
<script type="text/babel">
	let a = 1;
        let show = s => s + 1;

        alert(show(a));
</script>
```

引入browser.min.js的作用是使浏览器支持babel，可以使用ES2015+的语法，注意script的type类型是**`text/babel`**，标准的浏览器无法解析这种类型的脚本，但是引入browser.min.js转换js文件后，会根据该类型将script内容执行语法转换，从而兼容低版本浏览器（IE6应该是没救了）

> 使用这种方式有个缺点， 就是babel需要执行js语法转换，故页面加载会相对慢些


- 2. 方法二：编译js文件
1. 安装node.js ， 初始化项目
```
npm init -y
```

2. 安装babel-cli
```
npm i @babel/core @babel/cli @babel/preset-env -D

npm i @babel/polyfill -S
```
`@babel/core`   babel核心代码库
`@babel/cli `  babel命令库
`@babel/preset-env`    babel预设编译项
`@babel/polyfill`   babel兼容处理

3. 在`package.json`文件添加执行脚本
```
"scripts": {
	"build": "babel src -d dest"
}
```

4. 添加`.babelrc`配置文件
```
{
	"presets": ["@babel/preset-env"]
}
```
5. 执行编译
```
npm run build
```

7. demo案例
demo 结构如下：
![image.png](https://upload-images.jianshu.io/upload_images/12953648-28fe7038dfd85fed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

package.json文件源码：
```
{
  "name": "babel",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "babel src -d dest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.5.0",
    "@babel/core": "^7.5.0",
    "@babel/preset-env": "^7.5.0"
  }
}

```

.babel 源文件：
```
{
	"presets": ["@babel/preset-env"]
}
```

a.js 脚本文件
```
let a = 1;
let show = s => s + 1;
alert(show(a));

```

index.html文件：
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script type="text/javascript" src="dest/a.js">
    </script>
  </body>
</html>
```

最终运行效果：
![image.png](https://upload-images.jianshu.io/upload_images/12953648-22bbf2da74cfc291.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
