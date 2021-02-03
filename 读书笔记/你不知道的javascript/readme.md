## 编译原理

尽管通常将 Javascript 归类为“动态”或“解释执行”语言，但事实上它是一门编译语言。

传统的编译语言的流程中，程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。

- 分词/词法分析（Tokenizing/Leing）

这个过程会将由字符组成的字符串分解成（对编程语言来说）有意义的代码块，这些代码块被称为词法单元（token）。例如，考虑程序 var a = 2;。这段程序通常会被分解成为下面这些词法单元：var、a、=、2 、;。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。

- 解析/语法分析（Parsing）

这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”（Abstract Syntax Tree，AST）。var a = 2; 的抽象语法树中可能会有一个叫作 VariableDeclaration 的顶级节点，接下来是一个叫作 Identifier（它的值是 a）的子节点，以及一个叫作 AssignmentExpression 的子节点。AssignmentExpression 节点有一个叫作 NumericLiteral（它的值是 2）的子节点。

- 代码生成

AST 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息息相关。  
抛开具体细节，简单来说就是有某种方法可以将 var a = 2; 的 AST 转化为一组机器指令，用来创建一个叫作 a 的变量（包括分配内存等），并将一个值储存在 a 中。

我们习惯将 var a = 2; 看作一个声明，而实际上 JavaScript 引擎并不这么认为。它将 var a 和 a = 2 当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。

这意味着无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。可以将这个过程形象地想象成所有的声明（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为提升。

声明本身会被提升，而包括函数表达式的赋值在内的赋值操作并不会提升。

```js
foo();

var foo = function bar() {
  console.log("1");
};
```

**函数声明和变量声明都会被提升。但是一个值得注意的细节是函数会首先被提升，然后才是变量。**

闭包的使用场景：

```js
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz(); // 2 —— 朋友，这就是闭包的效果。
```

这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。

当然，无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包。

```js
function foo() {
  var a = 2;
  function baz() {
    console.log(a); // 2
  }
  bar(baz);
}
function bar(fn) {
  fn(); // 妈妈快看呀，这就是闭包！
}
```

传递函数当然也可以是间接的

```js
var fn;
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  fn = baz; // 将 baz 分配给全局变量
}
function bar() {
  fn(); // 妈妈快看呀，这就是闭包！
}
foo();
bar(); // 2
```

无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

### 现代的模块机制

```js
var MyModules = (function Manager() {
  var modules = {};

  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }

  function get(name) {
    return modules[name];
  }

  return {
    define,
    get,
  };
})();
```

这段代码的核心是 modules[name] = impl.apply(impl, deps)。为了模块的定义引入了包装函数（可以传入任何依赖），并且将返回值，也就是模块的 API，储存在一个根据名字来管理的模块列表中

```js
MyModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }
  return {
    hello: hello,
  };
});

MyModules.define("foo", ["bar"], function (bar) {
  var hungry = "hippo";
  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }
  return {
    awesome: awesome,
  };
});
var bar = MyModules.get("bar");
var foo = MyModules.get("foo");
console.log(bar.hello("hippo")); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO
```

```
当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包
```

模块有两个主要特征：（1）为创建内部作用域而调用了一个包装函数；（2）包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包。

this 在任何情况下都不指向函数的词法作用域

call(..) 和 apply(..) 方法

它们的第一个参数是一个对象，它们会把这个对象绑定到 this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此我们称之为显式绑定。

```
如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者new Number(..)）。这通常被称为“装箱”。
```

包括内置对象函数（比如：Number）在内的所有函数都可以用 new 来调用，这种函数调用被称为构造函数调用。这里有一个重要但是非常细微的区别：实际上并不存在所谓的构造函数，只有对于函数的构造调用。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个全新的对象
2. 这个新对象会被执行[[原型]]连接
3. 这个新对象会绑定到函数调用的 this
4. 如果函数没有返回其它对象，那么 new 表达式中的函数调用会自动返回这个新对象。

使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定

### 判断 this

现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的顺序来进行判断：

1. 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。

var bar = new foo()

2. 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。

var bar = foo.call(obj2)

3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。

var bar = obj1.foo()

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。

就是这样。对于正常的函数调用来说，理解了这些知识你就可以明白 this 的绑定原理了。

不过……凡事总有例外

