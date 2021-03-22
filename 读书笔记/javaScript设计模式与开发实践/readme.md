## 面向对象的JavaScript

###  1.4.5JavaScript中的原型继承

JavaScript 也同样遵守原型编程的基本规则：

 所有的数据都是对象。  
 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。  
 对象会记住它的原型。  
 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。  

**1. 所有的数据都是对象**    
JavaScript 中的根对象是 Object.prototype 对象。Object.prototype 对象是一个空的对象。我们在 JavaScript 遇到的每个对象，实际上都是从 Object.prototype 对象克隆而来的，Object.prototype 对象就是它们的原型。比如下面的 obj1 对象和 obj2 对象：
```js
var obj1 = new Object(); 
var obj2 = {}; 
// 可以利用 ECMAScript 5 提供的 Object.getPrototypeOf 来查看这两个对象的原型：
console.log( Object.getPrototypeOf( obj1 ) === Object.prototype ); // 输出：true 
console.log( Object.getPrototypeOf( obj2 ) === Object.prototype ); // 输出：true 
```
**2. 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它**    

**3. 对象会记住它的原型**

JavaScript 给对象提供了一个名为__proto__的隐藏属性，某个对象的__proto__属性默认会指向它的构造器的原型对象，即{Constructor}.prototype。在一些浏览器中，__proto__被公开出来，我们可以在 Chrome 或者 Firefox 上用这段代码来验证：
```js
var a = new Object(); 
console.log ( a.__proto__=== Object.prototype ); // 输出：true 
```
**4. 如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型**

虽然 JavaScript 的对象最初都是由 Object.prototype 对象克隆而来的，但对象构造器的原型并不仅限于 Object.prototype 上，而是可以动态指向其他对象。这样一来，当对象 a 需要借用对象 b 的能力时，可以有选择性地把对象 a 的构造器的原型指向对象 b，从而达到继承的效果。下面的代码是我们最常用的原型继承方式：
```js
var obj = { name: 'sven' }; 
var A = function(){}; 
A.prototype = obj; 
var a = new A(); 
console.log( a.name ); // 输出：sven
```
我们来看看执行这段代码的时候，引擎做了哪些事情。    
 首先，尝试遍历对象 a 中的所有属性，但没有找到 name 这个属性。     
 查找 name 属性的这个请求被委托给对象 a 的构造器的原型，它被 a.__proto__ 记录着并且指向 A.prototype，而 A.prototype 被设置为对象 obj。     
 在对象 obj 中找到了 name 属性，并返回它的值    

当我们期望得到一个“类”继承自另外一个“类”的效果时，往往会用下面的代码来模拟实现：

```js
var A = function(){}; 
A.prototype = { name: 'sven' }; 
var B = function(){}; 
B.prototype = new A(); 
var b = new B(); 
console.log( b.name ); // 输出：sven 
```
再看这段代码执行的时候，引擎做了什么事情。    
 首先，尝试遍历对象 b 中的所有属性，但没有找到 name 这个属性。    
 查找 name 属性的请求被委托给对象 b 的构造器的原型，它被 b.__proto__ 记录着并且指向B.prototype，而 B.prototype 被设置为一个通过 new A()创建出来的对象。    
 在该对象中依然没有找到 name 属性，于是请求被继续委托给这个对象构造器的原型A.prototype。    
 在 A.prototype 中找到了 name 属性，并返回它的值。    

和把 B.prototype 直接指向一个字面量对象相比，通过 B.prototype = new A()形成的原型链比之前多了一层。但二者之间没有本质上的区别，都是将对象构造器的原型指向另外一个对象，继承总是发生在对象和对象之间。 

# 2 this、call和apply

## 2.1 this

跟别的语言大相径庭的是，JavaScript 的 this 总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。 

### 2.1.1 this的指向

除去不常用的 with 和 eval 的情况，具体到实际应用中，this 的指向大致可以分为以下 4 种。

 作为对象的方法调用。    
 作为普通函数调用。    
 构造器调用。    
 Function.prototype.call 或 Function.prototype.apply 调用    

下面我们分别进行介绍。

1. 作为对象的方法调用    

当函数作为对象的方法被调用时，this 指向该对象：

```js
var obj = { 
    a: 1, 
    getA: function(){ 
        alert ( this === obj ); // 输出：true 
        alert ( this.a ); // 输出: 1 
    } 
}; 
obj.getA(); 
```

2. 作为普通函数调用

当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的 this 总是指向全局对象。在浏览器的 JavaScript 里，这个全局对象是 window 对象。
```js
window.name = 'globalName'; 
var getName = function(){ 
 return this.name; 
}; 
console.log( getName() ); // 输出：globalName 
```

在 ECMAScript 5 的 strict 模式下，这种情况下的 this 已经被规定为不会指向全局对象，而是 undefined：
```js
function func(){ 
 "use strict" 
 alert ( this ); // 输出：undefined 
} 
func(); 
```

3. 构造器调用   

JavaScript 中没有类，但是可以从构造器中创建对象，同时也提供了 new 运算符，使得构造器看起来更像一个类。

除了宿主提供的一些内置函数，大部分 JavaScript 函数都可以当作构造器使用。构造器的外表跟普通函数一模一样，它们的区别在于被调用的方式。当用 new 运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的 this 就指向返回的这个对象，见如下代码：
```js
var MyClass = function(){ 
 this.name = 'sven'; 
}; 
var obj = new MyClass(); 
alert ( obj.name ); // 输出：sven
```
但用 new 调用构造器时，还要注意一个问题，如果构造器显式地返回了一个 object 类型的对象，那么此次运算结果最终会返回这个对象，而不是我们之前期待的 this：

```js
var MyClass = function(){ 
 this.name = 'sven'; 
 return { // 显式地返回一个对象
 name: 'anne' 
 } 
}; 
var obj = new MyClass(); 
alert ( obj.name ); // 输出：anne 
```
如果构造器不显式地返回任何数据，或者是返回一个非对象类型的数据，就不会造成上述问题：
```js
var MyClass = function(){ 
 this.name = 'sven' 
 return 'anne'; // 返回 string 类型
}; 
var obj = new MyClass(); 
alert ( obj.name ); // 输出：sven 
```

