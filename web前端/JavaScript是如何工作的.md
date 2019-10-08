#### 1. 编程语言是如何工作的？
在开始讲解JavaScript之前，我们首先要理解任意一门语言的基本工作方式。电脑是由微处理器构成的，我们通过书写代码来命令这台小巧但功能强大的机器。但是微处理器能理解什么语言？它们无法理解Java，Pythen等语言，而只懂机器码。

用机器语言或汇编语言编写企业级代码是不可行的，因此我们需要像java，python这样佩带一个解释器或者编译器用于将其转换为机器码的高级语言。

##### 1.1 编译器和解释器
编译器/解释器可以用它处理的语言或任何其他语言来编写。
解释器：一行一行地快速读取和翻译文件。这就是JavaScript最初的工作原理。
编译器：编译器提前运行并创建一个文件，其中包含了输入文件的机器码转换。

有两种途径可以将JavaScript代码转换为机器码。编译代码时，机器对代码开始运行前将要发生的事情又更好的理解，这将加快稍后的执行速度。不过，在这个过程之前需要花费时间。

另一方面，解释代码时，执行时立即的，因此要更快，但是缺乏优化导致它在大型应用程序下运行缓慢。

#### 2.从JavaScript到机器码
就JavaScript而言，有一个引擎将其转换为机器码。和其他语言类似引擎可以用任何语言来开发，因此这样的引擎不止一个。
- V8是谷歌针对Chrome浏览器的引擎实现
- SpiderMonkey是第一个引擎，针对网景浏览器开发，现用于驱动FireFox。
- JavascriptCore是针对苹果对safari浏览器使用的引擎。

##### 2.1 ECMAScript
面对这么多的引擎，你可能会问：我可以开发自己的引擎吗？可以，只要遵循ECMAScript标准

