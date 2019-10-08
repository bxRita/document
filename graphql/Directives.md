[原文地址](https://ithelp.ithome.com.tw/articles/10206667?sc=pt)

#### GraphQL 内置指令
GraphQL 中内置了两款逻辑指令，指令跟在字段名后使用。
##### @include
当条件成立时，查询此字段
```
query {
    search {
        actors @include(if: $queryActor) {
            name
        }
    }
}
```
##### @skip
当条件成立时， 不查询此字段
```
query {
    search {
        comments @skip(if: $noComments) {
            from
        }
    }
}
```
今天要给大家介绍的是如何自定义指令（Directives）
实际用起来会像是下图所示
```
directive @isAuthenticated on FIELD_DEFINITION | OBJECT
directive @length(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION
directive @date(defaultFormat: String = "yyyy--MM-dd ") on FIELD_DEFINITION

type ExampleType @isAuthenticated {
  newField: String
  oldField: String @deprecated(reason: "use newField.")
  mobilePhoneNumber: String @length(max: 11)
  date: String @date
}
```

Directives 帮你实现TypeSystem做不到的细节
Directives 可视为GraphQL 的一种语法蜜糖(sugar syntax)，通常用于调整query 及schema 的行为，不同场景下可以有以下功能：
1. 影响query原有行为，如@include, @skip为query增加条件判断
2. 为Schema加上描述性标签，如@deprecated可以用于废除schema的某field又避免breaking change
3. 为Schema 添加新功能，例如参数检查、简单计算、权限检查、错误处理等等。不过这部分较为复杂，需自行定义

Directives 可以用在Client Side 的query 也可以用于Server Side 的Schema Definition ，不过通常比较多用于Schema Definition 中，一方面比较好维护，另一方面也减轻Client 的计算负担。

> 冷知识：通常在query使用的使用的Directives称为Executable Directive (或称Query Directive) ，在Schema中使用的称为Type System Directive (Schema Directive)。

##### 1. 客户端 query + directives
GraphQL 在query side 原生支援的Executable Directive 有两个，分别为：
1. @include (if: Boolean!): 用于判断是否显示此field，若if 为true 则显示。可用于field 及fragment 展开。
2. @skip (if: Boolean!): 用于判断是否忽略此field，若if 为false 则显示。可用于field 及fragment 展开。

##### 2. 服务端 schema definition + directives
前面提到Directives 可以为Schema 添加描述性标签或是添加新功能(或是两者兼具)，所以我们先从添加描述性标签开始，介绍一下同样也是GraphQL 原生支持的Type System Directive **@deprecated(reason: String = "No longer supported")**
###### 2.1 使用Type System Directives 标示Deprecated 范例
今天公司觉得某些男性/女性使用者并不喜欢透露自己的体重，所以决定废除这个栏位，但直接拿掉又怕系统出现问题，所以决定先dreprecate 掉，所以让我们修改Schema:
```
type User {
  ...
  "体重"
  weight(unit: WeightUnit = KILOGRAM): Float @deprecated (reason: "It's secret")
}
```
不过需注意，deprecated不代表说Client Side不能query，而是Client Side在阅读documentation时，会发现此field已经deprecated ，进而减少使用或修正目前的使用
如图所示，只要Server的Schema与Resolver并未移除掉该field ，User.weight仍然能取得值，只是在documentation中会将User.weight归类为Deprecated 
![image.png](https://upload-images.jianshu.io/upload_images/12953648-6d4f8280f3c8d5fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 3 服务端 schema definition + 自定义 Directives
举一个简单的例子，实作一个@uppper的Directives让回传的String都以大写形式呈现，我们需要做的有：
1. 引入外部套件
```
const { SchemaDirectiveVistor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');
```
2. 新增一个继承SchemaDirectiveVistor的class UpperCaseDirective来实作此Directive (可视为Directive的Resolver) ，再来通过override SchemaDirectiveVistor里的相关function来做出想要的效果。

这边@upper只针对栏位，因此只需要实作visitFieldDefinition。

3. 将步骤2新增的class放入ApolloServer初始化的参数列在option添加新栏位schemaDirectives来将以上两者连接。
4. 在Schema中( gqltag里)定义新的Directivesdirective @upper on FIELD_DEFINITION

代码如下：
```
// 1. 引入外部套件
const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

// 2. Directive 實作
class UpperCaseDirective extends SchemaDirectiveVisitor {
  // 2-1. ovveride field Definition 的實作
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    // 2-2. 更改 field 的 resolve function
    field.resolve = async function(...args) {
      // 2-3. 取得原先 field resolver 的計算結果 (因為 field resolver 傳回來的有可能是 promise 故使用 await)
      const result = await resolve.apply(this, args);
      // 2-4. 將得到的結果再做預期的計算 (toUpperCase)
      if (typeof result === 'string') {
        return result.toUpperCase();
      }
      // 2-5. 回傳最終值 (給前端)
      return result;
    };
  }
}

// 3. 定義新的 Directive
const typeDefs = gql`
  directive @upper on FIELD_DEFINITION

  type Query {
    hello: String @upper
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    }
  }
};

