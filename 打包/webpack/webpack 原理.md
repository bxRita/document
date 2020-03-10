### 5.1 工作原理概括
#### 5.1.1 基本概念     
在了解webpack原理之前，需要掌握以下几个核心概念    
- Entry: 入口， Webpack 执行构建的第一步将从Entry开始，可抽象成输入。
- Module ： 模块，在Webpack 里一切皆模块， 一个模块对应一个文件。Webpack 会从配置的Entry 开始，递归找出所有依赖的模块。
- Chunk ： 代码块， 一个Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader ： 模块转换器，用于将模块的原内容按照需求转换成新内容。
- Plugin ： 扩展插件，在Webpack 构建流程中的特定时机会广播对应的事件，插件可以监听这些事件的发生，在特定的时机做对应的事情。

#### 5.1.2 流程概括    
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程。   
- 初始化参数： 从配置文件和Shell 语句中读取与合并参数，得出最终的参数。
- 开始编译：用上一步得到的参数初始化Compiler 对象，加载所有配置的插件，通过执行对象的run 方法开始执行编译。
- 确定入口： 根据配置中的entry 找出所有入口文件。编译模块：从入口文件出发，调用所有配置的Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
- 完成模块编译： 在经过第4 步使用Loader 翻译完所有模块后， 得到了每个模块被翻译后的最终内容及它们之间的依赖关系。
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk,再将每个Chunk 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会。
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中。

在以上过程中， Webpack 会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，井且插件可以调用Webpack 提供的API 改变Webpack 的运行结果。

#### 5.1.3 流程细节
- Webpack 的构建流程可以分为以下三大阶段。初始化：启动构建，读取与合并配置参数，加载Plugin ，实例化Compiler 。
- 编译：从Entry 发出，针对每个Module 串行调用对应的Loader 去翻译文件的内容，再找到该Module 依赖的Module ，递归地进行编译处理。
- 输出：将编译后的Module 组合成Chunk ，将Chunk 转换成文件，输出到文件系统中。


**1.初始化阶段**

初始阶段会发生的事件及解释     
| 事件名 | 解释 | 
| :------| :------ | 
| 初始化参数 | 从配置文件和Shell 语句中读取与合并参数，得出最终的参数．在这个过程中还会执行配置文件中的插件实例化语句new Plugin() | 
| 实例化Compiler | 用上一步得到的参数初始化Compiler 实例， Compiler 负责文件监听和启动编译。在Compiler实例中包含了完整的Webpack 配置，全局只有一个Compiler 实例 | 
| 加载插件 | 依次调用插件的apply 方法，让插件可以监听后续的所有事件节点．同时向插件传入compiler实例的引用，以方便插件通过compiler 调用Webpack 提供的API | 
| environment | 开始应用Node.js 风格的文件系统到compiler 对象，以方便后续的文件寻找和读取 | 
| entry-option | 读取配置的Entrys ，为每个Entry 实例化一个对应的EntryPlugin ，为后面该Entry 的递归解析工作做准备 | 
| after-plugins | 调用完所有内置的和配置的插件的apply 方法 | 
| after-resolvers | 根据配置初始化resolver, resolver 负责在文件系统中寻找指定路径的文件 | 

**2.编译阶段**

编译阶段会发生的事件及解释     
| 事件名 | 解释 | 
| :------| :------ | 
| run | 启动一次新的编译 | 
| watch-run | 和run 类似，区别在于它是在监听模式下启动编译，在这个事件中可以获取是哪些文件发生了变化从而导致重新启动一次新的编译 | 
| compile | 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler 对象 | 
| compilation | 当Webpack 以开发模式运行时，每当检测到文件的变化，便有一次新的Compilation 被创建。 一个Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation对象也提供了很多事件回调给插件进行扩展 | 
| make | 一个新的Compilation 创建完毕，即将从Entry 开始读取文件，根据文件的类型和配置的Loader对文件进行编译，编译完后再找出该文件依赖的文件，递归地编译和解析 | 
| after-compile | 一次Compilation 执行完成 | 
| invalid | 当遇到文件不存在、文件编译错误等异常时会触发该事件，该事件不会导致Webpack 退出 | 

