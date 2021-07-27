## 主流浏览器

| 浏览器  |           内核            |
| :-----: | :-----------------------: |
|   IE    |          Trident          |
| Chrome  |      Webkit -> Blink      |
| FireFox |           Gecko           |
| Safari  |          Webkit           |
|  Opera  | Presto -> Webkit -> Blink |

## meta 标签

> 共有两个属性，分别是`http-equiv`属性和`name`属性

1. `http-equiv`属性

   ```html
   <meta http-equiv="参数" content="具体的描述" />
   ```

   - `content-type`

     用于设定网页字符集，便于浏览器解析与渲染页面

     ```html
     <!-- 旧html -->
     <meta http-equiv="content-type" content="text/html; charset=utf-8" />
     <!-- html5 -->
     <meta charset="utf-8" />
     ```

   - `set-cookie`

     设置cookie的一种方式，也可以指定过期时间

     ```html
     <meta http-equiv="set-cookie" content="name=value expires=Fri, 12 Jan 2001 18:18:18 GMT,path=/"/>
     ```

   - `X-UA-Compatible`

     告知浏览器以何种版本来渲染页面

     ```html
     <!-- 指定IE和Chrome使用最新版本渲染当前页面 -->
     <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
     ```

   - `cache-control`

     指定请求和响应遵循的缓存机制

     ```html
     <meta http-equiv="cache-control" content="no-cache" />
     ```

     - no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。
     - no-store: 不允许缓存，每次都要去服务器下载完整的响应。（安全措施）

