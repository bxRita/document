ECMAScript 6.0是2015年发布的下一代JavaScript语言标准，它引入了新的语法和API来提升开发效率，虽然目前部分浏览器和Node.js 已经支持ES6，但由于它们对ES6的所有标准支持不全，会导致在开发中不能全面使用ES6.     
通常我们需要将采用ES6编写的代码转换成目前已经支持良好的ES5代码，包含如下两件事：
- 将新的ES6语法用ES5实现，例如ES6的class语法用ES5的prototype实现
- 为新的API注入polyfill，例如使用新的fetch API时在注入对应的polyfill 后才能让低端浏览器正常运行

### 3.1.1 认识Babel
Babel可以方便地完成以上两件事。Babel时一个JavaScript编译器，能将ES6代码转为ES5代码，让我们使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活的扩展。在Babel执行编译的过程中，会从项目根目录下的.babelrc文件中读取配置。.babelrc时一个JSON格式的文件，内容大致如下：
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
babel-plugin-transform-runtime 时Babel官方提供的一个插件，作用是减少冗余代码。Babel在将ES6代码转换成ES5代码时，通常需要一些由ES5编写的辅助函数来完成新语法的实现，例如在转换class extent语法时会在转换后的ES5代码里注入_extent辅助函数用于实现继承：
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

P84