#### 3. V8引擎
##### 3.1 部分历史
谷歌针对浏览器开发了谷歌地图，而这对浏览器的处理能力提出了很高的要求。那时的JavaScript实现尚不足以快速地运行地图。谷歌想要吸引更多的用户使用这项服务，从而进行广告销售并牟利。基于这原因，这项服务必须快速且稳定。因此谷歌自己用C++开发了V8引擎并在2008年启用，它的速度很快，或者就像一些人说的，它的速度是最快的。
![image.png](https://upload-images.jianshu.io/upload_images/12953648-8b0d4ca8d8b5c8d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 3.2 解析和构建树
JavaScript文件进入引擎后，解析器进行词法解析，它将代码分解成token以确定它们的含义。这些token组成了AST（抽象语法树）。
![image.png](https://upload-images.jianshu.io/upload_images/12953648-0cc5258e0c3bc289.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
编译器在语义分析中验证语言元素和关键词的正确用法，而ASTs在这个过程中扮演着重要的角色。之后，ASTs被用于生成实际的字节码或者机器码。
##### 3.3 引擎的核心
![image.png](https://upload-images.jianshu.io/upload_images/12953648-20ae2066819644cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
我们之前谈到，JavaScript是由Ignition这个解释器解释的，同时由TurboFan这个JIT优化编译器进行编译。

首先，前面步骤生成的ASTs传递给解释器，该解释器迅速生成未经优化的机器码，并且其执行时无延迟的。

Profiler在代码运行时进行观察，找出可以进行优化的地方。例如，一个for循环跑了100次，但是每次迭代产生的结果都是一样的
使用这个分析器后，任何未优化的代码都将传递给编译器以进行优化，同时生成机器码，它最终会替换掉之前由解释器生成的未优化代码中的对应部分。

随着分析器和编译器不断地更改字节码，JavaScript的执行性能逐渐提高。

##### 3.4 更多历史
在V8的5.9推出之前，它使用两个优化编译器和一个基线编译器。
-  基线编译器 full-codegen迅速生成未优化的机器码。
-  两个优化编译器Crankshaft和TurboFan用于优化代码。

JavaScript增加了新的特性后，架构的复杂度上升，维护相同的管道对V8团队来说变得更加困难了。如果你想阅读更多相关的旧方法以及转向新管道的原因，可以访问他们的网站。

对于任何一个程序员来说，最关注的两个问题无非就是：时间复杂度和空间复杂度。第一部分介绍了V8为改进Javascript执行时间所做的速度提升和优化，第二部分则将着重介绍内存管理方面的知识。

#### 内存堆
![image.png](https://upload-images.jianshu.io/upload_images/12953648-012ef2fc7990d7aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
每当你在JavaScript程序中定义了一个变量、常量或者对象时，你都需要一个地方来存储它。这个地方就是内存堆。

当遇到语句var a = 10的时候，内存会分配一个位置用于存储a的值

可用内存是有限的， 而复杂的程序可能有很多变量和嵌套对象，因此合理的使用内存非常重要。
和诸如C这种需要显示分配和释放内存的语言不同，JavaScript提供了自动垃圾回收机制。一旦对象/变量离开了上下文并且不再使用，它的内存就会被回收并返还到可用内存池中。
在V8中， 垃圾回收器的名字叫做Orinoco，它的处理过程非常高效。这篇文章有相关解释
#### 标记清除算法
![image.png](https://upload-images.jianshu.io/upload_images/12953648-1719a6f14e0b3224.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们通常会使用这种简单有效的算法来判定可以从内存堆中安全清除的对象。算法的工作方式正如其名：将对象标记为可获得/不可获得，并将不可获得的对象清除。
垃圾回收器周期性地从根部或者全局对象开始，移向被它们引用的对象，接着再移向被这些对象引用的对象，以此类推。所有不可获得的对象会在之后被清除。
##### 内存泄漏
虽然垃圾回收器很高效，但是开发者不应该就此将内存管理的问题束之高阁。管理内存是一个很复杂的过程，哪一块内存不再需要并不是单凭一个算法就能决定的。

内存泄漏指的是，程序之前需要用到部分内存，而这部分内存在用完之后并没有返回到内存池。

下面是一些会导致你的程序出现内存泄漏的常见错误：
全局变量：如果你不断地创建全局变量，不管有没有用到它们，它们都将滞留在程序的整个执行过程中。如果这些变量是深层嵌套对象，将会浪费大量内存。
```
var a = {}
var b = {}
function hello(){
  c= a; // 这是一个你没有意识到的全局变量
}
```
如果你试图访问一个此前没有申明过的变量，那么将在全局作用域中创建一个变量。在上面的例子中，c是没有使用var关键字显示创建的变量/对象。

事件监听器：为了增强网站的交互性或者是制作一些浮夸的动画，你可能会创建大量的事件监听器。而用户在你的单页面应用中移向其它页面时，你又忘记移除这些监听器， 那么也可能会导致内存泄漏。 当用户在这些页面来回移动的时候， 这些监听器会不断增加。
```
var element = document.getElementById('button');
element.addEventListener('click', onClick)
```
Intervals 和 Timeouts: 当在这些闭包中引用对象时，除非闭包本身被清除，否则不会清除相关对象。
```
setInterval (() => {}) // 这时候忘记清除计时器 //那么将导致内存泄漏！
```
移除DOM元素： 这个问题很常见， 类似于全局变量导致的内存泄露。DOM元素 存在于对象内存和DOM树中。用例子来解释可能会更好：
```
var terminator = document.getElementById('terminate');
var badElem = document.getElementById('toDelete');
terminator.addEventListener('click', function(){
  badElem.remove();
})
```
在你通过id = “terminate”点击了按钮之后，toDelete会冲DOM中移除。不过，由于它任然被监听器引用，为这对象分配内存并不会被释放。
```
var terminator = document.getElementById('terminate');
terminator.addEventListener('click', function(){
  var badElem = document.getElementById('toDelete');
  badElem.remove();
})
```
badElem 是局部变量，在移除操作完成之后，内存将会被垃圾回收器回收。

##### 调用栈
栈是一种遵循LIFO（先进后出）规则的数据结构，用于存储和获取数据。JavaScript引擎通过栈来记住一个函数中最后执行的语句所在的位置。
```
function multiplyByTwo(x) {
  return x*2;
}
function calculate() {
  const sum = 4 + 2;
  return multiplyByTwo(sum);
}
calculate()
var hello = "some more code follows"
```
1. 引擎了解到我们的程序中有两个函数
2. 运行calculate()函数
3. 将calculate压栈并计算两数之和
4. 运行multiplyByTwo()函数
5. 将multiplyByTwo函数压栈并计算算术计算*2
6. 在返回结构的同时，将multiplyByTwo()从栈中弹出，之后回到calculcate()函数
7. 在calculate()函数返回结果的同时，将calculate()从栈中弹出，继续执行后面的代码

##### 栈溢出
在不对栈执行弹出的情况下，可连续压栈的数目取决于栈的大小。如果超过了这个界限之后还不断地压栈，最终会导致栈溢出。chrome浏览器将会抛出一个错误以及被称为栈帧的栈快照。

递归：递归指的是函数调用自身。递归可以大幅度地减少执行算法所花费的时间（时间复杂度），不过它的理解和实施较为复杂。

 下面的例子中，基本事件永远不会执行，lonley函数在没有返回值的情况下不断地调用自身，最终会导致栈溢出。
```
function lonely() {
  if(false) {
    return 1;// 基本事件
  }
  lonely() // 递归调用
}
```
##### 为什么JavaScript是单线程的？
一个线程代表着在同一时间段内可以单独执行的程序部分的数目。要想查看一门语言是单线程的还是多线程的，最简单的方式就是了解它有多少调用栈。Js只有一个，所以它是单线程语言。

这样不是会阻碍程序运行吗？如果我运行多个好事的阻塞操作，例如HTTP请求，那么程序必须得在每一个操作得到响应之后才能执行后面的代码。

为了解决这个问题 我们需要找到一种可以在单线程下异步完成任务的办法。 事件循环就是用来发挥这个作用的。

##### 事件循环
到现在为止， 我们谈到的内容大多包含在V8里面，但是如果你去查看V8的代码库， 你会发现它并不包含例如setTimeout或者DOM的实现。 事实上， 除了运行引擎之外 JS还包括浏览器提供的Web API， 这些API用于扩展JS