4. Function.prototype.call 或 Function.prototype.apply 调用

跟普通的函数调用相比，用 Function.prototype.call 或 Function.prototype.apply 可以动态地改变传入函数的 this：
```js
var obj1 = { 
 name: 'sven', 
 getName: function(){ 
    return this.name; 
 } 
}; 
var obj2 = { 
 name: 'anne' 
}; 
console.log( obj1.getName() ); // 输出: sven 
console.log( obj1.getName.call( obj2 ) ); // 输出：anne 
```

### 2.1.2 丢失的this

document.getElementById 这个方法名实在有点过长，我们大概尝试过用一个短的函数来代替它，如同 prototype.js 等一些框架所做过的事情：
```js
var getId = function( id ){ 
 return document.getElementById( id ); 
}; 
getId( 'div1' ); 
```
我们也许思考过为什么不能用下面这种更简单的方式：

```js
var getId = document.getElementById; 
getId( 'div1' ); 
```
现在不妨花 1 分钟时间，让这段代码在浏览器中运行一次:
```html
<html> 
 <body> 
 <div id="div1">我是一个 div</div> 
 </body> 
 <script> 
 var getId = document.getElementById; 
 getId( 'div1' ); 
 </script> 
</html> 
```
在 Chrome、Firefox、IE10 中执行过后就会发现，这段代码抛出了一个异常。这是因为许多引擎的 document.getElementById 方法的内部实现中需要用到 this。这个 this 本来被期望指向document，当 getElementById 方法作为 document 对象的属性被调用时，方法内部的 this 确实是指向 document 的。

但当用 getId 来引用 document.getElementById 之后，再调用 getId，此时就成了普通函数调用，函数内部的 this 指向了 window，而不是原来的 document。

我们可以尝试利用 apply 把 document 当作 this 传入 getId 函数，帮助“修正”this：
```js
document.getElementById = (function( func ){ 
 return function(){ 
    return func.apply( document, arguments ); 
 } 
})( document.getElementById ); 
var getId = document.getElementById; 
var div = getId( 'div1' ); 
alert (div.id); // 输出： div1 
```

## 2.2 call和apply 

### 2.2.1 call和apply的区别

Function.prototype.call 和 Function.prototype.apply 都是非常常用的方法。它们的作用一模一样，区别仅在于传入参数形式的不同。

apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数：

```js
var func = function( a, b, c ){ 
 alert ( [ a, b, c ] ); // 输出 [ 1, 2, 3 ] 
}; 
func.apply( null, [ 1, 2, 3 ] ); 
```
在这段代码中，参数 1、2、3 被放在数组中一起传入 func 函数，它们分别对应 func 参数列表中的 a、b、c。

call 传入的参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数：

```js
var func = function( a, b, c ){ 
 alert ( [ a, b, c ] ); // 输出 [ 1, 2, 3 ] 
}; 
func.call( null, 1, 2, 3 ); 
```

当使用 call 或者 apply 的时候，如果我们传入的第一个参数为 null，函数体内的 this 会指向默认的宿主对象，在浏览器中则是 window：

有时候我们使用 call 或者 apply 的目的不在于指定 this 指向，而是另有用途，比如借用其他对象的方法。那么我们可以传入 null 来代替某个具体的对象：
```js
Math.max.apply( null, [ 1, 2, 5, 3, 4 ] ) // 输出：5 
```

### 2.2.2 call和apply的用途

1. 改变 this 指向

call 和 apply 最常见的用途是改变函数内部的 this 指向，我们来看个例子：
```js
var obj1 = { 
    name: 'sven' 
}; 
var obj2 = { 
    name: 'anne' 
}; 
window.name = 'window'; 
var getName = function(){ 
    alert ( this.name ); 
}; 
getName(); // 输出: window 
getName.call( obj1 ); // 输出: sven 
getName.call( obj2 ); // 输出: anne
```

在实际开发中，经常会遇到 this 指向被不经意改变的场景，比如有一个 div 节点，div 节点的 onclick 事件中的 this 本来是指向这个 div 的：
```js
document.getElementById( 'div1' ).onclick = function(){ 
 alert( this.id ); // 输出：div1 
}; 
```
假如该事件函数中有一个内部函数 func，在事件内部调用 func 函数时，func 函数体内的 this就指向了 window，而不是我们预期的 div，见如下代码：

```js
document.getElementById( 'div1' ).onclick = function(){ 
    alert( this.id ); // 输出：div1 
    var func = function(){ 
        alert ( this.id ); // 输出：undefined 
    } 
    func(); 
}; 
```
这时候我们用 call 来修正 func 函数内的 this，使其依然指向 div：
```js
document.getElementById( 'div1' ).onclick = function(){ 
    var func = function(){ 
        alert ( this.id ); // 输出：div1 
    } 
    func.call( this ); 
}; 
```

2. Function.prototype.bind

大部分高级浏览器都实现了内置的 Function.prototype.bind，用来指定函数内部的 this指向，即使没有原生的 Function.prototype.bind 实现，我们来模拟一个也不是难事，代码如下：

```js
Function.prototype.bind = function( context ){ 
    var self = this; // 保存原函数
    return function(){ // 返回一个新的函数
        return self.apply( context, arguments ); // 执行新的函数的时候，会把之前传入的 context 
        // 当作新函数体内的 this 
    } 
}; 
var obj = { 
    name: 'sven' 
}; 
var func = function(){ 
    alert ( this.name ); // 输出：sven 
}.bind( obj); 

func(); 
```

在 Function.prototype.bind 的内部实现中，我们先把 func 函数的引用保存起来，然后返回一个新的函数。当我们在将来执行 func 函数时，实际上先执行的是这个刚刚返回的新函数。在新函数内部，self.apply( context, arguments )这句代码才是执行原来的 func 函数，并且指定 context对象为 func 函数体内的 this。

3. 借用其他对象的方法

