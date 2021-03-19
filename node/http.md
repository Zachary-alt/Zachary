## 网络编程 http https http2 websocket

### HTTP协议

```shell
// 观察HTTP协议
curl -v http://www.baidu.com
```

- [http协议详解](https://blog.csdn.net/weixin_38087538/article/details/82838762) 

- 创建接⼝，api.js

  ```js
  // /http/api.js
  const http = require("http");
  const fs = require("fs");
  http.createServer((req, res) => {
   const { method, url } = req;
   if (method == "GET" && url == "/") {
   fs.readFile("./index.html", (err, data) => {
       res.setHeader("Content-Type", "text/html");
       res.end(data);
   });
   } else if (method == "GET" && url == "/api/users") {
       res.setHeader("Content-Type", "application/json");
       res.end(JSON.stringify([{ name: "tom", age: 20 }]));
   }
   }).listen(3000);
  ```

- 请求接口

  ```html
  // index.html
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script> <script>
   (async () => {
       const res = await axios.get("/api/users")
       console.log('data',res.data)
       document.writeln(`Response : ${JSON.stringify(res.data)}`)
   })()
  </script>
  ```

- 埋点更容易

  ```js
  const img = new Image()
  img.src='/api/users?abc=123'
  ```

### 协议 端口 host

- 跨域：浏览器同源策略引起的接⼝调⽤问题

  ```js
  // proxy.js
  const express = require('express')
  const app = express()
  app.use(express.static(__dirname + '/'))
  module.exports = app
  
  // index.js
  const api = require('./api')
  const proxy = require('./proxy')
  api.listen(4000)
  proxy.listen(3000)
  ```

  ```js
  // 或者通过baseURL⽅式
  axios.defaults.baseURL = 'http://localhost:4000'
  ```

  浏览器抛出跨域错误

- 常⽤解决方案：

  1. JSONP(JSON with Padding)，前端+后端⽅案，绕过跨域 

  > 前端构造script标签请求指定URL（由script标签发出的GET请求不受同源策略限制），服务器返回⼀个函数执⾏语句，该函数名称通常由查询参callback的值决定，函数的参数为服务器返回的json数据。该函数在前端执⾏后即可获取数据。 

  2. 代理服务器 

  > 请求同源服务器，通过该服务器转发请求⾄⽬标服务器，得到结果再转发给前端。 
  >
  > 前端开发中测试服务器的代理功能就是采⽤的该解决⽅案，但是最终发布上线时如果web应⽤和接⼝服务器不在⼀起仍会跨域。 

  3. CORS(Cross Origin Resource Share) - 跨域资源共享，后端⽅案，解决跨域

  > 原理：cors是w3c规范，真正意义上解决跨域问题。它需要服务器对请求进⾏检查并对响应头做相应处理，从⽽允许跨域请求。

### 预检请求

具体实现：

响应简单请求: 动词为get/post/head，没有⾃定义请求头，Content-Type是application/x-www-form-urlencoded，multipart/form-data或text/plain之⼀，通过添加以下响应头解决：

```js
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
```

> 该案例中可以通过添加⾃定义的x-token请求头使请求变为preflight请求

```js
// index.html
axios.defaults.baseURL = 'http://localhost:3000';
axios.get("/users", {headers:{'X-Token':'jilei'}})
```

响应preflight请求，需要响应浏览器发出的options请求（预检请求），并根据情况设置响应头：

```js
else if (method == "OPTIONS" && url == "/api/users") {
     res.writeHead(200, {
         "Access-Control-Allow-Origin": "http://localhost:3000",
         "Access-Control-Allow-Headers": "X-Token,Content-Type",
         "Access-Control-Allow-Methods": "PUT"
     });
     res.end();
 }
```

则服务器需要允许x-token，若请求为post，还传递了参数：

```js
// index.html
axios.post("http://localhost:3000/users", {foo:'bar'}, {headers:{'X-Token':'jilei'}})
// http-server.js
else if ((method == "GET" || method == "POST") && url == "/users") {}
```

如果要携带cookie信息，则请求变为credential请求：

```js
// index.js
// 预检options中和/users接⼝中均需添加
res.setHeader('Access-Control-Allow-Credentials', 'true');
// 设置cookie
res.setHeader('Set-Cookie', 'cookie1=va222;')
// index.html
// 观察cookie存在
console.log('cookie',req.headers.cookie)
// ajax服务
axios.defaults.withCredentials = true
```

### Proxy代理模式

```js
var express = require('express');
const proxy = require('http-proxy-middleware')
const app = express()
app.use(express.static(__dirname + '/'))
app.use('/api', proxy({ target: 'http://localhost:4000', changeOrigin: false}));
module.exports = app
```

