## **Koa实战 **- **鉴权**

### **session-cookie**方式

cookie原理解析

```js
// cookie.js
const http = require("http")
http.createServer((req, res) => {
     if(req.url === '/favicon.ico'){
         res.end('')
         return
     }
     // 观察cookie存在
     console.log('cookie:', req.headers.cookie)
     // 设置cookie
     res.setHeader('Set-Cookie', 'cookie1=abc;')
     res.end('hello cookie!!')
 })
 .listen(3000)
```

- Header Set-Cookie负责设置cookie 
- 请求传递Cookie

session的原理解释

```js
// cookie.js
const http = require("http")
const session = {}
http.createServer((req, res) => {
     // 观察cookie存在
     console.log('cookie:', req.headers.cookie)
     const sessionKey = 'sid'
     const cookie = req.headers.cookie
     if(cookie && cookie.indexOf(sessionKey) > -1 ){
         res.end('Come Back ')
         // 简略写法未必具有通用性
         const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`)
         const sid = pattern.exec(cookie)[1]
         console.log('session:',sid ,session ,session[sid])
     } else {
         const sid = (Math.random() * 99999999).toFixed()
         // 设置cookie
         res.setHeader('Set-Cookie', `${sessionKey}=${sid};`)
         session[sid] = {name : 'laowang'}
         res.end('Hello')
     }
     res.end('hello cookie!!')
 })
 .listen(3000)
```

<img src="../.vuepress/public/assets/img/node/session.png" alt="1604728604168" style="zoom:80%;" />

**实现原理**： 

1. 服务器在接受客户端⾸次访问时在服务器端创建seesion，然后保存seesion(我们可以将 seesion保存在内存中，也可以保存在redis中，推荐使用后者)，然后给这个session⽣成⼀个唯⼀的标识字符串,然后在响应头中种下这个唯⼀标识字符串。 
2. 签名。这⼀步通过秘钥对sid进行签名处理，避免客户端修改sid。（非必需步骤） 
3. 浏览器中收到请求响应的时候会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求的请求头中会带上该域名下的cookie信息， 
4. 服务器在接受客户端请求时会去解析请求头cookie中的sid，然后根据这个sid去找服务器端保存的该客户端的session，然后判断该请求是否合法。

哈希Hash - SHA MD5 

```reStructuredText
把⼀个不定⻓摘要定⻓结果 

摘要 xsadakjd -> x4sdfdsafsdafl3s3 - 防篡改 

雪崩效应 shal md5 hmac
```

摘要 

对称DES

非对称 - RSA

### **Token** **验证**

- session不足
  - 服务器有状态 
- 不灵活如果APP该怎么办 跨域怎么办（cookie限制）

#### 原理

1.  客户端使用户名跟密码请求登录 
2.  服务端收到请求，去验证用户名与密码 
3.  验证成功后，服务端会签发⼀个令牌(Token)，再把这个 Token 发送给客户端 
4.  客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage里 
5.  客户端每次向服务端请求资源的时候需要带着服务端签发的 Token  
6.  服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据

```js
const Koa = require('koa')
const router = require('koa-router')()
const jwt = require("jsonwebtoken")
const jwtAuth = require("koa-jwt")
const secret = "it's a secret"
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const app = new Koa();
app.keys = ['some secret'];
app.use(static(__dirname + '/'));
app.use(bodyParser())
router.post("/users/login-token", async ctx => {
 const { body } = ctx.request;
 //登录逻辑，略
 //设置session
 const userinfo = body.username;
 ctx.body = {
 message: "登录成功",
 user: userinfo,
 // ⽣成 token 返回给客户端
 token: jwt.sign(
 {
     data: userinfo,
     // 设置 token 过期时间，⼀小时后，秒为单位
     exp: Math.floor(Date.now() / 1000) + 60 * 60
 },
 secret
 )
 };
});
router.get(
 "/users/getUser-token",
 jwtAuth({
 secret
 }),
 async ctx => {
// 验证通过，state.user
 console.log(ctx.state.user);
 
 //获取session
 ctx.body = {
 message: "获取数据成功",
 userinfo: ctx.state.user.data
 };
 }
);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```



#### JWT(JSON WEB TOKEN)原理解析

1. Bearer Token包含三个组成部分：令牌头、payload、哈希 

   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMTExMTEifSwiZXhwIjoxNTU3MTU1NzMwLCJpYXQiOjE1NTcxNTIxMzB9.pjGaxzX2srG_MEZizzmFEy7JM3t8tjkiu3yULgzFwUk 

2. 签名：默认使用base64对payload编码，使用hs256算法对令牌头、payload和密钥进行签名⽣成哈希 

3. 验证：默认使用hs256算法对hs256算法对令牌中数据签名并将结果和令牌中哈希比对

> HMAC SHA256 HMAC(Hash Message Authentication Code，散列消息鉴别码，基于密钥的Hash算法的认证协议。消息鉴别码实现鉴别的原理是，用公开函数和密钥产⽣⼀个固定⻓度的值 作为认证标识，用这个标识鉴别消息的完整性。使用⼀个密钥⽣成⼀个固定⼤小的小数据块，即MAC，并将其加⼊到消息中，然后传输。接收方利用与发送方共享的密钥进行鉴别认证等。 
>
> **BASE64** 按照RFC2045的定义，Base64被定义为：Base64内容传送编码被设计用来把任意序列的8位字节描述为⼀种不易被⼈直接识别的形式。（The Base64 Content-Transfer-Encoding is designed to represent arbitrary sequences of octets in a form that need not be humanly readable.） 常见于邮件、http加密，截取http信息，你就会发现登录操作的用户名、密码字段通 过BASE64编码的 
>
> **Beare** 
>
> Beare作为⼀种认证类型(基于OAuth 2.0)，使用"Bearer"关键词进行定义 
>
> **参考文档：** 
>
> jsonwebtoken、koa-jwt 
>
> 阮⼀峰 JWT解释 
>
> http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

### OAuth(开放授权)

概述：三方登⼊主要基于OAuth 2.0。OAuth协议为用户资源的授权提供了⼀个安全的、开放而又简易的标准。与以往的授权方式不同之处是OAUTH的授权不会使第三方触及到用户的帐号信息如用户名与密码），即第三方无使用户的用户名与密码就可以申请获得该用户资源的授权， 

因此OAUTH是安全的。