2. `name`属性

   ```html
   <meta name="参数" content="具体的描述" />
   ```

   - `keywords`

     告诉搜索引擎，网页的关键字

     ```html
     <meta name="keywords" content="前端" />
     ```

   - `description`

     告诉搜索引擎，网站的主要内容

     ```html
     <meta name="description" content="前端编程" />
     ```

   - `viewport`

     控制页面缩放，常用于移动端网页

     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <!-- 
       viewport参数详解：
       width：宽度（数值 / device-width）（默认为980 像素）
       height：高度（数值 / device-height）
       initial-scale：初始的缩放比例 （范围从>0 到10）
       minimum-scale：允许用户缩放到的最小比例
       maximum-scale：允许用户缩放到的最大比例
       user-scalable：用户是否可以手动缩 (no,yes)
      -->
     ```

## link 标签

- link

  ```html
  <link rel="stylesheet" href="x.css" />
  ```

- import

  ```html
  <style>
    @import url(x.css);
  </style>
  ```

- 区别

  1. link 属于`XHTML`标签，而`@import`是`CSS`提供的
  2. 页面加载的时候，`link`会同时被加载，而`@import`引用的`CSS`会等到页面被加载完再加载
  3. import 是`CSS2.1` 提出的，只在`IE5`以上才能被识别，而`link`是`XHTML`标签，无兼容问题
  4. `link`方式的样式权重高于`@import`的权重

## async / defer

- 普通的`script`标签

  浏览器会停止解析`dom`，加载和执行`js`文件后，再继续解析

  ```html
  <script src="a.js"></script>
  ```

- `async`

  `HTML5`中定义，不阻塞`dom`的解析，`js`一旦加载好立马执行，执行顺序未知

  ```html
  <script src="b.js" async></script>
  <script src="c.js" async></script>
  ```

- `defer`

  `HTML4`中定义，不阻塞`dom`的解析，加载好之后不会立马执行，等页面解析完，依次执行

  ```html
  <script src="d.js" defer></script>
  <script src="e.js" defer></script>
  ```

- 如果`script`标签无`src`属性，则`defer`和`async`都被忽略，动态添加的`script`标签隐含`async`属性

## Canvas / SVG

- Canvas

  ```html
  <canvas id="myCanvas" width="200" height="100"></canvas>
  <!-- canvas元素本身是没有绘图能力的，所有的绘制工作必须在JavaScript内部完成 -->
  <script>
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle("#FF0000");
    ctx.fillRect(0, 0, 150, 75);
  </script>
  ```

- SVG

  可伸缩矢量图形，使用 XML 格式定义图形，在放大或改变尺寸的情况下图形质量不会有损失

| Canvas                                             | SVG                                                     |
| -------------------------------------------------- | ------------------------------------------------------- |
| 依赖分辨率                                         | 不依赖分辨率                                            |
| 一整副画布，不支持事件处理器                       | 每一个图形都是独立的DOM节点，支持事件处理器             |
| 弱的文本渲染能力                                   | 最适合带有大型渲染区域的应用程序（比如谷歌地图）        |
| 能够以 .png 或 .jpg 格式保存结果图像               | 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快） |
| 最适合图像密集型的游戏，其中的许多对象会被频繁重绘 | 不适合游戏应用                                          |

### 总结

共同点：都是有效的图形工具，对于数据较小的情况下，都很又高的性能，它们都使用 JavaScript 和 HTML；它们都遵守万维网联合会 (W3C) 标准。

- svg优点：

  矢量图，不依赖于像素，无限放大后不会失真。

  以dom的形式表示，事件绑定由浏览器直接分发到节点上。

- svg缺点：

  dom形式，涉及到动画时候需要更新dom，性能较低。

- canvas优点：

  定制型更强，可以绘制绘制自己想要的东西。

  非dom结构形式，用JavaScript进行绘制，涉及到动画性能较高。

- canvas缺点：

  事件分发由canvas处理，绘制的内容的事件需要自己做处理。

  依赖于像素，无法高效保真，画布较大时候性能较低。

## 本地存储

|              |                           `Cookie`                           |       `localStorage`       |              `sessionStorage`              |
| ------------ | :----------------------------------------------------------: | :------------------------: | :----------------------------------------: |
| 有效期       | 一般由服务端生成，可设置失效时间，如果在浏览器端生成，默认是关闭浏览器后失效 | 除非手动清除，否则永久保存 | 仅当前会话下有效，关闭页面或浏览器后被清除 |
| 存储大小     |                           `4K`左右                           |          `5M`左右          |                  `5M`左右                  |
| 与服务端通信 |                 每次都会携带`http`的请求头中                 |           不参与           |                   不参与                   |

## 图片懒加载和预加载

- 懒加载

  - 也叫延迟加载，指的是在长网页中延迟加载图片，用户滚动到它们之前，可视区域外的图像不会加载

  - 当访问一个页面的时候，先把 img 标签的 src 属性设为空字符串，而图片的真正路径则设置在 data-src属性中，当页面滚动的时候需要去监听 scroll 事件，在 scroll 事件的回调中，判断懒加载的图片是否进入可视区域，如果在就将图片的 src 属性设置为 data-src的值

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
        <style>
          img {
            display: block;
            /* width: 100%; */
            height: 300px;
          }
        </style>
      </head>
      <body>
        <img src="" data-src="./web.png" />
        <img src="" data-src="./web1.png" />
        <img src="" data-src="./web2.png" />
        <img src="" data-src="./web3.png" />
        <img src="" data-src="./web4.png" />
        <img src="" data-src="./web5.png" />
        <img src="" data-src="./web6.png" />
        <img src="" data-src="./web7.png" />
        <img src="" data-src="./web8.png" />
        <img src="" data-src="./web9.png" />
        <img src="" data-src="./web10.png" />
        <img src="" data-src="./web11.png" />
        <img src="" data-src="./web12.png" />
        <img src="" data-src="./web13.png" />
        <img src="" data-src="./web14.png" />
      </body>
      <script>
        var imgs = document.querySelectorAll("img");
        function getTop(e) {
          return e.offsetTop
        }
    
        function lazyLoad(imgs) {
          var h = window.innerHeight
          var s = document.documentElement.scrollTop;
          for (let i = 0; i < imgs.length; i++) {
            if (h + s > getTop(imgs[i])) {
              imgs[i].src = imgs[i].getAttribute("data-src");
            }
          }
        }
    
        window.onload = window.onscroll = function() {
          lazyLoad(imgs);
        };
      </script>
    </html>
    ```

- 预加载

  - 预加载简单来说就是将所有所需的资源提前请求加载到本地，这样后面在需要用到时就直接从缓存取资源
  - 实现方式
    1. 用 CSS 和 JavaScript 实现预加载
    2. 仅使用 JavaScript 实现预加载
    3. 使用 Ajax 实现预加载