### 软绑定

如果可以给默认绑定指定一个全局对象和 undefined 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力

可以通过一种被称为软绑定的方法来实现我们想要的效果：

```js
if (!Function.prototype.softbind) {
  Function.prototype.softbind = function (obj) {
    var fn = this;
    // 补货所有参数
    var curried = [].slice.call(arguments, 1);
    var bound = function () {
      return fn.apply(
        !this || this === (window || global) ? obj : this,
        curried.concat.apply(curried, arguments)
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
```

下面我们看看 softBind 是否实现了软绑定功能：

```js
function foo() {
  console.log("name: " + this.name);
}

var obj = { name: "obj" },
  obj2 = { name: "obj2" },
  obj3 = { name: "obj3" };
var fooOBJ = foo.softbind(obj);
fooOBJ(); // name: obj
obj2.foo = foo.softbind(obj);
obj2.foo(); // name: obj2 <---- 看！！！
fooOBJ.call(obj3); // name: obj3 <---- 看！
setTimeout(obj2.foo, 10);
// name: obj <---- 应用了软绑定
```

可以看到，软绑定版本的 foo() 可以手动将 this 绑定到 obj2 或者 obj3 上，但如果应用默认绑定，则会将 this 绑定到 obj。

箭头函数不使用 this 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 this

## 对象

javascript 中一共有七种内置类型：

- string（字符串）
- number（数字）
- boolean（布尔值）
- null（空值）
- undefined（未定义）
- object（对象）
- symbol（ES6 中新增）

```
注意，简单基本类型（string、boolean、number、null 和 undefined）本身并不是对象。null 有时会被当作一种对象类型，但是这其实只是语言本身的一个 bug，即对 null 执行typeof null 时会返回字符串 "object"。1 实际上，null 本身是基本类型
```

```js
typeof undefined === "undefined"; // true
typeof true === "boolean"; // true
typeof 42 === "number"; // true
typeof "42" === "string"; // true
typeof { life: 42 } === "object"; // true
// ES6中新加入的类型
typeof Symbol() === "symbol"; // true

typeof null === "object"; // true

typeof function a(){ /* .. */ } === "function"; // true

```

我们需要使用复合条件来检测 null 值的类型：

```js
var a = null;
!a && typeof a === "object"; // true
```

内置对象

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error

### 对象-属性描述符

1. writable

writable 决定是否可以修改属性的值

```js
var myObject = {};
Object.defineProperty(myObject, "a", {
  value: 2,
  writable: false, // 不可写！
  configurable: true,
  enumerable: true,
});
myObject.a = 3;
myObject.a; // 2
```

```
可以把 writable:false 看作是属性不可改变，相当于你定义了一个空操作 setter。严格来说，如果要和 writable:false 一致的话，你的 setter 被调用时应当抛出一个 TypeError错误
```

2. configurable

只要属性是可配置的，就可以使用 defineProperty(..) 方法来修改属性描述符：

```js
var myObject = {
  a: 2,
};
myObject.a = 3;
myObject.a; // 3
Object.defineProperty(myObject, "a", {
  value: 4,
  writable: true,
  configurable: false, // 不可配置！
  enumerable: true,
});
myObject.a; // 4
myObject.a = 5;
myObject.a; // 5
Object.defineProperty(myObject, "a", {
  value: 6,
  writable: true,
  configurable: true,
  enumerable: true,
}); // TypeError
```

最后一个 defineProperty(..) 会产生一个 TypeError 错误，不管是不是处于严格模式，尝试修改一个不可配置的属性描述符都会出错。注意：如你所见，把 configurable 修改成 false 是单向操作，无法撤销！

除了无法修改，configurable:false 还会禁止删除这个属性：

```js
var myObject = {
  a: 2,
};
myObject.a; // 2
delete myObject.a;
myObject.a; // undefined
Object.defineProperty(myObject, "a", {
  value: 2,
  writable: true,
  configurable: false,
  enumerable: true,
});
myObject.a; // 2
delete myObject.a;
myObject.a; // 2
```

3. enumerable

这个描述符控制的是属性是否会出现在对象的属性枚举中，比如说 for..in 循环。如果把 enumerable 设置成 false，这个属性就不会出现在枚举中，虽然仍然可以正常访问它。相对地，设置成 true 就会让它出现在枚举中。