借用方法的第一种场景是“借用构造函数”，通过这种技术，可以实现一些类似继承的效果：
```js
var A = function( name ){ 
    this.name = name; 
}; 
var B = function(){ 
    A.apply( this, arguments ); 
}; 
B.prototype.getName = function(){ 
    return this.name; 
}; 
var b = new B( 'sven' ); 
console.log( b.getName() ); // 输出： 'sven' 
```

V8 的引擎源码,以 Array.prototype.push 为例，看看 V8 引擎中的具体实现：
```js
function ArrayPush() { 
    var n = TO_UINT32( this.length ); // 被 push 的对象的 length 
    var m = %_ArgumentsLength(); // push 的参数个数
    for (var i = 0; i < m; i++) { 
        this[ i + n ] = %_Arguments( i ); // 复制元素 (1) 
    }
    this.length = n + m; // 修正 length 属性的值 (2) 
    return this.length; 
}; 
```

通过这段代码可以看到，Array.prototype.push 实际上是一个属性复制的过程，把参数按照下标依次添加到被 push 的对象上面，顺便修改了这个对象的 length 属性。至于被修改的对象是谁，到底是数组还是类数组对象，这一点并不重要

由此可以推断，我们可以把“任意”对象传入 Array.prototype.push：
```js
var a = {}; 
Array.prototype.push.call( a, 'first' ); 
alert ( a.length ); // 输出：1 
alert ( a[ 0 ] ); // first
```
前面我们之所以把“任意”两字加了双引号，是因为可以借用 Array.prototype.push 方法的对象还要满足以下两个条件，从 ArrayPush 函数的(1)处和(2)处也可以猜到，这个对象至少还要满足：

 对象本身要可以存取属性；    

 对象的 length 属性可读写    

对于第一个条件，对象本身存取属性并没有问题，但如果借用 Array.prototype.push 方法的不是一个 object 类型的数据，而是一个 number 类型的数据呢? 我们无法在 number 身上存取其他数据，那么从下面的测试代码可以发现，一个 number 类型的数据不可能借用到 Array.prototype.push 方法：

```js
var a = 1; 
Array.prototype.push.call( a, 'first' ); 
alert ( a.length ); // 输出：undefined 
alert ( a[ 0 ] ); // 输出：undefined 
```
对于第二个条件，函数的 length 属性就是一个只读的属性，表示形参的个数，我们尝试把一个函数当作 this 传入 Array.prototype.push：

```js
var func = function(){}; 
Array.prototype.push.call( func, 'first' ); 
alert ( func.length ); 
// 报错：cannot assign to read only property ‘length’ of function(){}
```

# 3.闭包和高阶函数

### 3.1.2 变量的生存周期

除了变量的作用域之外，另外一个跟闭包有关的概念是变量的生存周期。

```js
var func = function(){ 
    var a = 1; 
    return function(){ 
        a++; 
        alert ( a );
    }
}

var f = func(); 
f(); // 输出：2 
f(); // 输出：3 
f(); // 输出：4 
f(); // 输出：5 

```
当退出函数后，局部变量 a 并没有消失，而是似乎一直在某个地方存活着。这是因为当执行 var f = func();时，f 返回了一个匿名函数的引用，它可以访问到 func()被调用时产生的环境，而局部变量 a 一直处在这个环境里。既然局部变量所在的环境还能被外界访问，这个局部变量就有了不被销毁的理由。在这里产生了一个闭包结构，局部变量的生命看起来被延续了。

### 3.1.3 闭包的更多作用

1. 封装变量

闭包可以帮助把一些不需要暴露在全局的变量封装成“私有变量”。假设有一个计算乘积的简单函数：

```js
var mult = function(){ 
    var a = 1; 
    for ( var i = 0, l = arguments.length; i < l; i++ ){ 
        a = a * arguments[i]; 
    } 
    return a; 
}; 
```

2. 延续局部变量的寿命

### 3.1.4 闭包和面向对象设计

过程与数据的结合是形容面向对象中的“对象”时经常使用的表达。对象以方法的形式包含了过程，而闭包则是在过程中以环境的形式包含了数据。通常用面向对象思想能实现的功能，用闭包也能实现。反之亦然。在 JavaScript 语言的祖先 Scheme 语言中，甚至都没有提供面向对象的原生设计，但可以使用闭包来实现一个完整的面向对象系统。 

下面来看看这段跟闭包相关的代码：
```js
var extent = function(){ 
    var value = 0; 
    return { 
        call: function(){ 
            value++; 
            console.log( value ); 
        } 
    } 
}; 
var extent = extent(); 
extent.call(); // 输出：1 
extent.call(); // 输出：2 
extent.call(); // 输出：3 
```
如果换成面向对象的写法，就是：
```js
var extent = { 
    value: 0, 
    call: function(){ 
        this.value++; 
        console.log( this.value ); 
    } 
}; 
extent.call(); // 输出：1 
extent.call(); // 输出：2 
extent.call(); // 输出：3
```
或
```js

var Extent = function(){ 
    this.value = 0; 
}; 
Extent.prototype.call = function(){ 
    this.value++; 
    console.log( this.value ); 
}; 
var extent = new Extent(); 
extent.call(); 
extent.call(); 
extent.call(); 
```

## 3.2 高阶函数

高阶函数是指至少满足下列条件之一的函数

 函数可以作为参数被传递；    
 函数可以作为返回值输出    

### 3.2.1 函数作为参数传递

把函数当作参数传递，这代表我们可以抽离出一部分容易变化的业务逻辑，把这部分业务逻辑放在函数参数中，这样一来可以分离业务代码中变化与不变的部分。其中一个重要应用场景就是常见的回调函数

1. 回调函数 

2. Array.prototype.sort

Array.prototype.sort 接受一个函数当作参数，这个函数里面封装了数组元素的排序规则。从Array.prototype.sort 的使用可以看到，我们的目的是对数组进行排序，这是不变的部分；而使用什么规则去排序，则是可变的部分。把可变的部分封装在函数参数里，动态传入Array.prototype.sort，使 Array.prototype.sort 方法成为了一个非常灵活的方法，代码如下

