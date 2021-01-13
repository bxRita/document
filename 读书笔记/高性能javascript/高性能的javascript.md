### 数据存取
#### 管理作用域
在没有优化javascript引擎的浏览器中，建议尽可能使用局部变量。一个好的经验法则是： 如果某个跨作用于的值在函数中被引用一次以上，那么就把它存储到局部变量里。考虑下面的例子：
```
function initUI() {
  var bd = document.body, links = document.getElementsByTagName('a'), i = 0, len = links.length;
  while(i < len) {
    update(links[i++])
  }
  document.getELementById('go-btn').onclick = function() {
     start();
  };
  bd.className = 'active';
}
```
该函数引用了三次document， 而document是个全局对象。搜索该变量的过程必须遍历整个作用域链，直到在全家变量对象中找到。你可以通过以下方法减少对性能的影响：先将全局变量的作用存储在一个局部变量中 ，然后使用这个局部变量代替全局变量。例如上面的代码可以重写如下：
```
function initUI() {
  var doc = document, bd = doc.body, links = doc.getElementsByTagName('a'), i = 0, len = links.length;
  while(i < len) {
    update(links[i++])
  }
  doc.getELementById('go-btn').onclick = function() {
     start();
  };
  bd.className = 'active';
}
```
更新后的initUI() 函数首先把document对象的引用存储到局部变量doc中， 访问全局变量的次数由3次减少到1次。由于doc是个局部变量，因此通过它访问document会更快。当然由于数量的原因， 这个简单的函数不会显示巨大的性能提升， 但是可以想象，如果有几十个全局变量被反复访问， 那么性能的改善将有多么显著

####  改变作用域链
一般来说， 一个执行环境的作用域链式不会改变的。但是有两个语句可以在执行时临时改变作用域链。第一个是with语句。
with语句用来给对象的所有属性创建一个变量。在其他语言中，类似功能通常用来避免书写重复代码。函数initUI可以重写如下：
```
function initUI() {
  with (document) {
    var bd = body, links = getElementsByTagName('a'), i = 0, len = links.length;
    while(i < len) {
      update(links[i++])
    }
    getELementById('go-btn').onclick = function() {
       start();
    };
    bd.className = 'active';
  }
  
}
```
重写后的initUI()版本使用with语句来避免多次书写document。这看上去更高效，而实际上产生了一个性能问题。

