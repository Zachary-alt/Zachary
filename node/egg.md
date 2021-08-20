## egg-实战

> https://eggjs.org/zh-cn/

### 创建项目

```shell
# 创建项⽬
npm i egg-init -g
egg-init egg-server
cd egg-server
npm i
# 启动项⽬
npm run dev
open localhost:7001
```

### 添加swagger-doc

添加Controller⽅法

```js
// app/controller/user.js
const Controller = require('egg').Controller
/**
 * @Controller ⽤户管理
 */
class UserController extends Controller {
 constructor(ctx) {
 	super(ctx)
 }
 /**
 * @summary 创建⽤户
 * @description 创建⽤户，记录⽤户账户/密码/类型
 * @router post /api/user
 * @request body createUserRequest *body
 * @response 200 baseResponse 创建成功
 */
 async create() {
     const { ctx } = this
     ctx.body = 'user ctrl'
 }
}
module.exports = UserController
```

contract

```js
// app/contract/index.js
'use strict';
module.exports = {
  baseRequest: {
    id: { type: 'string', description: 'id 唯⼀键', required: true, example: '1' },
  },
  baseResponse: {
    code: { type: 'integer', required: true, example: 0 },
    data: { type: 'string', example: '请求成功' },
    errorMessage: { type: 'string', example: '请求成功' },
  },
};

// /app/contract/user.js
'use strict';
module.exports = {
  createUserRequest: {
    mobile: { type: 'string', required: true, description: '⼿机号', example: '18801731528', format: /^1[34578]\d{9}$/ },
    password: { type: 'string', required: true, description: '密码', example: '111111' },
    realName: { type: 'string', required: true, description: '姓名', example: 'Tom' },
  },
};
```

#### 添加SwaggerDoc功能

```shell
npm install egg-swagger-doc-feat -S
```

```js
// config/plugin
swaggerdoc : {
 enable: true,
 package: 'egg-swagger-doc-feat', 
}
```

```js
// config.default.js
config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: '测试接⼝',
      description: '测试接⼝ swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    enableSecurity: false,
    // enableValidate: true,
    routerMap: true,
    enable: true,
  };
```

http://localhost:7001/swagger-ui.html 

http://localhost:7001/swagger-doc

### 增加异常处理中间件

```js
// /middleware/error_handler.js
'use strict';
module.exports = (options, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发⼀个 error 事件，框架会记录⼀条错误⽇志
      app.emit('error', err, this);
      const status = err.status || 500;
      // ⽣产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status,
        error,
      };
      if (status === 422) {
        ctx.body.derail = err.errors;
      }
      ctx.status = 200;
    }
  };
};
```

```js
// config.default.js
config.middleware = ['errorHandler']
```

### helper方法实现统⼀响应格式

Helper 函数⽤来提供⼀些实⽤的 utility 函数。 

它的作⽤在于我们可以将⼀些常⽤的动作抽离在 helper.js ⾥⾯成为⼀个独⽴的函数，这样可以⽤JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有⼀个好处是 Helper 这样⼀个简单的函数，可以让我们更容易编写测试⽤例。 

框架内置了⼀些常⽤的 Helper 函数。我们也可以编写⾃定义的 Helper 函数。

```js
'use strict';
const moment = require('moment');
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');
// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg,
  };
  ctx.status = 200;
};
```

### Validate检查参数

```shell
npm i egg-validate -S
```

```js
// config/plugin.js
validate: {
     enable: true,
     package: 'egg-validate',
 },
```

```js
async create() {
 const { ctx, service } = this
 // 校验参数
 ctx.validate(ctx.rule.createUserRequest) 
 }
```

### 添加Model层

```shell
npm install egg-mongoose -S
```

```js
// plugin.js
mongoose : {
 enable: true,
 package: 'egg-mongoose',
},
```

```js
config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_x',
    options: {
    // useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  };
```

```js
// model/user.js
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    realName: { type: String, required: true },
    avatar: { type: String, default:
   'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm' },
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model('User', UserSchema);
};
```

### 添加Service层

```shell
npm install egg-bcrypt -S
```

```js
bcrypt : {
 enable: true,
 package: 'egg-bcrypt'
 }
```

```js
// service/user.js
const Service = require('egg').Service
class UserService extends Service {
 
 /**
 * 创建⽤户
 * @param {*} payload
 */
 async create(payload) {
 const { ctx } = this
     payload.password = await this.ctx.genHash(payload.password)
     return ctx.model.User.create(payload)
 }
}
module.exports = UserService
```