```js
//从小到大排列
[ 1, 4, 3 ].sort( function( a, b ){ 
 return a - b;
});
// 输出: [ 1, 3, 4 ] 
//从大到小排列
[ 1, 4, 3 ].sort( function( a, b ){ 
 return b - a; 
}); 
// 输出: [ 4, 3, 1 ] 
```

### 3.2.2 函数作为返回值输出

相比把函数当作参数传递，函数当作返回值输出的应用场景也许更多，也更能体现函数式编程的巧妙。让函数继续返回一个可执行的函数，意味着运算过程是可延续的。

1. 判断数据类型

我们来看看这个例子，判断一个数据是否是数组，在以往的实现中，可以基于鸭子类型的概念来判断，比如判断这个数据有没有 length 属性，有没有 sort 方法或者 slice 方法等。但更好的方式是用 Object.prototype.toString 来计算。Object.prototype.toString.call( obj )返回一个字符串，比如 Object.prototype.toString.call( [1,2,3] ) 总是返回 "[object Array]" ， 而Object.prototype.toString.call( “str”)总是返回"[object String]"。所以我们可以编写一系列的isType 函数。代码如下：

```js
var isString = function( obj ){ 
    return Object.prototype.toString.call( obj ) === '[object String]'; 
}; 
var isArray = function( obj ){ 
    return Object.prototype.toString.call( obj ) === '[object Array]'; 
}; 
var isNumber = function( obj ){ 
    return Object.prototype.toString.call( obj ) === '[object Number]'; 
}; 
```
我们发现，这些函数的大部分实现都是相同的，不同的只是 Object.prototype.toString. call( obj )返回的字符串。为了避免多余的代码，我们尝试把这些字符串作为参数提前值入 isType函数。代码如下：

```js
var isType = function( type ){ 
    return function( obj ){ 
        return Object.prototype.toString.call( obj ) === '[object '+ type +']'; 
    } 
}; 
var isString = isType( 'String' ); 
var isArray = isType( 'Array' ); 
var isNumber = isType( 'Number' ); 

console.log( isArray( [ 1, 2, 3 ] ) ); // 输出：true 
```
我们还可以用循环语句，来批量注册这些 isType 函数：
```js
var Type = {};
for ( var i = 0, type; type = [ 'String', 'Array', 'Number' ][ i++ ]; ){
    (function( type ){
        Type[ 'is' + type ] = function( obj ){
            return Object.prototype.toString.call( obj ) === '[object '+ type +']';
        }
    })(type)
};
Type.isArray( [] ); // 输出：true
Type.isString( "str" ); // 输出：true
```

2. getSingle
下面是一个单例模式的例子，在第三部分设计模式的学习中，我们将进行更深入的讲解，这里暂且只了解其代码实现：

```js
var getSingle = function (fn) {
    var ret;
    return function () {
        return ret || (ret = fn.apply(this, arguments));
    };
};
```
这个高阶函数的例子，既把函数当作参数传递，又让函数执行后返回了另外一个函数。我们可以看看 getSingle 函数的效果：
```js
var getScript = getSingle(function(){ 
    return document.createElement( 'script' ); 
}); 
var script1 = getScript(); 
var script2 = getScript(); 
alert ( script1 === script2 ); // 输出：true 
```

### 3.2.3 高阶函数实现AOP

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。

在 Java 语言中，可以通过反射和动态代理机制来实现 AOP 技术。而在 JavaScript 这种动态语言中，AOP 的实现更加简单，这是 JavaScript 与生俱来的能力。

通常，在 JavaScript 中实现 AOP，都是指把一个函数“动态织入”到另外一个函数之中，具体的实现技术有很多，本节我们通过扩展 Function.prototype 来做到这一点。代码如下：

```js
Function.prototype.before = function( beforefn ){ 
 var __self = this; // 保存原函数的引用
 return function(){ // 返回包含了原函数和新函数的"代理"函数
 beforefn.apply( this, arguments ); // 执行新函数，修正 this 
 return __self.apply( this, arguments ); // 执行原函数
 } 
}; 
Function.prototype.after = function( afterfn ){ 
    var __self = this; 
    return function(){ 
        var ret = __self.apply( this, arguments ); 
        afterfn.apply( this, arguments ); 
        return ret; 
    } 
}; 
var func = function(){ 
    console.log( 2 ); 
}; 
func = func.before(function(){ 
    console.log( 1 ); 
}).after(function(){ 
    console.log( 3 ); 
}); 
func();
// 打印结果： 
//1
//2
//3
```
我们把负责打印数字 1 和打印数字 3 的两个函数通过 AOP 的方式动态植入 func 函数。通过执行上面的代码，我们看到控制台顺利地返回了执行结果 1、2、3。

这种使用 AOP 的方式来给函数添加职责，也是 JavaScript 语言中一种非常特别和巧妙的装饰者模式实现。

### 3.2.4 高阶函数的其它应用  

1. currying 函数柯里化（function curring）

currying 又称部分求值。一个 currying 的函数首先会接受一些参数，接受了这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。

从字面上理解 currying 并不太容易，我们来看下面的例子。

假设我们要编写一个计算每月开销的函数。在每天结束之前，我们都要记录今天花掉了多少钱。代码如下：

```js
var monthlyCost = 0; 
var cost = function( money ){ 
    monthlyCost += money; 
}; 
cost( 100 ); // 第 1 天开销
cost( 200 ); // 第 2 天开销
cost( 300 ); // 第 3 天开销
//cost( 700 ); // 第 30 天开销
alert ( monthlyCost ); // 输出：600
```
通过这段代码可以看到，每天结束后我们都会记录并计算到今天为止花掉的钱。但我们其实并不太关心每天花掉了多少钱，而只想知道到月底的时候会花掉多少钱。也就是说，实际上只需要在月底计算一次。

接下来我们编写一个通用的 function currying(){}，function currying(){}接受一个参数，即将要被 currying 的函数。在这个例子里，这个函数的作用遍历本月每天的开销并求出它们的总和。代码如下：