代码执行到with语句时，执行环境的作用域链临时被改变了。一个新的变量对象被创建，它包含了参数指定的对象的所有属性。这个对象被推入作用域的首位，这意味着函数的所有局部变量现在处于第二个作用域链对象中，因此访问的代价更高了
![with语句改变后的作用域.png](https://upload-images.jianshu.io/upload_images/12953648-3c4adffa4184e534.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
通过把document对象传递给with语句，一个包含了document对象所有属性的新的可变变量被置于作用域链的头部。这使得ducument对象的属性非常快，而访问局部变量则变慢了，比如bd。*因此，最好避免使用with语句*。综上所述，只要简单的把document存储在一个局部变量中， 就可以提升性能。

在javascript中， 并不是只有with语句能人味改变执行环境作用域链，trye-catch语句中的catch子句也具有同样的效果。当try代码块中发生错误， 执行过程会自动跳转到catch子句，然后把异常对象推入一个变量对象并置于作用域的首位。在catch代码块内部，函数所有局部变量将会放在第二个作用域链对象中，如：
```
try {
  methodMightCauseAnError();
} catch(ex) {
  alert(ex.message); // 作用域链在此处改变
}
```
请注意，一旦catch子句执行完毕 ，作用域链就会返回到之前的状态。

如果使用得当，try-catch是个非常有用的语句，因此不建议完全弃用。如果你准备使用try-catch，请确保了解可能会出现的错误。try-catch语句不应该用来解决javascript错误。如果你知道某个错误经常出现，那说明是代码本身有问题， 应该尽早被修复。

你尽量简化代码来使得catch子句对性能的影响最小化。一种推荐的做法是将错误委托给一个函数处理，比如：
```
try {
  methodThatMightCauseAnError();
}catch(ex) {
  handleError(ex); // 委托给错误处理器函数
}
```
函数handleError()是catch子句中唯一执行的代码。该函数接受错误产生的异常对象为参数，你可以用适当的方式灵活的处理错误。由于只执行一条语句，且没有局部变量的访问，作用域链的临时改变就不会影响代码性能。

#### 闭包、作用域和内存
闭包是javascript最强大的特性之一，它允许函数访问局部作用域之外的数据。然而使用闭包可能会导致性能问题。

#### 对象成员
##### 原型
javascript中的对象是基于原型的。原型是其他对象的基础，他定义并实现了一个新创建的对象所必须包含的成员列表。这一概念完全不同于传统面向对象编程语言中的类的概念，类定义了创建新对象的过程，而原型对象为所有对象实例所共享，因此这些实例也共享了原型对象的成员。

对象可以有两种成员类型：实例成员和原型成员。实例成员直接存在于对象实例中，原型成员则从对象原型继承而来。如：
```
var book = {
  title: 'High performance Javascript',
  publisher: 'yahoo Press'
}
alert(book.toString); // "[object, object]"
```
在这段代码中，对象book有两个实例成员：title和publisher。注意其中并没有定义toString()方法，但这个方法却被顺利执行，也没有抛出错误。方法toString是由对象book继承而来的原型成员。

![实例和原型的关系.png](https://upload-images.jianshu.io/upload_images/12953648-cca9f62e22fa9fb0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
解析对象成员的过程与解析变量十分相似。当book.toString()被调用时，会冲对象实例开始，搜索名为"toString"的成员。一旦book没有名为toString的成员，那么会继续搜索其原先对象，直到toString方法被找到并且执行。由此可见，对象book可以访问它原型中的每一个属性和方法。

你可以用hasOwnPerperty()方法来判断对象是否包含特定的实例成员。要确定对象是否包含特定的属性可以用in操作符。例如：
```
var book = {
  title: "High performance javascript",
  publisher: "Yahoo Press"
}
alert(book.hasOwnProperty("title")); // true
alert(book.hasOwnProperty("toString")); // false

alert("title" in book); // true
alert("toStrinng" in book); // true
```
这段代码中，由于title是个实例成员，因此将参数“title”传给hasOwnProperty()时会返回true，而传入参数"toString"时返回false，因为该实例中不存在此成员。使用in操作符时，两种情况下都会返回true，因为它既会搜索实例也搜索原型。

##### 原型链
对象的原型决定了实例的类型。默认情况下，所有对象都是对象（Object）的实例，并继承了所有的基本方法，比如toString()。你可以定义并使用构造函数来创建另一种类型的原型。例如：
```
function Book(title, publisher) {
  this.title = title;
  this.publisher = publisher;
}
Book.prototype.sayTitle  = function() {
  alert(this.title);
}
var book1 = new Book("High performance Javascriep", "Yahoo press");
var book2 = new Book("Jacascirpt：the Good Parts", "Yahoo press");

alert(book1 instanceof Book); // true
alert(book1 instanceof Object); // true

book1.sayTitle(); // High performance Javascriep
alert(book.toString()); // "[object, object]"
```
使用构造函数Book来创建一个新的Book实例。实例book1的原型（__proto__）是Book.prototype，而Book.prototype的原型是Object。这是原型链的创建过程，book1和book2继承了原型链中的所有成员。
![原型链.png](https://upload-images.jianshu.io/upload_images/12953648-ab55c9bbad237141.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
注意，这两个Book实例共享着同一个原型链，它们有着各自的title和publisher属性，而其他部分都继承自原型。
当调用book1.toString()时，搜索过程会深入原型链中直到找到对象成员“toString”。你也许会猜到，对象在原型链中存在的位置越深，找到它就越慢。下图显示了对象成员深度和访问它所需时间的关系。
![原型链中数据访问的深度.png](https://upload-images.jianshu.io/upload_images/12953648-36c5128e34cee0cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
尽管使用优化过的javascript引擎的新型浏览器在此过程表现优异，但是老版本的浏览器，特别是IE和FireFox 3.5，每深入一层原型链都会增加性能损失。请记住，搜索实例成员比从字面量或局部变量中读取数据代价更高，再加上遍历原型链带来的开销，这让性能问题更为严重。

##### 嵌套成员
由于对象成员可能包含其它成员，例如不太常见的写法：window.location.href。每次遇到点操作符，嵌套成员会导致Javascript引擎搜索所有对象成员。下图显示了对象成员深度和读取时间的关系。
![读取时间和属性深度的关系.png](https://upload-images.jianshu.io/upload_images/12953648-b8f1a88b76178728.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
结果不出所料，对象成员嵌套的越深，读取速度就越慢。执行location.href 总是比window.location.href要快，后者也比 window.location.href.toString()要快。如果这些属性不是对象的实例属性，那么成员解析还需要搜索原型链，这会花更多的时间。
> 提示：大部分浏览器中，通过点表示法(object.name)和通过括号表示法(object["name"])操作并没有明显的区别。只有在safiri中，点符号始终会更快，但这并不意味着不要用括号符号。

##### 缓存对象成员值
由于所有类似的性能问题都与对象成员有关，因此应该尽可能避免使用它们。更确切地说，应当注意，只在必要时使用对象成员。例如，在同一个函数中没有必要多次读取同一个对象成员。

通常来说，在函数中如果要读取同一个对象属性，最佳做法是将属性值保存到局部变量中。局部变量能用来替代属性以避免多次查找带来的性能开销。特别是处理嵌套对象成员时，这样做会明显提升执行速度。

JavaScript的命名空间，比如YUI中使用的技术，是导致频繁访问嵌套属性的起因之一。例如：
```
function toggle(element) {
  if(YAHOO.util.Dom.hasClass(element, "selected")) {
    YAHOO.util.Dom.removeClass(element, "selected");
    return false;
  } else {
    YAHOO.util.Dom.addClass(element, "selected");
    return true;
  }
}
```
这段代码中重复读取YAHOO.util.Dom 3次来读取3个不同的方法。每个方法又有三次成员查找，一共就有9次，导致代码十分低效。更好的做法是将YAHOO.util.Dom 保存在局部变量中，在访问该局部变量：
```
function toggle(element) {
  var dom = YAHOO.util.Dom;
  if(dom.hasClass(element, "selected")) {
    dom.removeClass(element, "selected");
    return false;
  } else {
    dom.addClass(element, "selected");
    return true;
  }
}
```
代码中对象成员读取的次数由9次减少到5此。请不要在同一个函数里多次查找同一个对象成员，除非它的值改变了
> 提升：这种优化技术并不推荐用于成员方法。因为许多对象方法使用this来判断执行环境，把一个对象方法保存在局部变量会导致this绑定到window，而this值得改变会是得javascript引擎无法正确解析他的对象成员，进而导致程序出错。

#### 小结
在Javascript中，数据存储的位置会对代码整体性能产生重大的影响。数据存储共有4种方式：字面量、变量、数组项、对象成员。它们有着各自的性能特点。
- 访问字面量和局部变量的速度最快，相反，访问数组元素和对象成员相对较慢。
- 由于局部变量存在于作用域链的起始位置，因此访问局部变量比访问跨作用域变量更快。变量在作用域链中的位置越深，访问所需要时间就越长。由于全局变量总处于作用域链的最末端，因此访问速度也是最慢的。
- 避免使用with语句，因为他会改变执行环境作用域链。同样，try-catch语句中的catch子句也有同样的影响，因此也要小心使用。
- 嵌套的对象成员会明显影响性能，尽量少用。
- 属性或方法在原型链中的位置越深，访问它的速度就越慢。
- 通常来说，你可以通过把常用的对象成员，数组元素、跨域变量保存在局部变量中来改善javascript性能，因此局部变量访问速度更快

### DOM编程
用脚本进行DOM操作的代价很昂贵，它是富web应用中最常见的性能瓶颈。

#### 浏览器中的DOM
浏览器中通常会把DOM和JavaScript独立实现。比如在IE中，JavaScript的实现名为JScript，位于jscript.dll文件中；DOM的实现则存在另一个库中，名为mshtml.dll(内部称为Trident)。这个分离允许其他技术和语言，比如VBscript，能共享使用DOM以及Trident提供的渲染函数。Safari中的DOM和渲染是使用Webkit中的WebCore实现的，javascript部分是由独立的JavaScriptCore引擎（最新版本的名字为SquirrelFish）来实现。Google Chrome同样使用WebKit中的webCore库来渲染页面，但JavaScript引擎是他们自己研发的名为V8。Firefox中的Javascript引擎名为SpiderMonkey（最新版的名字为TraceMonkey），与名为Gecko的渲染引擎相互独立。

这对性能意味着什么？简单理解，两个相互独立的功能只要通过接口彼此连接，就会产生消耗。有个贴切的比喻，把DOM和JavaScript（这里指ECMAScript）各自想象为一个岛屿，它们之间用收费桥梁连接。ECMAScript每次访问DOM，都要途径这座桥，并交纳“过路费”。访问DOM的次数越多，费用就越高。因此，推荐的做法是尽可能减少过桥的次数，努力呆在ECMAScript岛上。

##### DOM访问与修改
访问DOM元素是有代价的-前面提到的“过桥费”。修改元素则更为昂贵，因为它会导致浏览器重新计算页面的几何变化。

当然，最坏的情况是循环中访问或修改元素，尤其是对HTML元素集合循环操作。
为了让你对DOM编程带来的性能问题有个量化的了解，请看下面的简单实例：
```
function innerHTMLLoop() {
  for(var count = 0; count < 15000; count++) {
    document.getElementById('here').innerHTML += "a";
  }
}
```
这函数循环修改页面元素的内容，这段代码的问题在于，每次循环迭代，该元素都被访问2次：一次读取innerHTML属性值，另一次重写它。
换一种效率更高的方法，用局部变量存储修改中的内容，在循环结束后一次性写入：
```
function innerHTMLLoop2() {
  var content = "";
  for(var count = 0;count < 15000; count++) {
    content += "a";
  }
  document.getElementById('here').innerHTML += content;
}
```
在所有浏览器中，修改后的版本都运行得更快。因此，通用的经验法则是：*减少访问DOM的次数，把运算尽量留在ECMAScript这一端处理*。

##### 访问集合元素时使用局部变量
一般来说，对于任何类型的DOM访问，需要多次访问同一个DOM属性或方法需要多次访问时，最好使用一个局部变量缓存此成员。当遍历一个集合时，第一优化原则是把集合存储在局部变量中，并把length缓存在循环外部，然后使用局部变量替代这些需要多次读取的元素

看下面的例子，
// 较慢
```
function collectionGlobal() {
  var coll = document.getElementsByTagName("div"), len = coll.length, name = "";
  for(var count = 0; count < len; count++) {
    name = document.getElementsByTagName('div')[count].nodeName;
    name = document.getElementsByTagName('div')[count].nodeType;
    name = document.getElementsByTagName('div')[count].tagName;
  }
  return name;
}
```
// 较快
```
function collectionGlobal() {
  var coll = document.getElementsByTagName("div"), len = coll.length, name = "";
  for(var count = 0; count < len; count++) {
    name = coll [count].nodeName;
    name = coll [count].nodeType;
    name = coll [count].tagName;
  }
  return name;
}
```
// 最快
```
function collectionGlobal() {
  var coll = document.getElementsByTagName("div"), len = coll.length, name = "", el = null;
  for(var count = 0; count < len; count++) {
    el = coll[count];
    name = el.nodeName;
    name = el.nodeType;
    name = el.tagName;
  }
  return name;
}
```
##### 遍历DOM
DOM API提供了多种方法来读取文档结构中的特定部分。当你需要从多种方案中选择时，最好为特定操作选择最高效的API。

###### 获取DOM元素
通常你需要从某一个DOM元素开始，操作周围的元素，或者递归查找所有子节点。你可以使用childNodes得到元素集合，或者用nextSibling来获取每个相邻元素。

考虑以下两个等价的例子，都是以非递归的方式遍历子节点：
```
function testNextSibling() {
  var el = document.getELementById('mydiv'), ch = el.firstChild, name = '';
  do {
    name = ch.nodeName;
  } while(ch = ch.nextSibling);
  return name;
}

function testChildNodes() {
  var el = document.getElementById('mydiv'), ch = el.childNodes, len = ch.length, name = '';
  for(var count = 0; count < len; count++) {
    name = ch[count].nodeName;
  }
  return name;
}
```
  请牢记，childNodes是个元素集合，因此在循环中注意缓存length属性以避免在每次迭代中更新。

在不同浏览器中， 这两种方法的运行时间几乎相等， 但是在IE中，nextSibling 比childNode表现优异。在IE6中，nextSibling 要快16倍，IE7中式105倍。从结果分析，在性能要求极高时，在老版本的IE中更推荐使用nextSibling方法来查找DOM节点。其他情况取决于个人或团队偏好。

###### 元素节点
DOM元素属性诸如childNodes，firstChild，nextSibling并不区分元素节点和其他类型节点，比如注释和文本节点。在某些情况下，只需要访问元素节点，因此在循环中很可能需要检查返回节点的类型并过滤掉非元素节点。这些类型检查和过滤其实是不必要的DOM操作。
大部分现代浏览器提供的API只返回元素节点。如果可用的话推荐使用这些API，因为他们的执行效率比自己在JavaScript代码中实现过滤的效率更高。下表列出了这些DOM属性。
| 属性名 | 被替代的属性 | 
| :------ | :------ | 
| children | childNodes|
| childElementCount | childNodes.length | 
| firstElementChild | firstChild | 
| lastElementChild | lastChild | 
| nextElementSibling | nextSibling | 
| previousElementSibling | previousSibling | 
> 列出的所有属性都被Firfox3.5、Safari 4、Chrome 以及Opera 9.62所支持。其中IE6、IE7、IE8只支持children属性。

使用children替代childNodes会更快，因为集合项更少。HTML源码中的空白实际上是文本节点，而且它并不包含在children集合中。在所有浏览器中，children都比childNodes要快。

###### 选择器API
选择器API性能更好，所以先检查浏览器是否支持document.querySelectorAll(), 如果支持就用。如果你使用JavaScript库提供的选择器API，应确保该库在底层实现中使用原生API。
querySelector() 来获取第一个匹配的节点

###### 重绘与重排
浏览器下载完页面中的所有组件-HTML标记、Javascirpt、CSS、图片-之后会解析并生成两个内部数据结构：
*DOM树*
    表示页面结构
*渲染树*
    表示DOM节点如何显示
DOM树中的每一个需要显示的节点在渲染树种至少存在一个对应的节点（隐藏的DOM元素在渲染书中没有对应的节点）。渲染书中的节点被称为“帧（frames）”或“盒（boxes）”，符合CSS模型的定义，理解页面元素为一个具有内边距（padding），外边距（margins），边距（borders）和位置（position）的盒子，一旦DOM和渲染树构建完成，浏览器就开始显示（绘制“paint”）页面元素。

当DOM的变化影响了元素的几何属性（宽高）-比如改变边框宽度或给段落增加文字，导致行数增加——浏览器需要重新计算元素的几何属性，同样其它元素的几何属性和位置也会因此受到影响。浏览器会使渲染书中受到影响的部分失效，并重新构造渲染树。这个过程称为“重排（reflow）”。完成重排后，浏览器会重新绘制受影响的部分到屏幕中，该过程称为“重绘（repaint）”

并不是所有的DOM变化都会影响几何属性。例如，改变一个元素的背景色并不会影响它的宽和高。在这种情况下，只会发生一次重绘（不需要重排），因为元素的布局并没有改变。
重绘和重排操作都是代价昂贵的操作，它们会导致Web应用程序的UI反应迟钝，所以，应当尽可能减少这类过程的发生。

###### 重排何时发生
正如前文所提到，当页面布局和几何属性改变时就需要“重排”。下述情况中会发生重排。
- 添加或删除可见DOM元素。
- 元素位置改变
- 元素尺寸改变（包括：外边距、内边距、边框厚度、宽度、高度等属性改变）
- 内容改变，例如：文本改变或图片被另一个不同尺寸的图片替代
- 页面渲染器初始化
- 浏览器窗口尺寸改变
根据改变的范围和程度，渲染树中或大或小的对应的部分也需要重新计算。有些改变会触发整个页面的重排：例如，当滚动条出现时。

###### 渲染树变化的排队与刷新
由于每次重排都会产生计算消耗，大多数浏览器通过队列化修改并批量执行来优化重排过程。然而，你可能会（经常不知不觉）强制刷新队列并要求计划任务立刻执行。获取布局信息的操作会导致列队刷新，比如以下方法：
- offsetTop, offsetLeft, offsetWidth, offsetHeight
- scrollTop, scrollLeft, scrollWidth, scrollHeight
- clientTop, clientLeft, clientWidth, clientHeight
- getComputedStyle() (currentStyle in IE)
以上数学和方法需要返回最新的布局信息，因此浏览器不得不执行渲染队列中的“待处理变化”并触发重排以返回正确的值。

在修改样式的过程中，最好避免使用上面列出的属性。它们都会刷新渲染队列，即使你是获取最近未发生改变的或者与最新改变无关的布局信息。

###### 最小化重绘和重排
重绘和重排可能代价非常昂贵，因此一个好的提高程序响应速度的策略就是减少此类操作的发生。为了减少发生次数，应该合并多次对DOM和样式的修改，然后一次处理掉
 
**改变样式**
如：
```
var el = document.getElementById('mydiv');
el.style.borderLeft = "1px";
el.style.borderRight = "2px";
el.style.padding = "5px";
```
示例中有三个样式属性被改变，每一个都会影响元素的几何结构。最糟糕的情况下，会导致浏览器触发三次重排。大部分现代浏览器为此做了优化只会触发一次重排，但是在旧版浏览器中或者有一个分离的异步处理过程时（比如使用计时器），仍然效率低下。如果在上面代码执行时，有其他代码请求布局信息，这回导致触发三次重排。而且，这段代码四次访问DOM，可以被优化。

一个能够达到同样效果且效率更高的方式是：合并所有的改变然后一次处理，这样只会修改DOM一次。使用cssText属性可以实现：
var el = document.getElementById('mydiv');
el.style.cssText = "border-left: 1px;border-right: 2px; padding: 5px;"

例子中的代码修改cssText属性并覆盖了已存在的样式，因此如果想保留现有的样式，可以把它附加在cssText字符串后面
el.style.cssText += '; border-left: 1px;';
另一个一次性修改样式的办法是修改CSS的class名称，而不是修改内联样式。这种方法适用于那些不依赖于运行逻辑和计算的情况。改变CSS的class名称的方法更清晰，更易于维护；它有助于保持你的脚本与免除显示性代码，尽管他可能带来轻微的性能影响，因为改变类时需要检查级联样式
```
var el = document.getElementById('mydiv');
el.className = 'active';
```
###### 批量修改DOM
当你需要对DOM元素进行一系列操作时，可以通过以下步骤来减少重绘重排的次数：
1. 使元素脱离文档流
2. 对其应用多重改变
3. 把元素带回文档中
该过程里会触发两次重排——第一步和第三步。如果你忽略这两个步骤，那么在第二步所产生的任何修改都会触发一次重排。
有三种基本方法可以使DOM脱离文档：
- 隐藏元素，应用修改，重新显示
- 使用文档片段（document fragment）在当前DOM之外构建一个子树，再把它拷贝回文档
- 将原始元素拷贝到一个脱离文档的节点中，修改副本，完成后再替换原始元素。

为演示脱离文档的操作，考虑下面的链接列表它必须更新更多信息：
```
<ul id="mylist">
  <li><a href="http://phpied.com">Stoyan</a></li>
  <li><a href="http://julienlecomte.com">Julien</a></li>
</ul>
```
假设附加数据已经存储在一个对象中，并要插入列表。这些数据定义如下：
```
var data = [
  {
    "name": "Nicholas",
    "url": "http://nczonline.net"
  },
  {
    "name": "Ross",
    "url": "http://techfoolery.com"
  }
]
```
下面是一个用来更新指定节点数据的通用函数：
```
function appendDataToElement(appendToElement, data) {
  var a, li;
  for(var i = 0, max = data.lenth; i < max; i++) {
    a = document.createElement('a');
    a.href = data[i].url;
    a.appendChild(document.createTextNode(data[i].name));
    li = document.createElement('li');
    li.appendChild(a);
    appendToElement.appendChild(li);
  }
}
```
更新列表内容而不用担心重排问题，最明显的方法如下：
```
var ul = document.getElementById('mylist');
appendDataToELement(ul, data);
```
然而，使用这种方法data数组的每一个新条目被附加到当前DOM树时都会导致重排。正如前文所讨论的那样，一个减少重排的方法是通过改变display属性，临时从文档中移除<ul>元素，然后再恢复它：
```
var ul = document.getElementById('mylist');
ul.style.display = "none";
appendDataToElement(ul, data);
ul.style.display = "block";
```
另一种减少重排次数的方法是：在文档之外创建并更新一个文档片段，然后把它附加到原始列表中。文档片段是个轻量级的document对象，它的设计初衷就是为了完成这类任务——更新和移动节点。**文档片段的一个便利的语法特性是当你附加一个片段到节点中时，实际上被添加的是该片段的子节点，而不是片段本身。**下面的列子少一行代码，只触发一次重排，而且只访问了一次实时的DOM:
```
var fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
document.getElementById('mydiv').appendChild(fragment);
```
第三种解决方案是为需要修改的节点创建一个备份，然后对副本进行操作，一旦操作完成，就用新的节点替代旧的节点。
```
var old = document.getElementById('mydiv');
var clone = old.cloneNode(true);
appendDataToElement(clone, data);
old.parentNode.replaceChild(clone, old);
```
推荐尽可能地使用文档片段（方案二），因为它们所产生的DOM遍历和重排次数最少。唯一潜在的问题是文档片段未被充分利用，有些团队成员可能并不熟悉这项技术。

###### 缓存布局信息
如前文所述，浏览器尝试通过队列话修改和批量执行的方式最小化重排次数。当你查询布局信息时，比如获取偏移量（offsets）、滚动位置（scroll values）或计算出的样式值（computedstyle values）时，浏览器为了返回最新值，会刷新队列并应用所有变更。最好的做法是尽量减少布局信息的获取次数，获取后把它赋值给局部变量，然后再操作局部变量。

###### 让元素脱离动画流
用展开/折叠的方式来显示隐藏部分页面时一种常见的交互模式。它通常包括展开区域的几何动画，并将页面其他部分推向下方。

一般来说，重排只影响渲染树中的一小部分，但也可能影响很大的部分，甚至整个渲染树。浏览器所需要重排的次数越少，应用程序的响应速度就越快。因此当页面顶部一个动画推移至页面整个余下部分时，会导致一次代价昂贵的大规模重排，让用户感到页面一顿一顿的。渲染树中需要重新计算的节点越多，情况就会越糟。

使用以下步骤可以避免页面中的大部分重排：
1. 使用绝对位置定位页面上的动画元素，将其脱离文档流。
2. 让元素动起来。当它扩大时，会临时覆盖部分页面。但这只是页面一个小区域的重绘过程， 不会产生重排并重绘页面的大部分内容。
3. 当动画结束时恢复定位，从而只会下移一次文档的其他元素。

###### IE和:hover
从IE7开始，IE允许在任何元素（严格模式下）上使用:hover 这个CSS伪选择器。然而如果你有大量元素使用了:hover，那么会降低响应速度。此问题在IE8中更为明显。

###### 事件委托
当页面中存在大量元素，而且每一个都要一次或多次绑定事件处理器（比如onclick）时，这种情况可能会影响性能。每绑定一个事件处理器都是由代价的，它要么是加重了页面负担（更多的标签或JavaScript代码），要么是增加了运行期的执行时间。需要访问和修改的DOM元素越多，应用程序也就越慢，特别是事件绑定通常发生在onload（或DOMContentReady）时，此时对每一个富交互应用的网页来说都是一个拥堵的时刻。事件绑定占用了处理时间，而且，浏览器需要跟踪每个事件处理器，这也会占用更多的内存。当这些工作结束时，这些事件处理器中的绝大部分都不再需要（因为并不是100%的按钮或链接会被用户点击），因此有很多工作是没必要的。
一个简单而优雅的处理DOM事件的技术是事件委托。它是基于这样一个事实：事件逐层冒泡并能被父级元素捕获。使用事件代理，只需要给外层元素绑定一个处理器，就可以处理在其子元素上触发的所有事件。

根据DOM标准，每个事件都要经历三个阶段：
- 捕获
- 到达目标
- 冒泡
IE不支持捕获，但对于委托而言，冒泡已经足够。

##### 小结
访问和操作DOM是现代Web应用的重要部分。但每次穿越连接ECMAScript和DOM两个岛屿之间的桥梁，都会被收取“过桥费”。为了减少DOM编程带来的性能损失，请记住以下几点：
- 最小化DOM访问次数，尽可能在Javascript端处理
- 如果需要多次访问某个DOM节点，请使用局部变量存储它的引用
- 小心处理HTML集合，因为它实时联系着底层文档。把集合的长度缓存到一个变量中，并在迭代中使用它。如果需要经常操作集合，建议把它拷贝到一个数组中。
- 如果可能的话，使用速度更快的API，比如querySelectorAll()和firstElementChild
- 要留意重绘和重排，批量修改样式时，“离线”操作DOM树，使用缓存，并减少访问布局信息的次数。
- 动画中使用绝对定位，使用拖放代理。
- 使用事件委托来减少处理器的数量。

### 算法和流程控制
#### 循环
在大多数的编程语言中，代码执行时间大部分消耗在循环中。循环处理时最常见的编程模式之一，也是提升性能必须关注的要点之一。
##### 循环类型
四种循环类型：
第一种是标准的for循环，与其他类C语言的语法相同：
```
for(var i = 0; i < 10; i++) {
// 循环主体
}
```
for循环式JavaScript中最常见的循环结构。它由四部分组成：初始化、前测条件、后执行体、循环体。当代码运行中遇到for循环时，先运行初始化代码，然后进入前测条件。如果前测条件的结果为true，则运行循环体。循环体执行完后，后执行代码开始运行。for循环直观的代码封装风格被开发人员所喜爱。
> 请注意，在for循环初始化中var语句会创建一个函数级的变量，而不是循环级。由于Javascript只有函数级作用域，因此在for循环中定义一个新变量相当于在循环体外定义个新变量

第二种循环类型是while循环。while循环式最简单的前测循环，由一个前测条件和一个循环体构成：
```
var i = 0;
while(i < 10) {
  //   循环主体
  i++;
}
```
在循环体运行前，先计算前侧条件。如果计算结果为true，就运行循环体；否则，循环体会被跳过。任何for循环都能改写成while循环，反之亦然。

第三种循环类型是do-while 循环。do-while循环式Javascript中唯一一种后测循环，它由两部分组成，循环体和后测条件
```
var i = 0;
do {
  // 循环主体
} while(i++ < 10)
```
在do-while循环中，循环体会至少运行一次，而后再由后测条件决定是否再次运行。

第四种也是最后一种循环类型是for-in循环。该循环有个非常特别的用途；他可以枚举任何对象的属性名。基本格式如下：
```
for(var prop in object) {
  // 循环主体
}
```
循环每次运行时，prop变量被赋值为object的一个属性名（字符串），直到所有属性遍历完成才返回。所返回的属性包括对象实例属性以及从原型链中继承而来的属性。

##### 循环性能
不断引发循环性能争论的源头是循环类型的选择。在javascript提供的四种循环类中，只有for-in循环比其它几种明显要慢。

由于每次迭代操作会同时搜索实例或原型属性，for-in循环的每次迭代都会产生更多开销，所以比其他循环类型要慢，对比相同迭代的循环，for-in循环最终只有其它类型速度的1/7。因此，除非你明确需要迭代一个属性数量未知的对象，否则应避免使用for-in循环。如果你需要遍历一个数量有限的已知属性列表，使用其他循环类型会更快，比如可以使用以下模式：
```
var props = ["prop1", "prop2"], i = 0, len = props.length;
while(i < len) {
  process(object[props[i++]]);
}
```
> 提示：不要使用for-in 来遍历数组成员。

除for-in循环外，其他循环类型的性能都差不多，深究哪种循环最快并没有什么意义。循环类型的选择应该基于需求而不是性能。

如果循环类型与性能无关，那么该如何选择？ 其实只有两个可选因素：
- 每次迭代处理的事务
- 迭代的次数
通过减少这两者中的一个或者全部的时间开销，你就提升循环的整体性能。

##### 基于函数的迭代
ECMA-262标准第四版引入了一个新的原生数组方法：forEach()。此方法遍历一个数组的所有成员，并在每个成员上执行一个函数。要运行的函数作为参数传给forEach()，并在调用时接收三个参数，分别是：当前数组项的值，索引以及数组本身。以下是使用示例：
```
items.forEach(function(value, index, array){
  process(value);
})
```
尽管基于函数的迭代提供了一个更为便利的迭代方法，但它仍然比基于循环的迭代要慢一些。对于数组项调用外部方法所带来的开销是速度慢的主要原因。在所有情况下，基于循环的迭代比基于函数的迭代快8倍，因此在运行速度要求严格时，基于函数的迭代不是合适的选择。

##### 条件语句
###### if-else 对比switch
大多数情况下**switch比if-else运行的要快**，但只有当条件数量很大时才快的明显。这两个语句主要性能区别是：当条件增加时，if-else性能负担增加的程度比switch要多。因此，我们自然倾向于在条件数量较少时使用if-else，而在条件数量较大时使用switch，这从性能方面考虑也是合理的。
通常来说，if-else适用于判断两个离散值或几个不同的值域。当判断多于两个离散值时，switch语句是更佳选择。

###### 优化if-else
优化if-else的目标是：__最小化到达正确分支前所需判断的条件数量__。最简单的优化方法是确保最可能出现的条件放在首位。考虑代码如下：
```
if(value < 5){
  // 代码处理
}else if(value > 5 && value < 10){
   // 代码处理
} else{
   // 代码处理
  }
```
该代码只有当value值经常小于5的时候才是最优的。如果value大于5或者等于10， 那么每次到达正确分支之前必须经过两个条件判断，最终增加了这个语句所消耗的平均时间。if-else中的条件语句应该总是按照从最大概率到最小概率的顺序排列，以确保运行速度最快。
另一个减少条件判断次数的方法是把if-else组织成一系列嵌套的if-else语句。使用单个庞大的if-else通常会导致运行缓慢，因为每个条件都需要判断。

##### 查找表
有些时候优化条件语句的最佳方案是避免使用if-else和switch。当有大量离散值需要测试时，if-else和switch比使用查找表慢很多。Javascript中可以使用数组和普通对象来构建查找表，通过查找表访问数据比用if-else或switch快很多，特别是在条件语句数量很大的时候。

###### 递归
使用递归可以把复杂的算法变得简单。事实上有些传统算法正是用递归实现的，比如阶乘函数：
```
function factorial(n) {
  if(n == 0){
    return 1;
  }else{
    return n * factorial(n-1);
  }
}
```
递归函数潜在问题是终止条件不明确或缺少终止条件会导致函数长时间运行，并使得用户界面处于假死状态。而且，递归函数还可能遇到浏览器的“调用栈大小限制”

###### 调用栈限制
Javascript引擎支持的递归数量与Javascript调用栈大小直接相关。只有IE例外，它的调用栈与系统空闲内存有关，而其他所有浏览器都有固定数量的调用栈限制。大多数现代浏览器的调用栈数量比老版本浏览器多很多。下图展示了主流浏览器调用栈的大小对比：
![各种浏览器的Javascript调用栈大小对比.png](https://upload-images.jianshu.io/upload_images/12953648-00495b665fd3dadb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
当你使用了太多的递归，甚至超过最大调用栈容量时，浏览器会报告以下出错信息：
- Internet Explorer: "Stack overflow at line x"
- Firefox: "Too much recurison"
- Safiri: "Maximum call stack size exceeded"
- Opera: "Abort(control stack overflow)"
Chrome 是唯一不显示调用栈溢出错误的浏览器。

###### 迭代
任何递归能实现的算法同样可以用迭代来实现。迭代算法通常包含几个不同的循环，分别对应计算过程的不同方面，这也会引入它们自身的性能问题。

##### Memoization
memoze() 函数接受两个参数：一个是需要增加缓存功能的函数，一个是可选的缓存对象。
```
function memoize(fundamental, cache) {
  cache = cache || {};
  var shell = function(arg) {
    if(!cache.hasOwnProperty(arg)) {
      cache[arg] = fundamental(arg);
    }
    return cache[arg];
  };
  return shell;
}

// 缓存该阶乘函数
var memfactorial = memoize(factorial, {"0": 1, "1": 1});
var fact6 = memfactorial(6);
```

##### 小结：

Javascript和其它编程语言一样，代码的写法和算法会影响运行时间。与其他语言不同的是，JavaScript可用资源有限，因此优化技术更为重要。

- for 、while、和do-while循环性能特性相当，并没有一种循环类型明显快于或慢于其他类型。
- 避免使用for-in循环，除非你需要遍历一个属性未知的对象。
- 改善循环性能的最佳方式是减少每次迭代的运算量和减少循环迭代次数。
- 通常来说，switch总比if-else快，但并不总是最佳解决方案。
- 在判断条件较多时，使用查找表比if-else和switch更快。
- 浏览器的调用栈大小限制了递归算法在JavaScript中的应用，栈溢出会导致其他代码中断运行
- 如果你遇到栈溢出错误，可将方法改为迭代算法，或使用Memoization来避免重复计算
运行的代码数量越大，使用这些策略所带来的性能提升也就越明显。

### 字符串和正则表达式
字符串连接表现出惊人的性能紧张。通常一个任务通过一个循环，向字符串末尾不断地添加内容，来创建一个字符串（例如，创建一个HTML 表或者一个XML 文档），但此类处理在一些浏览器上表现糟糕而遭人痛恨。
那么你怎样优化此类任务呢？首先，有多种方法可以合并字符串
| 方法              | 样例    |
| --------          | -----:   |
| +                   | str='a'+'b'+'c'      |
| +=                  | str='a';     str += 'b' ;   str += 'c'     |
| array.join()        | str = ['a','b','c'].join()      |
| string.concat()        | str='a';  str=  str.concat('b','c')    |

**加和加等于**    
首先，看一个例子。这是连接字符串的常用方法：    
```
str += "one" + "two";
```
此代码执行时，发生四个步骤：    
1. 内存中创建了一个临时字符串
2. 临时字符串的值被赋予“onetwo”。
3. 临时字符串与str 的值进行连接。
4. 结果赋予str

这基本上就是浏览器完成这一任务的过程

下面的代码通过两个离散表达式直接将内容附加在str 上避免了临时字符串（上面列表中第1 步和第2步）。在大多数浏览器上这样做可加快10%-40%：
```
str += "one";
str += "two";
```
实际上，你可以用一行代码就实现这样的性能提升，如下：
```
str = str + "one" + "two";
// equivalent to str = ((str + "one") + "two")
```
这就避免了使用临时字符串，因为赋值表达式开头以str 为基础，一次追加一个字符串，从左至右依次连接。如果改变连接顺序（例如，str = "one" + str + "two"），你会失去这种优化。这与浏览器合并字符串时分配内存的方法有关。除IE 以外，浏览器尝试扩展表达式左端字符串的内存，然后简单地将第二个字符串拷贝到它的尾部（如图5-1）。如果在一个循环中，基本字符串位于最左端，就可以避免多次复制一个越来越大的基本字符串

**Array Joining 数组联结**
Array.prototype.join 方法将数组的所有元素合并成一个字符串，并在每个元素之间插入一个分隔符字符串。如果传递一个空字符串作为分隔符，你可以简单地将数组的所有元素连接起来。

**String.prototype.concat**
原生字符串连接函数接受任意数目的参数，并将每一个参数都追加在调用函数的字符串上。这是连接字符串最灵活的方法，因为你可以用它追加一个字符串，或者一次追加几个字符串，或者一个完整的字符串数组。
```js
// append one string
str = str.concat(s1);
// append three strings
str = str.concat(s1, s2, s3);
// append every string in an array by using the array
// as the list of arguments
str = String.prototype.concat.apply(str, array);
```
不幸的是，大多数情况下 concat 比简单的+和+=慢一些，而且在 IE，Opera 和 Chrome 上大幅变慢。此外，虽然使用 concat 合并数组中的所有字符串看起来和前面讨论的数组联结差不多，但通常它更慢一些（Opera 除外），而且它还潜伏着灾难性的性能问题，正如 IE7 和更早版本中使用+和+=创建大字符串那样。

**正则表达式优化**
**正则表达式工作原理**
为了有效地使用正则表达式，重要的是理解它们的工作原理。下面是一个正则表达式处理的基本步骤：    
第一步：编译    
当你创建了一个正则表达式对象之后（使用一个正则表达式直接量或者 RegExp 构造器），浏览器检查你的模板有没有错误，然后将它转换成一个本机代码例程，用于执行匹配工作。如果你将正则表达式赋给一个变量，你可以避免重复执行此步骤

第二步：设置起始位置    
当一个正则表达式投入使用时，首先要确定目标字符串中开始搜索的位置。它是字符串的起始位置，或者由正则表达式的 lastIndex 属性指定，但是当它从第四步返回到这里的时候（因为尝试匹配失败），此位置将位于最后一次尝试起始位置推后一个字符的位置上。

第三步：匹配每个正则表达式的字元    
正则表达式一旦找好起始位置，它将一个一个地扫描目标文本和正则表达式模板。当一个特定字元匹配失败时，正则表达式将试图回溯到扫描之前的位置上，然后进入正则表达式其他可能的路径上

第四步：匹配成功或失败    
如果在字符串的当前位置上发现一个完全匹配，那么正则表达式宣布成功。如果正则表达式的所有可能路径都尝试过了，但是没有成功地匹配，那么正则表达式引擎回到第二步，从字符串的下一个字符重新尝试。只有字符串中的每个字符（以及最后一个字符后面的位置）都经历了这样的过程之后，还没有成功匹配，那么正则表达式就宣布彻底失败

牢记这一过程将有助于您明智地判别那些影响正则表达式性能问题的类型。接下来我们深入剖析第三步中匹配过程的关键点：回溯。    

当一个正则表达式扫描目标字符串时，它从左到右逐个扫描正则表达式的组成部分，在每个位置上测试能不能找到一个匹配。对于每一个量词和分支，都必须决定如何继续进行。如果是一个量词（诸如*，+?，或者{2,}），正则表达式必须决定何时尝试匹配更多的字符；如果遇到分支（通过|操作符），它必须从这些选项中选择一个进行尝试

每当正则表达式做出这样的决定，如果有必要的话，它会记住另一个选项，以备将来返回后使用。如果所选方案匹配成功，正则表达式将继续扫描正则表达式模板，如果其余部分匹配也成功了，那么匹配就结束了。但是如果所选择的方案未能发现相应匹配，或者后来的匹配也失败了，正则表达式将回溯到最后一个决策点，然后在剩余的选项中选择一个。它继续这样下去，直到找到一个匹配，或者量词和分支选项的所有可能的排列组合都尝试失败了，那么它将放弃这一过程，然后移动到此过程开始位置的下一个字符上，重复此过程。

**分支和回溯**    
下面的例子演示了这一过程是如何处理分支的。   
```js
/h(ello|appy) hippo/.test("hello there, happy hippo");
```

此正则表达式匹配“hello hippo”或“happy hippo”。测试一开始，它要查找一个 h，目标字符串的第一个字母恰好就是 h，它立刻就被找到了。接下来，子表达式（ello|appy）提供了两个处理选项。正则表达式选择最左边的选项（分支选择总是从左到右进行），检查 ello 是否匹配字符串的下一个字符。确实匹配，然后正则表达式又匹配了后面的空格。然而在这一点上它走进了死胡同，因为 hippo 中的 h 不能匹配字符串中的下一个字母 t。此时正则表达式还不能放弃，因为它还没有尝试过所有的选择，随后它回溯到最后一个检查点（在它匹配了首字母 h 之后的那个位置上）并尝试匹配第二个分支选项。但是没有成功，而且也没有更多的选项了，所以正则表达式认为从字符串的第一个字符开始匹配是不能成功的，因此它从第二个字符开始，重新进行查找。它没有找到 h，所以就继续向后找，直到第 14 个字母才找到，它匹配 happy 的那个 h。然后它再次进入分支过程。这次 ello 未能匹配，但是回溯之后第二次分支过程中，它匹配了整个字符串“happy hippo”（如图 5-4）。匹配成功了。

下一个例子显示了带重复量词的回溯。    
```js
var str = "<p>Para 1.</p>" +
 "<img src='smiley.jpg'>" +
 "<p>Para 2.</p>" +
 "<div>Div.</div>";

str.match(/<p>.*<\/p>/i);
```
正则表达式一上来就匹配了字符串开始的三个字母<p>。然后是.*。点号匹配除换行符以外的任意字符，星号这个贪婪量词表示重复零次或多次——匹配尽量多的次数。因为目标字符串中没有换行符，它将吞噬剩下的全部字符串！不过正则表达式模板中还有更多内容需要匹配，所以正则表达式尝试匹配<。它在字符串末尾匹配不成功，所以它每次回溯一个字符，继续尝试匹配<，直到它回到</div>标签的<位置。然后它尝试匹配\/（转义反斜杠），匹配成功，然后是 p，匹配不成功。正则表达式继续回溯，重复此过程，直到第二段末尾时它终于匹配了</p>。匹配返回成功，它从第一段头部一直扫描到最后一个的末尾，这可能不是你想要的结果

你可以将正则表达式中的贪婪量词*改为懒惰（又名非贪婪）量词*?，以匹配单个段落。懒惰量词的回溯工作以相反方式进行。当正则表达式/<p>.*?<\/p>/推进到.*?时，它首先尝试全部跳过然后继续匹配<\/p>。它这么做是因为*?匹配零次或多次，但尽可能少重复，尽可能少的话那么它就可以重复零次。但是，当随后的<在字符串的这一点上匹配失败时，正则表达式回溯并尝试下一个最小的字符数：一个。它继续像这样向前回溯到第一段的末尾，在那里量词后面的<\/p>得到完全匹配。
```js
var str = "<p>Para 1.</p>" +
 "<img src='smiley.jpg'>" +
 "<p>Para 2.</p>" +
 "<div>Div.</div>";

str.match(/<p>.*?<\/p>/i);
```

当一个正则表达式占用浏览器上秒，上分钟或者更长时间时，问题原因很可能是回溯失控。为说明此问题，考虑下面的正则表达式，它的目标是匹配整个 HTML 文件。此表达式被拆分成多行是为了适合页面显示。不像其他大多数正则表达式那样，JavaScript 没有选项可使点号匹配任意字符，包括换行符，所以此例中以[\s\S]匹配任意字符。
```js
/<html>[\s\S]*?<head>[\s\S]*?<title>[\s\S]*?<\/title>[\s\S]*?<\/head>[\s\S]*?<body>[\s\S]*?<\/body>[\s\S]*?<\/html>/
```
此正则表达式匹配正常 HTML 字符串时工作良好，但是如果目标字符串缺少一个或多个标签时，它就会变得十分糟糕。例如</html>标签缺失，那么最后一个[\s\S]*?将扩展到字符串的末尾，因为在那里没有发现</html>标签，然后并没有放弃，正则表达式将察看此前的[\s\S]*?队列记录的回溯位置，使它们进一步扩大。正则表达式尝试扩展倒数第二个[\s\S]*?——用它匹配</body>标签，就是此前匹配过正则表达式模板<\/body>的那个标签——然后继续查找第二个</body>标签直到字符串的末尾。当所有这些步骤都失败了，倒数第三个[\s\S]*?将被扩展直至字符串的末尾，依此类推。

解决方法：具体化    
此类问题的解决办法在于尽可能具体地指出分隔符之间的字符匹配形式。例如模板".*?"用于匹配双引号包围的一个字符串。用更具体的[^"\rn]*取代过于宽泛的.*?，就去除了回溯时可能发生的几种情况，如尝试用点号匹配引号，或者扩展搜索超出预期范围。

在 HTML 的例子中解决办法不是那么简单。你不能使用否定字符类型如[^<]替代[\s\S]因为在搜索过程中可能会遇到其他类型的标签。但是，你可以通过重复一个非捕获组来达到同样效果，它包含一个回顾（阻塞下一个所需的标签）和[\s\S]（任意字符）元序列。这确保中间位置上你查找的每个标签都会失败，然后，更重要的是，[\s\S]模板在你在回顾过程中阻塞的标签被发现之前不能被扩展。应用此方法后正则表达式最终修改如下：
```js
/<html>(?:(?!<head>)[\s\S])*<head>(?:(?!<title>)[\s\S])*<title>
(?:(?!<\/title>)[\s\S])*<\/title>(?:(?!<\/head>)[\s\S])*<\/head>
(?:(?!<body>)[\s\S])*<body>(?:(?!<\/body>)[\s\S])*<\/body>
(?:(?!<\/html>)[\s\S])*<\/html>/
```
..................................................这章看不下去，难...........................


### 响应接口
#### 浏览器UI线程
JavaScript 和 UI 更新共享的进程通常被称作浏览器 UI 线程（虽然对所有浏览器来说“线程”一词不一定准确）。此 UI 线程围绕着一个简单的队列系统工作，任务被保存到队列中直至进程空闲。一旦空闲，队列中的下一个任务将被检索和运行。这些任务不是运行 JavaScript 代码，就是执行 UI 更新，包括重绘和重排版（在第三章讨论过）。此进程中最令人感兴趣的部分是每次输入均导致一个或多个任务被加入队列。

当所有 UI 线程任务执行之后，进程进入空闲状态，并等待更多任务被添加到队列中。空闲状态是理想的，因为所有用户操作立刻引发一次 UI 更新。如果用户企图在任务运行时与页面交互，不仅没有即时的UI 更新，而且不会有新的 UI 更新任务被创建和加入队列。事实上，大多数浏览器在 JavaScript 运行时停止 UI 线程队列中的任务，也就是说 JavaScript 任务必须尽快结束，以免对用户体验造成不良影响。

浏览器在 JavaScript 运行时间上采取了限制。这是一个有必要的限制，确保恶意代码编写者不能通过无尽的密集操作锁定用户浏览器或计算机。此类限制有两个：调用栈尺寸限制（第四章讨论过 栈溢出）和长时间脚本限制。长运行脚本限制有时被称作长运行脚本定时器或者失控脚本定时器，但其基本思想是浏览器记录一个脚本的运行时间，一旦到达一定限度时就终止它。当此限制到达时，浏览器会向用户显示一个对话框，如图 6-2 所示
![1](./imgs/1.png)
图 6-2 Internet Explorer 的长运行脚本警告对话框，当运行超过 5 百万条语句时显示    

有两种方法测量脚本的运行时间。第一个方法是统计自脚本开始运行以来执行过多少语句。此方法意味着脚本在不同的机器上可能会运行不同的时间长度，可用内存和 CPU 速度可以影响一条独立语句运行所花费的时间。第二种方法是统计脚本运行的总时间。在特定时间内可运行的脚本数量也因用户机器性能差异而不同，但脚本总是停在固定的时间上。毫不奇怪，每个浏览器对长运行脚本检查方法上略有不同：    
- Internet Explorer，在第 4 版中，设置默认限制为 5 百万条语句；此限制存放在 Windows 注册表中，叫做 HKEY_CURRENT_USER\Software\Microsoft\InternetExplorer\Styles\MaxScriptStatements
- Firefox 默认限制为 10 秒钟，此限制存放在浏览器的配置设置中（在地址栏中输入 about:config）键名为dom.max_script_run_time。
- Safari 默认限制为 5 秒钟，此设置不能改变，但你可以关闭此定时，通过启动 Develop 菜单并选择“禁止失控 JavaScript 定时器”。
- Chrome 没有独立的长运行脚本限制，替代以依赖它的通用崩溃检测系统来处理此类实例。
- Opera 没有长运行脚本限制，将继续运行 JavaScript 代码直至完成，由于 Opera 的结构，当运行结束时它并不会导致系统不稳定。

当浏览器的长时间脚本限制被触发时，有一个对话框显示给用户，而不管页面上的任何其他错误处理代码。这是一个主要的可用性问题，因为大多数互联网用户并不精通技术，会被错误信息所迷惑，不知道应该选择哪个选项（停止脚本或允许它继续运行）。

如果你的脚本在浏览器上触发了此对话框，意味着脚本只是用太长的时间来完成任务。它还表明用户浏览器在 JavaScript 代码继续运行状态下无法响应输入。从开发者观点看，没有办法改变长运行脚本对话框的外观，你不能检测到它，因此不能用它来提示可能出现的问题。显然，**长运行脚本最好的处理办法首先是避免它们**。

**How Long Is Too Long? 多久才算“太久”？**       
浏览器允许脚本继续运行直至某个固定的时间，这并不意味着你可以允许它这样做。事实上，你的JavaScript 代码持续运行的总时间应当远小于浏览器实施的限制，以创建良好的用户体验。Brendan Eich，JavaScript 的创造者，引用他的话说，“[JavaScript]运行了整整几秒钟很可能是做错了什么……” 

如果整整几秒钟对 JavaScript 运行来说太长了，那么什么是适当的时间？事实证明，即使一秒钟对脚本运行来说也太长了。一个单一的 JavaScript 操作应当使用的总时间（最大）是 100 毫秒。这个数字根据 RobertMiller 在 1968 年的研究。有趣的是，可用性专家 Jakob Nielsen 在他的著作《可用性工程》（Morgan Kaufmann，1944）上注释说这一数字并没有因时间的推移而改变，而且事实上在 1991 年被 Xerox-PARC（施乐公司的帕洛阿尔托研究中心）的研究中重申。

Nielsen 指出如果该接口在 100 毫秒内响应用户输入，用户认为自己是“直接操作用户界面中的对象。”超过 100 毫秒意味着用户认为自己与接口断开了。由于 UI 在 JavaScript 运行时无法更新，如果运行时间长于 100 毫秒，用户就不能感受到对接口的控制。

更复杂的是有些浏览器在 JavaScript 运行时不将 UI 更新放入队列。例如，如果你在某些 JavaScript 代码运行时点击按钮，浏览器可能不会将重绘按钮按下的 UI 更新任务放入队列，也不会放入由这个按钮启动的 JavaScript 任务。其结果是一个无响应的 UI，表现为“挂起”或“冻结”。

每种浏览器的行为大致相同。当脚本执行时，UI 不随用户交互而更新。此时 JavaScript 任务作为用户交互的结果被创建被放入队列，然后当原始 JavaScript 任务完成时队列中的任务被执行。用户交互导致的 UI更新被自动跳过，因为优先考虑的是页面上的动态部分。因此，当一个脚本运行时点击一个按钮，将看不到它被按下的样子，即使它的 onclick 句柄被执行了。

尽管浏览器尝试在这些情况下做一些符合逻辑的事情，但所有这些行为导致了一个间断的用户体验。因此最好的方法是，通过限制任何 JavaScript 任务在 100 毫秒或更少时间内完成，避免此类情况出现。这种测量应当在你要支持的最慢的浏览器上执行

#### 用定时器让出时间片
尽管你尽了最大努力，还是有一些 JavaScript 任务因为复杂性原因不能在 100 毫秒或更少时间内完成。这种情况下，理想方法是让出对 UI 线程的控制，使 UI 更新可以进行。让出控制意味着停止 JavaScript 运行，给 UI 线程机会进行更新，然后再继续运行 JavaScript。于是 JavaScript 定时器进入了我们的视野。

在 JavaScript 中使用 setTimeout()或 setInterval()创建定时器，两个函数都接收一样的参数：一个要执行的函数，和一个运行它之前的等待时间（单位毫秒）。setTimeout()函数创建一个定时器只运行一次，而setInterval()函数创建一个周期性重复运行的定时器。

定时器与 UI 线程交互的方式有助于分解长运行脚本成为较短的片断。调用 setTimeout()或 setInterval()告诉 JavaScript 引擎等待一定时间然后将 JavaScript 任务添加到 UI 队列中。例如：
```js
function greeting(){
 alert("Hello world!");
}

setTimeout(greeting, 250);
```
此代码将在 250 毫秒之后，向 UI 队列插入一个 JavaScript 任务运行 greeting()函数。在那个点之前，所有其他 UI 更新和 JavaScript 任务都在运行。请记住，第二个参数指出什么时候应当将任务添加到 UI 队列之中，并不是说那时代码将被执行。这个任务必须等到队列中的其他任务都执行之后才能被执行。考虑下面的例子：
```js
var button = document.getElementById("my-button");
button.onclick = function(){
 oneMethod();
 setTimeout(function(){
 document.getElementById("notice").style.color = "red";
 }, 250);
};
```
在这个例子中当按钮被点击时，它调用一个方法然后设置一个定时器。用于修改 notice 元素颜色的代码被包含在一个定时器设备中，将在 250 毫秒之后添加到队列。250 毫秒从调用 setTimeout()时开始计算，而不是从整个函数运行结束时开始计算。如果 setTimeout()在时间点 n 上被调用，那么运行定时器代码的JavaScript 任务将在 n+250 的时刻加入 UI 队列。   

#### 定时器精度
JavaScript 定时器延时往往不准确，快慢大约几毫秒。仅仅因为你指定定时器延时 250 毫秒，并不意味任务将在调用 setTimeout()之后精确的 250 毫秒后加入队列。所有浏览器试图尽可能准确，但通常会发生几毫秒滑移，或快或慢。正因为这个原因，定时器不可用于测量实际时间


