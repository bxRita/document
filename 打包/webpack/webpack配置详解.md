## 2、webpack 配置
配置Webpack 的方式有如下两种：
- 通过一个JavaScript 文件描述配置，例如使用webpack.config.js文件里的配置；
- 执行Webpack 可执行文件时通过命令行参数传入，例如webpack-dev-server --devtool source-map

这两种方式可以相互搭配，例如执行Webpack 时通过命令webpack --config webpack-dev.config.js 指定配置文件，再去webpack-dev.config.j s 文件里描述部分配置。

关于Webpack 的常用功能所提供的配置选项，请看[webpack官方网站](https://webpack.js.org/configuration/)


安装配置所影响的功能来划分：
- Entery： 配置模块的入口
- output : 配置如何输出最终想要的代码
- Resolve: 配置寻找模块的规则
- Plugins: 配置扩展插件
- DevServer: 配置DevServer
- 其他配置项： 其他零散的配置项
- 整体配置结构： 整体地描述各配置项的结构

#### 2.1.2 Entry类型
类型 | 例子 | 含义 
- | :-: | :-: 
string | './app/entry' | ccc 
array | ['./app/entry1', './app/entry2']| hhh 
object | {a: './app/entry', b: ['./app/entry-b1','./app/entry-b2']}| hhh 

如果是array 类型，则搭配output.library 配置项使用时，只有数组里的最后一个入口文件的模块会被导出。

#### 2.1.3 Chunk 的名称
Webpack 会为每个生成的Chunk 取一个名称， Chunk 的名称和En町的配置有关。
- 如果entry 是一个string 或array ，就只会生成一个Chunk ，这时Chunk 的名称是main
- 如果e ntr y 是一个object ，就可能会出现多个Chunk ，这时Chunk 的名称是object 键值对中键的名称。

#### 2.1.4 配置动态Entry
假如项目里有多个页面需要为每个页面的入口配置一个Entry，但这些页面的数量可能会不断增长，则这时Entry 的配置会受到其他因素的影响，导致不能写成静态的值。其解决方法是将Entry 设置成一个函数动态地返回上面所说的配置，代码如下：
```
//同步函数
entry : () = > {
    return {
        a : './pages/a'
        b :'./pages/b',
    }
}
//异步函数
entry: () = > {
    return new Promise ((resolve)=>{
        resolve({
            a :'./pages/a',
            b :'./pages/b'
        } );
    }) ;
};
```

### 2.2 Output
output 配置如何输出最终想要的代码。output 是一个object ，里面包含一系列配置项，下面分别介绍它们。
#### 2.2.1 filename
output.fi lename 配置输出文件的名称，为string 类型。如果只有一个输出文件，则可以将它写成静态不变的：

```
filename: 'bundle.js '
```

但是在有多个Chunk 要输出时，就需要借助模板和变量了。前面讲到， Webpack 会为每个Chunk 取一个名称，所以我们可以根据Chunk 的名称来区分输出的文件名：
```
file name :'[name].js'
```
代码里的［ name ］代表用内置的name 变量去替换［ name ］，这时我们可以将它看作一个字符串模块函数，每个要输出的Chunk 都会通过这个函数去拼接出输出的文件名称。内置变量除了包括name ，还包括如表2-2 所示的变量。
变量名 | 含义 | 
- | :-: |
id | Chunk 的唯一标识，从0开始 |
name | Chunk 的名称|
hash | Chunk 的唯一标识的Hash值|
chunkhash | Chunk内容的Hash值|

其中， hash 和chunkhash 的长度是可指定的，［ hash:8] 代表取8 位Hash 值，默认是20 位。
> 注意， ExtractTextWebpackPlugin插件使用contenthash 而不是chunkhash 来代表哈希值，原因在于ExtractTextWebpackPlugin 提取出来的内容是代码内容本身，而不是由一组模块组成的chunk


#### 2.2.2 chunkFilename
output.chunkFilename 配置无入口的Chunk 在输出时的文件名称。chunkFilename和上面的filename 非常类似，但chunkFilename 只用于指定在运行过程中生成的Chunk 在输出时的文件名称。会在运行时生成Chunk 的常见场景包括：使用CommonChunkPlugin 、使用import （'path/to/module'） 动态加载等。chunkFilename 支持和filename 一致的内置变量。