```js
var currying = function( fn ){ 
    var args = []; 
    return function(){ 
        if ( arguments.length === 0 ){ 
            return fn.apply( this, args ); 
        }else{ 
            [].push.apply( args, arguments ); 
            return arguments.callee; 
        } 
    } 
}; 
var cost = (function(){ 
    var money = 0; 
    return function(){ 
        for ( var i = 0, l = arguments.length; i < l; i++ ){ 
            money += arguments[ i ]; 
        } 
        return money; 
    } 
})(); 
var cost = currying( cost ); // 转化成 currying 函数
cost( 100 ); // 未真正求值
cost( 200 ); // 未真正求值 
cost( 300 ); // 未真正求值
alert ( cost() ); // 求值并输出：600 
```

2. uncurrying

我们常常让类数组对象去借用 Array.prototype 的方法，这是 call 和 apply 最常见的应用场景之一：
```js
(function(){
    Array.prototype.push.call( arguments, 4 ); // arguments 借用 Array.prototype.push 方法
    console.log( arguments ); // 输出：[1, 2, 3, 4] 
})( 1, 2, 3 ); 
```
在我们的预期中，Array.prototype 上的方法原本只能用来操作 array 对象。但用 call 和 apply可以把任意对象当作 this 传入某个方法，这样一来，方法中用到 this 的地方就不再局限于原来规定的对象，而是加以泛化并得到更广的适用性。 

那么有没有办法把泛化 this 的过程提取出来呢？本小节讲述的 uncurrying 就是用来解决这个问题的以下代码是 uncurrying 的实现方式之一：

```js
Function.prototype.uncurrying = function () { 
    var self = this; // self 此时是 Array.prototype.push 
    return function() { 
        var obj = Array.prototype.shift.call( arguments ); 
        return self.apply( obj, arguments ); 
    }; 
}; 
```
在类数组对象 arguments 借用 Array.prototype 的方法之前，先把 Array.prototype.push.call这句代码转换为一个通用的 push 函数： 

```js
var push = Array.prototype.push.uncurrying(); 
(function(){ 
    push( arguments, 4 ); 
    console.log( arguments ); // 输出：[1, 2, 3, 4] 
})( 1, 2, 3 );
```
通过 uncurrying 的方式，Array.prototype.push.call 变成了一个通用的 push 函数。这样一来，push 函数的作用就跟 Array.prototype.push 一样了，同样不仅仅局限于只能操作 array 对象。而对于使用者而言，调用 push 函数的方式也显得更加简洁和意图明了。

我们还可以一次性地把 Array.prototype 上的方法“复制”到 array 对象上，同样这些方法可操作的对象也不仅仅只是 array 对象：

```js
for ( var i = 0, fn, ary = [ 'push', 'shift', 'forEach' ]; fn = ary[ i++ ]; ){
    Array[ fn ] = Array.prototype[ fn ].uncurrying();
}; 
var obj = {
    "length": 3, 
    "0": 1, 
    "1": 2, 
    "2": 3 
};
Array.push( obj, 4 ); // 向对象中添加一个元素
console.log( obj.length ); // 输出：4
var first = Array.shift( obj ); // 截取第一个元素
console.log( first ); // 输出：1
console.log( obj ); // 输出：{0: 2, 1: 3, 2: 4, length: 3}

Array.forEach( obj, function( i, n ){
    console.log( n ); // 分别输出：0, 1, 2
});
```
目前我们已经给出了 Function.prototype.uncurrying 的一种实现。现在来分析调用Array.prototype.push.uncurrying()这句代码时发生了什么事情：
```js
Function.prototype.uncurrying = function () { 
    var self = this; // self 此时是 Array.prototype.push 
    return function() { 
        var obj = Array.prototype.shift.call( arguments ); 
        // obj 是{ 
        // "length": 1, 
        // "0": 1 
        // } 
        // arguments 对象的第一个元素被截去，剩下[2] 
        return self.apply( obj, arguments ); 
        // 相当于 Array.prototype.push.apply( obj, 2 ) 
    }; 
}; 
var push = Array.prototype.push.uncurrying(); 
var obj = { 
 "length": 1, 
 "0": 1 
}; 
push( obj, 2 ); 
console.log( obj ); // 输出：{0: 1, 1: 2, length: 2} 
```
除了刚刚提供的代码实现，下面的代码是 uncurrying 的另外一种实现方式：
```js
Function.prototype.uncurrying = function(){ 
    var self = this; 
    return function(){ 
        return Function.prototype.call.apply( self, arguments ); 
    } 
}; 
```

3. 函数节流

4. 分时函数

5. 惰性加载函数

# 单例模式

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏览器中的 window 对象等。在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。

## 4.1 实现单例模式

要实现一个标准的单例模式并不复杂，无非是用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。代码如下：

```js
var Singleton = function( name ){ 
    this.name = name; 
    this.instance = null; 
}; 
Singleton.prototype.getName = function(){ 
    alert ( this.name ); 
}; 
Singleton.getInstance = function( name ){ 
    if ( !this.instance ){ 
    this.instance = new Singleton( name ); 
    } 
    return this.instance; 
}; 
var a = Singleton.getInstance( 'sven1' ); 
var b = Singleton.getInstance( 'sven2' ); 
console.log(a.name, b.name); // sven1    sven1
alert ( a === b ); // true 
```
我们通过 Singleton.getInstance 来获取 Singleton 类的唯一对象，这种方式相对简单，但有一个问题，就是增加了这个类的“不透明性”，Singleton 类的使用者必须知道这是一个单例类，跟以往通过 new XXX 的方式来获取对象不同，这里偏要使用 Singleton.getInstance 来获取对象

## 4.3 用代理实现单例模式

## 4.4 JavaScript 中的单例模式

作为普通的开发者，我们有必要尽量减少全局变量的使用，即使需要，也要把它的污染降到最低。以下几种方式可以相对降低全局变量带来的命名污染。

1. 使用命名空间

适当地使用命名空间，并不会杜绝全局变量，但可以减少全局变量的数量

2. 使用闭包封装私有变量

这种方法把一些变量封装在闭包的内部，只暴露一些接口跟外界通信：

