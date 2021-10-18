## 数据持久化 - MySQL

## 资源

- MySQL相关： 

  MySQL：[下载](https://dev.mysql.com/downloads) 

  node驱动：[⽂档](https://dev.mysql.com/downloads) 

  Sequelize：[⽂档](https://dev.mysql.com/downloads)、[api](http://docs.sequelizejs.com/) 

- mongodb相关： 

  MongoDB：[下载](https://www.mongodb.com/download-center/community) 

  node驱动：[⽂档](https://github.com/mongodb/node-mongodb-native) 

  mongoose：[⽂档](https://mongoosejs.com/docs/guide.html) 

- redis相关： 

  redis：[下载](https://redis.io/download) 

  node_redis：[⽂档](https://github.com/NodeRedis/node_redis)

### node.js中实现持久化的多种方法

- ⽂件系统 fs 

- 数据库 

  关系型数据库-mysql 

  ⽂档型数据库-mongodb 

  键值对数据库-redis

### node.js原生驱动

安装mysql模块： `npm i mysql2 --save` 

mysql2模块基本使用

```js
(async ()=>{
    const mysql = require('mysql2/promise')
    //连接
    const cfg={
        host:'localhost',
        user:'root',
        password:'123456',
        database:'test'
    }
    const connection = await mysql.createConnection(cfg);
    let ret = await connection.execute(`CREATE TABLE IF NOT EXISTS test(
        id INT NOT NULL AUTO_INCREMENT,
        message VARCHAR(45) NULL,
        PRIMARY KEY (id)
        )`)
        console.log('create',ret);
    ret = await connection.execute(`INSERT INTO test(message) VALUE(?)`,['aaa'])
    console.log('INSERT',ret);

    const [rows,fields] = await connection.execute(`SELECT * FROM test`)
    console.log('select:', rows);
})()
```

### Node.js ORM - Sequelize

- 概述：基于Promise的ORM(Object Relation Mapping)，⽀持多种数据库、事务、关联等

- 安装： `npm i sequelize mysql2 -S`

- 基本使用：

  ```js
  (async ()=>{
      const Sequelize = require('sequelize');
      //建立连接
      const sequelize=new Sequelize('test','root','123456',{
          host:'localhost',
          dialect:'mysql'
      })
      // 定义模型
      const Fruit = sequelize.define('Fruit',{
          id:{
              type:Sequelize.DataTypes.UUID,
              defaultValue:Sequelize.DataTypes.UUIDV1,
              primaryKey:true
          },
          name:{type:Sequelize.STRING(20),allowNull:false},
          price:{type:Sequelize.FLOAT,allowNull:false},
          stock:{type:Sequelize.INTEGER,defaultValue:0},
      })
      //同步数据库
      let ret = await Fruit.sync({force:false})
      console.log('sync',ret)
  
      ret=await Fruit.create({
          name:'香蕉',
          price:3.5
      })
      console.log('create',ret)
  
      ret = await Fruit.findAll()
      console.log('findall',JSON.stringify(ret));
  
      await Fruit.update({price:4},{
          where:{name:'香蕉'}
      })
      
      const Op=Sequelize.Op;
      ret = await Fruit.findAll({
          where:{price:{[Op.lt]:5,[Op.gt]:2}} // 价格在2-5之间
      })
      console.log('ret',JSON.stringify(ret));
      
  })()
  ```

  - 强制同步：创建表之前先删除已存在的表

    ```
    Fruit.sync({force: true})
    ```

  - 避免自动⽣成时间戳字段

    ```js
    const Fruit = sequelize.define("Fruit", {}, {
     	timestamps: false
    });
    ```

  - 指定表名： `freezeTableName: true` 或 `tableName:'xxx'`

    > 设置前者则以modelName作为表名；设置后者则按其值作为表名。 
    >
    > 蛇形命名 underscored: true, 
    >
    > 默认驼峰命名

    ```js
    const Fruit = sequelize.define("Fruit", {}, {
     	timestamps: false,
        tableName:'TAB_FRUIT',
        //underscored: true
    });
    ```

  - UUID-主键

    ```js
    id:{
                type:Sequelize.DataTypes.UUID,
                defaultValue:Sequelize.DataTypes.UUIDV1,
                primaryKey:true
            },
    ```


> Restful服务 
>
> 实践指南 http://www.ruanyifeng.com/blog/2014/05/restful_api.html 
>
> 原理 http://www.ruanyifeng.com/blog/2011/09/restful.html

> TODO List范例 
>
> https://github.com/BayliSade/TodoList 

关于新版本的警告问题 

https://segmentfault.com/a/1190000011583806

