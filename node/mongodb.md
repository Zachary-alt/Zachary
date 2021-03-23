## 持久化之mongodb

### mongodb安装、配置

- [下载安装](https://www.runoob.com/mongodb/mongodb-window-install.html) 

- 配置环境变量 

- 创建dbpath⽂件夹 

- 启动：

  ```
  mongo
  // 默认连接
  ```

- 测试：

  ```js
  // 查询所有数db据库
  show dbs
  // 切换/创建数据库,当创建⼀个集合(table)的时候会⾃动创建当前数据库
  use test
  // 插⼊⼀条数据
  db.fruits.save({name:'苹果',price:5})
  // 条件查询
  db.fruits.find({price:5})
  `1234`
  // 得到当前db的所有聚集集合
  db.getCollectionNames()
  
  // 查询
  db.fruits.find()
  ```

  > [mongo命令⾏操作](https://docs.mongodb.com/manual/reference/method/) 

  参考资料 

  菜⻦⽂档 

  http://www.runoob.com/mongodb/mongodb-create-database.html 

  官⽹ 

  https://docs.mongodb.com/manual/reference/method/

###  mongodb原生驱动

> http://mongodb.github.io/node-mongodb-native/3.1/quick-start/quick-start/ 
>
> 官⽹API

安装mysql模块： `npm install mongodb --save` 

连接mongodb

```js
(async () => {
     const { MongoClient: MongoDB } = require('mongodb')

     // 创建客户端
     const client = new MongoDB(
         'mongodb://localhost:27017',
         {
         	userNewUrlParser: true
         }
     )
     let ret
     // 创建连接
     ret = await client.connect()
     console.log('ret:', ret)

     const db = client.db('test')

     const fruits = db.collection('fruits')

     // 添加⽂档
     ret = await fruits.insertOne({
         name: '芒果',
         price: 20.1
     })
     console.log('插⼊成功', JSON.stringify(ret))
     // 查询⽂档
     ret = await fruits.findOne()
     console.log('查询⽂档:', ret)

     // 更新⽂档
     // 更新的操作符 $set
     ret = await fruits.updateOne({ name: '芒果' },
     { $set: { name: '苹果' } })
     console.log('更新⽂档', JSON.stringify(ret.result))

     // 删除⽂档
     ret = await fruits.deleteOne({name: '苹果'})

     await fruits.deleteMany()

     client.close()
 
 })()
```

案例：⽠果超市 

提取数据库配置,./models/conf.js

```js
// models/conf.js
module.exports = {
 url: "mongodb://localhost:27017",
 dbName: 'test', 
}
```

封装数据库连接，./models/db.js

```js
const conf = require('./conf')
const { EventEmitter } = require('events')

// 客户端
const { MongoClient } = require('mongodb')

class Mongodb {
    constructor(conf) {
        this.conf = conf
        this.emmiter = new EventEmitter()
        this.client = new MongoClient(conf.url, {
            useNewUrlParser: true
        })
        this.client.connect(err => {
            if (err) throw err
            console.log('连接成功')
            this.emmiter.emit('connect')
        })

        
    }
    col(colName, dbName = conf.dbName){
        return this.client.db(dbName).collection(colName)
    }
    once(event,cb){
        this.emmiter.once(event,cb)
    }
}

module.exports = new Mongodb(conf)
```

- eventEmmiter

  ```js
  // eventEmmiter.js
   const EventEmitter = require('events').EventEmitter;
   const event = new EventEmitter();
   event.on('some_event', num => {
   	console.log('some_event 事件触发:'+num);
   });
   let num = 0
   setInterval(() => {
   	event.emit('some_event' , num ++ );
   }, 1000);
  ```

添加测试数据，./initData.js

```js
const mongodb = require('./models/db')
mongodb.once('connect', async () => {
    const col = mongodb.col('fruits')
    // 删除已存在
    await col.deleteMany()
    const data = new Array(100).fill().map((v, i) => {
        return { name: "XXX" + i, price: i, category: Math.random() > 0.5 ? '蔬菜' : '水果' }
    })

    // 插入
    await col.insertMany(data)
    console.log("插入测试数据成功")
})
```

接⼝编写，index.js

```js
const express = require("express")
const app = express()
const path = require("path")
const mongo = require("./models/db")
// const testdata = require("./initData")

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.get("/api/list", async (req, res) => {
    // 分⻚查询
    const { page, category, keyword } = req.query
    // 构造条件
    const condition = {}
    if (category) {
        condition.category = category
    }
    if (keyword) {
        condition.name = { $regex: new RegExp(keyword) }
    }
    try {
        const col = mongo.col("fruits")
        const total = await col.find(condition).count()
        const fruits = await col
            .find(condition)
            .skip((page - 1) * 5)
            .limit(5)
            .toArray()
        res.json({ ok: 1, data: { fruits, pagination: { total, page } } })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/category", async (req, res) => {
    const col = mongo.col("fruits")
    const data = await col.distinct('category')
    res.json({ ok: 1, data })
})

app.listen(3000)
```

操作符 

https://docs.mongodb.com/manual/reference/operator/query/ 

### ODM - Mongoose

安装： `npm install mongoose -S`