```js
var user = (function(){ 
    var __name = 'sven', 
    __age = 29; 
    return { 
        getUserInfo: function(){ 
            return __name + '-' + __age; 
        } 
    } 
})(); 
```
我们用下划线来约定私有变量__name 和__age，它们被封装在闭包产生的作用域中，外部是访问不到这两个变量的，这就避免了对全局的命令污染。

## 4.5 惰性单例

惰性单例指的是在需要的时候才创建对象实例。惰性单例是单例模式的重点，这种技术在实际开发中非常有用，有用的程度可能超出了我们的想象，实际上在本章开头就使用过这种技术，instance 实例对象总是在我们调用 Singleton.getInstance 的时候才被创建，而不是在页面加载好的时候就创建，代码如下：

```js
Singleton.getInstance = (function(){ 
    var instance = null; 
    return function( name ){ 
        if ( !instance ){ 
            instance = new Singleton( name );
        } 
        return instance; 
    } 
})(); 
```
不过这是基于“类”的单例模式，前面说过，基于“类”的单例模式在 JavaScript 中并不适用，下面我们将以 WebQQ 的登录浮窗为例，介绍与全局变量结合实现惰性的单例

假设我们是 WebQQ 的开发人员（网址是web.qq.com），当点击左边导航里 QQ 头像时，会弹出一个登录浮窗（如图 4-1 所示），很明显这个浮窗在页面里总是唯一的，不可能出现同时存在两个登录窗口的情况。
![1](./imgs/1.png)

第一种解决方案是在页面加载完成的时候便创建好这个 div 浮窗，这个浮窗一开始肯定是隐藏状态的，当用户点击登录按钮的时候，它才开始显示

这种方式有一个问题，也许我们进入 WebQQ 只是玩玩游戏或者看看天气，根本不需要进行登录操作，因为登录浮窗总是一开始就被创建好，那么很有可能将白白浪费一些 DOM 节点。

我们可以用一个变量来判断是否已经创建过登录浮窗，这也是本节第一段代码中的做法：
```js
var createLoginLayer = (function(){ 
    var div; 
    return function(){ 
        if ( !div ){ 
            div = document.createElement( 'div' ); 
            div.innerHTML = '我是登录浮窗'; 
            div.style.display = 'none'; 
            document.body.appendChild( div ); 
        } 
        return div; 
    } 
})(); 

document.getElementById( 'loginBtn' ).onclick = function(){ 
    var loginLayer = createLoginLayer(); 
    loginLayer.style.display = 'block'; 
};
```

## 4.6 通用的惰性单例

上一节我们完成了一个可用的惰性单例，但是我们发现它还有如下一些问题。

 这段代码仍然是违反单一职责原则的，创建对象和管理单例的逻辑都放在 createLoginLayer对象内部。    
 如果我们下次需要创建页面中唯一的 iframe，或者 script 标签，用来跨域请求数据，就必须得如法炮制，把 createLoginLayer 函数几乎照抄一遍：   
```js
var createIframe= (function(){ 
    var iframe; 
    return function(){ 
        if ( !iframe){ 
            iframe= document.createElement( 'iframe' ); 
            iframe.style.display = 'none'; 
            document.body.appendChild( iframe); 
        } 
        return iframe; 
    } 
})(); 
```

现在我们就把如何管理单例的逻辑从原来的代码中抽离出来，这些逻辑被封装在 getSingle函数内部，创建对象的方法 fn 被当成参数动态传入 getSingle 函数：
```js
var getSingle = function( fn ){ 
    var result; 
    return function(){ 
        return result || ( result = fn .apply(this, arguments ) ); 
    } 
}; 
```
接下来将用于创建登录浮窗的方法用参数 fn 的形式传入 getSingle，我们不仅可以传入createLoginLayer，还能传入 createScript、createIframe、createXhr 等。之后再让 getSingle 返回一个新的函数，并且用一个变量 result 来保存 fn 的计算结果。result 变量因为身在闭包中，它永远不会被销毁。在将来的请求中，如果 result 已经被赋值，那么它将返回这个值。代码如下：
```js
var createLoginLayer = function(){ 
    var div = document.createElement( 'div' ); 
    div.innerHTML = '我是登录浮窗'; 
    div.style.display = 'none'; 
    document.body.appendChild( div ); 
    return div; 
}; 
var createSingleLoginLayer = getSingle( createLoginLayer ); 
document.getElementById( 'loginBtn' ).onclick = function(){ 
    var loginLayer = createSingleLoginLayer(); 
    loginLayer.style.display = 'block'; 
}; 
```
下面我们再试试创建唯一的 iframe 用于动态加载第三方页面：

```js
var createSingleIframe = getSingle( function(){ 
    var iframe = document.createElement ( 'iframe' ); 
    document.body.appendChild( iframe ); 
    return iframe; 
}); 
document.getElementById( 'loginBtn' ).onclick = function(){ 
    var loginLayer = createSingleIframe(); 
    loginLayer.src = 'http://baidu.com'; 
}; 
```
在这个例子中，我们把创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法可以独立变化而互不影响，当它们连接在一起的时候，就完成了创建唯一实例对象的功能，看起来是一件挺奇妙的事情。

# 5. 策略模式

## 5.1 使用策略模式计算奖金

在现实中，很多时候也有多种途径到达同一个目的地。比如我们要去某个地方旅游，可以根据具体的实际情况来选择出行的线路。 

 如果没有时间但是不在乎钱，可以选择坐飞机。    
 如果没有钱，可以选择坐大巴或者火车。    
 如果再穷一点，可以选择骑自行车。    

在程序设计中，我们也常常遇到类似的情况，要实现某一个功能有多种方案可以选择。比如一个压缩文件的程序，既可以选择 zip 算法，也可以选择 gzip 算法

这些算法灵活多样，而且可以随意互相替换。这种解决方案就是本章将要介绍的策略模式。

> 策略模式指的是定义一系列的算法，把它们一个个封装起来。将不变的部分和变化的部分隔开是每个设计模式的主题，策略模式也不例外，策略模式的目的就是将算法的使用与算法的实现分离开来。

