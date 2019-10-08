什么是DOM（ Document Object Model）
DOM定义了表示和修改文档所需的方法。DOM对象即为宿主对象，由浏览器厂商定义，用来操作html和xml功能的一类对象的集合。也有人称DOM是对HTML以及XML的标准编程接口。

#### DOM基本操作
##### 1. 对节点的增删查改
  - 查
    - 查看元素节点
      - document 代表整个文档
      - document.getElementById() // 元素id在ie8以下的浏览器，不区分id大小写，而且也返回匹配name属性的元素
      - getElementsByTagName() // 标签名
      - getElementsByName(); // 需注意，只有部分标签可生效（表单，表单元素，img，iframe）
      - getElementsByClassName() // 类名 ->ie8和ie8以下的ie版本中没有，可以多个class一起
      - querySelector() // css 选择器 在ie7和ie7以下的版本中没有(非实时，得到的是一个副本)
      // document.querySelector('div > span  .demo')
      - querySelectorAll() // css选择器在ie7和ie7以下的版本中没有(非实时，得到的是一个副本)

例：点击不同按钮切换展示不同div
```
<script type="text/javascript">
var btn = document.getElementsByTagName('button');
var div = document.getElementsByClassName('content');
for(var i = 0; i< btn.length; i++) {
  (function(n){
    btn[n].onclick = function(){
      for(var j = 0; j< btn.length; j++) {
        btn[j].className = '';
        btn[j].style.display= 'none';
      }
      this.className = "active";
      div[n].style.display = "block";
    }
  })(i)
}
</script>
```

##### 2. 遍历节点树
  - parentNode -> 父节点（最顶端的parentNode为#document）
  - childNodes -> 子节点们（文本节点、注释节点、元素节点。。。）
  - firstChild -> 第一个子节点
  - lastChild -> 最后一个子节点
  - nextSiblings -> 后一个兄弟节点 
  - previousSiblings ->前一个兄弟节点
> 上面的方法不区分节点类型：包含 文本节点、注释节点、元素节点等各种类型的节点（兼容所有浏览器）

##### 3. 基于 *元素节点* 树遍历
  - parentElement  -> 返回当前元素的父元素节点（IE9以下不兼容）
  - **children**  （常用）-> 只返回当前元素的元素子节点
  - node.childElementCount === node.children.length  -> 当前元素节点的子元素阶段个数（IE不兼容）
  - firstElementChild  -> 返回的是第一个元素节点（IE不兼容）
  - lastElementChild  -> 返回的是最后一个元素节点（IE不兼容）
  - nextElementSibling/previousElementSibling  -> 返回后一个/前一个兄弟元素节点（IE不兼容）

> 部分方法IE9以下不兼容

##### 4. 节点类型
- 元素节点  ------ 1
- 属性节点  ------ 2
- 文本节点  ------ 3
- 注释节点  ------ 8
- document  ------ 9
- DocumentFragment  ------ 11
> 数字对应nodeType 返回值

例如：返回一个节点所有的元素节点
```
function returnElementChild(node) {
  var temp  = { // 定义一个类数组
    length: 0,
    push: Array.prototype.push, // 拥有数组的方法
    splice: Array.prototype.splice // 拥有数组的形式
  }
  var child = node.childNodes, len = child.length
  for(var i = 0; i< len; i++) {
    if(child[i].nodeType === 1) {
      temp.push(child[i])
    }
  }
  return temp;
}
```

##### 5. 节点的四个属性
- nodeName
  元素的标签名，以大写形式表示只读
- nodeValue
  Text节点或Comment节点的文本内容，可读写
- **nodeType**
  该节点的类型，只读
- attributes
  Element节点的属性集合

> 节点的一个方法 Node.hasChildNodes()；// true or false

