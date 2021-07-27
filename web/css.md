## 权重

| !important        | Infinity |
| ----------------- | -------- |
| 行间样式          | 1000     |
| id                | 100      |
| class\|属性\|伪类 | 10       |
| 标签\|伪元素      | 1        |
| 通配符            | 0        |

## 选择器

- 通配符选择器

- 标签选择器

- 类选择器

- ID选择器

- 属性选择器

  ```css
  [att=val]
  [att*=val]  如果元素用att表示的属性的属性值中包含用val指定的字符，则使用该样式
  [att^=val]  以val开头
  [att$=val]  以val结尾
  ```

- 派生选择器

  1. 后代选择器： div span (浏览器遍历父子选择器时自右向左顺序)
  2. 子元素选择器：div > span
  3. 相邻兄弟选择器：h1 + p

- 并列选择器 div.class

- 分组选择器 div, span

- 伪元素选择器

  1. link 表示元素未被点击时的状态
  2. hover 表示鼠标悬停时的状态
  3. active 表示元素被点击时的状态
  4. visited 表示元素被点击后的状态

- 序选择器

  1. `:first-child` 选中同级别中的第一个标签

     ```html
     <style type="text/css">
     	ul li:first-child{
     		color:red;
     	}
     </style>
     ```

  2. `:last-child` 选中同级别中的最后一个标签

  3. `:nth-child(n)` 选中同级别中第n个标签

  4. `:nth-last-child(n)` 选中同级别中倒数第n个标签

  5. `:only-child` 选中父元素中唯一的元素

  6. `:nth-child(odd)` 选中同级别中所有奇数

  7. `:nth-child(even)` 选中同级别中所有偶数

  8. `:nth-child(xn+y)` x和y自定义，n从0开始递增

  9. `:first-of-type` 选中同级别中同类型的第一个标签

     ```html
     <style type="text/css">
     	p:first-of-type{
     		background:#ff0000;
     	}
     </style>
     ```

  10. `:last-of-type` 选中同级别中同类型的最后一个标签

  11. `:nth-of-type(n)` 选中同级别中同类型的第n个标签

  12. `:nth-last-of-type(n)` 选中同级别中同类型倒数第n个标签

  13. `:only-of-type` 选中父元素某一类型的标签

  14. `:nth-of-type(odd)` 选中同级别中同类型所有奇数

  15. `:nth-of-type(even)` 选中同级别中同类型所有偶数

## 盒模型

- 标准盒子模型

  width和height指的是content的宽度和高度

  标准盒模型下盒子的大小：content + border + padding + margin

  box-sizing: content-box

- IE盒子模型

  width和height指的是content + border + padding的宽度和高度

  怪异盒模型下盒子的大小： width（content + border + padding） + margin

  box-sizing: border-box

## BFC

> 一个块格式化上下文（block formatting context） 是Web页面的可视化CSS渲染出的一部分。它是块级盒布局出现的区域，也是浮动层元素进行交互的区域。
> 一个块格式化上下文由以下之一创建：

- 根元素或其它包含它的元素
- 浮动元素 (元素的 float 不是 none)
- 绝对定位元素 (元素具有 position 为 absolute 或 fixed)
- 内联块 (元素具有 display: inline-block)
- 表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
- 表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
- 具有overflow 且值不是 visible 的块元素，
- display: flow-root
- column-span: all 应当总是会创建一个新的格式化上下文，即便具有 column-span: all 的元素并不被包裹在一个多列容器中。
- 一个块格式化上下文包括创建它的元素内部所有内容，除了被包含于创建新的块级格式化上下文的后代元素内的元素。

块格式化上下文对于定位 (参见 float) 与清除浮动 (参见 clear) 很重要。定位和清除浮动的样式规则只适用于处于同一块格式化上下文内的元素。浮动不会影响其它块格式化上下文中元素的布局，并且清除浮动只能清除同一块格式化上下文中在它前面的元素的浮动。

我们发现一个什么问题！貌似看不懂哎！！

为什么会产生这样的原因？？

你能解释一下什么是桌子吗？？

仔细想想，发现好像并不能合理的解释它。

BFC 也是如此，只有特性(功能)，没有定义。

> I know it when i see it.

### BFC 特性(功能)

1. 使 BFC 内部浮动元素不会到处乱跑；
2. 和浮动元素产生边界。

#### 使 BFC 内部的浮动元素不会到处乱跑

在正常的文档流中，块级元素是按照从上自下，内联元素从左到右的顺序排列的。

如果我给里面的元素一个 float 或者绝对定位，它就会脱离普通文档流中。

```html
<style>
        .out{
            border: 10px solid red;
        }
        .in{
            background: grey;
            width: 100%;
            height: 100px;
            float: left;
        }
    </style>
    <div class="out">
        <div class="in"></div>
    </div>
```

没有产生 BFC

此时如果我们还想让外层元素包裹住内层元素该如果去做？？

让外层元素产生一个 BFC 。(产生 BFC 的方法 MDN 文档里有写)

```css
.out{
            border: 10px solid red;
            overflow: hidden;
        }
```

产生 BFC

**这就是 BFC 的第一个作用：使 BFC 内部的浮动元素不会到处乱跑。**

#### 和浮动元素产生边界

```html
<style>
        div{
            border: 3px solid red;
            height: 100px;
        }
        .left{
            min-width: 200px;
            margin-right: 20px;
            float: left;
        }
        .right{
            border-color: blue;
        }
    </style>
    <body>
    <!-- 和浮动元素产生边界 -->
    <div class="left"></div>
    <div class="right"></div>
</body>
```