```js
var myObject = {};
Object.defineProperty(
  myObject,
  "a",
  // 让 a 像普通属性一样可以枚举
  { enumerable: true, value: 2 }
);
Object.defineProperty(
  myObject,
  "b",
  // 让 b 不可枚举
  { enumerable: false, value: 3 }
);
myObject.b; // 3
"b" in myObject; // true
myObject.hasOwnProperty("b"); // true
// .......
for (var k in myObject) {
  console.log(k, myObject[k]);
}
// "a" 2
```

4. getter 和 setter

对象默认的 [[Put]] 和 [[Get]] 操作分别可以控制属性值的设置和获取。

在 ES5 中可以使用 getter 和 setter 部分改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上。getter 是一个隐藏函数，会在获取属性值时调用。setter 也是一个隐藏函数，会在设置属性值时调用。

通常来说 getter 和 setter 是成对出现的（只定义一个的话通常会产生意料之外的行为）

```js
var myObject = {
  // 给 a 定义一个 getter
  get a() {
    return this._a_;
  },
  // 给 a 定义一个 setter
  set a(val) {
    this._a_ = val * 2;
  },
};
myObject.a = 2;
myObject.a; // 4
```

### 不变性

1. 对象常量

结合 writable:false 和 configurable:false 就可以创建一个真正的常量属性（不可修改、重定义或者删除）：

```js
var myObject = {};
Object.defineProperty(myObject, "FAVORITE_NUMBER", {
  value: 42,
  writable: false,
  configurable: false,
});
```

2. 禁止扩展  
   如果你想禁止一个对象添加新属性并且保留已有属性，可以使用 Object.preventExtensions(..)

```js
var myObject = {
  a: 2,
};
Object.preventExtensions(myObject);
myObject.b = 3;
myObject.b; // undefined
```

在非严格模式下，创建属性 b 会静默失败。在严格模式下，将会抛出 TypeError 错误。

3. 密封

Object.seal(..) 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用 Object.preventExtensions(..) 并把所有现有属性标记为 configurable:false。

所以，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性（**虽然可以修改属性的值**）。

4. 冻结  
   Object.freeze(..) 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用 Object.seal(..) 并把所有“数据访问”属性标记为 writable:false，这样就**无法修改它们的值**

这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意直接属性的修改（不过就像我们之前说过的，这个对象引用的其他对象是不受影响的）。

你可以“深度冻结”一个对象，具体方法为，首先在这个对象上调用 Object.freeze(..)，然后遍历它引用的所有对象并在这些对象上调用 Object.freeze(..)。但是一定要小心，因为这样做有可能会在无意中冻结其他（共享）对象

### 存在性

in 操作符会检查属性是否在对象及其 [[Prototype]] 原型链中。相比之下，hasOwnProperty(..) 只会检查属性是否在 myObject 对象中，不会检查 [[Prototype]] 链。

```js
var myObject = {
  a: 2,
};
"a" in myObject; // true
"b" in myObject; // false
"toString" in myObject; // true
myObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("b"); // false
myObject.hasOwnProperty("toString"); // false
```

### 遍历

**for..in** 循环可以用来遍历对象的可枚举属性列表（包括 [[Prototype]] 链）。

ES5 中增加了一些数组的辅助迭代器，包括 forEach(..)、every(..) 和 some(..)。每种辅助迭代器都可以接受一个回调函数并把它应用到数组的每个元素上，唯一的区别就是它们对于回调函数返回值的处理方式不同

- forEach(..) 会遍历数组中的所有值并忽略回调函数的返回值。

- every(..) 会一直运行直到回调函数返回 false（或者“假”值）

- some(..) 会一直运行直到回调函数返回 true（或者“真”值）

```
every(..) 和 some(..) 中特殊的返回值和普通 for 循环中的 break 语句类似，它们会提前终止遍历。
```

如何直接遍历值而不是数组下标（或者对象属性）, ES6 增加了一种用来遍历数组的 **for..of** 循环语法（如果对象本身定义了迭代器的话也可以遍历对象）：

```js
var myArray = [{ a: 1 }, { a: 2 }, { a: 3 }];
for (var v of myArray) {
  console.log(v);
}
// {a: 1}
// {a: 2}
// {a: 3}
```

