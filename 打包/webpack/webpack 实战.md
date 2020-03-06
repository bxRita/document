ECMAScript 6.0是2015年发布的下一代JavaScript语言标准，它引入了新的语法和API来提升开发效率，虽然目前部分浏览器和Node.js 已经支持ES6，但由于它们对ES6的所有标准支持不全，会导致在开发中不能全面使用ES6.     
通常我们需要将采用ES6编写的代码转换成目前已经支持良好的ES5代码，包含如下两件事：
- 将新的ES6语法用ES5实现，例如ES6的class语法用ES5的prototype实现
- 为新的API注入polyfill，例如使用新的fetch API时在注入对应的polyfill 后才能让低端浏览器正常运行

### 3.1.1 认识Babel
Babel可以方便地完成以上两件事。Babel是一个JavaScript编译器，能将ES6代码转为ES5代码，让我们使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活的扩展。在Babel执行编译的过程中，会从项目根目录下的.babelrc文件中读取配置。.babelrc时一个JSON格式的文件，内容大致如下：
```json
{
    "plugins":[
        [
            "transform-runtime",
            {
                "polyfill": false
            }
        ]
    ],
    "presets": [
        [
            "es2015",
            {
                "modules": false
            }
        ],
        "stage-2",
        "react"
    ]
}

```
**1. Plugins**
plugins属性告诉Babel要使用哪些插件，这些插件可以控制如何转换代码。   
以上配置文件里的transform-runtime对应的插件全名叫做babel-plugin-transform-runtime，即在前面加上babel-plugin-。要让Babel正常运行，我们必须先安装这个插件：
```
npm i -D babel-plugin-transform-runtime
```
babel-plugin-transform-runtime 是Babel官方提供的一个插件，作用是减少冗余代码。Babel在将ES6代码转换成ES5代码时，通常需要一些由ES5编写的辅助函数来完成新语法的实现，例如在转换class extent语法时会在转换后的ES5代码里注入_extent辅助函数用于实现继承：
```js
function _extent(target) {
    for(var i =1; i < arguments.length; i++>) {
        var source = arguments[i];
        for(var key in source) {
            if(Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
```
这会导致每个使用class extent语法的文件都被注入重复的_extent辅助函数代码，babel-plugin-transform-runtime的作用在于将原本注入JavaScript文件里的辅助函数替换成一条导入语句：
```js
var _extent = require('babel-runtime/helpers/_extent');
```
这样能减小Babel编译出来的代码的文件大小。     
同时需要注意的是，由于babel-plugin-transform-runtime注入了require('babel-runtime/helpers/_extent')语句到编译后的代码里，需要安装babel-runtime依赖到我们的项目后，代码才能正常运行。也就是说babel-plugin-transform-runtime 和 babel-runtime需要配套使用，在使用babel-plugin-transform-runtime后一定需要使用babel-runtime。   

**2. Presets**
presets属性告诉Babel要转换的源码使用了哪些新的语法特性，一个Presets对一组新语法的特性提供了支持，多个Presets可以叠加。Presets其实是一组Plugins的集合，每个Plugin完成一个新语法的转换工作。Presets是按照ECMAScript草案来组织的，通常可以分为以下三大类。
1. 已经被写入ECMAScript标准里的特性，由于之前每年都有新特性被加入到标准里，所以又可细分如下。
    - ES2015 ： 包含2015年加入的新特性
    - ES2016 ： 包含2016年加入的新特性
    - ES2017 ： 包含2017年加入的新特性
    - Env : 包含当前所有ECMAScript标准里的最新特性
2. 被社区提出来的但还未被写入ECMAScript标准里的特性，这其中又分为以下4种
    - stage0 只是一个美好激进的想法，一些Babel插件实现了对这些特性的支持，但是不确定是否会被定为标准。  
    - stage1 值得被纳入标准的特性
    - stage2 该特性规范已经被起草，将会被纳入标准里
    - stage3 该特性规范已经定稿，各大浏览器厂商和Node.js社区已开始着手实现
    - stage4 在接下来的一年里将会加入标准里
3. 用于支持一些特定应用场景下的语法的特性，和ECMAScript 标准没有关系，例如babel-preset-react用于支持React开发里的JSX语法。


