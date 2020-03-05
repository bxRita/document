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
    devtool: 'source-map' // 输出sourcemap以方便在浏览器里调试typeScript代码
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
        app: './main.js' // app的JavaScript执行入口文件
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
            filename : 'index.html' // 输出的HTML 的文件名称
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
    filename : 'index.html' // 输出的HTML 的文件名称
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

### 3.10 管理多个单页应用




















