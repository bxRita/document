## 简介
TypeScript是一种由微软开发的自由和开源编程语言。它是JavaScript的一个超级，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。     

### 为什么选择TypeScript
[TypeScript 官网](http://www.typescriptlang.org/)
- TypeScript 增加了代码的可读性和可维护性
    + 类型系统实际上是最好的文档，大部分的函数看看类型的定义就知道如何使用了
    + 可以在编译阶段就发现大部分错误，这总比在运行时出错好
    + 增强了编译器和IDE的功能，包括代码补全、接口提示、跳转到定义、重构等
- TypeScript非常包容
    + TypeScript是JavaScript的超集，.js 文件可以直接重命名为.ts即可
    + 即使不显示的定义类型，也能够自动做出类型推论
    + 可以定义从简单到复杂的几乎一切类型
    + 即使TypeScript编译报错，也可以生成JavaScript文件
    + 兼容第三方库，即使第三方库不是用TypeScript写的，也可以编写单独的类型文件供TypeScript
- TypeScript 拥有活跃的社区
    + 大部分第三方库都有提供给TypeScript的类型定义文件
    + Google 开发的Angularly就是使用TypeScript编写的
    + TypeScript拥抱了ES6规范，也支持部分ESNext草案的规范。

### 安装TypeScript
TypeScript的命令行工具安装方法如下：
```
npm install -g typescript
或
yarn global add typescript
```
以上命令会在全局环境下安装tsc命令，安装完成之后， 我们就可以在任何地方执行tsc命令了。
如编译demo/hello.ts文件后，编译生成hello.js
```
tsc hello.ts
```
我们约定使用TypeScript编写的文件以.ts为后缀，用TypeScript编写React时，以.tsx为后缀。   

**编译器**    
TypeScript最大的优势便是增强了编译器和IDE的功能，包括代码补全、接口提示、跳转到定义、重构等。    

### HelloTypeScript
我们从一个简单的例子开始。    
将以下代码复制到demo/hello-1.ts中：
```ts
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```
然后执行：
```
tsc hello-1.ts
```
这时候会生成一个编译好的文件 hello-1.js：
```js
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```
TypeScript中，使用<b>：</b>指定变量类型，<b>：</b>的前后有没有空格都可以。    
上述例子中，我们用<b>：</b>指定person参数类型为string。但是编译为js之后，并没有什么检查的代码被插进来。   

**TypeScript只会进行静态检查，如果发现有错误，编译的时候就会报错。**     
> let 是ES6中的关键字，和 var 类似，用于定义一个局部变量。

下面尝试把这段代码demo/hell0-2.ts 编译以下:
```ts
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```
编译器中会提示错误，编译的时候 也会出错： 
```
hello-2.ts:6:22 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.

6 console.log(sayHello(user));
                       ~~~~
Found 1 error.
```
但是还是生成了js文件:
```js
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = [0, 1, 2];
console.log(sayHello(user));
```
**TypeScript编译的时候即使报错了，还是会生成编译结果**，我们仍然可以使用这个编译之后的文件。   
如果要在报错的时候终止js文件的生成，可以在tsconfig.json中配置noEmitOnError即可。关于tsconfig.json，请参阅[官方手册](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)

## 基础
本部分介绍了TypeScript中常用类型和一些基本概念，旨在让大家对TypeScript有个初步的理解。具体内容包括：
- 原生数据类型
- 任意值
- 类型推论
- 对象的类型--接口
- 数组的类型
- 函数的类型
- 类型断言
- 声明文件
- 内置对象

### 原始数据类型
JavaScript的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object Types）。   
原始数据类型包括：布尔值、数值、字符串、null、undefined以及ES6中新类型Symbol。    
本节主要介绍前物种原始数据类型在TypeScript中的应用。   

#### 布尔值
布尔值是最基础的数据类型，在 TypeScript 中，使用 boolean 定义布尔值类型：
```ts
let isDone: boolean = false;
// 编译通过
// 后面约定，未强调编译错误的代码片段，默认为编译通过
```
注意，使用构造函数 Boolean 创造的对象不是布尔值：
```ts
let createdByNewBoolean: boolean = new Boolean(1);
```
编译结果如下：

```
test.ts:1:5 - error TS2322: Type 'Boolean' is not assignable to type 'boolean'.
  'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.

1 let createdByNewBoolean: boolean = new Boolean(1);
      ~~~~~~~~~~~~~~~~~~~


Found 1 error.
```

事实上 <b>new Boolean()</b> 返回的是一个<b>Boolean</b>对象：
```ts
let createdByNewBoolean: Boolean = new Boolean(1);
```
直接调用 Boolean 也可以返回一个 boolean 类型：
```ts
let createdByBoolean: boolean = Boolean(1);
```
在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样，不再赘述。    


#### 数值
使用number定义数值类型(demo/test.ts)：
```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```
编译结果：
```js
var decLiteral = 6;
var hexLiteral = 0xf00d;
// ES6 中的二进制表示法
var binaryLiteral = 10;
// ES6 中的八进制表示法
var octalLiteral = 484;
var notANumber = NaN;
var infinityNumber = Infinity;

```
其中 0b1010 和 0o744 是 [ES6 中的二进制和八进制表示法](http://es6.ruanyifeng.com/#docs/number#%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%92%8C%E5%85%AB%E8%BF%9B%E5%88%B6%E8%A1%A8%E7%A4%BA%E6%B3%95)，它们会被编译为十进制数字。   

#### 字符串
使用 string 定义字符串类型(demo/test-1.ts)：
```ts
let myName: string = 'Tom';
let myAge: number = 25;

// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```
编译结果：
```js
var myName = 'Tom';
var myAge = 25;
// 模板字符串
var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next month.";

```
其中 ` 用来定义 [ES6 中的模板字符串](http://es6.ruanyifeng.com/#docs/string#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)，${expr} 用来在模板字符串中嵌入表达式。    

#### 空值
JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数(demo/test-2.ts)：
```ts
function alertName(): void {
    alert('My name is Tom');
}
```
声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null：
```ts
let unusable: void = undefined;
```

#### Null 和 Undefined
在 TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型：
```ts
let u: undefined = undefined;
let n: null = null;
```
与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量：
```ts
// 这样不会报错
let num: number = undefined;
```

```ts
// 这样也不会报错
let u: undefined;
let num: number = u;
```
而 void 类型的变量不能赋值给 number 类型的变量：
```ts
let u: void;
let num: number = u;

// Type 'void' is not assignable to type 'number'.
```

### 任意值
> 任意值（Any）用来表示允许赋值为任意类型。

#### 什么是任意类型
如果是一个普通类型，在赋值过程中改变类型是不被允许的：
```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;
// 编译结果如下：
// Type '7' is not assignable to type 'string'.
```
但如果是 any 类型，则允许被赋值为任意类型。
```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
// 编译成功
```

#### 任意值的属性和方法
在任意值上访问任何属性都是允许的：
```ts
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```
也允许调用任何方法：
```ts
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
```
可以认为，**声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**。

#### 未声明类型的变量
变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：
```ts
let something;
something = 'seven';
something = 7;

something.setName('Tom');
```
等价于：
```ts
let something: any;
something = 'seven';
something = 7;

something.setName('Tom');
```

### 类型推论
> 如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型

#### 什么是类型推论
以下代码虽然没有指定类型，但是会在编译的时候报错：
```ts
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```
事实上，它等价于：
```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```
TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。    

**如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：**
```ts
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

### 联合类型
> 联合类型（Union Types）表示取值可以为多种类型中的一种。

#### 简单的例子
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = true;

// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```
联合类型使用 <b>|</b> 分隔每个类型。     
这里的 let myFavoriteNumber: string | number 的含义是，允许 myFavoriteNumber 的类型是 string 或者 number，但是不能是其他类型。    

#### 访问联合类型的属性或方法
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们**只能访问此联合类型的所有类型里共有的属性或方法**：
```ts
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```
上例中，length 不是 string 和 number 的共有属性，所以会报错。    

访问 string 和 number 的共有属性是没问题的：
```ts
function getString(something: string | number): string {
    return something.toString();
}
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：  
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```
上例中，第二行的 myFavoriteNumber 被推断成了 string，访问它的 length 属性不会报错。   
而第四行的 myFavoriteNumber 被推断成了 number，访问它的 length 属性时就报错了。   

### 对象类型--接口
> 在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

#### 什么是接口
在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。    
TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。   

#### 简单的例子
```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```
上面的例子中，我们定义了一个接口 Person，接着定义了一个变量 tom，它的类型是 Person。这样，我们就约束了 tom 的形状必须和接口 Person 一致。  
定义的变量比接口少了一些属性是不允许的：
```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom'
};

// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
//   Property 'age' is missing in type '{ name: string; }'.
```
多一些属性也是不允许的：
```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```
可见，**赋值的时候，变量的形状必须和接口的形状保持一致**。

#### 可选属性
有时我们希望不要完全匹配一个形状，那么可以用可选属性：
```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
```

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```
可选属性的含义是该属性可以不存在。     
这时**仍然不允许添加未定义的属性**：

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// examples/playground/index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

#### 任意属性
有时候我们希望一个接口允许有任意的属性，可以使用如下方式：
```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```
使用 [propName: string] 定义了任意属性取 string 类型的值。    
需要注意的是，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**：
```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```
上例中，任意属性的值允许是 string，但是可选属性 age 的值却是 number，number 不是 string 的子属性，所以报错了。      
另外，在报错信息中可以看出，此时 { name: 'Tom', age: 25, gender: 'male' } 的类型被推断成了 { [x: string]: string | number; name: string; age: number; gender: string; }，这是联合类型和接口的结合。    

#### 只读属性
有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 readonly 定义只读属性：
```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```
上例中，使用 readonly 定义的属性 id 初始化后，又被赋值了，所以报错了。    
注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候：
```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```
上例中，报错信息有两处，第一处是在对 tom 进行赋值的时候，没有给 id 赋值。    
第二处是在给 tom.id 赋值的时候，由于它是只读属性，所以报错了。    

### 数组类型
> 在 TypeScript 中，数组类型有多种定义方式，比较灵活。

#### 「类型 + 方括号」表示法
最简单的方法是使用「类型 + 方括号」来表示数组：
```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
```
数组的项中**不允许**出现其他的类型：
```ts
let fibonacci: number[] = [1, '1', 2, 3, 5];

// Type 'string' is not assignable to type 'number'.
```
数组的一些方法的参数也会根据数组在定义时约定的类型进行限制：
```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
fibonacci.push('8');

// Argument of type '"8"' is not assignable to parameter of type 'number'.
```
上例中，push 方法只允许传入 number 类型的参数，但是却传了一个 "8" 类型的参数，所以报错了。这里 "8" 是一个字符串字面量类型，会在后续章节中详细介绍。      

#### 数组泛型
我们也可以使用数组泛型（Array Generic） Array<elemType> 来表示数组：
```ts
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```
#### 用接口表示数组
接口也可以用来描述数组：
```ts
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```
NumberArray 表示：只要索引的类型是数字时，那么值的类型必须是数字。   
虽然接口也可以用来描述数组，但是我们一般不会这么做，因为这种方式比前两种方式复杂多了。    
不过有一种情况例外，那就是它常用来表示类数组。    

#### 类数组
类数组（Array-like Object）不是数组类型，比如 arguments：
```ts
function sum() {
    let args: number[] = arguments;
}

// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
```
上例中，arguments 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口：
```ts
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```
在这个例子中，我们除了约束当索引的类型是数字时，值的类型必须是数字之外，也约束了它还有 __length__ 和 __callee__ 两个属性。      
事实上常用的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等： 
```ts
function sum() {
    let args: IArguments = arguments;
}
```
其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
```ts
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```
#### any 在数组中的应用
一个比较常见的做法是，用 any 表示数组中允许出现任意类型：
```ts
let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
```

### 函数的类型
> [函数是JavaScript中的一等公民](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch2.html)

#### 函数声明
在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）：
```js
// 函数声明（Function Declaration）
function sum(x, y) {
    return x + y;
}

// 函数表达式（Function Expression）
let mySum = function (x, y) {
    return x + y;
};
```
一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到，其中函数声明的类型定义较简单：
```ts
function sum(x: number, y: number): number {
    return x + y;
}
```
注意，**输入多余的（或者少于要求的）参数，是不被允许的**：
```ts
function sum(x: number, y: number): number {
    return x + y;
}
sum(1, 2, 3);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```
```ts
function sum(x: number, y: number): number {
    return x + y;
}
sum(1);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```

#### 函数表达式
如果要我们现在写一个对函数表达式（Function Expression）的定义，可能会写成这样：
```ts
let mySum = function (x: number, y: number): number {
    return x + y;
};
```
这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 mySum 添加类型，则应该是这样：
```ts
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```
::: warning 警告：
注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。

在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。   

在 ES6 中，=> 叫做箭头函数，应用十分广泛，可以参考 [ES6 中的箭头函数](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)
:::

#### 用接口定义函数的形状
我们也可以使用接口的方式来定义一个函数需要符合的形状：
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

#### 可选参数
前面提到，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？    

与接口中的可选属性类似，我们用 ? 表示可选的参数：
```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```
需要注意的是，可选参数必须接在必需参数后面。换句话说，__可选参数后面不允许再出现必需参数了__：
```ts
function buildName(firstName?: string, lastName: string) {
    if (firstName) {
        return firstName + ' ' + lastName;
    } else {
        return lastName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName(undefined, 'Tom');

// index.ts(1,40): error TS1016: A required parameter cannot follow an optional parameter.
```

#### 参数默认值
在 ES6 中，我们允许给函数的参数添加默认值，__TypeScript 会将添加了默认值的参数识别为可选参数__：
```ts
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```
此时就不受「可选参数必须接在必需参数后面」的限制了：
```ts
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');
```
#### 剩余参数
ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数）：
```js
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```
事实上，items 是一个数组。所以我们可以用数组的类型来定义它：
```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```
注意，rest 参数只能是最后一个参数，关于 rest 参数，可以参考 [ES6 中的 rest 参数](http://es6.ruanyifeng.com/#docs/function#rest%E5%8F%82%E6%95%B0)。    

#### 重载
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。    
利用联合类型，我们可以这么实现：
```ts
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。      
这时，我们可以使用重载定义多个 reverse 的函数类型(demo/test-4.ts)：
```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。     

::: warning 注意：
TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
:::

### 类型断言
> 类型断言（Type Assertion）可以用来手动指定一个值的类型。

#### 语法
```
<类型>值
```
或
```
值 as 类型
```

::: warning 注意：
在 tsx 语法（React 的 jsx 语法的 ts 版）中必须用后一种。
:::

#### 例子：将一个联合类型的变量指定为一个更加具体的类型
之前提到过，当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：
```ts
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```
而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法，比如：
```ts
function getLength(something: string | number): number {
    if (something.length) {
        return something.length;
    } else {
        return something.toString().length;
    }
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
// index.ts(3,26): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```
上例中，获取 something.length 的时候会报错。     
此时可以使用类型断言，将 something 断言成 string：
```ts
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```
类型断言的用法如上，在需要断言的变量前加上 <Type> 即可。       
类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的：
```ts
function toBoolean(something: string | number): boolean {
    return <boolean>something;
}

// index.ts(2,10): error TS2352: Type 'string | number' cannot be converted to type 'boolean'.
//   Type 'number' is not comparable to type 'boolean'.
```

### 声明文件
> 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

#### 新语法索引
由于本章涉及大量新语法，故在本章开头列出新语法的索引，方便大家在使用这些新语法时能快速查找到对应的讲解：  
* __declare var__ 声明全局变量
* __declare function__ 声明全局方法
* __declare class__ 声明全局类
* __declare enum__ 声明全局枚举类型
* __declare namespace__ 声明(含有子属性的)全局对象
* __interface 和 type__ 声明全局类型
* __export__ 导出变量
* __export namespace__ 导出（含有子属性）对象
* __export default__ ES6默认导出
* __export =__ commonjs 导出模块
* __export as namespace__ UMD库声明全局变量
* __declare global__ 扩展全局变量
* __declare module__ 扩展模块
* __/// <reference />__ 三斜线指令

#### 什么事声明语句
假如我们想使用第三方库 jQuery，一种常见的方式是在 html 中通过 __&lt;script&gt;__ 标签引入 jQuery，然后就可以使用全局变量 $ 或 jQuery 了。    
我们通常这样获取一个 id 是 foo 的元素：
```ts
$('#foo');
// or
jQuery('#foo');
```
但是在 ts 中，编译器并不知道 $ 或 jQuery 是什么东西1：
```ts
jQuery('#foo');
// ERROR: Cannot find name 'jQuery'.
```
这时，我们需要使用 declare var 来定义它的类型2：
```ts
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```
上例中，declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。它编译结果是：
```ts
jQuery('#foo');
```
除了 declare var 之外，还有其他很多种声明语句，将会在后面详细介绍。   

#### 声明是声明文件
通常我们会把声明语句放到一个单独的文件（jQuery.d.ts）中，这就是[声明文件](./declaration-files/03-jquery-d-ts)：
```ts
// src/jQuery.d.ts

declare var jQuery: (selector: string) => any;
```

```ts
// src/index.ts

jQuery('#foo');
```
声明文件必需以 .d.ts 为后缀。     
一般来说，ts 会解析项目中所有的 *.ts 文件，当然也包含以 .d.ts 结尾的文件。所以当我们将 jQuery.d.ts 放到项目中时，其他所有 *.ts 文件就都可以获得 jQuery 的类型定义了。       
```
/path/to/project
├── src
|  ├── index.ts
|  └── jQuery.d.ts
└── tsconfig.json
```
假如仍然无法解析，那么可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。    

#### 第三方声明文件
当然，jQuery 的声明文件不需要我们定义了，社区已经帮我们定义好了：[jQuery in DefinitelyTyped](./config/jquery/index.d.ts)。       
我们可以直接下载下来使用，但是更推荐的是使用 @types 统一管理第三方库的声明文件。          
@types 的使用方式很简单，直接用 npm 安装对应的声明模块即可，以 jQuery 举例：
```
npm install @types/jquery --save-dev
```
可以在[这个页面](https://microsoft.github.io/TypeSearch/)搜索你需要的声明文件

#### 书写声明文件
当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。前面只介绍了最简单的声明文件内容，而真正书写一个声明文件并不是一件简单的事，以下会详细介绍如何书写声明文件。   

在不同的场景下，声明文件的内容和使用方式会有所区别。

库的使用场景主要有以下几种：

+ __全局变量__：通过 &lt;script&gt; 标签引入第三方库，注入全局变量
+ __npm 包__：通过 import foo from 'foo' 导入，符合 ES6 模块规范
+ __UMD 库__：既可以通过 &lt;script&gt; 标签引入，又可以通过 import 导入
+ __直接扩展全局变量__：通过 &lt;script&gt; 标签引入后，改变一个全局变量的结构
+ __在 npm 包或 UMD 库中扩展全局变量__：引用 npm 包或 UMD 库后，改变一个全局变量的结构
+ __模块插件__：通过 &lt;script&gt; 或 import 导入后，改变另一个模块的结构

#### 全局变量
全局变量是最简单的一种场景，之前举的例子就是通过 &lt;script&gt; 标签引入 jQuery，注入全局变量 $ 和 jQuery。   

使用全局变量的声明文件时，如果是以<b>npm install @types/xxx --save-dev</b>安装的，则不需要任何配置。如果是将声明文件直接存放于当前项目中，则建议和其他源码一起放到<b> src </b>目录下（或者对应的源码目录下）：
```
/path/to/project
├── src
|  ├── index.ts
|  └── jQuery.d.ts
└── tsconfig.json
```
如果没有生效，可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。   

全局变量的声明文件主要有以下几种语法：
- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型

**declare var**       
在所有的声明语句中，declare var 是最简单的，如之前所学，它能够用来定义一个全局变量的类型。与其类似的，还有 declare let 和 declare const，使用 let 与使用 var 没有什么区别：
```ts
// src/jQuery.d.ts

declare let jQuery: (selector: string) => any;
```

```ts
// src/index.ts

jQuery('#foo');
// 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
```
而当我们使用 const 定义时，表示此时的全局变量是一个常量，不允许再去修改它的值了,[样例](./declaration-files/04-declare-const-jquery):
```ts
// src/jQuery.d.ts

declare const jQuery: (selector: string) => any;

jQuery('#foo');
// 使用 declare const 定义的 jQuery 类型，禁止修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
// ERROR: Cannot assign to 'jQuery' because it is a constant or a read-only property.
```
一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 const 而不是 var 或 let。

需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的实现, [样例](./declaration-files/05-declare-jquery-value)：
```ts
declare const jQuery = function(selector) {
    return document.querySelector(selector);
};
// ERROR: An implementation cannot be declared in ambient contexts.
```

**declare function**     
declare function 用来定义全局函数的类型。jQuery 其实就是一个函数，所以也可以用 function 来定义：
```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
```

```ts
// src/index.ts

jQuery('#foo');
```
在函数类型的声明语句中，函数重载也是支持的:[样例](./declaration-files/06-declare-function) 
```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any): any;
```

```ts
// src/index.ts

jQuery('#foo');
jQuery(function() {
    alert('Dom Ready!');
});
```
**declare class**
当全局变量是一个类的时候，我们用 declare class 来定义它的类型, [样例](./declaration-files/07-declare-class) 
```ts
// src/Animal.d.ts

declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}
```

```ts
// src/index.ts

let cat = new Animal('Tom');
```
同样的，declare class 语句也只能用来定义类型，不能用来定义具体的实现，比如定义 sayHi 方法的具体实现则会报错：
```ts
// src/Animal.d.ts

declare class Animal {
    name: string;
    constructor(name: string);
    sayHi() {
        return `My name is ${this.name}`;
    };
    // ERROR: An implementation cannot be declared in ambient contexts.
}
```
**declare enum**
使用 declare enum 定义的枚举类型也称作外部枚举（Ambient Enums），举例如下，[样例](./declaration-files/08-declare-enum) 
```ts
// src/Directions.d.ts

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

```ts
// src/index.ts

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```
与其他全局变量的类型声明一致，declare enum 仅用来定义类型，而不是具体的值。

Directions.d.ts 仅仅会用于编译时的检查，声明文件里的内容在编译结果中会被删除。它编译结果是：
```ts
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```
其中 Directions 是由第三方库定义好的全局变量。

**declare namespace**
namespace 是 ts 早期时为了解决模块化而创造的关键字，中文称为命名空间。

由于历史遗留原因，在早期还没有 ES6 的时候，ts 提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，ts 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间。

随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的 namespace，而推荐使用 ES6 的模块化方案了，故我们不再需要学习 namespace 的使用了。

namespace 被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。

比如 jQuery 是一个全局变量，它是一个对象，提供了一个 jQuery.ajax 方法可以调用，那么我们就应该使用 declare namespace jQuery 来声明这个拥有多个子属性的全局变量。

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
```
注意，在 declare namespace 内部，我们直接使用 function ajax 来声明函数，而不是使用 declare function ajax。类似的，也可以使用 const, class, enum 等语句, [样例](./declaration-files/09-declare-namespace) 

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    const version: number;
    class Event {
        blur(eventType: EventType): void
    }
    enum EventType {
        CustomClick
    }
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
console.log(jQuery.version);
const e = new jQuery.Event();
e.blur(jQuery.EventType.CustomClick);
```
__嵌套的命名空间__     
如果对象拥有深层的层级，则需要用嵌套的 namespace 来声明深层的属性的类型,  [样例](./declaration-files/10-declare-namespace-nesting) 

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    namespace fn {
        function extend(object: any): void;
    }
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```
假如 jQuery 下仅有 fn 这一个属性（没有 ajax 等其他属性或方法），则可以不需要嵌套 namespace，[样例](./declaration-files/11-declare-namespace-dot) 
```ts
// src/jQuery.d.ts

declare namespace jQuery.fn {
    function extend(object: any): void;
}
```

```ts
// src/index.ts

jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```
**interface 和 type**       
除了全局变量之外，可能有一些类型我们也希望能暴露出来。在类型声明文件中，我们可以直接使用 interface 或 type 来声明一个全局的接口或类型，[样例](./declaration-files/12-interface) 
```ts
// src/jQuery.d.ts

interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
}
declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void;
}
```
这样的话，在其他文件中也可以使用这个接口或类型了：
```ts
// src/index.ts

let settings: AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```
::: tip 提示：
type 与 interface 类似，不再赘述。
:::

**防止命名冲突**        
暴露在最外层的 interface 或 type 会作为全局类型作用于整个项目中，我们应该尽可能的减少全局变量或全局类型的数量。故最好将他们放到 namespace 下，[样例](./declaration-files/13-avoid-name-conflict) 
```ts
// src/jQuery.d.ts

declare namespace jQuery {
    interface AjaxSettings {
        method?: 'GET' | 'POST'
        data?: any;
    }
    function ajax(url: string, settings?: AjaxSettings): void;
}
```
注意，在使用这个 interface 的时候，也应该加上 jQuery 前缀：
```ts
// src/index.ts

let settings: jQuery.AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```
**声明合并**      
假如 jQuery 既是一个函数，可以直接被调用 jQuery('#foo')，又是一个对象，拥有子属性 jQuery.ajax()（事实确实如此），那么我们可以组合多个声明语句，它们会不冲突的合并起来，[样例](./declaration-files/14-declaration-merging)
```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

```ts
// src/index.ts

jQuery('#foo');
jQuery.ajax('/api/get_something');
```
**npm包**        
一般我们通过 <b>import foo from 'foo' </b>导入一个 npm 包，这是符合 ES6 模块规范的。

在我们尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：

- 与该 npm 包绑定在一起。判断依据是 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以以后我们自己创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起。

- 发布到 @types 里。我们只需要尝试安装一下对应的 @types 包就知道是否存在该声明文件，安装命令是 npm install @types/foo --save-dev。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 @types 里了。

假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了。由于是通过 import 语句导入的模块，所以声明文件存放的位置也有所约束，一般有两种方案：

- 创建一个 node_modules/@types/foo/index.d.ts 文件，存放 foo 模块的声明文件。这种方式不需要额外的配置，但是 node_modules 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。

- 创建一个 types 目录，专门用来管理自己写的声明文件，将 foo 的声明文件放到 types/foo/index.d.ts 中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。

目录结构：

```
/path/to/project
├── src
|  └── index.ts
├── types
|  └── foo
|     └── index.d.ts
└── tsconfig.json
```

tsconfig.json 内容：

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```
如此配置之后，通过 import 导入 foo 的时候，也会去 types 目录下寻找对应的模块的声明文件了。
::: warning 注意：
module 配置可以有很多种选项，不同的选项会影响模块的导入导出模式。这里我们使用了 commonjs 这个最常用的选项，后面的教程也都默认使用的这个选项。

不管采用了以上两种方式中的哪一种，我都强烈建议大家将书写好的声明文件（通过给第三方库发 pull request，或者直接提交到 @types 里）发布到开源社区中，享受了这么多社区的优秀的资源，就应该在力所能及的时候给出一些回馈。只有所有人都参与进来，才能让 ts 社区更加繁荣。
:::

npm 包的声明文件主要有以下几种语法：
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块

__export__     
npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。

export 的语法与普通的 ts 中的语法类似，区别仅在于声明文件中禁止定义具体的实现，[样例](./declaration-files/15-export)：

```ts
// types/foo/index.d.ts

export const name: string;
export function getName(): string;
export class Animal {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right
}
export interface Options {
    data: any;
}
```
对应的导入和使用模块应该是这样：
```ts
// src/index.ts

import { name, getName, Animal, Directions, Options } from 'foo';

console.log(name);
let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'foo'
    }
};
```
__混用 declare 和 export__    
我们也可以使用 declare 先声明多个变量，最后再用 export 一次性导出。上例的声明文件可以等价的改写为，[样例](./declaration-files/16-declare-and-export)
```ts
// types/foo/index.d.ts

declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
interface Options {
    data: any;
}

export { name, getName, Animal, Directions, Options };
```
::: warning 注意：
与全局变量的声明文件类似，interface 前是不需要 declare 的。
:::

__export namespace__      
与 declare namespace 类似，export namespace 用来导出一个拥有子属性的对象，[样例](./declaration-files/17-export-namespace)
```ts
// types/foo/index.d.ts

export namespace foo {
    const name: string;
    namespace bar {
        function baz(): string;
    }
}
```

```ts
// src/index.ts

import { foo } from 'foo';

console.log(foo.name);
foo.bar.baz();
```
__export default__     
在 ES6 模块系统中，使用 export default 可以导出一个默认值，使用方可以用 import foo from 'foo' 而不是 import { foo } from 'foo' 来导入这个默认值。

在类型声明文件中，export default 用来导出默认值的类型，[样例](./declaration-files/18-export-default)：   
```ts
// types/foo/index.d.ts

export default function foo(): string;
```

```ts
// src/index.ts

import foo from 'foo';

foo();
```
注意，只有 _function_、_class_ 和 _interface_ 可以直接默认导出，其他的变量需要先定义出来，再默认导出，[样例](./declaration-files/19-export-default-enum-error)：
```ts
// types/foo/index.d.ts

export default enum Directions {
// ERROR: Expression expected.
    Up,
    Down,
    Left,
    Right
}
```
上例中 export default enum 是错误的语法，需要使用 declare enum 定义出来，然后使用 export default 导出：
```ts
// types/foo/index.d.ts

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

export default Directions;
```
针对这种默认导出，我们一般会将导出语句放在整个声明文件的最前面，[样例](./declaration-files/20-export-default-enum)
```ts
// types/foo/index.d.ts

export default Directions;

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```
**export =**      
在 commonjs 规范中，我们用以下方式来导出一个模块：
```js
// 整体导出
module.exports = foo;
// 单个导出
exports.bar = bar;
```
在 ts 中，针对这种模块导出，有多种方式可以导入，第一种方式是 <b>const ... = require</b>：

```ts
// 整体导入
const foo = require('foo');
// 单个导入
const bar = require('foo').bar;
```
第二种方式是 <b>import ... from</b>，注意针对整体导出，需要使用 import * as 来导入：
```ts
// 整体导入
import * as foo from 'foo';
// 单个导入
import { bar } from 'foo';
```
第三种方式是 <b>import ... require</b>，这也是 ts 官方推荐的方式：
```ts
// 整体导入
import foo = require('foo');
// 单个导入
import bar = foo.bar;
```
对于这种使用 commonjs 规范的库，假如要为它写类型声明文件的话，就需要使用到 export = 这种语法了，[样例](./declaration-files/21-export-equal)：
```ts
// types/foo/index.d.ts

export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

```ts

```

```ts

```

```ts

```














[URL](https://ts.xcatliu.com/basics/type-of-function)