// 4. Add directive to the ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // 4. 將 schema 的 directive 與實作連接並傳進 ApolloServer。
  schemaDirectives: {
    upper: UpperCaseDirective
  }
});

server.listen().then(({ url }) => {
  console.log(`? Server ready at ${url}`);
});
```
这边特别解释一下因为UpperCaseDirective在宣告时( directive @upper on FIELD_DEFINITION)只应用于FIELD_DEFINITION，所以我们只需要override visitFieldDefinition一项，若想知道其他Type要override的function的话，可见Apollo官方提供的API如以下程式码：
```
class SomeDirective extends SchemaDirectiveVisitor {
  visitSchema(schema: GraphQLSchema) {}

  visitObject(object: GraphQLObjectType) {}

  visitFieldDefinition(field: GraphQLField<any, any>) {}

  visitArgumentDefinition(argument: GraphQLArgument) {}

  visitInterface(iface: GraphQLInterfaceType) {}

  visitInputObject(object: GraphQLInputObjectType) {}

  visitInputFieldDefinition(field: GraphQLInputField) {}

  visitScalar(scalar: GraphQLScalarType) {}

  visitUnion(union: GraphQLUnionType) {}

  visitEnum(type: GraphQLEnumType) {}

  visitEnumValue(value: GraphQLEnumValue) {}
}
```
更多范例可以上[Apollo Server 2 - Implementing directives](https://www.apollographql.com/docs/apollo-server/features/creating-directives/)上查询，另外很多directive的实作都可以找到套件只要下载来传入`ApolloServer`就ok了！

他强大的地方还有可以做ACL (Access Control List)也就是权限管理，比如今天Query的me的资料只能给有登入的使用而不开放给没有登入的guest，或是me.age只能给朋友看到，甚至是只有管理者( Admin可以删除使用者)
```
type User {
  ...
  @friendOnly
  age
}

Query {
  @isAuthenticated
  me: User
}

type Mutation {
  @auth(requires: "ADMIN")
  deleteUser(id: ID!): User
}
```
让我们来用之前社交软体的例子来试试看@isAuthenticated吧!

##### 4. @isAuthenticated 实现
一样分为两部分： Schema与Resovler ( IsAuthenticatedDirectiveclass)

###### 4.1 @isAuthenticated- Schema Definition
Schema部分非常简单，而我们目前仅用于FIELD_DEFINITION上~
```
directive @isAuthenticated on FIELD_DEFINITION

type Query {
  me: User @isAuthenticated
}
```

###### 4.2 @isAuthenticated- Resolver
```
class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const context = args[2];
      // 检查有沒有 context.me
      if (!context.me) throw new ForbiddenError('Not logged in~.');

      // 确定有 context.me 后才进入 Resolve Function
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

const resolvers = {
  Query: {
    // 这里被纯做资料存取逻辑
    me: (root, args, { me, userModel }) => userModel.findUserByUserId(me.id),
    ...
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    // 一样要记得放入 ApolloServer 中
    isAuthenticated: IsAuthenticatedDirective
  }
});
```
虽然Directive 功能强大，但目前Directive 的应用还不算广且还有许多改进空间(实作难度偏高)，所以可以审视自身需求来判断是否真的要新增一个Directive 

Reference: 
*   [Facebook GraphQL Specification: Type-System.Directives](https://facebook.github.io/graphql/June2018/#sec-Type-System.Directives)
*   [Apollo Draft specification for GraphQL Schema Decorators](https://github.com/apollographql/graphql-tools/blob/master/designs/graphql-decorator-spec.md)
*   [The power of GraphQL directives](https://blog.callstack.io/the-power-of-graphql-directives-81f4987fd76d)
*   **[Apollo - Resuable GraphQL schema directives](https://blog.apollographql.com/reusable-graphql-schema-directives-131fb3a177d1)**

*   [Prisma: GraphQL Directive Permissions — Authorization Made Easy](https://www.prisma.io/blog/graphql-directive-permissions-authorization-made-easy-54c076b5368e/)
*   [Apollo - Schema Directives](https://www.apollographql.com/docs/graphql-tools/schema-directives.html#What-about-directiveResolvers)
*   [Apollo - directiveResolvers](https://www.apollographql.com/docs/graphql-tools/directive-resolvers.html)

*   [Issue - graphql-constraint-directive](https://github.com/confuser/graphql-constraint-directive/issues/2)