### Controller调用

```js
/**
   * @summary 创建用户
   * @description 创建用户，记录用户账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(ctx.rule.createUserRequest);
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    const res = await service.user.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
```

### **通过生命周期初始化数据**

https://eggjs.org/en/basics/app-start.html#mobileAside

```js
// /app.js
'use strict';
/**
 *  全局定义
 * @param app
 */

class AppBootHook {
  constructor(app) {
    this.app = app;
    app.root_path = __dirname;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    console.log('========Init Data=========');
    const ctx = await this.app.createAnonymousContext();
    await ctx.model.User.remove();
    await ctx.service.user.create({
      mobile: '18911111111',
      password: '111111',
      realName: 'zhao',
    });
  }

  async serverDidReady() {

  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook;
```

### **用户鉴权模块**

注册jwt模块

```shell
npm i egg-jwt -S
```

```js
// plugin.js
jwt: {
 enable: true,
 package: 'egg-jwt', 
 }
 
 // config.default.js
 config.jwt = {
     secret: 'Great4-M',
     enable: true, // default is false
     match: /^\/api/, // optional
 }
```

#### Service层

```js
'use strict';
const { Service } = require('egg');

class ActionTokenService extends Service {
  async apply(_id) {
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data: {
        _id,
      },
      exp: Math.floor(Date.now() / 1000 + (60 * 60 * 7)),
    }, ctx.app.config.jwt.secret);
  }

}
module.exports = ActionTokenService;
```

```js
// service/userAccess.js
'use strict';
const { Service } = require('egg');
class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByMobile(payload.mobile);
    console.log('88888mobile' + payload.moblie);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    const verifyPsw = await ctx.compare(payload.password, user.password);
    if (!verifyPsw) {
      ctx.throw(404, 'user password is error');
    }
    // 生成Token令牌
    return { token: await service.actionToken.apply(user._id) };
  }
  async logout() {
  }

  async current() {
    const { ctx, service } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    user.password = 'How old are you?';
    return user;
  }
}

module.exports = UserAccessService;
```

#### Contract层

```js
'use strict';
// app/contract/userAccess.js
module.exports = {
  loginRequest: {
    mobile: { type: 'string', required: true, description: '手机号', example: '18801731528', format: /^1[34578]\d{9}$/ },
    password: { type: 'string', required: true, description: '密码', example: '111111' },
  },
};
```

#### Controller层

```js
// controller/userAccess.js
'use strict';
const Controller = require('egg').Controller;
/**
 * @Controller 用户鉴权
 */
class UserAccessController extends Controller {
  /**
   * @summary 用户登入
   * @description 用户登入
   * @router post /auth/jwt/login
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async login() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(ctx.rule.loginRequest);
    // 组装参数
    const payload = ctx.request.body || {};

    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 用户登出
   * @description 用户登出
   * @router post /auth/jwt/logout
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async logout() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    await service.userAccess.logout();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = UserAccessController;
```

### **文件上传**

```js
npm i await-stream-ready stream-wormhole image-downloader -S
```

controller

```js
'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const dowload = require('image-downloader');

/**
 * @controller 上传
 */
class UploadController extends Controller {
  /**
     * @summary 上传单个⽂件
     * @description 上传单个⽂件
     * @router post /api/upload/single
     */
  async create() {
    const { ctx } = this;
    // 要通过 ctx.getFileStream 便捷的获取到⽤户上传的⽂件，需要满⾜两个条件：
    // 只⽀持上传⼀个⽂件。
    // 上传⽂件必须在所有其他的 fields 后⾯，否则在拿到⽂件流时可能还获取不到fields。
    const stream = await ctx.getFileStream();
    // 所有表单字段都能通过 `stream.fields` 获取到
    const filename = path.basename(stream.filename); // ⽂件名称
    const extname = path.extname(stream.filename).toLowerCase(); // ⽂件扩展名称
    const uuid = (Math.random() * 999999).toFixed();

    // 组装参数 stream
    const target = path.join(this.config.baseDir, 'app/public/uploads', `${uuid}${extname}`);
    const writeStream = fs.createWriteStream(target);
    // ⽂件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (error) {
      // 必须将上传的⽂件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(writeStream);
      throw error;
    }
    // 调⽤ Service 进⾏业务处理
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}
module.exports = UploadController;
```

