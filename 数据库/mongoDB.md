### 目录
- 一、MongoDB
    + 1.1、安装MongoDB
        * 1.1.1、配置运行环境
        * 1.1.2、运行MongoDB
    + 1.2、数据库操作
        * 1.2.1、创建数据库与查看数据库
        * 1.2.2、删除数据库
        * 1.2.3、插入数据
        * 1.2.4、查询数据
        * 1.2.5、修改
        * 1.2.6、删除
### 一、MongoDB

MongoDB是开源，高性能的NoSQL数据库；支持索引、集群、复制和故障转移、各种语言的驱动程序丰富；高伸缩性；

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

官网地址：http://www.mongodb.org/

github:https://github.com/mongodb/

API Docs：http://docs.mongodb.org/manual/

nodejs驱动：https://github.com/mongodb/node-mongodb-native

#### 1.1、安装MongoDB

下载地址：http://www.mongodb.org/downloads

下载成功后点击msi文件直接安装，这里以win10_64位的操作系统为例。

1.1.1、配置运行环境

### 1)、创建存放数据的文件夹

在任意没有中文的目录下新建文件夹，如c:\data，在文件夹下存放MongoDB数据库文件与日志文件，如：

c:\data\db用于存放mongodb的数据文件

c:\data\log用于存放mongodb的日志文件

### 2）、创建配置文件

打开MongoDB的安装目录如“C:\Program Files\MongoDB\Server\3.4\bin”，并在此目录下新建一个mongo.config文件，文件内容如下：

```
##数据库目录##
dbpath=C:\data\db

##日志输出文件##
logpath=C:\data\log\db.log
```

### 3) 、安装Windows服务

使用cmd进入命令行

使用cd切换目录到安装目录下，如：cd  C:\Program Files\MongoDB\Server\3.4\bin

安装MongoDB服务且指定配置文件，如：

mongod --config "C:\Program Files\MongoDB\Server\3.4\bin\mongo.config" --install

### 4)、错误处理

如果运行过程中提示“无法定位程序输入点ucrtbase.terminate于动态链接库api-ms-win-crt-runtime-|1-1-0.dll”错误，请下载安装“vc_redist.x64”，如果vc redis.x64安装失败请先下载补丁(KB2999226)再安装。

### 5)、添加环境变量

在计算机->右键->高级->在环境变量PATH中加入"C:\Program Files\MongoDB\Server\3.4\bin"路径。

![1](./imgs/1.png)

### 6)、启动服务

在cmd窗口中运行如下命令开始服务，也可以在可以在“控制面板\所有控制面板项\管理工具\服务”手动开启，注意默认是开机就自动启动服务的，可以设置成手动启动。

![2](./imgs/2.png)

net start mongodb

停止服务

net stop mongodb

在cmd中运行如下命令

![3](./imgs/3.png)

这样安装就成功了！

#### 1.1.2、运行MongoDB

### 1)、直接运行

如果安装完成后不想做任何配置，可以直接运行，其中mongod.exe是服务，应该先启动，如：

![4](./imgs/4.png)

### 2)、启动服务后运行

使用net start mongodb或手动启动服务器运行客户端mongo.exe文件。

### 3)、可视化工具

当服务启动成功后，如果认为命令行操作不方便，可以使用robomongo等GUI工具。

官网：https://robomongo.org/

![5](./imgs/5.png)

 第二项是一个绿色版的，解压后在文件夹中找到exe文件直接运行即可。

运行后创建连接，与本地mongodb建立连接 

![6](./imgs/6.png)

![7](./imgs/7.png)


### 1.2、数据库操作

#### 1.2.1、创建数据库与查看数据库

打开新的命令窗口，切换至bin路径下，输入mongo

![8](./imgs/8.png)

![9](./imgs/9.png)

通过命令行命令可以查看数据库以及表的操作

以下实例我们创建了数据库gomall
```
> use gomall
switched to db gomall
> db
gomall
```
如果使用GUI工具在连接名称上右键create database也可以创建数据库：