## 原型

### Object.prototype

所有普通的 [[Prototype]] 链最终都会指向内置的 Object.prototype

```js
myObject.foo = "bar";
```

下面我们分析一下如果 foo 不直接存在于 myObject 中而是存在于原型链上层时会出现的三种情况：

```
1. 如果在 [[Prototype]] 链上层存在名为 foo 的普通数据访问属性并且没有被标记为只读（writable:false），那就会直接在 myObject 中添加一个名为 foo 的新属性，它是屏蔽属性。

2. 如果在 [[Prototype]] 链上层存在 foo，但是它被标记为只读（writable:false），那么无法修改已有属性或者在 myObject 上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。

3. 如果在 [[Prototype]] 链上层存在 foo 并且它是一个 setter，那就一定会调用这个 setter。foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义 foo 这个 setter。

如果你希望在第二种和第三种情况下也屏蔽 foo，那就不能使用 = 操作符来赋值，而是使用 Object.defineProperty(..)来向 myObject 添加 foo
```

有些情况下会隐式产生屏蔽

```js
var anotherObject = {
  a: 2,
};
var myObject = Object.create(anotherObject);
anotherObject.a; // 2
myObject.a; // 2
anotherObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("a"); // false
myObject.a++; // -------隐式屏蔽--------！
anotherObject.a; // 2
myObject.a; // 3
myObject.hasOwnProperty("a"); // true
```

尽管 myObject.a++ 看起来应该（通过委托）查找并增加 anotherObject.a 属性，但是别忘了 ++ 操作相当于 myObject.a = myObject.a + 1。因此 ++ 操作首先会通过 [[Prototype]]查找属性 a 并从 anotherObject.a 获取当前属性值 2，然后给这个值加 1，接着用 [[Put]]将值 3 赋给 myObject 中新建的屏蔽属性 a

修改委托属性时一定要小心。如果想让 anotherObject.a 的值增加，唯一的办法是 anotherObject.a++

所有的函数默认都会拥有一个名为 prototype 的公有并且不可枚举的属性，它会指向另一个对象：

```js
function Foo() {
  // ...
}
var a = new Foo();

Object.getPrototypeOf(a) === Foo.prototype; // true
```

这个对象通常被称为 Foo 的原型，因为我们通过名为 Foo.prototype 的属性引用来访问它。

### 对象关联

[[Prototype]] 机制就是存在于对象中的一个内部链接，它会引用其他对象

通常来说，这个链接的作用是：如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在 [[Prototype]] 关联的对象上进行查找。同理，如果在后者中也没有找到需要的引用就会继续查找它的 [[Prototype]]，以此类推。这一系列对象的链接被称为“原型链”。

**创建关联**

```js
var foo = {
  something: function () {
    console.log("Tell me something good....");
  },
};

var bar = Object.create(foo);

bar.something(); // Tell me something good....
```

Object.create(..) 会创建一个新对象（bar）并把它关联到我们指定的对象（foo），这样我们就可以充分发挥 [[Prototype]] 机制的威力（委托）并且避免不必要的麻烦（比如使用 new 的构造函数调用会生成 .prototype 和 .constructor 引用）。

```
Object.create(null) 会 创 建 一 个 拥 有 空（ 或 者 说 null）[[Prototype]]链接的对象，这个对象无法进行委托。由于这个对象没有原型链，所以instanceof 操作符（之前解释过）无法进行判断，因此总是会返回 false。这些特殊的空 [[Prototype]] 对象通常被称作“字典”，它们完全不会受到原型链的干扰，因此非常适合用来存储数据。
```

我们并不需要类来创建两个对象之间的关系，只需要通过委托来关联对象就足够了。而 Object.create(..) 不包含任何“类的诡计”，所以它可以完美地创建我们想要的关联关系。

Object.create()得 polyfill 代码

```js
if (!Object.create) {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
```

## 数字值   

### 较小的值   

二进制浮点数最大的问题（不仅 JavaScript，所有遵循 IEEE 754 规范的语言都是如此），是会出现如下情况：
```js
0.1 + 0.2 === 0.3; // false
```

简单来说，二进制浮点数中的 0.1 和 0.2 并不是十分精确，它们相加的结果并非刚好等于0.3，而是一个比较接近的数字 0.30000000000000004，所以条件判断结果为 false。