```js
var performanceS = function(){}; 
performanceS.prototype.calculate = function( salary ){ 
 return salary * 4; 
}; 
var performanceA = function(){}; 
performanceA.prototype.calculate = function( salary ){ 
 return salary * 3; 
}; 
var performanceB = function(){}; 
performanceB.prototype.calculate = function( salary ){ 
 return salary * 2; 
};
// 接下来定义奖金类 Bonus：
var Bonus = function(){ 
 this.salary = null; // 原始工资
 this.strategy = null; // 绩效等级对应的策略对象
}; 
Bonus.prototype.setSalary = function( salary ){ 
 this.salary = salary; // 设置员工的原始工资
}; 
Bonus.prototype.setStrategy = function( strategy ){ 
 this.strategy = strategy; // 设置员工绩效等级对应的策略对象
}; 
Bonus.prototype.getBonus = function(){ // 取得奖金数额
 return this.strategy.calculate( this.salary ); // 把计算奖金的操作委托给对应的策略对象
}; 

var bonus = new Bonus(); 
bonus.setSalary( 10000 ); 
bonus.setStrategy( new performanceS() ); // 设置策略对象
console.log( bonus.getBonus() ); // 输出：40000 
bonus.setStrategy( new performanceA() ); // 设置策略对象
console.log( bonus.getBonus() ); // 输出：30000 

```

## 5.2 JavaScript 版本的策略模式 

在 5.1 节中，我们让 strategy 对象从各个策略类中创建而来，这是模拟一些传统面向对象语言的实现。实际上在 JavaScript 语言中，函数也是对象，所以更简单和直接的做法是把 strategy直接定义为函数：
```js
var strategies = { 
    "S": function( salary ){ 
        return salary * 4; 
    }, 
    "A": function( salary ){ 
        return salary * 3; 
    }, 
    "B": function( salary ){ 
        return salary * 2; 
    } 
}; 

var calculateBonus = function( level, salary ){ 
    return strategies[ level ]( salary ); 
}; 
console.log( calculateBonus( 'S', 20000 ) ); // 输出：80000 
console.log( calculateBonus( 'A', 10000 ) ); // 输出：30000
```

## 5.3 多态在策略模式中的体现

## 5.4 使用策略模式实现缓动动画

在实现完整的功能之前，我们先了解一些常见的缓动算法，这些算法最初来自 Flash，但可以非常方便地移植到其他语言中。

这些算法都接受 4 个参数，这 4 个参数的含义分别是动画已消耗的时间、小球原始位置、小球目标位置、动画持续的总时间，返回的值则是动画元素应该处在的当前位置。代码如下：

```js
var tween = { 
    linear: function( t, b, c, d ){ 
        return c*t/d + b; 
    }, 
    easeIn: function( t, b, c, d ){ 
        return c * ( t /= d ) * t + b; 
    }, 
    strongEaseIn: function(t, b, c, d){ 
        return c * ( t /= d ) * t * t * t * t + b; 
    }, 
    strongEaseOut: function(t, b, c, d){ 
        return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b; 
    }, 
    sineaseIn: function( t, b, c, d ){ 
        return c * ( t /= d) * t * t + b; 
    }, 
    sineaseOut: function(t,b,c,d){ 
        return c * ( ( t = t / d - 1) * t * t + 1 ) + b; 
    } 
}; 
```

## 5.6 表单校验

### 5.6.1 表单校验的第一个版本

现在编写表单校验的第一个版本，可以提前透露的是，目前我们还没有引入策略模式。代码如下：

```html
<html> 
    <body> 
        <form action="http:// xxx.com/register" id="registerForm" method="post"> 
            请输入用户名：<input type="text" name="userName"/ > 
            请输入密码：<input type="text" name="password"/ > 
            请输入手机号码：<input type="text" name="phoneNumber"/ > 
            <button>提交</button> 
        </form> 
        <script> 
            var registerForm = document.getElementById( 'registerForm' ); 
            registerForm.onsubmit = function(){ 
                if ( registerForm.userName.value === '' ){ 
                    alert ( '用户名不能为空' ); 
                    return false; 
                } 
                if ( registerForm.password.value.length < 6 ){ 
                    alert ( '密码长度不能少于 6 位' ); 
                    return false; 
                } 
                if ( !/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value ) ){ 
                    alert ( '手机号码格式不正确' ); 
                    return false; 
                } 
            } 
        </script> 
    </body> 
</html> 
```
这是一种很常见的代码编写方式，它的缺点跟计算奖金的最初版本一模一样。    

 registerForm.onsubmit 函数比较庞大，包含了很多 if-else 语句，这些语句需要覆盖所有的校验规则。    
 registerForm.onsubmit 函数缺乏弹性，如果增加了一种新的校验规则，或者想把密码的长度校验从 6 改成 8，我们都必须深入 registerForm.onsubmit 函数的内部实现，这是违反开放—封闭原则的。    
 算法的复用性差，如果在程序中增加了另外一个表单，这个表单也需要进行一些类似的校验，那我们很可能将这些校验逻辑复制得漫天遍野。    

### 5.6.2 用策略模式重构表单校验

下面我们将用策略模式来重构表单校验的代码，很显然第一步我们要把这些校验逻辑都封装成策略对象：
```js
var strategies = { 
    isNonEmpty: function( value, errorMsg ){ // 不为空
        if ( value === '' ){ 
            return errorMsg ; 
        } 
    }, 
    minLength: function( value, length, errorMsg ){ // 限制最小长度
        if ( value.length < length ){ 
            return errorMsg; 
        } 
    }, 
    isMobile: function( value, errorMsg ){ // 手机号码格式
        if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){ 
            return errorMsg; 
        } 
    } 
};
```
接下来我们准备实现 Validator 类。Validator 类在这里作为 Context，负责接收用户的请求并委托给 strategy 对象。在给出 Validator 类的代码之前，有必要提前了解用户是如何向 Validator类发送请求的，这有助于我们知道如何去编写 Validator 类的代码。代码如下：
```js
var validataFunc = function(){ 
    var validator = new Validator(); // 创建一个 validator 对象
    /***************添加一些校验规则****************/ 
    validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' ); 
    validator.add( registerForm.password, 'minLength:6', '密码长度不能少于 6 位' ); 
    validator.add( registerForm.phoneNumber, 'isMobile', '手机号码格式不正确' ); 
    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
} 
var registerForm = document.getElementById( 'registerForm' ); 
registerForm.onsubmit = function(){ 
    var errorMsg = validataFunc(); // 如果 errorMsg 有确切的返回值，说明未通过校验
    if ( errorMsg ){ 
        alert ( errorMsg ); 
        return false; // 阻止表单提交
    } 
}; 
```
从这段代码中可以看到，我们先创建了一个 validator 对象，然后通过 validator.add 方法，往 validator 对象中添加一些校验规则。validator.add 方法接受 3 个参数，以下面这句代码说明：

