### 入门介绍
#### 为什么选择webpack
- 大多数团队在开发新项目时会采用紧跟时代的技术，这些技术几乎都会采用“ 模块
化＋新语言＋新框架” ， Webpack 可以为这些新项目提供一站式的解决方案;
- Webpack 有良好的生态链和维护团队，能提供良好的开发体验并保证质量；
- Webpack 被全世界大量的Web 开发者使用和验证，能找到各个层面所需的教程和经验分享。

#### 1.3 安装webpack
在用Webpack 执行构建任务时，需要通过webpack 可执行文件去启动构建任务，所以需要安装webpack 可执行文件。在安装Webpack 前请确保我们的系统安装了5.0.0 及以上版本的Node.js

在开始为项目加入构建前， 需要新建一个web项目：
新建一个目录如：webpack-demo，cd webpack-demo ，进入项目根目录后执行npm init 来初始化工程，执行完后会生成一个package.json文件

##### 1.3.2 安装webpack到本项目
npm i -D 是npm install --save-dev 的简写，是指安装模块并保存到package.json的devDependencies
＃安装最新的稳定版
npm i -D webpack
＃安装指定版本
npm i -D webpack@<version>
＃安装最新的体验版本
npm i -D webpack@beta

安装完成后，我们可以通过以下途径运行安装到本项目的Webpack:
- 在项目根目录下对应的命令行里通过node modules/.bin/webpack 运行Webpack 的可执行文件。
-  在Npm Script 里定义的任务会优先使用本项目下的Webpack，代码如下：
```
"scripts":{"build":"webpack --config webpack.config.js"}
```
##### 1.3.2 安装Webpack 到全局
安装到全局后，我们可以在任何地方共用一个Webpack 可执行文件，而不用各个项目重复安装，安装方式如下：
npm i -g webpack
虽然介绍了以上两种安装方式，但是我们**推荐安装到本项目**，原因是可防止不同的项目因依赖不同版本的Webpack 而导致冲突。

##### 1.3.2 使用Webpack
运行构建前，先将要完成该功能的最基础的JavaScript 文件和HTML 建立好，目录结构如下：

|── webpack-demo

   |── index.html

   |── main.js

   |── show.js

   |──  package.json
   
   |──  webpack.config.js

页面入口文件index.html 如下：
// index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="./dist/bundle.js"></script>
</body>
</html>
```
存放工具函数的show.js 文件的内容如下：
```javascript
// 操作DOM 元素，将content 显示到网页上
function show(content) {
    window.document.getElementById('app').innerText = "hello " + content;
}
module.exports = show;
```

包含执行入口的main .js 文件的内容如下：
```javascript
// 通过Common JS 规范导入show 函数
const show = require("./show")
show('webpack');
```

package.json
```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "build":"webpack --config webpack.config.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "webpack": "^4.35.2"
  }
}
```

Webpack 在执行构建时默认会从项目根目录下的webpack.config.js文件中读取配置，所以我们还需要新建它，其内容如下：
```javascript
const path = require("path");
module.exports = {
    //Javascript 执行的入口
  entry: "./main.js",
  mode: "development", // 项目当前执行环境：development/production
  output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
  }
};
```
一切文件就绪，在项目根目录下执行webpack 命令： npm run build ，我们会发现目录下多出一个dist 目录，里面有个bundle.js 文件， bundle.js 文件是一个可执行的JavaScript文件，它包含页面所依赖的两个模块main.js 、show.js ，以及内置的webpackBootstrap启动函数。这时用浏览器打开index.html 网页，将会看到Hello, Webpack

Webpack 是一个打包模块化JavaScript 的工具，它会从main.j s 出发，识别出源码中的模块化导入语句，递归地找出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。

#### 1.4 使用Loader
本节继续优化这个网页，为项目引入CSS代码, 在根目录下新建一个main.css ，内容如下：
```css
#app {
    text-align: center;
}
```
Webpack 将一切文件看作模块， css 文件也不例外。要引入main. css ，则需要像引入JavaScript 文件那样，修改入口文件main.js 如下：
```javascript
// 通过commonjs规范引入css模块
require("./main.css");
// 通过Common JS 规范导入show 函数
const show = require("./show")
show('webpack');
```
但是这样修改后去执行Webpack 构建是会报错的，因为Webpack 不原生支持解析css文件。要支持非JavaScript 类型的文件，则需要使用Webpack 的Loader 机制。将Webpack 的配置修改如下：
```javascript
const path = require("path");