在处理带有小数的数字时需要特别注意。很多（也许是绝大多数）程序只需要处理整数，最大不超过百万或者万亿，此时使用 JavaScript 的数字类型是绝对安全的。

那么应该怎样来判断 0.1 + 0.2 和 0.3 是否相等呢？   

最常见的方法是设置一个误差范围值，通常称为“机器精度”（machine epsilon），对JavaScript 的数字来说，这个值通常是 2^-52 (2.220446049250313e-16)。    

从 ES6 开始，该值定义在 Number.EPSILON 中，我们可以直接拿来用，也可以为 ES6 之前的版本写 polyfill：   
```js
if (!Number.EPSILON) {
 Number.EPSILON = Math.pow(2,-52);
}
```
可以使用 Number.EPSILON 来比较两个数字是否相等（在指定的误差范围内）：

```js
function numbersCloseEnoughToEqual(n1,n2) {
 return Math.abs( n1 - n2 ) < Number.EPSILON;
}
var a = 0.1 + 0.2;
var b = 0.3;
numbersCloseEnoughToEqual( a, b ); // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 ); // false
```
能够呈现的最大浮点数大约是 1.798e+308（这是一个相当大的数字），它定义在 Number.MAX_VALUE 中。最小浮点数定义在 Number.MIN_VALUE 中，大约是 5e-324，它不是负数，但无限接近于 0 ！

### 整数的安全范围    

数字的呈现方式决定了“整数”的安全值范围远远小于 Number.MAX_VALUE。

能够被“安全”呈现的最大整数是 2^53 - 1，即 9007199254740991，在 ES6 中被定义为Number.MAX_SAFE_INTEGER。最小整数是 -9007199254740991，在 ES6 中被定义为 Number.MIN_SAFE_INTEGER。   

有时 JavaScript 程序需要处理一些比较大的数字，如数据库中的 64 位 ID 等。由于JavaScript 的数字类型无法精确呈现 64 位数值，所以必须将它们保存（转换）为字符串。   

### 特殊数值   

JavaScript 数据类型中有几个特殊的值需要开发人员特别注意和小心使用。  

**不是值得值**   

undefined 类型只有一个值，即 undefined。null 类型也只有一个值，即 null。它们的名称既是类型也是值   
undefined 和 null 常被用来表示“空的”值或“不是值”的值。二者之间有一些细微的差别。例如：  
-  null 指空值（empty value）
-  undefined 指没有值（missing value）

或者   
- undefined 指从未赋值
- null 指曾赋过值，但是目前没有值  

null 是一个特殊关键字，不是标识符，我们不能将其当作变量来使用和赋值。然而undefined 却是一个标识符，可以被当作变量来使用和赋值。   

**void 运算符**   

表达式 void ___ 没有返回值，因此返回结果是 undefined。void 并不改变表达式的结果，只是让表达式不返回值

```js
var a = 42;
console.log( void a, a ); // undefined 42
```

**不是数字得数字(NAN)**   
如果数学运算的操作数不是数字类型（或者无法解析为常规的十进制或十六进制数字），就无法返回一个有效的数字，这种情况下返回值为 NaN。   

NaN 意指“不是一个数字”（not a number），这个名字容易引起误会，后面将会提到。将它理解为“无效数值”“失败数值”或者“坏数值”可能更准确些。

```js
var a = 2 / "foo"; // NaN
typeof a === "number"; // true
```
NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

NaN 是一个特殊值，它和自身不相等，是唯一一个非自反（自反，reflexive，即 x === x 不成立）的值。而 NaN != NaN 为 true，很奇怪吧？

```
NaN 是 JavaScript 中唯一一个不等于自身的值
```

**无穷数（Infinity/-Infinity）**    
```js
var a = 1 / 0 ;
```

JavaScript 中上例的结果为 Infinity（即 Number.POSITIVE_INfiNITY）。同样：

```js
var a = 1 / 0; // Infinity
var b = -1 / 0; // -Infinity  如果除法运算中的一个操作数为负数，则结果为-Infinity（即 Number.NEGATIVE_INfiNITY）。
```

- Number.isInteger 要检测一个值是否是整数
- Number.isNaN(..)  来判断一个值是否是 NaN