## 浏览器工作原理

- 加载
  1. 浏览器根据 DNS 服务器得到域名的 IP 地址
  2. 向这个 IP 的机器发送 HTTP 请求
  3. 服务器收到、处理并返回 HTTP 请求
  4. 浏览器得到并返回内容
- 渲染
  1. 根据 HTML 结构生成 DOM 树
  2. 根据 CSS 生成 CSSOM
  3. 将 DOM 和 CSSOM 整合形成 Render Tree
  4. 根据 Render Tree 开始渲染和展示
  5. 遇到`script`标签时，会执行并阻塞渲染，所以推荐将其放在 body 底部
  6. `JS` 会阻塞 `DOM` 解析
  7. `CSS` 不会阻塞 `DOM` 的解析，但是会阻塞页面渲染

经典问题：[从url输入到返回请求的过程](https://juejin.cn/post/6928677404332425223)

## 回流重绘

- 浏览器渲染过程

  1. 浏览器使用流式布局模型
  2. 浏览器会把 HTML 解析成 DOM，把 CSS 解析成 CSSOM，DOM 和 CSSOM 合并产生了 Render Tree
  3. 有了 Render Tree，就知道所有节点的样式，然后计算节点在页面中的大小和位置，最后把节点绘制到页面上
  4. 由于浏览器使用流式布局，对 Render Tree 的计算通常只需要遍历一次就可以完成，但 table 及其内部元素除外，他们需要多次计算，通常要花 3 倍同等元素的时间，所以要避免使用 table 布局

- 回流

  当 Render Tree 中部分或全部元素的尺寸、结构或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流

  1. 页面首次渲染

  2. 浏览器窗口大小发生改变

  3. 元素尺寸或位置发生改变

  4. 元素内容变化（文字数量或图片大小等）

  5. 元素字体大小变化

  6. 添加或删除可见的 DOM 元素

  7. 激活 CSS 伪类

  8. 查询某些属性或调用某些方法

     ```js
     clientWidth、clientHeight、clientTop、clientLeft
     offsetWidth、offsetHeight、offsetTop、offsetLeft
     scrollWidth、scrollHeight、scrollTop、scrollLeft
     scrollIntoView()、scrollIntoViewIfNeeded()
     getComputedStyle()
     getBoundingClientRect()
     scrollTo()
     ```

- 重绘

  当页面中元素样式的改变并不影响它在文档流中的位置时（比如：color、background-color、visibility 等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

- 性能影响

  回流必会引起重绘，重绘不一定回流，回流比重绘的代价高

  现代浏览器对频繁的回流或重绘操作进行优化：

  浏览器会维护一个队列，把所有引起回流和重绘的操作放到队列中，如果队列中的任务数量或者时间达到一个阈值，（至少一个浏览器刷新帧 16ms，60 赫兹刷新率的屏幕，1000ms/60）浏览器就会将队列清空，但是在获取布局尺寸等信息时，为保证准确性，当访问一下属性或方法时，浏览器也会立即清空队列

  ```js
  clientWidth、clientHeight、clientTop、clientLeft
  offsetWidth、offsetHeight、offsetTop、offsetLeft
  scrollWidth、scrollHeight、scrollTop、scrollLeft
  width、height
  getComputedStyle()
  getBoundingClientRect()
  ```

- 如何避免

  避免使用 table 布局

  尽可能在 DOM 树的最末端改变 class： 减小回流的范围

  将动画效果应用到`position`属性为`absolute`或`fixed`的元素上 ，避免影响其他元素的布局，这样只是一个重绘，而不是回流；

  避免使用`CSS`表达式（例如：`calc()`）

  避免频繁操作样式，最好一次性重写`style`属性，或者将样式列表定义为`class`并一次性更改`class`属性

  避免频繁操作`DOM`

  也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的`DOM`操作不会引发回流和重绘

## 浏览器缓存

> 浏览器缓存过程
>
> 1. 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
> 2. 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

- 缓存位置

  - Service Worker

    - 运行在浏览器背后的独立线程，一般可以用来实现缓存功能
    - 传输协议必须为HTTPS，因为Service Worker中涉及到请求拦截，用HTTPS保障安全
    - Service Worker的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的
    - Service Worker实现缓存功能一般分为三个步骤：首先需要先注册Service Worker，然后监听到install事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就直接读取缓存文件，否则就去请求数据
    - 当Service Worker没有命中缓存的时候，会根据缓存查找优先级去查找数据

  - Memory Cache

    内存中的缓存，主要包含的是当前页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等，读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，但是缓存持续性很短，会随着进程的释放而释放，一旦关闭tab页，内存中的缓存也就被释放了

  - Disk Cache

    磁盘缓存，容量和时效性比Memory Cache强，也是所有浏览器缓存中覆盖面最大的，可以根据HTTP头信息设置网页是否缓存，并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据

  - Push Cache

    推送缓存，是HTTP/2中的内容，当以上三种缓存都没有命中时才会使用，它只在会话(session)中存在，一旦会话结束就被释放，并且缓存时间也很短暂，Chrome中只有五分钟左右，同时也并非严格执行HTTP头部中缓存指令

- 强缓存

  不会向服务器发送请求，直接从缓存中读取资源，在Chrome控制台的network中可以看到该请求返回200的状态码，并且size显示from disk cache或from memory cache，强缓存可以通过设置两种HTTP Header实现：Expires和Cache-Control

  - Expires

    缓存过期时间，用来指定资源到期的时间，是服务器端的具体的时间点。

    ```js
    Expires: Wed, 27 May 2020 06:37:06 GMT
    ```

    这个表示资源在这个时间过期，过期之后就得向服务器发请求，Expires是HTTP/1.0的产物，受限于本地时间，如果修改了本地时间，就会造成缓存失效

  - Cache-Control

    在HTTP/1.1中，采用了Cache-Control，和Expires不同的是没有采用过期时间这种方式，而是采用过期时长来控制缓存，对应的字段是max-age

    ```js
    Cache-Control:max-age=3600
    ```

    | 指令         | 作用                                                         |
    | ------------ | ------------------------------------------------------------ |
    | public       | 表示响应可以被客户端和代理服务器缓存                         |
    | private      | 表示响应只可以被客户端缓存                                   |
    | max-age=30   | 缓存30秒后就过期，需要重新请求                               |
    | s-maxage=30  | 覆盖max-age，作用一样，只在代理服务器中生效，优先级高于max-age |
    | no-store     | 不缓存任何响应                                               |
    | no-cache     | 跳过当前的强缓存，发送HTTP请求，即直接进入协商缓存阶段       |
    | max-stale=30 | 30秒内，即使缓存过期，也使用该缓存                           |
    | min-fresh=30 | 希望在30秒内获取最新的响应                                   |

  - 其实这两者差别不大，区别就在于 Expires 是http1.0的产物，Cache-Control是http1.1的产物，当**Expires**和**Cache-Control**同时存在的时候，**Cache-Control**会优先考虑

- 协商缓存

  强制缓存失效后，浏览器在请求头中携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，这种缓存标识分为两种：**Last-Modified** 和 **ETag**

  - Last-Modified

    即最后修改时间，浏览器在第一次访问资源时，服务器返回资源的同时，在response header中添加Last-Modified的header，值是这个资源在服务器上的最后修改时间，浏览器接收缓存文件和header；

    浏览器下一次请求这个资源，浏览器检测到有Last-Modified这个header，于是添加If-Modified-Since这个header，值就是Last-Modified的值，服务器再次收到这个资源请求，会根据If-Modified-Since中的值与服务器中这个资源的最后修改时间对比，如果没有变化，返回304和空的响应体，直接从缓存读取，如果If-Modified-Since的时间小于服务器中这个资源的最后修改时间，说明文件有更新，于是返回新的资源文件和200

    弊端：

    - 如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成Last-Modified被修改，服务端不能命中缓存导致发送相同的资源
    - 因为Last-Modified只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源

  - ETag

    Etag是服务器响应请求时，返回当前资源文件的一个唯一标识（服务器生成），只要资源有变化，Etag就会重新生成。浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的Etag值放到request header里的If-None-Match里，服务器只需要比较客户端传来的If-None-Match和自己服务器上该资源的Etag是否一致，就能判断资源相对客户端而言是否被修改过了，如果服务器发现Etag匹配不上，那么就会返回新的资源，和常规的HTTP请求响应流程一样，如果Etag是一致的，则直接返回304使用本地缓存

  - 两者对比

    - 精确度上，Etag要优于Last-Modified，Last-Modified的时间单位是秒，如果某个文件在1秒内改变了多次，那么他们的Last-Modified其实并没有体现出来修改，但是Etag每次都会改变确保了精度；如果是负载均衡的服务器，各个服务器生成的Last-Modified也有可能不一致。
    - 性能上，Etag要逊于Last-Modified，Last-Modified只需要记录时间，而Etag需要服务器通过算法来计算出一个hash值。
    - 优先级上，服务器校验优先考虑Etag

- [HTTP header 探索](http://feg.netease.com/archives/680.html)

- 缓存机制

  强制缓存优先于协商缓存，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中，生效则返回304，继续使用缓存

- 用户行为对浏览器缓存的影响

  - 打开网页，地址栏输入地址：查找disk cache中是否有匹配，有则使用，没有则发送请求
  - 普通刷新(F5)：因为tab页没有关闭，可以使用memory cache，如果匹配的话被优先使用，其次才是disk cache
  - 强制刷新(Ctrl + F5)：浏览器不使用缓存，因此发送的请求头均带有Cache-Control:no-cache，服务器直接返回200和最新内容

## DNS缓存

- DNS：Domain Name System ,即域名系统
- DNS解析：通过域名最终得到该域名对应的IP地址，也叫域名解析
- DNS缓存：有DNS的地方就有缓存，浏览器、操作系统、Local DNS、根域名服务器
  1. 首先搜索浏览器自身的DNS缓存，如果存在，则域名解析到此完成
  2. 如果浏览器自身的缓存中没有找到对应的条目，那么会尝试读取操作系统的hosts文件，看是否存在对应映射关系
  3. 如果本地hosts文件不存在对应映射关系，则查找本地DNS服务器
  4. 如果本地DNS服务器还没找到的话,它就会向根服务器发出请求,进行递归查询

> 注：各大浏览器默认开启了DNS缓存功能

## CDN缓存

- CDN：Content Delivery Network,即内容分发网络

  简单的理解就是CDN会选择一个离用户最近的CDN边缘节点来响应用户的请求

- CDN缓存：即在浏览器本地缓存失效后，浏览器会向CDN边缘节点发送请求，类似浏览器缓存，CDN边缘节点也存在一套缓存机制，CDN边缘节点缓存策略因服务商不同而不同，但一般都会遵循http标准协议，通过http响应头中的Cache-control字段来设置CDN边缘节点数据缓存时间

  当浏览器向CDN节点请求数据时，CDN节点会判断缓存数据是否过期，若缓存数据并没有过期，则直接将缓存数据返回给客户端，否则，CDN节点就会向服务器发出回源请求，从服务器拉取最新数据，更新本地缓存，并将最新数据返回给客户端

## Web 安全

1. SQL 注入：

   输入时进行了恶意的 SQL 拼接，导致最后生成的 SQL 有问题，典型的例子就是对 SQL 语句进行字符串拼接的时候没有对用户输入的内容进行转译，如果用户在语句中添加 delete 等关键字就会造成影响

   预防：正确使用参数化绑定 sql 变量

   ```text
   1、过滤用户输入参数中的特殊字符，降低风险
   2、禁止通过字符串拼接sql语句，要严格使用参数绑定来传入参数
   3、合理利用数据库框架提供的机制
   ```

2. XSS(跨站脚本攻击)：

   通过某种方式（发布文章、评论）等将一段特定的 JS 代码隐蔽的输入进去，JS 代码一旦执行，就可以获取服务端数据、cookie 等

   预防：用正则替换，cookie设置HttpOnly属性(禁止页面的Javascript 访问带有 HttpOnly 属性的Cookie )

   ```text
   < 替换为：&lt;
   > 替换为：&gt;
   & 替换为：&amp;
   ‘ 替换为：&#x27;
   ” 替换为：&quot;
   ```

3. CSRF(跨站请求伪造)：

   借助了 cookie 的特性，劫持操作者的权限来完成某个操作，而不是拿到用户的信息

   预防： 加入各个层级的权限验证