module.exports = {
    //Javascript 执行的入口
  entry: "./main.js",
  mode: "development",
  output: {
    // 将所有依赖的模块合并输出到一个bundle.j s 文件中
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader', 
                  {
                      loader: 'css-loader', 
                      options: {
                        //   minimize: true
                        }
                  }
            ] //如上配置告诉Webpack ， 在遇到以.css 结尾的文件时，先使用css-loader 读取css 文件，再由styleloader 将css 的内容注入JavaScript 里
          }
      ]
  }
};
```

Loader 可以看作具有文件转换功能的翻译员，配置里的module.rules 数组配置了一组规则， 告诉Webpack 在遇到哪些文件时使用哪些Loader 去加载和转换。如上配置告诉Webpack ， 在遇到以.css 结尾的文件时，先使用css-loader 读取css 文件，再由styleloader 将css 的内容注入JavaScript 里。在配置loader时需要注意：
- use 属性的值需要是一个由Loader 名称组成的数组， Loader 的执行顺序是由后到前的；
- 每个Loader 都可以通过：
  - Url requerystring 的方式传入参数，例如css-loader?minimize 中的minimize 告诉css- loader 要开启css 压缩
  - options 属性配置实现（一般用这种方式配置）

在重新执行Webpack 构建前，要先安装新引入的Loader:
```
npm i -D style-loader css-loader
```

安装成功后重新执行构建时，我们会发现bundle.js 文件被更新了，里面注入了在main.css 中写的css ，而不会额外生成一个css 文件。但是重新刷新index.html 网页时，将会发现“ Hello,Webpack”中了，样式生效了！也许你会对此感到奇怪，第一次看到css 被写在了JavaScript 里！这其实都是style-loader 的功劳，它的工作原理大概是将css的内容用JavaScript 里的字符串存储起来，在网页执行JavaScript 时通过DOM 操作，动态地向HTML head 标签里插入HTML style 标签。也许你认为这样做会导致JavaScript 文件变大并且加载网页的时间变长，想让Webpack 单独输出css 文件。接下来讲解如何通过WebpackPlugin 机制来实现。

#### 1.5 使用Plugin
Plugin 是用来扩展Webpack 功能的，通过在构建流程里注入钩子实现，它为Webpack 带来了很大的灵活性。

上面一节通过Loader 加载了css 文件，本节通过Plugin 将注入bundle.js 文件里的css 提取到单独的文件中，配置webpack.config.js修改如下：
```javascript
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //Javascript 执行的入口
  entry: "./main.js",
  mode: "development",
  output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
  },
  module: {
      rules: [
        {
           test: /\.css$/, // 用正则去匹配要用该loader 转换的css 文件
           loaders: ExtractTextPlugin.extract({
               //转换.css 文件需要使用的Loader
               use: ['css-loader']
           }) 
        }
      ]
  },
  plugins: [
      new ExtractTextPlugin({
          // filename: `[name]_[hash:8].css` // 从.js 文件中提取出来的.css 文件的名称
          filename: `[name]_style.css` // 暂时为了方便在html文件中引入css 采用固定格式文件名
      })
  ]
};
```
要让以上代码运行起来，需要先安装新引入的插件：
```
npm i -D extract-text-webpack-plugin
```

安装成功后重新执行构建
>  如果执行出现报错：
原因：extract-text-webpack-plugin还不能支持webpack4.0.0以上的版本
解决：npm install --save-dev extract-text-webpack-plugin@next
（"extract-text-webpack-plugin": "^4.0.0-beta.0"）

 我们会发现dist 目录下多出一个main_7a56a.css 文件， bundle.js 文件里也没有css 代码了，再将该css 文件： main_style.css 引入index.html 里就完成了。

从以上代码可以看出， Webpack 是通过plugins 属性来配置需要使用的插件列表的。plugins 属性是一个数组，里面的每一项都是插件的一个实例，在实例化一个组件时可以通过构造函数传入这个组件支持的配置属性。

#### 1.6 使用devServer
前面的几节只是让Webpack 正常运行起来了，但在实际开发中我们可能会需要：
- 提供HTTP 服务而不是使用本地文件预览；
- 监昕文件的变化并自动刷新网页，做到实时预览：
- 支持SourceMap ，以方便调试。

对于这些， Webpack 都为我们考虑好了。Webpack 原生支持上述第2 、3 点内容，再结合官方提供的开发工具DevServer ( https: //webpack.js.org/configuration/dev-server）也可以很方便地做到第1 点。DevServer 会启动一个HTTP 服务器用于服务网页请求，同时会帮助启动Webpack ，并接收Webpack 发出的文件更变信号，通过WebSocket 协议自动刷新网页做到实时预览。

下面为之前的小项目“ Hello ,Webpack ”继续集成DevServer 。首先需要安装DevServer:
```
npm i -D webpack-dev-server
```
安装成功后执行：webpack-dev-server 命令， DevServer 就启动了，这时我们会看到
控制台有一串日志输出：
```
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
```
这意味着DevServer 启动的HTTP 服务器监听在8080 端口， DevServer 启动后会一直驻留在后台保持运行，访问这个网址，就能获取项目根目录下的index.html 了。用浏览器打开这个地址时我们会发现页面空白，错误的原因是./dist/bundle.js 加载404了。同时我们会发现并没有文件输出到dist 目录，原因是DevServer 会将Webpack 构建出的文件保存在内存中，在要访问输出的文件时，必须通过HTTP 服务访问。由于DevServer不会理会webpack.config.js 里配置的output.path 属性，所以要获取bundle.js 的正确URL 是http: //localhost:8080/bundle.js，对应的index.html 应该修改为：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
     <link href="main_style.css" rel="stylesheet"/>
</head>
<body>
    <div id="app"></div>
    <script src="bundle.js"></script>
</body>
</html>
```
##### 1.6.1 实时预览
接着上面的步骤，可以试试修改main.js 、main.css 、show.js 中的任意文件，保存后我们会发现浏览器被自动刷新，运行出修改后的效果。
Webpack 在启动时可以开启监昕模式，之后Webpack 会监昕本地文件系统的变化，在发生变化时重新构建出新的结果。

