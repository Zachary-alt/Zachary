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