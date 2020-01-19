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

[URL](https://ts.xcatliu.com/basics/type-of-array)