#### 2.2.3 path
output.path 配置输出文件存放在本地的目录，必须是string 类型的绝对路径。通常通过Node.js 的path 模块去获取绝对路径：
```
path: path.resolve(__dirname, 'dist_[hash]')
```

#### 2.2.4 publicPath
在复杂的项目里可能会有一些构建出的资源需要异步加载，加载这些异步资源需要对应的URL 地址。

output.publicPath 配置发布到线上资源的URL 前缀，为string 类型。默认值是空字符'' ，即使用相对路径。

这样说可能有点抽象，举个例子，需要将构建出的资源文件上传到CDN 服务上，以利于加快页面的打开速度。配置代码如下：
```
filename : '[name][chunkhash:8].js'
publicPath :'https://cdn.example.com/assets/'
```
这时发布到线上的H TML 在引入JavaScript 文件时就需要以下配置项：
```
<script src='https://cdn.example.com/assets/a_12345678.js'></script>
```
使用该配置项时要小心，稍有不慎将导致资源加载404 错误。

output.path 和output.publicPath 都支持字符串模板，内置变量只有一个，即hash ，代表一次编译操作的Hash 值。

#### 2.2.5 crossOriginloading
Webpack 输出的部分代码块可能需要异步加载，而异步加载是通过JSONP(https ://zh.wikipedia.org/wiki/JSONP)方式实现的。JSONP 的原理是动态地向HTML 中插入一个\<script src="url"\>\<\/script\> 标签去加载异步资源。output.crossOriginLoading 则是用于配置这个异步插入的标签的crossorigin 值。

script 标签的crossorigin 属性可以取以下值：
- anonymous （默认），在加载此脚本资源时不会带上用户的C ooki es 。
- use-credentials ，在加载此脚本资源时会带上用户的Coo kies a

通常用设置crossorigin 来获取异步加载的脚本执行时的详细错误信息。

#### 2.2.6 libraryTarget 和library
当用Webpack 去构建一个可以被其他模块导入使用的库时，需要用到libraryTarget 和library 。
- output . libraryTarget 配置以何种方式导出库。
- output . library 配置导出库的名称。

它们通常搭配在一起使用。
output.libraryTarget 是字符串的枚举类型， 支持以下配置。
##### 1. var(默认)
编写的库将通过var 被赋值给通过library 指定名称的变量。
假如配置了output.library='libraryName'，则输出和使用的代码如下：

```javascript
// Webpack 输出的代码
var LibraryName = lb_code ;
// 使用库的方法
LibraryName.doSomething();
```
假如output.libray为空，则直接输出：
```
lib_code
```
其中， lib_code 是指导出库的代码内容，是有返回值的一个自执行函数。
##### 2. commonjs
编写的库将通过CommonJS 规范导出。
假如配置了output.library ＝'LibraryName'，则输出和使用的代码如下：
```javascript
// Webpack 输出的代码
exports['LibraryName'] = lib_code;
// 使用库的方法
require('library-name-in-npm')['LibraryName'].doSomething () ;
```

其中， library-name-in-npm 是指模块被发布到Npm 代码仓库时的名称。
##### 3. commonjs2
编写的库将通过CommonJS2 规范导出，输出和使用的代码如下：
```javascript
// Webpack 输出的代码
module.exports = lib_code;
// 使用库的方法
require('library-name-in-npm').doSomething () ;
```
CommonJS2 和CommonJS 规范相似，差别在于CornmonJS 只能用exports 导出，而
CommonJS2 在CommonJS 的基础上增加了module.exports 的导出方式。
在output.libraryTarget 为commonjs2 时，配置output.library 将没有意义。

##### 4. this
编写的库将通过this 被赋值给通过library 指定的名称，输出和使用的代码如下：
```javascript
// Webpack 输出的代码
this ['LibraryName'] = lib_code;
//使用库的方法
this.LibraryName.doSomething();
```
##### 5. window
编写的库将通过window 赋值给通过library 指定的名称，输出和使用的代码如下：
```javascript
//Webpack 输出的代码
window ['LibraryName'] = lib_code ;
／／ 使用库的方法
window.LibraryName.doSomething ();
```
##### 6. global
编写的库将通过window 赋值给通过library 指定的名称，输出和使用的代码如下：
```javascript
//Webpack 输出的代码
global.['LibraryName'] = lib_code;
// 使用库的方法
global.LibraryName.doSomething();
```
#### 2.2.7 libraryExport
ou tput . libraryExpo rt 配置要导出的模块中哪些子模块需要被导出。它只有在output .libraryTarget 被设置成comrnonj S 或者comrnonjs2 时使用才有意义。

假如要导出的模块源代码是：
```
export canst a=l;
export default b=2 ;
```
而现在想让构建输出的代码只导出其中的a ，则可以将output.libraryExport 设置成a ， 那么构建输出的代码和使用方法将变成如下内容：
```javascript
// Webpack 输出的代码
module.exports = lib_code [ 'a'];
// 使用库的方法
require('library-name-in-npm') === l;
```

以上只是output 中的常用配置项，还有部分几乎用不上的配置项没有在这里一一列举,详情查看[webpack官网](https://webpack.js.org/guides/getting-started/)

### 2.2 Module
module 配置处理模块的规则，下面对它进行详细讲解。

#### 2.3.1 配置Loader
rules 配置模块的读取和解析规则，通常用来配置Loader 。其类型是一个数组，数组里的每一项都描述了如何处理部分文件。配置一项rules 时大致可通过以下方式来完成。

- 条件匹配：通过test 、include 、exclude 三个配置项来选中Loader 要应用规则的文件。
- 应用规则： 对选中的文件通过use 配置项来应用Loader ，可以只应用一个Loader或者按照从后往前的顺序应用一组Loader ，同时可以分别向Loader 传入参数。
- 重置顺序：一组Loader 的执行顺序默认是从右到左执行的，通过enforce 选项可以将其中一个Loader 的执行顺序放到最前或者最后。

下面通过一个例子来说明具体的使用方法：

```
module: {
    rules: [
        {
            // 命中Javascript文件
            test: /\.js$/,
            // 用babel -loader 转换JavaScript 文件
            // ? cacheDirectory 表示传给babel-loader 的参数，用于缓存babel 的编译结果，加快重新编译的速度
            use: ['babel-loader?cacheDirectory'],
            // 只命中src 目录里的JavaScript 文件，加快Webpack 的搜索速度
            include: path.resolve(__dirname, 'src')
        },
        {
            // 命中sass文件
            test: /\.scss$/,
            // 使用一组Loader 去处理scss 文件
            // 处理顺序为从后到前，即先交给sass-loader 处理，再将结果交给css-loader,最后交给style-loader
            use: ['style-loader','css-loader','sass-loader'],
            // 排除node modules 目录下的文件
            exclude: path.resolve(__dirname, 'node_modules')
        },
        {
            // 对非文本文件采用file-loader 加载
            test: /\ . (gif | png | jpe?g | eot | woff | ttf | svg | pdf) $/,
            use: ['file-loader']
        }
    ]
}

```
在Loader 需要传入很多参数时，我们还可以通过一个Object 来描述，例如在上面的babel-loader 配置中有如下代码：
```
use: [
    {
        loader: 'babel-loder',
        options: {
            cacheDirectory: true
        },
        // enforce ：'post'的含义是将该Loader 的执行顺序放到最后
        // enforce 的值还可以是pre ，代表将Loader 的执行顺序放到最前面
        enforce: 'post'
    },
    // 省略其它loader
]

```
在上面的例子中， test 、include 、exclude 这三个命中文件的配置项只传入了一个字符串或正则，其实它们也支持数组类型，使用如下：
```
{
    test: [/\.jsx?$/,/\.tsx?/],
    include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'tests'),
    ],
    exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_modules'),
    ]
}
```
数组里的每项之间是“或”的关系，即文件的路径只要满足数组中的任何一个条件，就会被命中。

#### 2.3.2 noParse
// P56