### 3.1.2 接入Babel
在了解Babel后，下一步就需要知道如何在Webpack种使用它。由于Babel所做的事情是转换代码，所以应该通过Loader去接入Babel。Webpack的配置如下：
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    },
    // 输出source-map 以方便直接调试ES6源码
    devtool: 'source-map'
};
```
以上配置命中了项目目录下的所有JavaScript文件，并通过Babel-loader调用Babel完成转换工作。在重新执行构建前，需要先安装新引入的依赖：
```
# Webpack 接入Babel必须依赖的模块
npm i -D babel-core babel-loader
# 根据我们的需求选择不同的Plugins或Presets
npm i -D babel-preset-env
```

### 3.2 使用TypeScript语言
TypeScript 是JavaScript的一个超集，主要提供了类型检查系统和ES6语法支持，但不支持新的API。目前没有任何环境支持运行原生的TypeScript代码，必须通过构建将它转换成JavaScript代码后才能运行。    

下面改造一下前面用过的例子,用TypeScript 重写JavaScript。
```typescript
// show.ts
export function show(content: string) {
    window.document.getElementById('app').innerText = `Hell0, ${content}`
}
//main.ts
import {show} from './show.ts'

// 执行show 函数
show ('Webpack');
```
TypeScript官方提供了能将TypeScript转换成JavaScript的编译器。我们需要在当前项目的根目录下新建一个用于配置编译选项的tsconfig.json文件，编译器默认会读取和使用这个文件，配置文件的内容如下：
```json
{
    "compilerOptions": {
        "importHelpers": true,// 为了不让同样的辅助函数重复出现在多个文件中，可以开启Typescript编译器的importHelpers选项
        "module": "commonjs", // 编译出的代码采用的模块规范
        "target": "es5", // 编译出的代码采用ES的哪个版本
        "sourceMap": true // 输出SourceMap 以方便调试 
    },
    "exclude": [// 不编译这些目录里的文件
        "node_modules"
    ]
}
```
通过npm install -g typescript 安装编译器到全局后，可以通过tsc hello.ts命令编译出hello.js 和hello.js.map文件。

#### 3.2.3 集成webpack
要让Webpack支持TypeScript，需要解决以下两个问题。
- 通过Loader将TypeScript转换成JavaScript
- Webpack在寻找模块对应的文件时需要尝试ts后缀

对于问题1，社区已经出现了几个可用的Loader，推荐速度更快的awesome-typescript-loader。对于问题2，我们需要修改默认的resolve.extensions配置项。   
综上所述，相关的Webpack配置如下：
```js
const path = require('path');
module.exports = {
   //Javascript 执行的入口
   entry: "./main",
   mode: "development",
   output: {
    // 将所有依赖的模块合并输出到一个bundle.js 文件中
     filename: "bundle.js",
     path: path.resolve(__dirname, "./dist") // 将输出文件都放到dist 目录下
   },
    resolve: {
        // 先尝试以ts为后缀的typeScript源码文件
        extensions: ['.ts','.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    devtool: 'source-map'// 输出sourcemap以方便在浏览器里调试typeScript代码
}
```
在运行构建前需要安装上面用到的依赖：
```
npm i -D typescript awesome-typescript-loader
```

### 3.3 使用Flow检查器


### 3.9 为单页应用生成HTML
> hello,webpack这个例子是因为只输出了一个bundle.js文件，所以手写了一个index.html文件去引入这个bundle.js才能在浏览器中运行起来。问题：如何自动化地生成这个符合要求的index.html

#### 3.9.3 解决方案
这里推荐一个用于方便解决以上问题的webpack插件web-webpack-plugin。该插件已经被社区中的许多人使用和验证，解决了大家的痛点并获得很多好评。   
修改webpack配置如下：
```js
const path = require('path');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DefinePlugin = require ('webpack/lib/DefinePlugin');
const { WebPlugin } =require ('web-webpack-plugin') ；
module.exports = {
    entry: {
        app: './main.js'// app的JavaScript执行入口文件
    },
    output: {
        filename :'[name]_[chunkhash:8].js'， // 为输出的文件名称加上Hash 值
        path: path.resolve (__dirname,'./dist'),
    },
    module: {
        rules: [
            {
                test : /\.js$/ ,
                use: ['babel-loader'] ,
                //排除nodemodules 目录下的文件，
                //该目录下的文件都采用了ESS 语法，没必要再通过Babel 转换
                exclude : path.resolve( dirname , 'node_modules') ,
            },
            {
                test: /\.css/, //增加对css 文件的支持
                //提取出Chunk 中的css 代码到单独的文件中
                use: ExtractTextPlugin.extract({
                    use:［'css-loader?minimize'］ //压缩css 代码
                })
            }
        ]
    },
    plugins: [
        //使用本文的主角WebPlugin ， 一个WebPlugin 对应一个HTML 文件
        new WebPlugin ({
            template : './template.html', //HTML 模板文件所在的文件路径
            filename : 'index.html'// 输出的HTML 的文件名称
        }),
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`, // 为输出css文件名称加上hash值
        }),
        new DefinePlugin({
            // 定义NODE_ENV环境变量为production，以去除源码中只有开发时才需要的部分
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            //删除所有注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有console语句，可以兼容IE浏览器
                drop_console: true,
                //内嵌已定义但是只用到了一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义变量去引用的静态值
                reduce_vars: true
            }
        })
    ]
}
```
以上大多数配置都是按照前面讲过的内容增加的配置，例如：
- 增加对css文件的支持，将Chunk中的CSS代码提取到单独的文件中，压缩CSS文件
- 定义NODE_ENV环境变量为production，以去除源码中只有开发时才需要的部分
- 为输出的文件名称加上Hash值
- 压缩输出的JavaScript代码

但核心部分在于plugins里的内容：
```js
new WebPlugin ({
    template : './template.html', //HTML 模板文件所在的文件路径
    filename : 'index.html'// 输出的HTML 的文件名称
}),
```
其中template: `./template.html`所指的模板文件内容是：
```html
<html>
<head >
<meta charset="UTF-8">
<!--注入Chunk app 中的css 代码-->
<link rel="stylesheet" href="app?_inline">
<!--二注入google_analytics 中的JavaScript 代码-->
<script src="./google_analytics.js?_inline"></script>
<!--异步加载Disqus 评论-->
<script src ="https://dive-into-webpack.disqus.com/embed.js"async></script>
</head>
<body>
<div id="app"></div>
<!--导入Chunk app 中的JavaScript 代码-->
<script src="app"></script>
<!--Disqus 评论容器-->
<div id="disqus thread"></div>
</body>
</html>
```
该文件描述了哪些资源需要被以哪种方式加入到输出的HTML文件中。    
以`<link rel="stylesheet" href="app?_inline">`为例，按照正常引入css文件一样的语法来引入Webpack 生产的代码。href 属性中的app?_inline 可以分为两部分，前面的app 表示css 代码来自名叫app 的Chunk ，后面的_inline 表示这些代码需要被内嵌到这个标签所在的位置。     

同样，`<script src="./google_analytics.js?_inline"></script>`表示JavaScript 代码来自相对于当前模板文件template.html 的本地文件./google_ analytics.js ，而且文件中的JavaScript 代码也需要被内嵌到这个标签所在的位置。

也就是说，在资源链接URL 字符串里问号前面的部分表示资源内容来自哪里，后面的querystring 表示这些资源注入的方式。     
该插件除了支持inline 属性，表示内嵌资源到HTML 中，还支持以下属性。
- _dist: 只有在生产环境下才引入该资源
- _dev: 只有在开发环境下才引入该资源
- _ie: 只有在IE浏览器下才需要引入该资源，通过`[if IE]>resource<![endif]`注释实现。    
这些属性之间可以搭配使用，互不冲突。例如app?_inline&_dist表示只在生产环境才引入该资源，并且需要内嵌到HTML里。     

### 3.13 构建NPM模块
#### 3.13.1 认识NPM
Npm (https://www.npmjs.com ）是目前最大的JavaScript 模块仓库，里面有全世界的开发者上传的可复用模块。虽然在大多数情况下我们都是这些开放模块的使用者，但我们也许会成为贡献者，会开发一个模块上传到Npm 仓库。     
发布到Npm 仓库的模块有以下几个特点。
+ 在每个模块根目录下都必须有一个描述该模块的package.json 文件。该文件描述了模块的入口文件是哪个，该模块又依赖哪些模块等。若想深入了解，则可以阅读package.json 文件(http://javascript.ruanyifeng.com/nodejs/packagejson.html ） 。

+ 模块中的文件以JavaScript 文件为主，但不限于JavaScript 文件。例如一个UI组件可能同时需要JavaScript 、css 、图片文件等。

+ 模块中的代码大多采用模块化规范，因为我们的某个模块可能依赖其他模块，而别的模块又可能依赖我们的这个模块。目前支持比较广泛的是CommonJS 模块化规范，上传到Npm 仓库的代码最好遵守该规范。

#### 3.13.2 抛出问题
Webpack 不仅用于构建可运行的应用，也用于构建可上传到T句m 的模块。接下来讲解如何用Webpack 构建一个可上传到N pm 仓库的React 组件，具体要求如下。    
* 源代码采用ES6 编写，但发布到Npm 仓库时需要转换成ES5 代码，并且遵守CommonJS 模块化规范。如果发布到Npm 上的ES5 代码是经过转换的，则请同时提供Source Map 以方便调试。
* 该UI 组件依赖的其他资源文件如css 文件也需要包含在发布的模块里。
* 尽量减少冗余代码，减少发布出去的组件的代码文件大小。
* 在发布出去的组件的代码中不能含有其依赖的模块的代码，而是让用户可选择性地安装。例如不能内嵌React 库的代码，这样做的目的是，在其他组件也依赖React库时，防止React 库的代码被重复打包。

在开始前先看看最终发布到N pm 仓库的模块的目录结构：
```
node_modules/hello-webpack
|--lib
|   |--index.css(组件所有依赖的CSS都在这个文件中)
|   |--index.css.map
|   |--index.js(组件所有依赖的CSS都在这个文件中)
|   |--index.js.map
|--src(ES6 源码)
|   |--index.css
|   |--index.js
|--package.json(模块描述文件)
```
src/index.js 文件中，内容如下：
```js
import React , { Component } from "react";
import "./index.css";
// 导出该组件以供其他模块使用
export default class HelloWebpack extends Component {
    render () {
        return <hl className="hello-component">Hello,Webpack</hl>
    }
}
```
使用该模块时只需要这样做
```js
// 通过ES6语法导入
import HelloWebpack from './hello-webpack'
import 'hello-webpack/lib/index.css';

// 通过ES5语法导入
var  HelloWebpack =require('./hello-webpack') 
require('hello-webpack/lib/index.css');

//  使用react-dom渲染
render(<HelloWebpack />);
```
#### 3.13.2 使用Webpack 构建Npm模块
接下来用Webpack一条一条地对应上面所抛出的4点要求：
1) 对于要求1，可以这样
- 使用babel-loader将ES6代码转换成ES5代码
- 通过开启devtool: 'source-map'输出Source Map以发布调试。
- 设置output.libraryTarget = 'commonjs2'，使输出的代码符合CommonJS2模块化规范，以供其它模块导入使用。

相关的Webpack配置代码如下：
```js
module.exports = {
    output: {
        //输出的代码符合Common JS 模块化规范，以供其他模块导入使用。
        libraryTarget:'commonjs2',
    },
    // 输出Source Map
    devtool: 'source-map'
}
```

2) 对于要求2，需要通过css-loader 和extract祀xt-webpack-plugin 实现，相关的Webpack配置代码如下：
```js
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
module.exports = {
    module: {
        rules: [
            {
                // 增加对CSS文件的支持
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            // 输出的css文件名称
            filename: 'index.css'
        })
    ]
}
```
此步引入了3个依赖：
**安装Webpack 构建所需要的新依赖**
```
npm i -D style-loader css-loader extract-text-webpack-plugin
```
3) 对于要求3 ，需要注意的是Babel 在将ES6 代码转换成ES5 代码时会注入一些辅助函数。    
修改.babelrc文件，为其加入transform-runtime插件：   
```json
{
    "plugins": [
        [
            "transform-runtime",
            {
                // transform-runtime 默认会自动为我们使用的ES6 API 注入polyfill
                // 假如在源码中使用了Promise ，则输出的代码将会自动注入 require ('babel-runtimelcore- jslPromise') 语句
                // polyfill 的注入应该交给模块使用者，因为使用者可能在其他地方注入了其他Promise polyfill 库
                // 所以关闭该功能
                "polyfill": false
            }
        ]
    ]
}
```
4)  对于要求4 ，需要通过在2.7 节介绍过的Externals 实现。
Externals 用来告诉在Webpack 要构建的代码中使用了哪些不用被打包的模块，也就是说这些模板是外部环境提供的， Webpack 在打包时可以忽略它们。    
相关的Webpack 配置代码如下：   
```js
module.exports = {
    // 通过正则命中所有以react 或者babel-runtime 开头的模块
    // 这些模块通过注册在运行环境中的全局变量访问，不用被重复打包进输出的代码里
    externals: /^(react|babel-runtime)/,
}
```
开启以上配置后，在输出的代码中会存在导入react 或者babel-runtime 模块的代码，但是它们的react 或者babel-runtime 的内容不会被包含进去    

webpack 完整配置如下：
```js
const path = require("path");
const ExtractTextPlugin = require ('extract-text-webpack-plugin');

module.exports = {
    //Javascript 执行的入口
  entry: "./src/index.js",
  mode: "development",
  output: {
    // 输出文件的名称
    filename: "index.js",
    // 输出文件存放目录
    path: path.resolve(__dirname, "./lib"),
    // 将输出文件都放到dist 目录下
    libraryTarget: 'commonjs2'
  },
  // 通过正则命中所有以rea ct 或者babel- runtime 开头的模块，
  // ／这些模块通过注册在运行环境中的全局变量访问，不能被打包进输出的代码里，防止它们出现多次。
  externals: /^(react|babel-runtime)/,
  module: {
      rules: [
          {
              test: /\.js$/,
              use: ['babel-loader'],
              // 排除node_modules 目录下的文件，
              // node_modules 目录下的文件都采用了ES5 语法，没必要再通过Babel 转换。
              exclude: path.resolve(__dirname, 'node_modules')
          },{
            // 增加对css文件的支持
            test: /\.css/,
            // 提取Chunk 中的css 代码到单独的文件中
            use: ExtractTextPlugin.extract({
              use: ['css-loader']
            })
          }
      ]
  },
  plugins: [
    new ExtractTextPlugin({
      // 输出css文件名称
      filename: 'index.css'
    })
  ],
  // 输出sourceMap
  devtool: 'source-map'
};
```

### 3.15 搭配NPM script
Npm script 使一个任务执行者。Npm 是在安装Node.js时附带的包管理器， Npm Script 则是Npm 内置的一个功能，允许在package.json 文件里使用scripts 宇段定义任务：
```json
"scripts": {
    "dev":"node dev.js",
    "pub":"node build.js"
}
```
以上代码中的scripts 字段是一个对象，每个属性对应一段脚本，以上代码定义了两个任务dev 和pub 。Npm Script 的底层实现原理是通过调用Shell 去运行脚本命令， 例如执行`npm run pub `命令等同于执行`node build.js` 命令。    
Npm Script 还有一个重要的功能，是能运行安装到项目目录的node_modules 里的可执行模块，例如在通过命令：
```
npm i -D webpack
```
将Webpack 安装到项目中后，是无法直接在项目根目录下通过命令webpack 去执行Webpack构建的，而是要通过如下命令去执行：   
```
./node_modules/.bin/webpack
```
Npm Script 能方便地解决这个问题，只需要在scripts 字段里定义一个任务，例如：
```json
{
   "scripts": {
        "build":"webpack"
    } 
}
```
Npm Script 会先去项目目录下的node_modules 中寻找有没有可执行的webpack 文件，如果有就使用本地的，如果没有就使用全局的。所以现在执行Webpack 构建时，只需要通过执行npm run build 实现。    

#### 3.15.2 NPM 为什么需要Npm script
Webpack 只是一个打包模块化代码的工具，并没有提供任何任务管理相关的功能。但在实际场景中通常不会是只通过执行webpack 就能完成所有任务的， 而是需要多个任务才能完成。
举一个常见的例子，要求如下。
-  在开发阶段为了提高开发体验，使用DevServer 做开发，并且需要输出Source Map以方便调试，同时需要开启自动刷新功能。
-  为了减小发布到线上的代码尺寸，在构建出发布到线上的代码时， 需要压缩输出的代码。
-  在构建完发布到线上的代码后，需要将构建出的代码提交给发布系统。

可以看出要求1 和要求2 是相互冲突的， 其中要求3 又依赖要求2 。要满足以上三个要求，需要定义三个不同的任务。

接下来通过Npm Script 定义上面的3 个要求：
```json
{
   "scripts": {
        "dev":"webpack-dev-server --open",
        "dist":"NODE_ENV=production webpack --config webpack_dist.config.j s",
        "pub":"npm run dist && rsync dist"
    } 
}
```
含义分别如下。
- dev 代表用于开发时执行的任务， 通过DevServer 启动构建。所以在开发项目时只需执行npm run dev
- dist 代表构建出用于发布到线上的代码，输出到dist 目录中。其中的NODE_ENV=production 用于在运行任务时注入环境变量。
- pub 代表先构建出用于发布到线上的代码，再同步dist 目录中的文件到发布系统（如何同步文件，则需根据我们所使用的发布系统而定〉，所以在开发完成后需要发布时只需执行npm run pub 。

> 使用Npm Script 的好处是将一连串复杂的流程简化成了一个简单的命令，在需要时只需执行对应的简短命令，而不用手动重复整个流程。这会大大提高我们的效率并降低出错率。

### 3.16 代码检查
#### 3.16.1 代码检查具体是做什么的
检查代码和Code Review 很相似，都是审视提交的代码可能存在的问题。但Code Review一般由人执行，而检查代码是通过机器执行一些自动化的检查。自动化地检查代码的成本更低，实施代价更小。   

检查代码时主要检查以下几项。
- 代码风格：让项目成员强制遵守统一的代码风格，例如如何缩紧、如何写注释等，保障代码的可读性，不将时间浪费在争论如何使代码更好看上。

- 潜在问题： 分析代码在运行过程中可能出现的潜在Bug 。

目前己经有成熟的工具可以检验诸如JavaScript 、Type Script 、css 、scss 等常用语言。    

#### 3.16.2 怎么做代码检查
**1.检查JavaScript**
目前最常用的JavaScript 检查工具是ESlint（https: //eslint.org ），它不仅内置了大量的常用检查规则，还可以通过插件机制做到灵活扩展。     
ES lint 的使用很简单，在通过：
```
npm i -g eslint
```
安装到全局后，再在项目目录下执行：
```
eslint init
```
来新建一个ES lint 配置文件.eslintrc ，该文件的格式为JSON 。   
如果想覆盖默认的检查规则，或者想加入新的检查规则，则需要修改该文件，例如使用以下配置：
```json
{
  // 从eslint :recommended 中继承所有检查规则
  "extends":"eslint:recommended",
  // 再自定义一些规则
  "rules": {
      // 需要在每行结尾加；
      "semi":["error","always"],
      // 需要使用"" 包裹字符串
      "quotes":["error", "double"]
  }  
}
```
写好配置文件后，再执行
```
eslint yourfile.js
```

去检查yourfile.js 文件，如果我们的文件没有通过检查，则ESlint 会输出出错的原因

#### 3.16.3 结合webpack检查代码
以上介绍的代码检查工具可以和Webpack 结合，在开发过程中通过Webpack 输出实时的检查结果。

**1. 结合ESlint**
eslint-loader ( https://github.com/MoOx/eslint-loader ）可以方便地将ESLint 整合到Webpack 中，使用方法如下：
```js
module.exports = {
    module: {
        rules: [
            test: /\.js/,
            // 不用检查node_modules 目录下的代码
            include: /node modules/,
            loader :'eslint-loader',
            // 将eslint-loader 的执行顺序放在最前面，防止其他Loader 将处理后的代码交给eslint-loader 去检查
            enforce : 'pre'
        ]
    }
}
```
接入eslint-loader 后，就能在控制台中看到ESLint 输出的错误日志了。

**4.一些建议**
将代码检查功能整合到Webpack 中会导致以下问题：
- 由于执行检查步骤的计算量大，所以整合到Webpack 中会导致构建变慢：
- 在整合代码检查到Webpack 后，输出的错误信息是通过行号来定位错误的，没有编辑器集成显示错误直观。

为了避免以上问题，还可以这样做：
- 使用集成了代码检查功能的编辑器，让编辑器实时、直观地显示错误：
- 将代码检查步骤放到代码提交时，也就是说在代码提交前调用以上检查工具去检查代码，只有在检查都通过时才提交代码，这样就能保证提交到仓库的代码都通过了检查。

如果我们的项目是使用Git 管理的， 则Git 提供了Hook 功能做到在提交代码前触发执行脚本。

husky ( https://github.com/typicode/husky ）可以方便、快速地为项目接入Git Hook ，执行npm i -D husky 安装husky 时， husky 会通过Npm Script Hook 自动配置好Git Hook,我们需要做的只是在package.json 文件中定义几个脚本，方法如下：

```json
{
   "scripts": {
       // 在执行git commit 前会执行的脚本
        "precommit":"npm run lint",
        // 在执行git push 前会执行的脚本
        "prepush":"lint",
        // 调用es lint 、stylelint 等工具检查代码
        "lint":"eslint && stylelint"
    }
}
```
我们需要根据自己的情况选择设置precommit 和prepush 中的一个，无须对两个都设置。    


### 3.17 通过Node.js API 启动webpack
#### 3.17.1 安装和使用Webpack模块
在调用Webpack API前，需要先安装它：
```
npm i -D webpack
```
安装成功后，可以采用以下代码导入webpack模块：
```js
const webpack = require('webpack');

// ES6语法
import webpack from 'webpack';
// 导出的webpack 其实是一个函数，使用方法如下：
webpack({
    // webpack 配置，和webpack.config.js 文件一致
}, (err, starts) => {
    if(err || starts.hasErrors()){
        // 构建过程出错
    }
    // 成功执行完构建
})
```
如果我们将Webpack配置写在webpack.config.js文件中，则可以这样使用：
```js
// 读取webpack.config.js 文件中的配置
const config = require('./webpack.config.js');
webpack(config, callback);
```

#### 3.17.2 以监听模式运行
以上使用Webpack API的方法只能执行一次构建，无法以监听模式启动Webpack，为了使用API时以监听模式启动，则需要获取Compile实例，方法如下：
```js
// 如果不传callback 回调函数作为第2 个参数，就会返回一个Compiler 实例，用于控制启动， 而不是像上面那样立即启动
const compiler = webpack(config);
// 调用compiler.watch并以监听模式启动，返回的watching用以关闭监听
const watching = compiler.watch({
    //watchOptions
    aggregateTimeout: 300,
}, (err, stats) => {
    // 每次因文件发生变化而重新执行完构建后
})

watching.close(()=>{
    //在监听关闭后
})
```


### 3.18 使用web pack Dev Middleware
前面介绍过DevServer 是一个方便开发的小型HTTP服务器，DevServer其实是基于webpack-dev-middleware和Expressjs实现的，而webpack-dev-middleware其实是Expressjs的一个中间件。     
也就是说， 实现DevServer基本功能的代码大致如下：
```js
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

// 从webpack.config.js 文件中读取webpack配置
const config = require('./webpack.config.js');
// 实例化一个Expressjs app
const app = express()

// 用读取到的webpack 配置实例化一个compiler
const compiler = webpack(config);
// 为app 注册一个webpackMiddleware中间件
app.use(webpackMiddleware(compile));
// 启动HTTP服务器，服务器监听在3000 端口
app.listen(3000)
```
从以上代码可以看出，从webpack-dev-middleware 中导出的webpackMiddleware是一个函数，该函数需要接收一个Compiler 实例。在3.17 节中曾提到， Webpack API 导出的webpack 函数会返回一个Compiler 实例。

webpackMiddleware 函数的返回结果是一个Expressjs 的中间件，该中间件有以下功能。
- 接收来自Webpack Compiler 实例输出的文件，但不会将文件输出到硬盘中，而会保存在内存中。
- 在Expresjs app 上注册路由，拦截HTTP 收到的请求，根据请求路径响应对应的文件内容。

通过webpack-dev-middleware 能够将DevServer 集成到现有的HTTP 服务器中，让现有的HTTP 服务器能返回Webpack 构建出的内容，而不是在开发时启动多个HTTP 服务器。这特别适用于后端接口服务采用Node.js 编写的项目。

#### 3.18.1 Webpack Dev Middleware 支持的配置项
在Node.js 中调用webpack-dev-middleware 提供的API 时，还可以向它传入一些配置项，方法如下：
```js
// webpackMiddleware 函数的第2 个参数为配置项
app.use(webpackMiddleware(compiler , {
    // 在webpack-dev-middleware 支持的所有配置项中
    // 只有publicPath 属性为必填项，其他都是选填项

    // Webpack 输出资源绑定HTTP 服务器上的根目录，
    // 和Webpack 配置中的publicPath 含义一致
    publicPath :'/assets/',
    // 不输出info 类型的日志到控制台，只输出warn 和error 类型的日志
    noinfo: false,
    // 不输出任何类型的日志到控制台
    quiet: false ,
    // 切换到懒惰模式，这意味着不监听文件的变化，只会在有请求时再编译对应的文件，
    // 这适合页面非常多的项目。
    lazy: true,
    // watchOptions
    // 只在非懒惰模式下才有效
    watchOptions: {
        aggregateTimeout : 300 ,
        poll : true
        // 默认的URL 路径，默认是'index.html '
        index :'index.html ',
        //  自定义HTTP 头
        headers: {'X-Custom-Header ':'yes'},
        // 为特定后缀的文件添加HTTP mimeTypes ，作为文件类型映射表
        mimeTypes: {'text/html ':['phtml']},
        // 统计信息输出样式
        stats: {
            colors: true
        },
        // 自定义输出日志的展示方法
        reporter: null,
        // 开启或关闭服务端渲染
        serverSideRender: false,
    }
))
```
#### 3.18.2 Webpack Dev Middleware 与模块热替换
Dev Server 提供了一个便捷的功能，可以做到在监听到文件发生变化时自动替换网页中的老模块，以做到实时预览。DevServer 虽然是基于webpack-dev-middleware 实现的，但webpack-dev-middleware 井没有实现模块热替换功能，而DevServer 自己实现了该功能。     
为了在使用webpack-dev-middleware 时也能使用模块热替换功能去提升开发效率，需要额外接入webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware）。需要做以下修改才能实现模块热替换。      
第1步，修改webpack.config.js 文件，加入HotModuleReplacementPlugin插件，修改如下：   
```js
const HotModuleReplacementPlugin =require('webpack/lib/HotModuleReplacementPlugin');
module.exports = {
    entry: [
        // 为了支持模块热替换，注入代理客户端
        'webpack-hot-middleware/client',
        // JavaScript 执行入口文件
        './src/main.js'
    ],
    output: {
        // 将所有依赖的模块合并输出到一个bundle.js 文件中
        filename: 'bundle.js'
    },
    plugins: [
        // 为了支持模块热替换，生成.hot-update.json 文件
        new HotModuleReplacementPlugin(),
    ],
    devtool: 'source-map'
}
```
该修改相当于完成了webpack-dev-server --hot 的工作。

第2步，修改HTTP 服务器代码的server.js 文件，接入webpack-hot-middleware中间件，修改如下：
```js
const express = require ('express');
const webpack = require('webpack');
const webpackMiddleware = require ('webpack-dev-middleware ');
// 从webpack.config.j s 文件中读取Webpack 配置
const config =require ('./webpack.config.js');
// 实例化一个Expressjs app
const app = express ();
// 用读取到的Webpack 配置实例化一个Compiler
const compiler= webpack(config);
// 为app 注册webpackMiddleware 中间件
app.use(webpackMiddleware(compiler));
// 为了支持模块热替换，响应用于替换老模块的资源
app.use(require('webpack-hot-middleware') (compiler));
// 将项目根目录作为静态资源目录，用于服务HTML 文件
app.use(express.static('.'));
// 启动HTTP 服务器，服务器监听在3000 端口
app.listen(3000, () => {
    console.info ('成功监听在3000'）；
}) ;
```
第3 步，修改执行入口文件main.js ，加入替换逻辑，在文件末尾加入以下代码：
```js
if(module.hot){
    module.hot.accept();
}
```
第4 步，安装新引入的依赖：
```
npm i -D webpack-dev-middleware webpack-hot-middleware express
```
安装成功后，通过node ./server.js 就能启动一个类似于DevServer 的支持模块热替换的自定义HTTP 服务了。      

[下一篇： webpack优化](./webpack 优化.md)