在编译阶段中，最重要的事件是compilation ，因为在compilation 阶段调用了Loader,完成了每个模块的转换操作。在compilation 阶段又会发生很多小事件        
| 事件名 | 解释 | 
| :------| :------ | 
| build-module | 使用对应的Loader 去转换一个模块 | 
| normal-module-loader | 在用Loader 转换完一个模块后，使用acorn 解析转换后的内容，输出对应的抽象语法树(AST ），以方便Webpack 在后面对代码进行分析 | 
| program | 从配置的入口模块开始，分析其AST ，当遇到requi町等导入其他模块的语句时，便将其 加入依赖的模块列表中，同时对新找出的依赖模块递归分析，最终弄清楚所有模块的依赖关系 | 
| seal | 所有模块及其依赖的模块都通过Loader 转换完成，根据依赖关系开始生成Chunk | 

**3.输出阶段**        
输出阶段发生的事件及解释   

| 事件名 | 解释 | 
| :------| :------ | 
| should-emit | 所有需要输出的文件己经生成，询问插件有哪些文件需要输出， 有哪些不需要输出 | 
| emit | 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出的内容 | 
| after-emit | 文件输出完毕 | 
| done | 成功完成一次完整的编译和输出流程 | 
| failed | 如果在编译和输出的流程中遇到异常，导致Webpack 退出， 就会直接跳转到本步骤，插件可以在本事件中获取具体的错误原因 | 

在输出阶段己经得到了各个模块经过转换后的结果和其依赖关系，并且将相关模块组合在一起形成一个个Chunk 。在输出阶段会根据Chunk 的类型，使用对应的模板生成最终要要输出的文件内容。    

### 5.2 输出文件分析
...

### 5.3 编写loader
Loader 就像一个翻译员，能将源文件经过转化后输出新的结果，并且一个文件还可以链式地经过多个翻译员翻译。         
以处理CSS文件为例：   
- 先将scss 源代码提交给sass-loader ，将scss 转换成CSS;
- 将sass-loader 输出的css 提交给css-loader 处理，找出css 中依赖的资源、压缩css 等：
- 将css-loader 输出的css 提交给style-loader 处理，转换成通过脚本加载的JavaScript代码。

可以看出，以上处理过程需要有顺序地链式执行，先sass- loader ，再css-loader ， 再styleloader 。以上处理的Webpack 的相关配置如下：
```js
module.exports = {
  module: {
      rules: [
          {
              // 增加对scss 文件的支持
              test: /\.scss$/,
              use: [
                  'style-loader', 
                  {
                      loader: 'css-loader', 
                      options: {
                           minimize: true
                        }
                  },
                  'sass-loader'
            ]
          }
      ]
  }
};
```
#### 5.3.1 Loader的职责
由上面的例子可以看出， 一个Loader 的职责是单一的， 只需要完成一种转换。如果一个源文件需要经历多步转换才能正常使用，就通过多个Loader 去转换。在调用多个Loader去转换一个文件时，每个Loader 都会链式地顺序执行。第1 个Loader 将会拿到需处理的原内容，上一个Loader 处理后的结果会被传给下一个Loader 接着处理，最后的Loader 将处理后的最终结果返回给Webpack 。      
所以，在开发一个Loader 时，请保持其职责的单一性，我们只需关心输入和输出。     

#### 5.3.2 Loader基础
Webpack 是运行在Node. 上的，一个Loader 其实就是一个Node.js 模块，这个模块需要导出一个函数。这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。     
一个简单的Loader的源码如下：
```js
module.exports = function(source) {
    // source 为compiler 传递给Loader 的一个文件的原内容
    // 该函数需要返回处理后的内容，这里为了简单起见，直接将原内容返回了，相当于该Loader 没有做任何转换
    return source
}
```
由于Loader 运行在Node.js 中，所以我们可以调用任意Node.js 自带的API ，或者安装第三方模块进行调用：
```js
const sass = require('node-sass');
module.exports = function(source) {
    return sass(source)
};
```
#### 5.3.3 Loader进阶
以上只是一个最简单的Loader, Webpack 还提供了一些API 供Loader 调用，下面进行一一介绍。    
**1.获得Loader的options**     
在最上面处理scss 文件的Webpack 配置中，将options 参数传给了css-loader ，以控制css-loader 。如何在自己编写的Loader 中获取用户传入的options 呢？需要这样做：
```js
const loaderUtils = require ('loader-utils');
module.exports = function(source) {
    // 获取用户为当前Loader 传入的options
    const options = loaderUtils.getOptions(this);
    return source;
};
```
**2.返回其它结果**      
上面的Loader 都只是返回了原内容转换后的内容，但在某些场景下还需要返回除了内容之外的东西。     
以用babel-loader 转换ES6 代码为例，它还需要输出转换后的ES5 代码对应的SourceMap ，以方便调试源码。为了将Source Map 也一起随着ES5 代码返回给Webpack ，还可以这样写：
```js
module.exports = function(source) {
    // 通过this .callba ck 告诉Webpack 返回的结果
    this.callback(null, source, sourceMaps);
    // 当我们使用this.callback 返回内容时，该Loader 必须返回undefined, 让Webpack 知道该Loader 返回的结果在this.callback 中，而不是return 中
    return ;
}
```
其中的this.callback 是Webpack 向Loader 注入的API ，以方便Loader 和Webpack之间通信。this.callback 的详细使用方法如下：   
```js
this.callback(
    // 当无法转换原内容时，为Webpack 返回一个Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于通过转换后的内容得出原内容的Source Map ，以方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了AST 语法树，则可以将这个AST 返回，
    // 以方便之后需要AST 的Loader 复用该AST ，避免重复生成AST ，提升性能
    abstractSyntaxTree?: AST
)
```
Source Map 的生成很耗时，通常在开发环境下才会生成Source Map ，在其他环境下不用生成，以加速构建。因此， Webpack 为Loader 提供了this.sourceMap API 去告诉Loader在当前构建环境下用户是否需要Source Map 。如果我们编写的Loader 会生成Source Map ,则请考虑这一点。

**3.同步与异步**  
Loader 有同步和异步之分，上面介绍的Loader 都是同步的Loader ，因为它们的转换流程都是同步的，转换完成后再返回结果。但在某些场景下转换的步骤只能是异步完成的，例如我们需要通过网络请求才能得出结果，如果采用同步的方式，则网络请求会阻塞整个构建，导致构建非常缓慢。      
如果是异步转换，则我们可以这样做：     
```js
module.exports = function(source) {
    //告诉Webpack 本次转换是异步的， Loader 会在callback 中回调结果
    var callback = this.async();
    someAsyncOperation(source, function(err, result , sourceMaps, ast) {
        //通过callback 返回异步执行后的结果
        callback (err, result, sourceMaps, ast);
    });
}
```
**4. 处理二进制数据**
在默认情况下， Webpack 传给Loader 的原内容都是UTF-8 格式编码的字符串。但在某些场景下Loader 不会处理文本文件，而会处理二进制文件如file-loader ，这时就需要Webpack为Loader 传入二进制格式的数据。为此，我们需要这样编写Loader:
```js
module.exports = function(source) {
    // 在exports.raw=== true 时， Webpack 传给Loader 的source 是Buffer 类型的
    source instanceof Buffer === true;
    // Loader 返回的类型也可以是Buffer 类型的
    // 在exports.raw !== true 时， Loader 也可以返回Buffer 类型的结果
    return source;
}
//  通过exports.raw 属性告诉Webpack 该Loader 是否需要二进制数据
module.exports.raw = true;
```
在以上代码中最关键的代码是最后一行module.exports.raw=true ；若没有该行代码，则Loader 只能拿到字符串。

**5.缓存加速**
在某些情况下，有些转换操作需要大量的计算，非常耗时，如果每次构建都重新执行重复的转换操作，则构建将会变得非常缓慢。为此， Webpack 会默认缓存所有Loader 的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时，是不会重新调用对应的Loader 去执行转换操作的。     
如果我们不想让We bpack 不缓存该Loader 的处理结果，则可以这样：     
```js
module.exports = function(source) {
    // 关闭该Loader 的缓存功能
    this.cacheable(false);
    return source
}
```
#### 5.3.4 其它Loader API
除了以上提到的在Loader 中能调用的WebpackAPI ， 还存在以下常用的API 。         
+ this.context ： 当前处理的文件所在的目录，假如当前Loader 处理的文件是/src/main.js ，则this.context 等于/src 。
+ this.resource ：当前处理的文件的完整请求路径，包括q即可怕ing ，例如/src/main.js?name=l 。
+ this.resourcePath ：当前处理的文件的路径，例如/src/main.js 。
+ this.resourceQuery ：当前处理的文件的querystring.
+ this.target ：等于Webpack 配置中的Target，具体内容请参见2.7 节。
+ this.loadModule ：但Loader 在处理一个文件时，如果依赖其他文件的处理结果才能得出当前文件的结果，就可以通过this.loadModule(request: st ring,callback : function (err, source, sourceMap, module))去获取req uest对应的文件的处理结果。
+ this.resolve ：像require 语句一样获得指定文件的完整路径，使用方法为resolve(context : string , request: string, callback : function(err, result: string))。
+ this.addDependency ：为当前处理的文件添加其依赖的文件，以便其依赖的文件发生发生变化时，重新调用Loader 处理该文件。使用方法为addDependency (file:string)。
+ this.addContextDependency ：和addDependency 类似，但addContextDependency 是将整个目录加入当前正在处理的文件的依赖中。使用方法为addContextDependency (directory : string)。
+ this.clearDependencies ：清除当前正在处理的文件的所有依赖，使用方法为clearDependencies()。
+ this.emitFile ：输出一个文件，使用方法为emitFile(name : string ,content: Buffe | string , sourceMap: { ... })。


#### 5.3.5 加载本地Loader
在开发Loader 的过程中，为了测试编写的Loader 能否正常工作，需要将它配置到Webpack中，才可能会调用该Loader 。在前面的章节中使用的Loader 都是通过Npm 安装的，在使用Loader 时会直接使用Loader 的名称    
如果还采取以上方法去使用本地开发的Loader ，将会很麻烦，因为我们需要确保编写的Loader 的源码在node_modules 目录下。为此需要先将编写的Loader 发布到Npm 仓库， 再安装到本地项目中使用。        
解决以上问题的便捷方法有如下两种。    

**1.Npm link**
Npm link 专门用于开发和调试本地的Npm模块，能做到在不发布模块的情况下， 将本地的一个正在开发的模块的源码链接到项目的node_modules 目录下，让项目可以直接使用本地的Npm 模块。由于是通过软链接的方式实现的，编辑了本地的Npm 模块的代码，所以在项目中也能使用到编辑后的代码。    
完成Npm link 的步骤如下：    
* 确保正在开发的本地Npm 模块(也就是正在开发的Loader)的package.json 己经正确配置好：
* 在本地的Npm 模块根目录下执行npm link ，将本地模块注册到全局：
* 在项目根目录下执行npm link loader-name ，将第2 步注册到全局的本地Npm模块链接到项目的node_moduels 下，其中的loader-name 是指在第1 步的package.json 文件中配置的模块名称。

**2.ResolveLoader**
ResolveLoader 用于配置Webpack 如何寻找Loader ，它在默认情况下只会去node_modules 目录下寻找。为了让Webpack 加载放在本地项目中的Loader,需要修改resolveLoader.modules 。      
假如本地项目中的Loader 在项目目录的./loaders/loader-name 下， 则需要如下配置:
```js
module.exports = {
    resolveLoader: {
        // 去哪些目录下寻找Loader ，有先后顺序之分
        modules: ['node_modules','./loaders']
    }
}
```
加上以上配置后， Webpack 会先去node_modules 项目下寻找Loader ，如果找不到，则再去./loaders/ 目录下寻找。    

案例参考： `./comment-require-loader`

### 5.4 编写Plugin       
Webpack 通过Plugin 机制让其更灵活，以适应各种应用场景。在Webpack 运行的生命周期中会广播许多事件， Plugin 可以监听这些事件，在合适的时机通过Webpack 提供的API改变输出结果。      
一个最基础的Plugin 的代码是这样的：
```js
class BasicPlugin {
    // 在构造函数中获取用户为该插件传入的配置
    constructor(options){}
    // Webpack 会调用BasicPlugin 实例的apply 方法为插件实例传入compiler 对象
    apply(compiler) {
        compiler.plugin('compilation', function(compilation){
        })
    }
}
module.exports = BasicPlugin
```
在使用这个Plugin 时，相关的配置代码如下：   
```js
const BasicPlugin = require('./BasicPlugin.js');
module.exports = {
    plugins: [
        new BasicPlugin(options),
    ]
}
```
Webpack 启动后，在读取配置的过程中会先执行new BasicPlugin(options)，初始化一个BasicPlugin 并获得其实例。在初始化compiler 对象后，再调用basicPlugin.apply(compiler)为插件实例传入compiler 对象。插件实例在获取到compiler 对象后，就可以通过compiler.plugin(事件名称，回调函数)监听到Webpack 广播的事件，并且可以通过compiler 对象去操作Webpack 。        
通过以上最简单的Plugin ，相信我们大概明白了Plugin 的工作原理，但在实际开发中还有很多细节需要注意，下面进行详细介绍。     

#### 5.4.1 Compiler 和Compilation
在开发Plugin 时最常用的两个对象就是Compiler 和Compilation ，它们是Plugin 和Webpack之间的桥梁。Compiler 和Compilation 的含义如下。
- Compiler 对象包含了Webpack 环境的所有配置信息，包含options 、loaders 、plugins等信息。这个对象在Webpack 启动时被实例化，它是全局唯一的，可以简单地将它理解为Webpack 实例。
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当Webpack以开发模式运行时，每当检测到一个文件发生变化，便有一次新的Compilation 被创建。Compilation 对象也提供了很多事件回调供插件进行扩展。通过Compilation也能读取到Compiler 对象。

Compiler 和Compilation 的区别在于： Compiler 代表了整个Webpack 从启动到关闭的生命周期，而Compilation 只代表一次新的编译。

#### 5.4.2 事件流
Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。这条生产线上的每个处理流程的职责都是单一的，多个流程之间存在依赖关系，只有在完成当前处理后才能提交给下一个流程去处理。插件就像插入生产线中的某个功能，在特定的时机对生产线上的资源进行处理。      
Webpack 通过Tapable (https://github.com/webpack/tapable)来组织这条复杂的生产线。Webpack 在运行的过程中会广播事件，插件只需要监听它所关心的事件，就能加入这条生产线中，去改变生产线的运作。Webpack 的事件流机制保证了插件的有序性，使得整个系统的扩展性良好。     
Webpack 的事件流机制应用了观察者模式，和Node.js中的EventEmitter 非常相似。Compiler和Compilation 都继承自Tapable ，可以直接在Compiler 和Compilation 对象上广播和监听事件，方法如下：
```js
/**
* 广播事件
* event-name 为事件名称，注意不要和现有的事件重名
* params 为附带的参数
*/
compiler.apply('event-name', params);
/**
* 监听名称为event-name 的事件，当event-name 事件发生时，函数就会被执行。
* 同时函数中的params 参数为广播事件时附带的参数。
*/
compiler.plugin('event-name', function (params) {})
```

在开发插件时，还需要注意以下两点：只要能拿到Compiler 或Compilation 对象，就能广播新的事件，所以在新开发的插件中也能广播事件，为其他插件监听使用。传给每个插件的Compiler 和Compilation 对象都是同一个引用。也就是说，若在一个插件中修改了Compiler或Compilation 对象上的属性，就会影响到后面的插件。有些事件是异步的，这些异步的事件会附带两个参数，第2个参数为回调函数，在插件处理完任务时需要调用回调函数通知Webpack,才会进入下一个处理流程。例如：
```js  
compiler.plugin('emit', function(compilation, callback){
    //支持处理逻辑
    // 处理完毕后执行callback已通知webpack
    // 如果不执行callback，运行流程将会一直卡在这里而不往后执行
    callback();
})
```

#### 5.4.3 常用API
插件可以用来修改输出文件和增加输出文件，甚至可以提升Webpack 的性能，等等。    
**1. 读取输出资源、代码块、模块及真依赖**     
**2. 监听文件的变化**    
**3. 修改输出资源**    
在某些场景下插件需要修改、增加、删除输出的资源，要做到这一点， 则需要监听emit事件，因为发生emit 事件时所有模块的转换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此emit 事件是修改Webpack 输出资源的最后时机。
**4.判断Webpack 使用了哪些插件**    

案例详见[EndWebpackPlugin](./end-webpack-plugin]
