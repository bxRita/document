### graphQL介绍
GraphQL 是一个旨在简化前端和后端之间通信的规范。它主要由服务端的 schema 语言和客户端的查询语言组成。

### 为什么用graphQL
下面给出几个理由：
##### 1. GraphQL API 有强类型 schema
对大多数API而言，最大的问题在于缺少强类型约束。常见场景为：后端API更新了，但文档没跟上，你没法知道新的API是干什么的，怎么用，这应该是前后端掐架的原因之一。

GraphQL schema 是每个GraphQL API的基础，它清晰的定义了每个API支持的操作，包括输入的参数和返回的内容。

GraphQL schema是强类型的，可使用SDL(GraphQL Schema Definition Language)来定义。相对而言，强类型系统使开发人员自行车换摩托。比如，可以使用构建工具验证API请求，编译时检查API调用可能发生的错误，甚至可以在代码编辑器中自动完成API操作。

schema带来的另一个好处是，不用再去编写API文档——因为根据schema自动生成了，这改变了API开发的玩法。

##### 2. 按需获取
我们经常谈GraphQL的主要优点——前端可以从API获取想要的数据，不必依赖REST端返回的固定数据结构。

如此，解决了传统REST API的两个典型问题：**Overfetching**和**Underfetching**。
- **Overfetching**

    Overfetching意味着前端得到了实际不需要的数据，这可能会造成性能和带宽浪费。

    比如：个人资料页面需要呈现用户姓名和生日；提供用户信息的API(如/users/id)还会返回用户的地址、账单、日期等信息，但这在个人资料页面没有用，也没必要。

- **Underfetching**

    Underfetching与Overfetching想反，API返回中缺少足够的数据，这意味着前端需要请求额外的API得到需要的数据。

    最坏的场景下，不足的结果会导致臭名昭著的N+1请求问题：获取数据列表，而没有API能够满足列表字段要求，不得不对每行数据发起一次请求，以获取所需数据。

    栗子：假设我们在捣鼓一个博客应用。显示 user列表，除user本身信息外，还要显示每个user最近一篇文章的title。然而，调用/users/仅得到user集合，不得不对每个user调用/users/<id>/articles获取其最新文章。

    说明：当然你可以再写一个API来满足特殊场景，如/users/lastarticles/来满足上面的需求，但需要编写后端相关代码，调试和部署，加班....

> 使用GraphQL，前端自己决定返回的数据及结构。


##### 3. GraphQL支持快速产品开发
GraphQL使前端开发人员轻松，感谢GraphQL的前端库(Apollo、Relay或Urql)，前端可以用如缓存、实时更新UI等功能。

前端开发人员生产力提高，产品开发速度加快，无论UI如何变后端不用变。

构建GraphQL API的过程大多围绕GraphQL scheme。由此，经常听到 schema-driven development(SDD)，这只是指一个过程，功能在schema中定义，在resolver(解析器)中实现。

##### 4. Composing GraphQL API
schema拼接(stitching)是GraphQL中的新概念之一，简而言之，可以组合和连接多个GraphQL API，合并为一个。与React组件概念类似，一个GraphQL API可以由多个GraphQL API构成。

##### 5. 丰富的开源生态和社区
自Facebook正式发布GraphQL以来，仅两年多时间，整个GraphQL生态系统的成熟程度难以置信。

### graphQL的理解

在GraphQL中，对于数据模型的抽象是通过Type来描述的，对于接口获取数据的逻辑是通过Schema来描述的

这么说可能比较抽象，我们一个一个来说明。

#### type
对于数据模型的抽象是通过Type来描述的，每一个Type有若干Field组成，每个Field又分别指向某个Type。

GraphQL的Type简单可以分为两种，一种叫做Scalar Type(标量类型)，另一种叫做Object Type(对象类型)。

##### 1. Scalar Type

GraphQL中的内建的标量包含：
- Int: 32 位有符号整型，超出精度范围后，引擎会抛出异常
- Float: 有符号双精度浮点数，超出精度范围后，引擎会抛出异常
- String: 字符串，用于表示 UTF-8 字符序列
- Boolean: bool 值
- ID: 资源唯一标志符
- Enum： 枚举