通过DevServer 启动的Webpack 会开启监听模式，当发生变化时重新执行构建，然后通知DevServer 。DevServer 会让Webpack 在构建出的JavaScript 代码里注入一个代理客户端用于控制网页，网页和DevServer 之间通过WebSocket 协议通信，以方便DevServer 主动向客户端发送命令。DevServer 在收到来自Webpack 的文件变化通知时，通过注入的客户端控制网页刷新。

> 如果尝试修改index.html 文件并保存，则我们会发现这并不会触发以上机制， 导致这个问题的原因是Webpack 在启动时会以配置里的entry 为入口去递归解析出entry 所依赖的文件，只有entry 本身和依赖的文件才会被Webpack 添加到监听列表里。而index.html文件是脱离了JavaScript 模块化系统的，所以Webpack 不知道它的存在

##### 1.6.2 模块热替换
除了通过重新刷新整个网页来实现实时预览， DevServer 还有一种被称作模块热替换的刷新技术。模块热替换能做到在不重新加载整个网页的情况下，通过将己更新的模块替换老模块，再重新执行一次来实现实时预览。模块热替换相对于默认的刷新机制能提供更快的响应速度和更好的开发体验。模块热替换默认是关闭的，要开启模块热替换，我们只需在启动DevServer 时带上--hot 参数，重启Dev Server 后再去更新文件就能体验到模块热替换的神奇了。
```
webpack-dev-server --hot
```
启动参数配置参见[webpack官方文档](https://webpack.js.org/configuration/dev-server/)

##### 1.6.3 支持Source Map
在浏览器中运行的JavaScript 代码都是编译器输出的代码，这些代码的可读性很差。如果在开发过程中遇到一个不知道原因的Bug，则我们可能需要通过断点调试去找出问题。在编译器输出的代码上进行断点调试是一件辛苦和不优雅的事情，调试工具可以通过Source Map( https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/）映射代码，让我们在源代码上断点调试。Webpack 支持生成Source Map ，只需在启动时带上一devtool source-map参数。
```
webpack-dev-server --devtool source-map
```
重启DevServer 后刷新页面，再打开Chrome 浏览器的开发者工具，就可以在Sources栏中看到可调试的源代码了，如图1-2 所示。
![image.png](https://upload-images.jianshu.io/upload_images/12953648-3abcc707f27258a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 1.7 核心概念
相信我们己经对Webpack 有了一个初步的认识。虽然Webpack 功能强大且配置项多，但只要理解了其中的几个核心概念，就能随心应手地使用它。Webpack有以下几个核心概念。
- Entry：入口， Webpack 执行构建的第一步将从Entry 开始，可抽象成输入。
- Module ：模块，在Webpack 里一切皆模块，一个模块对应一个文件。Webpack 会从配置的Entry 开始递归找出所有依赖的模块。
- Chunk ：代码块，一个Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader ：模块转换器，用于将模块的原内容按照需求转换成新内容。
- Plugin ：扩展插件，在Webpack 构建流程中的特定时机注入扩展逻辑，来改变构建结果或做我们想要的事情。
- Output：输出结果，在Webpack 经过一系列处理并得出最终想要的代码后输出结果。

Webpack 在启动后会从Entry里配置的Module 开始，递归解析Entry 依赖的所有Module 。每找到一个Module ，就会根据配置的Loader 去找出对应的转换规则，对Module 进行转换后，再解析出当前Module 依赖的Module 这些模块会以Entry为单位进行分组， 一个Entry及其所有依赖的Module 被分到一个组也就是一个Chunk 。最后， Webpack 会将所有Chunk 转换成文件输出。在整个流程中， Webpack 会在恰当的时机执行Plugin 里定义的逻辑。

[下一篇： webpack配置详解](./webpack配置详解.md)