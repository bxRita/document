优化分为优化开发体验和优化输出质量，下面进一步深入讲解如何优化Webpack 构建。
- 优化开发体验
    - 优化构建速度。项目庞大时构建的耗时可能会变得很长，每次等待构建的耗时加起来也会是个大数目
    - 优化使用体验。通过自动化手段完成一些重复的工作，让我们专注于解决问题本身
- 优化输出质量
    优化输出质量的目的是为用户呈现体验更好的网页，例如减少首屏加载时间、提升性能流畅度等． 这至关重要，因为在互联网行业竞争日益激烈的今天，这可能会关系到我们的产品的生死．
    优化输出质量的本质是优化构建输出的要发布到线上的代码，分为以下几点。
    - 减少用户能感知到的加载时间，也就是首屏加载时间
    - 提升流畅度，也就是提升代码性能

### 4.1 缩小文件的搜索范围
Webpack 在启动后会从配置的Entry 出发，解析出文件中的导入语句，再递归解析。在遇到导入语句时， Webpack 会做以下两件事。
- 根据导入语句去寻找对应的要导入的文件。例如require('react')导入语句对应的文件是./node_modules/react/react.js, require(./util')对应的文件是./util.js。
- 根据找到的要导入的文件的后缀，使用配置中的Loader 去处理文件。例如使用ES6开发的JavaScript 文件需要使用babel-loader 处理。

虽然以上两件事对于处理一个文件来说非常快，但是在项目大了以后文件量会变得非常大，这时构建速度慢的问题就会暴露出来。虽然以上两件事情无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

### 4.1.1 优化Loader配置
由于Loader 对文件的转换操作很耗时，所以需要让尽可能少的文件被Loader 处理。
在使用Loader 时，可以通过test 、include 、exclude 三个配置项来命中Loader 要应用规则的文件。为了尽可能少地让文件被Loader 处理，可以通过include 去命中只有哪些文件需要被处理。     
以采用ES6 的项目为例，在配置babel-loader 时可以这样：
```js
module.exports = {
    module: {
        rules: [
            {
                // 如果项目源码中只有js文件，就不要写成/\.jsx?$/，以提升正则表达式的性能
                test: /\.js/,
                // babel-loader 支持缓存转换出的结果，通过cacheDirectory 选项开启
                use: ['babel-loader?cacheDirectory'],
                // 只对项目根目录下的src 目录中的文件采用babel-loader
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}
```
我们可以适当调整项目的目录结构，以方便在配置Loader 时通过include 缩小命中的范围。      

### 4.1.2 优化resolve.modules 配置
resolve.modules ，它用于配置Webpack 去哪些目录下寻找第三方模块。   
resolve.modules 的默认值是［'node_modules'］，含义是先去当前目录的./node_modules 目录下去找我们想找的模块，如果没找到， 就去上一级目录../node_modules中找，再没有就去../../node_modules 中找，以此类推， 这和Node.js 的模块寻找机制很相似。     
当安装的第三方模块都放在项目根目录的./node_modules 目录下时，就没有必要按照默认的方式去一层层地寻找，可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：
```js
module.exports = {
    resolve: {
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        //其中，__dirname 表示当前工作目录，也就是项目根目录
        modules: [path.resolve(__dirname, 'node_modules')]
    }
}
```
### 4.2 使用DllPlugin

### 4.3 使用HappyPack
由于有大量文件需要解析和处理，所以构建是文件读写和计算密集型的操作， 特别是当文件数量变多后， Webpack 构建慢的问题会显得更为严重。运行在Node.js的Webpack是单线程模型的，也就是说Webpack 需要一个一个地处理任务，不能同时处理多个任务。      
HappyPack (https://github.com/amireh/happypack )就能让Webpack 做到这一点，它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。  

```js
const path = require('path');
const ExtractTextPlugin=require('extract-text-webpack-plugin') ;
const HappyPack =require('happ ypack');
module.exports = {
    module : {
        rules: [
            {
                test: /\.js/，
                // 将对.js 文件的处理转交给id 为babel 的HappyPack 实例
                use: ['happypack/loader?id=babel'],
                //  排除node_modules 目录下的文件， node_modules 目录下的文件都采用了ESS语法，没必要再通过Babel 去转换
                 exclude : path.resolve( dirname,'node_modules')
            },
            {
                // 将对.css 文件的处理转交给id 为css 的HappyPack 实例
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['happypack/loader?id=css'],
                })
            }
        ]
    },
    plugins: [
        new HappyPack ({
            // 用唯一的标识符id ，来代表当前的HappyPack 是用来处理一类特定的文件的
            id : 'babel',
            //  如何处理.js文件，用法和Loader 配置中的一样
            loaders: [ 'babel-loader?cacheDirectory'],
            // ...其他配置项
        }),
        new HappyPack({
            id :'css',
            // 如何处理.css 文件，用法和Loader 配置中的一样
            loaders: ['css-loader'],
        }),
        new ExtractTextPlugin({
            filename：`[name].css`，
        })
    ]
};
```
接入HappyPack 后，需要为项目安装新的依赖：
```
npm i -D happypack
```

#### 4.3.2 HappyPack 原理
在整个Webpack 构建流程中，最耗时的流程可能就是Loader 对文件的转换操作了，因为要转换的文件数据量巨大，而且这些转换操作都只能一个一个地处理。HappyPack 的核心原理就是将这部分任务分解到多个进程中去并行处理，从而减少总的构建时间。          
从前面的使用中可以看出，所有需要通过Loader 处理的文件都先交给了happypack/loader 去处理，在收集到了这些文件的处理权后， HappyPack 就可以统一分配了。每通过new HappyPack()实例化一个HappyPack ， 其实就是告诉HappyPack 核心调度器如何通过一系列Loader 去转换一类文件，并且可以指定如何为这类转换操作分配子进程。    
核心调度器的逻辑代码在主进程中，也就是运行着Webpack 的进程中，核心调度器会将一个个任务分配给当前空闲的子进程，子进程处理完毕后将结果发送给核心调度器，它们之间的数据交换是通过进程间的通信API 实现的。
核心调度器收到来自子进程处理完毕的结果后，会通知Webpack 该文件己处理完毕。    

### 4.4 使用ParallelUglifyPlugin
在使用Webpack 构建出用于发布到线上的代码时，都会有压缩代码这一流程。最常见的JavaScript 代码压缩工具是UglifyJS (https://github.com/mishoo/UglifyJS2)，并且Webpack也内置了它。

当Webpack 有多个JavaScript 文件需要输出和压缩时， 原本会使用UglifyJS 去一个一个压缩再输出，但是ParallelUglifyPlugin 会开启多个子进程，将对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过UglifyJS 去压缩代码，但是变成了并行执行。所以ParallelUglifyPlugin 能更快地完成对多个文件的压缩工作。      

ParallelUglifyPlugin 的使用也非常简单，将原来Webpack 配置文件中内置的UglifyJsPlugin去掉后， 再替换成ParallelUglifyPlugin 即可，相关代码如下：
```js
const path= require ('path');
const DefinePlugin = require ('webpack/lib/DefinePlugin');
const ParallelUglifyPlugin =require('webpack-parallel-uglify-plugin')；
module.exports = {
    plugins : [
        // 使用ParallelUglifyPlugin 并行压缩输出的JavaScript 代码
        new ParallelUglifyPlugin ( {
            // 传递给UglifyJS 的参数
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有注释
                    comments: false
                },
                compress: {
                    // 在UglifyJS 删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的、console 、语句，可以兼容IE 浏览器
                    drop_console: true,
                    // 内嵌己定义但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            },
        })
    ]
}
```
在通过new ParallelUglifyPlugin (）实例化时，支持以下参数。   
- test ：使用正则去匹配哪些文件需要被ParallelUglifyPlugin 压缩， 默认为/.js$/，也就是默认压缩所有的js文件。
- include ：使用正则去命中需要被ParallelUglifyPlugin 压缩的文件，默认为［］ 。
- exclude ：使用正则去命中不需要被ParallelUglifyPlugin 压缩的文件，默认为［］ 。
- cacheDir ：缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。cacheDir 用于配置缓存存放的目录路径。默认不会缓存， 若想开启缓存，则请设置一个目录路径。
- workerCount ：开启几个子进程去并发执行压缩。默认为当前运行的计算机的CPU 核数减1 。
- sourceMap ：是否输出Source Map ，这会导致压缩过程变慢。
- uglifyJS ：用于压缩ES5 代码时的配置，为Object 类型，被原封不动地传递给UglifyJS 作为参数。
- uglifyES ：用于压缩ES6 代码时的配置，为Object 类型，被原封不动地传递给UglifyES 作为参数。

> 其中的test 、include 、exclude 与配置Loader 时的思想和用法一样。

UglifyES (https://github.com/mishoo/UglifyJS2/tree/harmony）是UglifyJS 的变种，专门用于压缩ES6 代码，它们都出自同一个项目，井且不能同时使用。      
ParallelUglifyPlugin 同时内置了UglifyJS 和UglifyES ， 也就是说ParallelUglifyPlugin 支持井行压缩ES6 代码。        
接入ParallelUglifyPlugin 后，项目需要安装新的依赖：
```
npm i -D webpack-parallel-uglify-plugin
```

### 4.5 使用自动刷新
#### 4.5.1 文件监听
文件监昕是在发现源码文件发生变化时，自动重新构建出新的输出文件。   

Webpack 官方提供了两大模块， 一个是核心的webpack，一个是webpack-dev-server 。而文件监听功能是Webpack 提供的。    
Webpack 支持文件监昕相关的配置项，代码如下：
```js
module.export = {
//只有在开启监昕模式时， watchOptions 才有意义
//默认为false ，也就是不开启
    watch: true,
    // 监听模式运行时的参数
    // 在开启监听模式时才有意义
    watchOptions: {
        // 不监听的文件或文件夹，支持正则匹配
        // 默认为空
        ignored: /node_modules/,
        // 监听到变化发生后等300ms再去执行动作，节流，
        // 防止文件更新太快而导致重新编译频率太快。默认为300ms
        aggregateTimeout : 300,
        //判断文件是否发生变化是通过不停地询问系统指定文件有没有变化实现的
        // 默认每秒询问1000 次
        poll: 1000
    }
}
```
让Webpack 开启监听模式时，有如下两种方式。    
- 在配置文件webpack.config.js 中设置watch: true 。
- 在执行启动Webpack 的命令时带上--watch 参数， 完整的命令是`webpack --watch`。

**1 . 文件监昕的工作原理**
在Webpack 中监昕一个文件发生变化的原理，是定时获取这个文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后一次保存的最后编辑时间不一致，就认为该文件发生了变化。配置项中的watchOptions.poll 用于控制定时检查的周期，具体含义是每秒检查多少次。        
当发现某个文件发生了变化时，并不会立刻告诉监昕者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。配置项中的watchOptions.aggregateTimeout 用于配置这个等待时间。这样做的目的是，我们在编辑代码的过程中可能会高频地输入文字，导致文件变化的事件高频地发生， 如果每次都重新执行构建，就会让构建卡死。    
在默认情况下， Webpack 会从配置的Entry 文件出发，递归解析出Entry 文件所依赖的文件，将这些依赖的文件都加入监听列表中。可见， Webpack这一点还是做得很智能的，而不是粗暴地直接监昕项目目录下的所有文件。      
由于保存文件的路径和最后的编辑时间需要占用内存，定时检查周期检查需要占用CPU 及文件110 ，所以最好减少需要监昕的文件数量和降低检查频率。    


#### 4.5.2 自动刷新浏览器
监听到文件更新后的下一步是刷新浏览器， webpack模块负责监听文件， webpack-devserver模块则负责刷新浏览器。在使用webpack-dev-server 模块去启动webpack 模块时， webpack模块的监听模式默认会被开启。webpack 模块会在文件发生变化时通知webpack-dev-server模块。    
**1.自动刷新的原理**
控制浏览器刷新有如下三种方法。
- 借助浏览器扩展去通过浏览器提供的接口刷新， WebStorm IDE 的LiveEdit 功能就是这样实现的。
- 向要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
- 将要开发的网页装进一个iframe 中，通过刷新iframe 去看到最新效果。

DevServer 支持第2 、3 种方法， 第2种是DevServer 默认采用的刷新方法。     
**2. 优化自动刷新的性能**

### 4.6开启模块热替换
要做到实时预览，除了可以用4.5 中介绍的刷新整个网页的方法， DevServer 还支持一种叫做模块热替换(Hot Module Replacement）的技术可在不刷新整个网页的情况下做到超灵敏实时预览。原理是在一个源码发生变化时，只需重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。    

#### 4.6.1模块热替换的原理
模块热替换的原理和自动刷新的原理类似，都需要向要开发的网页中注入一个代理客户端来连接Dev Server 和网页，不同在于模块热替换的独特的模块替换机制。       
Dev Server 默认不会开启模块热替换模式，要开启该模式，则只需在启动时带上参数--hot ，完整的命令是webpack-dev-server --hot      


### 4.7 区分环境
#### 4.7.1 为什么需要区分环境
- 在开发过程中方便开发调试的环境：
- 发布到线上为用户使用的运行环境。

#### 4.7.2 如何区分环境
```js
if(process.env.NODE_ENV === 'production'){
    console.log ('你正在线上环境');
}else{
    console.log ('你正在使用开发环境');
}
```

### 4.8压缩代码
浏览器通过服务器访问网页时获取的JavaScript 、css 资源都是文本形式的，文件越大，网页加载的时间越长。为了提升网页加载速度和减少网络传输流量，可以对这些资源进行压缩。除了可以通过GZIP 算法对文件进行压缩，还可以对文本本身进行压缩。     
#### 4.8.1 压缩JavaScript
- UglifyJsPlugin：通过封装UglifyJS 实现压缩。
- ParallelUglifyPlugin ： 多进程并行处理压缩

#### 4.8.2 压缩ES6
运行ES6 的代码相对于转换后的ES5 代码有如下优点。
- 对于一样的逻辑，用ES6 实现的代码量比ES5 更少。
- JavaScript 引擎对ES6 中的语法做了性能优化，例如针对con st 申明的变量有更快的读取速度。

在用上面所讲的压缩方法去压缩ES6 代码时，我们会发现UglifyJS 报错退出， 原因是UglifyJS 只理解ES5 语法的代码。为了压缩ES6 代码，需要使用专门针对ES6 代码的UglifyES     
UglifyES 和UglifyJS 来自同一个项目的不同分支，它们的配置项基本相同， 只是接入Webpack 时有所区别。在为Webpack 接入UglifyES 时，不能使用内置的UglifyJsPlugin ，而是需要单独安装和使用最新版本的uglifyjs-webpack-plugin。安装方法如下：
```
npm i -D uglifyjs-webpack-plugin@beta
```
Webpack 相关配置的代码如下：
```js
const UglifyESPlugin = require ('uglifyjs-webpack-plugin');
module.exports = {
    plugins: [
        new UglifyESPlugin ({
            //多嵌套了一层
            uglifyOptions : {
                compress : {
                    //在Ugl ifyJS 删除没有用到的代码时不输出警告
                    warnings : false,
                    //删除所有、console 、语句，可以兼容IE 浏览器
                    drop_console: true,
                    // 内嵌己定义但是只用到了一次的变量
                    collapse_vars : true,
                    //提取出现多次但是没有定义成变量去引用的静态值
                    reduce_vars : true
                },
                output: {
                    //最紧凑的输出
                    beautify : false,
                    // 删除所有注释
                    comments : false,
                }
            }
        })
    ]    
}
```
#### 4.8.3 压缩css
css 代码也可以像JavaScript 那样被压缩，以达到提升加载速度和代码混淆的作用。目前比较成熟、可靠的css 压缩工具是cssnano (http://cssnano.co），基于PostCSS 。     
cssnano 能理解css 代码的含义，而不仅仅是删掉空格，如下所述。
- margin : lOpx 20px lOpx 20px 被压缩成margin: lOpx 20px.
- color:#ffOOO0 被压缩成color:red

将cssnano 接入Webpack 中也非常简单，因为css-loader 己经将其内置了，要开启cssnano去压缩代码，则只需开启css-loader 的minimize 选项。相关的Webpack 配置如下：
```js
const path= require ('path');
const { WebPlugin } = require ('web-webpack-plugin');
const ExtractTextPlugin =require ('extract-text-webpack-plugin' );

module.exports = {
    module : {
        rules: [
            {
                test: /\.css/，// 增加对css 文件的支持
                // 提取Chunk 中的css 代码到单独的文件中
                use: ExtractTextPlugin.extract({
                    // 通过minimize 选项压缩css 代码
                    use: ['css-loader?minimize']
                }),
            }
        ]
    },
    plugins: [
        // 用WebPlugin生成对应的HTML 文件
        new WebPlugin ({
            template: './template.html ', II HTML 模板文件所在的文件路径
            filename: 'index.html '// 输出的HTML的文件名称
        }),
        new ExtractTextPlugin({
            filename : `[name]_[contenthash:8].css` ，// 为输出的css文件名称加上Hash值
        })
    ]
}
```

### 4.9 CDN加速
#### 4.9.1 什么是CDN
虽然在前面通过压缩代码的手段减小了网络传输的大小，但实际上最影响用户体验的还是网页首次打开时的加载等待，其根本原因是网络传输过程耗时较大。CDN (内容分发网络）的作用就是加速网络传输，通过将资源部署到世界各地，使用户在访问时按照就近原则从离其最近的服务器获取资源，来加快资源的获取速度。CDN 其实是通过优化物理链路层传输过程中的光速有限、丢包等问题来提升网速的

#### 4.9.2 接入CDN
要为网站接入CDN ， 需要将网页的静态资源上传到CDN 服务上，在服务这些静态资源时需要通过CDN 服务提供的URL 地址去访问。

#### 4.9.3 用webpack实现CDN的接入
构建需要实现以下几点。
- 静态资源的导入URL需要变成指向CDN 服务的绝对路径的URL，而不是相对于HTML 文件的URL
- 静态资源的文件名需要带上由文件内容算出来的Hash值，以防止被缓存。
- 将不同类型的资源放到不同域名的CDN 服务上，以防止资源的并行加载被阻塞。

先来看看要实现以上要求的最终Webpack 配置：
```js
const path = require ('path') ;
const ExtractTextPlugin = require ('extract-text-webpack-plugin'） ;
const { WebPlugin } = require ('web-webpack-plugin');
module.exports = {
    //省略entry 配置．．．
    output : {
        // 为输出的JavaScript 文件名加上Hash 值
        filename :'[name]_[chunkhash:8].js',
        path: path.resolve (__dirname,'./dist'),
        // 指定存放JavaScript 文件的CDN 目录URL
        publicPath : '//js.cdn.com/id/',
    },
    module: {
        rules: [
            {
                //增加对css 文件的支持
                test : /\.css/,
                //提取Chunk 中的css 代码到单独的文件中
                use: ExtractTextPlugin.extract({
                    //压缩css 代码
                    use : ['css-loader?minimize'],
                    // 指定存放css 中导入的资源(例如图片）的CDN 目录URL
                    publicPath : '//img.cdn.com/id/'
                })
            },
            {
                //增加对PNG 文件的支持
                test: /\.png/,
                //为输出的PNG 文件名加上Hash 值
                use : ['file-loader?name=[name]_[hash:8].[ext]'],
            }
            // 省略其他Loader 配置．．．
        ]
    },
    plugins: [
        //使用WebPlugin 自动生成HTML
        new WebPlugin((
            // HTML 模板文件所在的文件路径
            template : './template.html',
            //输出的HTML 的文件名
            filename : 'index.html',
            //指定存放css 文件的CDN 目录URL
            stylePublicPath : '//css.cdn.com/id/',
        }),
        new ExtractTextPlugin ( (
            //为输出的css 文件名加上Hash 值
            filename ：`[name]_[contenthash:8].css`，
        }),
        // 省略代码压缩插件配置．． ．
    ],
};
```
在以上代码中最核心的部分是通过publicPath 参数设置存放静态资源的CDN 目录URL 。为了让不同类型的资源输出到不同的CON ，需要分别进行如下设置
- 在output.publicPath 中设置JavaScript 的地址。
- 在css-loader.publicPath 中设置被css 导入的资源的地址。
- 在WebPlugin.stylePublicPath 中设置css 文件的地址。

设置好publicPath 后， WebPlugin 在生成HTML 文件并将css-loader 转换css代码时，会考虑到配置中的publicPath ，用对应的线上地址替换原来的相对地址。

### 4.10 使用Tree Shaking
Tree Shaking 可以用来剔除JavaScript 中用不上的死代码。它依赖静态的ES6 模块化语法，例如通过import和export 导入、导出。       

> 需要注意，要让Tree Shaking 正常工作的前提是，提交给Webpack 的JavaScript 代码必须采用了ES6 的模块化语法，因为ES6 模块化语法是静态的（在导入、导出语句中的路径必须是静态的字符串，而且不能放入其他代码块中），这让Webpack 可以简单地分析出哪些export 的被import 了。如果采用了ES5 中的模块化，例如module.export={ ... ｝、require (x+y)、if(x){require('./util')}，则Webpack 无法分析出可以剔除哪些代码。

在项目中使用大量的第三方库时，我们会发现Tree Shaking 似乎不生效了，原因是大部分Npm 中的代码都采用了CommonJS 语法，这导致Tre e S haking 无法正常工作而降级处理。      
但幸运的是，有些库考虑到了这一点，这些库在发布到Npm 上时会同时提供两份代码，一份采用Commo nJS 模块化语法，一份采用ES6 模块化语法。并且在package . json 文件中分别指出这两份代码的入口。    

以redux库为例，其发布到Npm上的目录结构为：
```
node_modules/redux
|--es
|   |-- index.js #采用ES6模块化语法
|--lib
|   |-- index.js #采用ES5模块化语法
|-- package.json
```
在package.json文件中有两个字段：
```json
{
    "main":"lib/index.js", // 指明采用Common JS 模块化的代码入口
    "jsnext:main":"es/index.js"
}
```
为了让Tree Shaking 对redux 生效，需要配置Webpack 的文件寻找规则如下：
```js
module.exports = {
    resolve: {
        // 针对Npm 中的第三方模块优先采用jsnext:main 中指向的ES6 模块化语法的文件
        mainFields: ['jsnext:main','browser','main']
    }
}
```
以上配置的含义是优先使用jsnext:main 作为入口，如果不存在，jsnext:main就会采用browser 或者main 并将其作为入口

### 4.11 提取公共代码
```js
new CommonsChunkPlugin({
    //从common 和base 两个现成的Chunk 中提取公共部分
    chunks : ['common','base'] ,
    // 将公共部分放到base 中
    name :'base'
})
```

### 4.12 分割代码以按需加载

### 4.14 开启Scope Hoisting
开启Scope Hoisting优点：
- 代码体积更小，因为函数申明语句会产生大量的代码：
- 代码在运行时因为创建的函数作用域变少了，所以内存开销也变小了。

Scope Hoisting 的实现原理其实很简单：分析模块之间的依赖关系，尽可能将被打散的模块合并到一个函数中，但前提是不能造成代码元余。因此只有那些被引用了一次的模块才能被合井。        
由于Scope Hoisting 需要分析模块之间的依赖关系，因此源码必须采用ES6 模块化语句，不然它将无法生效

#### 4.14.2 使用Scope Hoisting
在Web pack 中使用Scope Hoi s ting 非常简单，因为这是Webpack 内置的功能，只需要配置一个插件，相关代码如下：
```js
const ModuleConcatenationPlugin = require('webpack/lib/optimizi/ModuleConcatenationPlugin');
module.exports = {
    plugins: [
        // 开启Scope Hoidting
        new ModuleConcatenationPlugin()
    ]
}
```
同时，考虑到Scope Hoisting 依赖源码时需采用ES6 模块化语法，还需要配置mainFields 。因为大部分Npm 中的第三方库采用了CommonJS 语法，但部分库会同时提供ES6 模块化的代码，所以为了充分发挥Scope Hoisting 的作用，需要增加以下配置：
```js
module.exports = {
    resolve: {
        // 针对Npm 中的第三方模块优先采用jsnext:main 中指向的ES6 模块化语法的文件
        main Fields: ['jsnext:main','browser','main']
    }
}
```
开启Scope Hoisting 并发挥最大作用的配置如下：
```js
const ModuleConcatenationPlugin = require('webpack/lib/optimizi/ModuleConcatenationPlugin');
module.exports = {
    resolve: {
        // 针对Npm 中的第三方模块优先采用jsnext:main 中指向的ES6 模块化语法的文件
        main Fields: ['jsnext:main','browser','main']
    },
    plugins: [
        // 开启Scope Hoidting
        new ModuleConcatenationPlugin()
    ]
}
```