```js
validator.add( registerForm.password, 'minLength:6', '密码长度不能少于 6 位' ); 
```

 registerForm.password 为参与校验的 input 输入框。     

 'minLength:6'是一个以冒号隔开的字符串。冒号前面的minLength代表客户挑选的strategy对象，冒号后面的数字 6 表示在校验过程中所必需的一些参数。'minLength:6'的意思就是校验 registerForm.password 这个文本输入框的 value 最小长度为 6。如果这个字符串中不包含冒号，说明校验过程中不需要额外的参数信息，比如'isNonEmpty'。     

 第 3 个参数是当校验未通过时返回的错误信息。     

当我们往 validator 对象里添加完一系列的校验规则之后，会调用 validator.start()方法来启动校验。如果 validator.start()返回了一个确切的 errorMsg 字符串当作返回值，说明该次校验没有通过，此时需让 registerForm.onsubmit 方法返回 false 来阻止表单的提交。

最后是 Validator 类的实现

```js
var Validator = function(){ 
    this.cache = []; // 保存校验规则
}; 
Validator.prototype.add = function( dom, rule, errorMsg ){ 
    var ary = rule.split( ':' ); // 把 strategy 和参数分开
    this.cache.push(function(){ // 把校验的步骤用空函数包装起来，并且放入 cache 
        var strategy = ary.shift(); // 用户挑选的 strategy 
        ary.unshift( dom.value ); // 把 input 的 value 添加进参数列表
        ary.push( errorMsg ); // 把 errorMsg 添加进参数列表
        return strategies[ strategy ].apply( dom, ary ); 
    }); 
}; 

Validator.prototype.start = function(){ 
    for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){ 
        var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
        if ( msg ){ // 如果有确切的返回值，说明校验没有通过
            return msg; 
        } 
    } 
}; 
```

### 5.6.3 给某个文本输入框添加多种校验规则

如果我们既想校验它是否为空，又想校验它输入文本的长度不小于 10 呢？我们期望以这样的形式进行校验：

```js
validator.add(registerForm.userName, [{ 
    strategy: 'isNonEmpty', 
    errorMsg: '用户名不能为空'
}, { 
    strategy: 'minLength:6', 
    errorMsg: '用户名长度不能小于 10 位' 
}] 
); 
```
下面提供的代码可用于一个文本输入框对应多种校验规则：
```html
<html> 
    <body> 
        <form action="http:// xxx.com/register" id="registerForm" method="post"> 
            请输入用户名：<input type="text" name="userName"/ > 
            请输入密码：<input type="text" name="password"/ > 
            请输入手机号码：<input type="text" name="phoneNumber"/ > 
            <button>提交</button> 
        </form> 
        <script> 
            /***********************策略对象**************************/ 
            var strategies = { 
                isNonEmpty: function( value, errorMsg ){ 
                    if ( value === '' ){ 
                        return errorMsg; 
                    } 
                }, 
                minLength: function( value, length, errorMsg ){ 
                    if ( value.length < length ){ 
                        return errorMsg; 
                    } 
                }, 
                isMobile: function( value, errorMsg ){ 
                    if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){ 
                        return errorMsg; 
                    } 
                } 
            }; 
            /***********************Validator 类**************************/ 
            var Validator = function(){ 
                this.cache = []; 
            }; 
            Validator.prototype.add = function( dom, rules ){ 
                var self = this; 
                for ( var i = 0, rule; rule = rules[ i++ ]; ){ 
                    (function( rule ){ 
                        var strategyAry = rule.strategy.split( ':' ); 
                        var errorMsg = rule.errorMsg; 
                        self.cache.push(function(){ 
                            var strategy = strategyAry.shift(); 
                            strategyAry.unshift( dom.value ); 
                            strategyAry.push( errorMsg ); 
                            return strategies[ strategy ].apply( dom, strategyAry ); 
                        }); 
                    })( rule ) 
                } 
            }; 
            Validator.prototype.start = function(){ 
                for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){ 
                    var errorMsg = validatorFunc(); 
                    if ( errorMsg ){ 
                        return errorMsg; 
                    } 
                } 
            }; 
            /***********************客户调用代码**************************/ 
            var registerForm = document.getElementById( 'registerForm' ); 
            var validataFunc = function(){ 
                    var validator = new Validator(); 
                    validator.add( registerForm.userName, [{ 
                    strategy: 'isNonEmpty', 
                    errorMsg: '用户名不能为空' 
                }, { 
                strategy: 'minLength:6', 
                errorMsg: '用户名长度不能小于 10 位' 
                }]); 
                validator.add( registerForm.password, [{ 
                    strategy: 'minLength:6', 
                    errorMsg: '密码长度不能小于 6 位' 
                }]); 
                validator.add( registerForm.phoneNumber, [{ 
                    strategy: 'isMobile', 
                    errorMsg: '手机号码格式不正确' 
                }]); 
                var errorMsg = validator.start(); 
                return errorMsg; 
            } 
            registerForm.onsubmit = function(){ 
                var errorMsg = validataFunc(); 
                if ( errorMsg ){ 
                    alert ( errorMsg ); 
                    return false; 
                } 
            };
        </script> 
    </body> 
</html> 
```


