值得注意的是，GraphQL中可以通过Scalar声明一个新的[标量](https://www.jianshu.com/p/93f062175c7d)。总之，我们只需要记住，标量是GraphQL类型系统中最小的颗粒

##### 2. Object Type
仅有标量是不够的抽象一些复杂的数据模型的，这时候我们需要使用对象类型,举个例子(先忽略语法，仅从字面上看)
```
type Article {
  id: ID
  text: String
  isPublished: Boolean
}
```
上面的代码，就声明了一个Article类型，它有3个Field，分别是ID类型的id，String类型的text和Boolean类型的isPublished。

对于对象类型的Field的声明，我们一般使用标量，但是我们也可以使用另外一个对象类型，比如如果我们再声明一个新的User类型，如下：
```
type User {
  id: ID
  name: String
}
```
这时我们就可以稍微的更改一下关于Article类型的声明代码，如下：
```
type Article {
  id: ID
  text: String
  isPublished: Boolean
  author: User
}
```
Article新增的author的Field是User类型, 代表这篇文章的作者。

总之，我们通过对象模型来构建GraphQL中关于一个数据模型的形状，同时还可以声明各个模型之间的内在关联（一对多、一对一或多对多）。

##### 3. Type Modifier
关于类型，还有一个较重要的概念，即类型修饰符，当前的类型修饰符有两种，分别是List和Required ，它们的语法分别为[Type]和Type!, 同时这两者可以互相组合，比如[Type]!或者[Type!]或者[Type!]!(请仔细看这里!的位置)，它们的含义分别为：
- 列表本身为必填项，但其内部元素可以为空
- 列表本身可以为空，但是其内部元素为必填
- 列表本身和内部元素均为必填

我们进一步来更改上面的例子，假如我们又声明了一个新的Comment类型，如下：
```
type Comment {
  id: ID!
  desc: String,
  author: User!
}
```
你会发现这里的ID有一个!，它代表这个Field是必填的，再来更新Article对象，如下：
```
type Article {
  id: ID!
  text: String
  isPublished: Boolean
  author: User!
  comments: [Comment!]
}
```
我们这里的作出的更改如下：

- id字段改为必填
- author字段改为必填
- 新增了comments字段，它的类型是一个元素为Comment类型的List类型

最终的Article类型，就是GraphQL中关于文章这个数据模型，一个比较简单的类型声明。

#### schema
现在我们开始介绍Schema，我们之前简单描述了它的作用，即它是用来描述对于接口获取数据逻辑的，但这样描述仍然是有些抽象的，我们其实不妨把它当做REST架构中每个独立资源的uri来理解它，只不过在GraphQL中，我们用Query来描述资源的获取方式。因此，我们可以将Schema理解为多个Query组成的一张表。

这里又涉及一个新的概念Query，GraphQL中使用Query来抽象数据的查询逻辑，当前标准下，有三种查询类型，分别是query（查询）、mutation（更改）和subscription（订阅）。

Note: 为了方便区分，Query特指GraphQL中的查询（包含三种类型），query指GraphQL中的查询类型（仅指查询类型）

##### Query
上面所提及的3中基本查询类型是作为Root Query（根查询）存在的，对于传统的CRUD项目，我们只需要前两种类型就足够了，第三种是针对当前日趋流行的real-time应用提出的。

我们按照字面意思来理解它们就好，如下：

- query（查询）：当获取数据时，应当选取Query类型
- mutation（更改）：当尝试修改数据时，应当使用mutation类型
- subscription（订阅）：当希望数据更改时，可以进行消息推送，使用subscription类型

仍然以一个例子来说明。

首先，我们分别以REST和GraphQL的角度，以Article为数据模型，编写一系列CRUD的接口，如下：

Rest 接口
```
GET /api/v1/articles/
GET /api/v1/article/:id/
POST /api/v1/article/
DELETE /api/v1/article/:id/
PATCH /api/v1/article/:id/
```

GraphQL Query
```
type Query {
  articles(): [Article!]!
  article(id: Int): Article!
}

type Mutation {
  createArticle(): Article!
  updateArticle(id: Int): Article!
  deleteArticle(id: Int): Article!
}
```
对比我们较熟悉的REST的接口我们可以发现，GraphQL中是按根查询的类型来划分Query职能的，同时还会明确的声明每个Query所返回的数据类型，这里的关于类型的语法和上一章节中是一样的。需要注意的是，我们所声明的任何Query都必须是Root Query的子集，这和GraphQL内部的运行机制有关。

例子中我们仅仅声明了Query类型和Mutation类型，如果我们的应用中对于评论列表有real-time的需求的话，在REST中，我们可能会直接通过长连接或者通过提供一些带验证的获取长连接url的接口，比如：
```
POST /api/v1/messages/
```
之后长连接会将新的数据推送给我们，在GraphQL中，我们则会以更加声明式的方式进行声明，如下
```
subscription {
  updatedArticle() {
    mutation
    node {
        comments: [Comment!]!
    }
  }
}
```
#### Resolver
如果我们仅仅在Schema中声明了若干Query，那么我们只进行了一半的工作，因为我们并没有提供相关Query所返回数据的逻辑。为了能够使GraphQL正常工作，我们还需要再了解一个核心概念，Resolver（解析函数）。

GraphQL中，我们会有这样一个约定，Query和与之对应的Resolver是同名的，这样在GraphQL才能把它们对应起来，举个例子，比如关于articles(): [Article!]!这个Query, 它的Resolver的名字必然叫做articles。

在介绍Resolver之前，是时候从整体上了解下GraphQL的内部工作机制了，假设现在我们要对使用我们已经声明的articles的Query，我们可能会写以下查询语句（同样暂时忽略语法）：
```
query {
  articles {
       id
       author {
           name
       }
       comments {
          id
          desc
          author
        }
  }
}
```
GraphQL在解析这段查询语句时会按如下步骤（简略版）：
- 首先进行第一层解析，当前Query的Root Query类型是query，同时需要它的名字是articles
- 之后会尝试使用articles的Resolver获取解析数据，第一层解析完毕
- 之后对第一层解析的返回值，进行第二层解析，当前articles还包含三个子Query，分别是id、author和comments
    - id在Author类型中为标量类型，解析结束
    - author在Author类型中为对象类型User，尝试使用User的Resolver获取数据，当前field解析完毕
    - 之后对第二层解析的返回值，进行第三层解析，当前author还包含一个Query, name，由于它是标量类型，解析结束
    - comments同上...

我们可以发现，GraphQL大体的解析流程就是遇到一个Query之后，尝试使用它的Resolver取值，之后再对返回值进行解析，这个过程是递归的，直到所解析Field的类型是Scalar Type（标量类型）为止。解析的整个过程我们可以把它想象成一个很长的Resolver Chain（解析链）。

### 其他知识点：

#### 1. HTTP方法、标题和正文
你的GraphQL HTTP服务器应当能够处理HTTP GET和POST方法。

##### GET请求
在收到一个HTTP GET请求时， 应当在“query”查询字符串（query string）中指定GraphQL查询。例如，如果我们要执行以下GraphQL查询：
```
{
	me {
		name
	}
}
```
此请求可以通过HTTP GET 发送，如下所示：
```
http: //myapi/graphql?query={me {name}}
```
查询变量可以作为JSON编码的字符串发送到名为variables的附加查询参数中。如果查询包含多个具名操作，则可以使用一个operationName查询参数来控制哪一个应当执行。

###### POST请求
标准的GraphQL POST请求应当使用application/json内容类型（content type）,并包含以下形式JSON编码请全体：
```
{  
	"query": "...",  
	"operationName": "...",  
	"variables": { "myVariable": "someValue", ... }
}
```
operationName和variables是可选字段。仅当查询中存在多个操作时才需要operationName。
除了上边这种请求之外， 我们还建议支持另外两种情况：
	- 如果存在“query”这一查询字符串参数（如上面的GET示例中），则应当以与HTTP GET 相同的方式进行解析和处理
	- 如果存在“application/graphql”Content-Type头， 则将HTTP POST请求体内容视为GraphQL 查询字符串。


集成到vue 工程： vue-apollo 