![10](./imgs/10.png)

 创建成功后如下所示：

![11](./imgs/11.png)

Collections表示集合，类似关系数据库中的表。

Functions表示函数，类似关系数据库中的存储过程与函数。

Users表示用户。

document表示记录，类似关系数据为中的记录或行。

如果你想查看所有数据库，可以使用 show dbs 命令：
```
> show dbs
```
![12](./imgs/12.png)
MongoDB 中默认的数据库为 test，如果你没有创建新的数据库，集合将存放在 test 数据库中。

#### 1.2.2、删除数据库

```
> use gomall
switched to db gomall
> db.dropDatabase()
{ "dropped" : "gomall", "ok" : 1 }
```
或者在UI界面上：
![13](./imgs/13.png)

#### 1.2.3、插入数据

### a)、db.集合.insert(数据)

这里的数据可以是JSON

先打开shell脚本编写的界面，操作如下：

![14](./imgs/14.png)


db.products.insert({name:"iphone",price:1988});

从上图操作可以看出，没有去创建“products”集合，其实通过插入操作也会自动创建_id，是mongodb自已生成的，每行数据都会存在，默认是ObjectId，可以在插入数据时插入这个键的值(支持mongodb支持的所有数据类型)　

查看数据：db.getCollection('products').find({})

![15](./imgs/15.png)

b)、db.表名.save(数据);

db.products.save({_id:2,name:"HuWei P9",price:2988});

![16](./imgs/16.png)

_id可以自已插入、一个表中不一定要字段都相同，虽然insert和save方法都可以插入数据，当默认的“_id”值已存在时，调用insert方法插入会报错；而save方法不会,会更新相同的_id所在行数据的信息。

![17](./imgs/17.png)

c)、批量添加

mongodb的shell中可以使用javascript脚本，如

for(var i=0;i<5;i++) db.users.save({'_id':i,'name':'test'+i,'age':i+8});

![18](./imgs/18.png)

![19](./imgs/19.png)

#### 1.2.4、查询数据
### a)、查询集合中所有数据：db.集合.find();

db.users.find({name:'test0'});

![20](./imgs/20.png)

### b)、按条件查询（支持多条件）：db.集合.find(条件);

db.users.find({name:'zhangguo0',age:9}); 

对象中的条件要求同时成立

### c)、查询第一条（支持条件）：db.集合.findOne(条件);

### d)、限制数量：db.集合.find().limit(数量);

![21](./imgs/21.png)

### e)、跳过指定数量：db.表名.find().skip(数量);

![22](./imgs/22.png)

### f)、比较查询

大于：gt 小于：lt

大于等于：gte 小于等于：lte

非等于：$ne

db.users.find({age:{'$gt':9}});

查找年龄大于9且小于11岁的

db.users.find({age:{'$gt':9, '$lt':11}});

![23](./imgs/23.png)

### g)、查询数量：db.表名.find().count();

![24](./imgs/24.png)

### h)、排序：db.表名.find().sort({"字段名":1});

1：表示升序，-1：表示降序

![25](./imgs/25.png)

### i)、指定字段返回： db.表名.find({},{"字段名":0});  参数1：返回 0：不返回

![26](./imgs/26.png)

#### 1.2.5、修改

前面save在_id字段已存在是就是修改操作，按指定条件修改语法如下：

db.集合.update({"条件字段名":"字段值"},{$set:{"要修改的字段名":"修改后的字段值"}});

db.users.update({age:{'$eq':9}},{$set:{age:100}});

![27](./imgs/27.png)

修改多条：

db.users.updateMany({age:{"$gte":10}},{$set:{age:30}});

![28](./imgs/28.png)

![29](./imgs/29.png)

#### 1.2.6、删除

db.集合.remove(条件);

db.users.remove({age:{'$gte':10}});  删除年龄>=10岁的数据

![30](./imgs/30.png)
















