## 什么是SVG？

- SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
- SVG 用来定义用于网络的基于矢量的图形
- SVG 使用 XML 格式定义图形
- SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失
- SVG 是万维网联盟的标准
- SVG 与诸如 DOM 和 XSL 之类的 W3C 标准是一个整体

与其他图像格式相比，使用 SVG 的优势在于：

- SVG 可被非常多的工具读取和修改（比如记事本）
- SVG 与 JPEG 和 GIF 图像比起来，尺寸更小，且可压缩性更强。
- SVG 是可伸缩的
- SVG 图像可在任何的分辨率下被高质量地打印
- SVG 可在图像质量不下降的情况下被放大
- SVG 图像中的文本是可选的，同时也是可搜索的（很适合制作地图）
- SVG 可以与 Java 技术一起运行
- SVG 是开放的标准
- SVG 文件是纯粹的 XML

SVG 的主要竞争者是 Flash。

与 Flash 相比，SVG 最大的优势是与其他标准（比如 XSL 和 DOM）相兼容。而 Flash 则是未开源的私有技术。

### 简单的 SVG 实例

```html
<svg version="1.1"
  baseProfile="full"
  width="300" height="200"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" stroke="red" stroke-width="4" fill="yellow" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="115" font-size="16" text-anchor="middle" fill="white">RUNOOB SVG TEST</text>
</svg>
```

## SVG 在 HTML 页面

SVG 文件可通过以下标签嵌入 HTML 文档：`<embed>`、`<object>` 或者` <iframe>`。

SVG的代码可以直接嵌入到HTML页面中，或您可以直接链接到SVG文件。

`<embed>`:

- 优势：所有主要浏览器都支持，并允许使用脚本
- 缺点：不推荐在HTML4和XHTML中使用（但在HTML5允许）

```html
<embed src="circle1.svg" type="image/svg+xml" />
```

`<object>`:

- 优势：所有主要浏览器都支持，并支持HTML4，XHTML和HTML5标准
- 缺点：不允许使用脚本。

```html
<object data="circle1.svg" type="image/svg+xml"></object>
```

`<iframe>`:

- 优势：所有主要浏览器都支持，并允许使用脚本
- 缺点：不推荐在HTML4和XHTML中使用（但在HTML5允许）

```html
<iframe src="circle1.svg"></iframe>
```

## SVG 矩形 - `<rect>`

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect x="50" y="20" width="150" height="150"
  style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;
  stroke-opacity:0.9"/>
</svg>
```

**代码解析：**

- x 属性定义矩形的左侧位置（例如，x="0" 定义矩形到浏览器窗口左侧的距离是 0px）
- y 属性定义矩形的顶端位置（例如，y="0" 定义矩形到浏览器窗口顶端的距离是 0px）
- CSS 的 fill-opacity 属性定义填充颜色透明度（合法的范围是：0 - 1）
- CSS 的 stroke-opacity 属性定义轮廓颜色的透明度（合法的范围是：0 - 1）

## SVG 圆形 - `<circle>`

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="red"/>
</svg>
```

**代码解析：**

- cx和cy属性定义圆点的x和y坐标。如果省略cx和cy，圆的中心会被设置为(0, 0)
- r属性定义圆的半径

## SVG 椭圆 - `<ellipse>`

椭圆与圆很相似。不同之处在于椭圆有不同的x和y半径，而圆的x和y半径是相同的：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <ellipse cx="300" cy="80" rx="100" ry="50"
  style="fill:yellow;stroke:purple;stroke-width:2"/>
</svg>
```

**代码解析：**

- CX属性定义的椭圆中心的x坐标
- CY属性定义的椭圆中心的y坐标
- RX属性定义的水平半径
- RY属性定义的垂直半径

## SVG 直线 - `<line>`

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <line x1="0" y1="0" x2="200" y2="200"
  style="stroke:rgb(255,0,0);stroke-width:2"/>
</svg>
```

- x1 属性在 x 轴定义线条的开始
- y1 属性在 y 轴定义线条的开始
- x2 属性在 x 轴定义线条的结束
- y2 属性在 y 轴定义线条的结束

## SVG 多边形 - `<polygon>`

`<polygon>` 标签用来创建含有不少于三个边的图形。

多边形是由直线组成，其形状是"封闭"的（所有的线条 连接起来）。

![Remark](https://www.runoob.com/images/lamp.gif)polygon来自希腊。 "Poly" 意味 "many" ， "gon" 意味 "angle".

```html
<svg height="250" width="500">
  <polygon points="220,10 300,210 170,250 123,234" style="fill:lime;stroke:purple;stroke-width:1" />
</svg>
```

**代码解析：**

- points 属性定义多边形每个角的 x 和 y 坐标

## SVG 多段线 - `<polyline>`

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polyline points="20,20 40,25 60,40 80,120 120,140 200,180"
  style="fill:none;stroke:black;stroke-width:3" />
</svg>
```

## SVG 路径 - `<path>`

`<path>` 元素用于定义一个路径。

下面的命令可用于路径数据：

- M = moveto(M X,Y) ：将画笔移动到指定的坐标位置
- L = lineto(L X,Y) ：画直线到指定的坐标位置
- H = horizontal lineto(H X)：画水平线到指定的X坐标位置
- V = vertical lineto(V Y)：画垂直线到指定的Y坐标位置
- C = curveto(C X1,Y1,X2,Y2,ENDX,ENDY)：三次贝赛曲线
- S = smooth curveto(S X2,Y2,ENDX,ENDY)：平滑曲率
- Q = quadratic Belzier curve(Q X,Y,ENDX,ENDY)：二次贝赛曲线
- T = smooth quadratic Belzier curveto(T ENDX,ENDY)：映射
- A = elliptical Arc(A RX,RY,XROTATION,FLAG1,FLAG2,X,Y)：弧线
- Z = closepath()：关闭路径

**注意：**以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <path d="M150 0 L75 200 L225 200 Z" />
</svg>
```

## SVG 文本 - `<text>`

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <text x="0" y="15" fill="red">I love SVG</text>
</svg>
```

## SVG Stroke 属性

Stroke属性定义一条线，文本或元素轮廓颜色

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <g fill="none">
    <path stroke="red" stroke-width="2" d="M5 20 l215 0" />
    <path stroke="blue" stroke-linecap="round" d="M5 40 l215 0" />
    <path stroke="black" stroke-dasharray="5,5" d="M5 60 l215 0" />
  </g>
</svg>
```

stroke- width属性定义了一条线，文本或元素轮廓厚度

strokelinecap属性定义不同类型的开放路径的终结

strokedasharray属性用于创建虚线

## [SVG 滤镜](https://www.w3school.com.cn/svg/svg_filters_intro.asp)

**SVG 滤镜用来向形状和文本添加特殊的效果**

## [SVG 渐变](https://www.w3school.com.cn/svg/svg_grad_linear.asp)

**SVG 渐变必须在 `<defs>` 标签中进行定义。**

## [SVG 实例](https://www.w3school.com.cn/svg/svg_examples.asp)

## [SVG 元素](https://www.w3school.com.cn/svg/svg_reference.asp)