### DOM 结构树
![DOM结构树.png](https://upload-images.jianshu.io/upload_images/12953648-b17f0a019daf76f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
// document -->HTMLDocument.prototype -->Document.prototype

#### DOM基本操作
- 1. getElementById 方法定义在Document.prototype上，即Element节点上不能使用
- 2. getElementsByName 方法定义在HTMLDocument.prototype上，即非html中的document不能使用（xml document, Element）
- 3. getElementsByTagName方法定义在Document.prototype和Element.prototype上
- 4. HTMLDocument.prototype定义了一些常用的属性，body,head分别指代HTML文档中<body><head>标签
//  document.body  document.head
- 5. Document.prototype上定义了documentElement属性，指代文档的根元素，在HTML文档中，他总是指代<HTML>元素
// document.documentElement -> html
- 6. getElementsByClassName、querySelectorAll、querySelector在Document.prototype，Element.prototype类中均有定义

例：封装函数，返回元素e的第n个兄弟节点，n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0，返回自己
```
function returnSiblings(e, n) {
  while(e && n) {
    if (n>0) {
      e = e.nextElementSibling;
      n--;
    } else 
    {
      e = e.previousElementSibling;
      n++;
    }
  }
  return e;
}
```
> 上面的nextElementSibling/ previousElementSibling有兼容性问题（IE9以下不兼容），考虑用nextSibling可以兼容ie，但是nextsibling返回的不仅仅是元素节点，可能是文本节点，注释节点...

下面兼任处理：
```
function returnSiblings(e, n) {
  while(e && n) {
    if (n>0) {
      if(e.nextElementSibling) {
        e = e.nextElementSibling;
      } else {
        for(e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
      }
      n--;
    } else 
    {
      if(e.previousElementSibling) {
         e = e.previousElementSibling;
      } else {
        for(e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
      }
      n++;
    }
  }
  return e;
}
```

#### DOM基本操作--->增 删 改
- 增
  1. **document.createElement()**; // 创建元素节点
  2. document.createTextNode(); // 创建文本节点
  3. document.createComment();// 创建注释节点
  4. document.createDocumentFragment(); // 创建文档碎片节点
- 插
  1. **parentNode.appendChild()**;
      // 任何一个元素节点都有这个方法，类似数组的push追加一个节点
      // appendChild 是一个剪切操作（如果节点已经存在，则会删除原来的，剪切到新的位置）
  2. parentNode.insertBefore(a, b); // insert a before b， a和b 是并列的
- 删
  1. parent.removeChild(a); // 父节点删除子节点a, 返回被删除的a节点
  2. **child.remove()**; // child删除自己
-替换
  1. parent.replaceChild(new, origin);//拿new替换origin元素，返回origin元素

- Element节点的一些属性
  1. innerHTML ----> 获取/改变一个元素内的html
  2. **innerText**(火狐不兼容)/textContent(老IE不兼容) ----> 获取/改变文本内容（注意：如果元素本身有内容 设置文本内容时会覆盖原来的内容）
- Element节点的一些方法 
  1. ele.setAttribute(attName, attVal)
  2. ele.getAttribute(attName)

如：封装函数insertAfter(); 功能类似insertBefore();(可忽略老版本浏览器)
```
Element.prototype.insertAfter = function(targetNode, afterNode) {
  var beforeNode = afterNode.nextElementSibling;
  if (beforeNode == null) {
    this.appendChild(targetNode);
  }else{
    this.insertBefore(targetNode, beforeNode);
  }
}
```
- 查看滚动条的滚动距离
  1. window.pageXOffset/pageYOfset
      IE8及IE8以下不兼容
  2. document.body/documentElement.scrollLeft/scrollTop
    兼容性比较混乱，用时取两个值相加，因为不可能存在两个同时有值
例：封装兼容性方法，求滚动轮滚动距离getScrollOffset()
```
function getScrollOffset() {
  if(window.pageXOffset) {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    }
  } else {
    retutn {
      x: document.body.scrollLeft + documnet.documentElement.scrollLeft,
      y: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}
```

- 查看可视窗口的尺寸
  - window.innerWith/innerHeight
    - IE及IE8以下不兼容
  - document.documentElement.clientWidth/clientHeight
    - 标准模式下，任意浏览器都兼容
  - document.body.clientWidth/clientHeight
    - 适用于怪异模式下的浏览器
 封装兼容性方法，返回浏览器视口尺寸getViewportOffset()
```javascript
function getViewportOffset() {
  if(window.innerWidth) {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    }
  } else {
    if(document.compatMode === 'BackCompat') { // 怪异模式
      return {
        w: document.body.clientWidth,
        h: document.body.clientHeight
      }
    } else {
      return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
      }
    }
  }
}
```
- 查看元素的几何尺寸
  - domEle.getBoundingClientRect();
  - 兼容性很好
  - 该方法返回一个对象，对象里面有left, top, right, bottom 等属性。left和top代表该元素左上角X和Y坐标，right和bottom代表元素右下角的X和Y坐标
- height和width属性老版本IE并未实现
- 返回的结果并不是“实时的”
```html
<!doctype html>
<html>
	<head></head>
	<body>
		<div style="background: red; width: 100px; height: 100px; left: 100px; top: 100px;position: absolute;"></div>
		<script>
			var div = document.getElementsByTagName('div')[0];
			let box = div.getBoundingClientRect();
			console.log(box);
			div.style.width = "200px";
			console.log(box);
		</script>
	</body>
</html>
```
![image.png](https://upload-images.jianshu.io/upload_images/12953648-820ff0761f2ad16e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 查看元素尺寸
  - dom.offsetWidth, dom.offsetHeight （视觉上的尺寸，包含padding）
- 查看元素的位置
  - dom.offsetLeft, dom.offsetTop
  - 对于无定位父级的元素，返回相对文档的坐标。对于有定位父级的元素，返回相对于最近的有定位的父级的坐标
  - dom.offsetParent
  - 返回最近的有定位的父级，如无，返回body, body.offsetParent 返回null


例： 求任意元素相对于文档的坐标getElementPosition
```
function getElementPosition() {
  
}
```
- 让滚动条滚动
  - window上有三个方法
  - scroll(), scrollTo(), scrollBy();
    scroll和scrollTo 滚动到某个点，多次调用 不能累加
  - 三个方法功能类似，用法都是将x, y 坐标传入。即实现让滚动轮滚动到当前位置
  - 区别：scrollBy() 会在之前的数据基础之上做累加
例： 利用scrollBy()快速阅读的功能
```
var start = document.getElementById('start'); // 开始按钮
var stop = document.getElementById('stop'); // 结束按钮
var timer = 0, key = true;
start.onclick = function() {
   if(key) {
      timer  = setInterval(function(){
       window.scrollBy(0, 10);
      }, 100);
      key = false;
    }
}
stop.onclick = function() {
  clearInterval(timer );
  key = true;
}
```
##### 脚本化CSS
- 读写元素css属性
  - dom.style.prop
    - 可读写行间样式，没有兼容性问题，碰到float这样的保留字属性，前面应加css
    - eg: float -——>cssFloat
    - 复合属性必须拆解，组合单词变成小驼峰式写法
    - 写入的值必须是字符串格式
```
// div.style 获取的是行间样式，即style="width: 100px;height:200px"上的样式, 没写就没有
var div = document.getElementsByTagName('div')[0];
div.style.width = "200px";
div.style.height = "200px";
div.style.backgroundColor = "red"; // 组合单词background-color变成小驼峰式
div.style.borderWidth = "5px" // 符合属性必须拆解（border-width 是border中的一个属性）
// div.style.border = "5px solid black" 现在浏览器也支持这种写法
```
- 查询计算样式
  - window.getComputedStyle(ele, null);
  - 计算样式只读
  - 返回的计算样式的值都是绝对值，没有相对单位
  - IE8及IE8以下不兼容
```
var div = document.getElementsByTagName('div')[0];
var computedStyle = window.getComputedStyle(div, null);
console.log(computedStyle.width);
```
- 查询样式（IE独有的属性）
  - ele.currentStyle
  - 计算样式只读
  - 返回的计算样式的值不是经过转换的绝对值

例：封装兼容性方法getStyle(elem, prop)
```
function getStyle(elem, prop) {
  if(window.getComputedStyle) {
    return window.getComputedStyle(elem, null)[prop];
  } else {
    return elem.currentStyle[prop];
  }
}
```
getComputedStyle的第二个参数，用来获取伪元素的样式表
如获取div伪元素的宽度：
```
// div::after{content:""; width: 50px;height:50px; display:inline-block;}
var div = document.getElementsByTagName('div')[0];
window.getComputedStyle(div, "after").width;
```