没有产生 BFC

一般情况下如果没有 BFC的话，我们想要让普通元素与浮动元素产生左右边距，需要将 maring 设置为浮动元素的宽度加上你想要产生边距的宽度。

这里的浮动元素的宽度为 200px ，如果想和它产生 20px 的右边距，需要将非浮动元素的 margin-left 设置为 200px+20px 。

```css
.right{
            border-color: blue;
            display: flow-root;
        }
```

产生了 BFC

## Flex布局

- 容器默认存在两根轴，水平的主轴(main axis) 垂直的交叉轴(cross axis)。主轴的开始位置叫做main start ，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end

- 容器属性

  1. flex-direction：决定主轴的方向

     ```css
     row（默认值）：主轴为水平方向，起点在左端。
     row-reverse：主轴为水平方向，起点在右端。
     column：主轴为垂直方向，起点在上沿。
     column-reverse：主轴为垂直方向，起点在下沿。
     ```

  2. flex-wrap：如果一条轴线排不下，如何换行

     ```css
     nowrap（默认）：不换行
     wrap：换行，第一行在上方
     wrap-reverse：换行，第一行在下方
     ```

  3. flex-flow：`flex-direction`属性和`flex-wrap`属性的简写形式，默认值是 `row nowrap`

  4. justify-content：项目在主轴上的对齐方式

     ```css
     flex-start（默认值）：左对齐
     flex-end：右对齐
     center： 居中
     space-between：两端对齐，项目之间的间隔都相等。
     space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍
     ```

  5. align-items：项目在交叉轴上的对齐方式

     ```css
     flex-start：交叉轴的起点对齐
     flex-end：交叉轴的终点对齐
     center：交叉轴的中点对齐
     baseline: 项目的第一行文字的基线对齐
     stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
     ```

  6. align-content：定义多根轴线的对齐方式，若项目只有一根轴线，该属性不起作用

     ```css
     flex-start：与交叉轴的起点对齐
     flex-end：与交叉轴的终点对齐
     center：与交叉轴的中点对齐
     space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
     space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
     stretch（默认值）：轴线占满整个交叉轴
     ```

- 项目属性

  1. order：定义项目的排列顺序，数值越小，排列越靠前，默认为0
  2. flex-grow：定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
  3. flex-shrink：定义项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
  4. flex-basis：定义分配多余空间之前，项目占据的主轴空间，默认为auto，即项目的本来大小
  5. flex：是flex-grow、flex-shrink和flex-basis的简写，默认值是0 1 auto，后两个属性可选，该属性有两个快捷值：auto(1 1 auto) 和none (0 0 auto)
  6. align-self：允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性，默认值是auto，表示继承父元素的align-items属性

## 动画

- transform

  1. 2D转换

     ```css
     /*  translate()：根据左(X轴)和顶部(Y轴)位置给定的参数，从当前元素位置移动*/
     transform: translate(50px,100px);
     /*  rotate()：在一个给定度数顺时针旋转的元素。负值是允许的，这样是元素逆时针旋转*/
     transform: rotate(30deg);
     /*  scale()：该元素增加或减少的大小，取决于宽度（X轴）和高度（Y轴）的参数*/
     transform: scale(2,3)
     /*  skew()：包含两个参数值，分别表示X轴和Y轴倾斜的角度，如果第二个参数为空，则默认为0，参数为负表示向相反方向倾斜*/
     transform: skew(30deg,20deg)
     /*  matrix()：matrix 方法有六个参数，包含旋转，缩放，移动（平移）和倾斜功能*/
     transform:matrix(0.866,0.5,-0.5,0.866,0,0);
     ```

  2. 3D转换

     ```css
     /* rotateX()：围绕其在一个给定度数X轴旋转的元素*/
     transform: rotateX(120deg)
     /* rotateY()：围绕其在一个给定度数Y轴旋转的元素*/
     transform: rotateY(130deg)
     ```

- transition

> 过渡是元素从一种样式逐渐改变为另一种的效果 要实现这一点，必须规定两项内容：
>
> 1. 指定要添加效果的CSS属性
> 2. 指定效果的持续时间

```css
div {
    transition: width 2s, height 2s, transform 2s;
}
div:hover {
    width: 200px;
    height: 200px;
    transform: rotate(180deg);
}
```

- animation

> @keyframes ： 创建动画
>
> animation ： 将动画捆绑到元素，并设置时间

```css
@keyframes myfirst {
    from {background: red;}
    to {background: yellow;}
}
// 百分比来规定变化发生的时间，或用关键词 "from" 和 "to"，等同于 0% 和 100%
@keyframes myfirst
{
    0%   {background: red;}
    25%  {background: yellow;}
    50%  {background: blue;}
    100% {background: green;}
}
div {
	animation: myfirst 5s;
}
```

## em/rem/vw/vh

| 单位 | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| em   | 相对长度单位，相对于当前对象内文本的字体尺寸， 根据父元素的大小变化而变化 |
| rem  | 相对长度单位，相对于根元素（ 即 html 元素）font-size 的倍数， 不会被它的父元素影响 |
| vw   | 相对于视口的宽度， 视口被均分为 100 单位的vw                 |
| vh   | 相对于视口的宽度， 视口被均分为 100 单位的vh                 |

