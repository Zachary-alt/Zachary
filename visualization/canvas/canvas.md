## Canvas 标签

### canvas 标签语法和属性 （重点）

- anvas：画布油布的意思 ==英 ['kænvəs] 美 ['kænvəs] ==
- 标签名 canvas，需要进行闭合。就是一普通的 html 标签。
- 可以设置 width 和 height 属性，但是属性值**单位必须是 px**，否则忽略。
- width 和 hegiht：默认 300*150 像素
- 注意：
  - 不要用 CSS 控制它的宽和高,会走出图片拉伸，
  - 重新设置 canvas 标签的宽高属性会让画布擦除所有的内容。
  - 可以给 canvas 画布设置背景色

### 浏览器不兼容处理（重点）

- ie9 以上才支持 canvas, 其他 chrome、ff、苹果浏览器等都支持

- 只要浏览器兼容 canvas，那么就会支持绝大部分 api(个别最新 api 除外)

- 移动端的兼容情况非常理想，基本上随便使用

- 2d 的支持的都非常好，3d（webgl）ie11 才支持，其他都支持

- 如果浏览器不兼容，最好进行友好提示

  ```html
  <canvas id="cavsElem">
    你的浏览器不支持canvas，请升级浏览器.浏览器不支持，显示此行文本
  </canvas>
  ```

- 浏览器不兼容，可以使用*flash*等手段进行**优雅降级**

## canvas 绘图上下文 context

### Context：Canvas 的上下文、绘制环境。

- 上下文是所有的绘制操作 api 的入口或者集合。

- Canvas 自身无法绘制任何内容。Canvas 的绘图是使用 JavaScript 操作的。

- Context 对象就是 JavaScript 操作 Canvas 的接口。 *使用[CanvasElement].getContext(‘2d’)来获取 2D 绘图上下文。

  ```js
  let canvas = document.getElementById('cavsElem'); //获得画布
  let ctx = canvas.getContext('2d'); //注意：2d小写， 3d：webgl
  ```

## 基本的绘制路径

### canvas 坐标系

canvas 坐标系，从最左上角 0,0 开始。x 向右增大， y 向下增大

### 设置绘制起点(moveTo)

```
* 语法：ctx.moveTo(x, y);
* 解释：设置上下文绘制路径的起点。相当于移动画笔到某个位置
* 参数：x,y 都是相对于 canvas盒子的最左上角。
* 注意：**绘制线段前必须先设置起点。**
```

### 绘制直线(lineTo)

```
* 语法：ctx.lineTo(x, y);
* 解释：从x,y的位置绘制一条直线到起点或者上一个线头点。
* 参数：x,y 线头点坐标。
```

### 路径开始和闭合

```
* 开始路径：ctx.beginPath();
* 闭合路径：ctx.closePath();
* 解释：如果是绘制不同状态的线段或者形状，必须使用开始新路径的方法把不同的绘制操作隔开。闭合路径会自动把最后的线头和开始的线头连在一起。
* beginPath: 核心的作用是将 不同绘制的形状进行隔离，
  每次执行此方法，表示重新绘制一个路径,跟之前的绘制的墨迹可以进行分开样式设置和管理。
```

### 描边(stroke)

```
* 语法：ctx.stroke();
* 解释：根据路径绘制线。路径只是草稿，真正绘制线必须执行stroke
* stroke: （用笔等）画；轻抚；轻挪；敲击；划尾桨；划掉；（打字时）击打键盘
 英 [strəʊk]   美 [strok]
```

### canvas 绘制的基本步骤

- 第一步：获得上下文 =>canvasElem.getContext('2d');
- 第二步：开始路径规划 =>ctx.beginPath()
- 第三步：移动起始点 =>ctx.moveTo(x, y)
- 第四步：绘制线(矩形、圆形、图片...) =>ctx.lineTo(x, y)
- 第五步：闭合路径 =>ctx.closePath();
- 第六步：绘制描边 =>ctx.stroke();

```html
<canvas id="cvs" width="300" height="300">
        你的浏览器不支持canvas，请升级浏览器.浏览器不支持，显示此行文本
    </canvas>
    <script>
        let canvas = document.getElementById('cvs'); //获得画布
        let cvsCtx = canvas.getContext('2d'); //注意：2d小写， 3d：webgl

        //绘制三角形
        ctx.beginPath(); //开始路径
        cvsCtx.moveTo(100, 100); // 画笔移动到100,100
        cvsCtx.lineTo(200, 100); // 从画笔位置画一条直线到200, 100
        cvsCtx.lineTo(100, 200); // 从当前位置，再画一条直线到100, 200

        // cvsCtx.lineTo(100, 100);
        cvsCtx.closePath(); // 闭合路径

        cvsCtx.lineWidth = 4; // 设置线宽
        cvsCtx.strokeStyle='red'; // 设置描边样式
        cvsCtx.stroke(); // 描边
        
        cvsCtx.fillStyle='green'; // 设置填充色
        cvsCtx.fill(); // 填充
    </script>
```

### 填充(fill)

```
* 语法：ctx.fill();
* 解释：填充，是将闭合的路径的内容填充具体的颜色。默认黑色。

* 注意：交叉路径的填充问题，“非零环绕原则”，顺逆时针穿插次数决定是否填充。

    以下是非0环绕原则的原理：（了解即可，非常少会用到复杂的路径）
    “非零环绕规则”是这么来判断有自我交叉情况的路径的：对于路径中的任意给定区域，从该区域内部画一条足够长的线段，
    使此线段的终点完全落在路径范围之外。
    图2-14中的那三个箭头所描述的就是上面这个步骤。
    接下来，将计数器初始化为0，
    然后，每当这条线段与路径上的直线或曲线相交时，
    就改变计数器的值。如果是与路径的顺时针部分相交，则加1，
    如果是与路径的逆时针部分相交，则减1。若计数器的最终值不是0，那么此区域就在路径里面，在调用fill()方法时，
    浏览器就会对其进行填充。
    如果最终值是0，那么此区域就不在路径内部，浏览器也就不会对其进行填充了

```

<img src="../.vuepress/public/assets/img/canvas/fill-0-prin.jpg" alt="1604728604168" style="zoom:80%;" />

### 快速创建矩形 rect()方法

```
* 语法：ctx.rect(x, y, width, height);
* 解释：x, y是矩形左上角坐标， width和height都是以像素计
* rect方法只是规划了矩形的路径，并没有填充和描边。
* rect: abbr. 矩形（rectangular）；
```

### 快速创建描边矩形和填充矩形

```
* 语法： ctx.strokeRect(x, y, width, height);
    - 参数跟2.3.8相同，注意此方法绘制完路径后立即进行stroke绘制
* 语法：ctx.fillRect(x, y, width, height);
    - 参数跟2.3.8相同， 此方法执行完成后。立即对当前矩形进行fill填充。
```

### 清除矩形(clearRect)

```
* 语法：ctx.clearRect(x, y, width, hegiht);
* 解释：清除某个矩形内的绘制的内容，相当于橡皮擦。
```

```js
let canvas = document.getElementById('cvs'); //获得画布
let context = canvas.getContext('2d'); //注意：2d小写， 3d：webgl

// 矩形
context.beginPath();
context.fillStyle='red';
context.rect(10, 10, 100, 100); // 描边矩形，同strokeRect
context.fillRect(110, 110, 100, 100); // 填充矩形
context.clearRect(10, 10, 150, 180); // 橡皮擦,好像只能擦掉填充矩形
context.stroke();
```

## 绘制圆形（arc)

- 概述：arc() 方法创建弧/曲线（用于创建圆或部分圆）。
  - 语法：ctx.arc(x,y,r,sAngle,eAngle,counterclockwise);
  - arc: 弧（度）弧形物；天穹 英 [ɑːk] 美 [ɑrk]
  - counter 反击，还击；反向移动，对着干；反驳，回答 ['kaʊntə] 美 ['kaʊntɚ]
  - 解释： - x,y：圆心坐标。 - r：半径大小。 - sAngle:绘制开始的角度。 圆心到最右边点是 0 度，顺时针方向弧度增大。 - eAngel:结束的角度，注意是弧度。π - counterclockwise：是否是逆时针。true 是逆时针，false：顺时针 - 弧度和角度的转换公式： `rad = deg\*Math.PI/180;`
  - 在 Math 提供的方法中**sin、cos 等都使用的弧度** 

```js
 // 圆弧
context.beginPath();
context.fillStyle='yellow';
context.moveTo(150, 150);

context.arc(150, 150, 100, Math.PI / 180 * 0, Math.PI / 180 * 30, true);
context.closePath();
context.fill();
context.stroke();
```

## 绘制文字

###  绘制上下文的文字属性

- font 设置或返回文本内容的当前字体属性
  - font 属性使用的语法与 CSS font 属性相同。

> 例如：ctx.font = "18px '微软雅黑'";

- textAlign 设置或返回文本内容的当前对齐方式
  - start : 默认。文本在指定的位置开始。
  - end : 文本在指定的位置结束。
  - center: 文本的中心被放置在指定的位置。
  - left : 文本左对齐。
  - right : 文本右对齐。

> 例如：ctx.textAlign = 'left';

![对齐图片](https://malun666.github.io/aicoder_vip_doc/images/textAsign.png)

> 例如： ctx.textBaseline = 'top'; 单词: alphabetic: 字母的；照字母次序的 [,ælfə'bɛtɪk] ideographic：表意的；表意字构成的 英 [,ɪdɪəʊ'ɡræfɪk] 美 [,ɪdɪə'græfɪk]

![设置文字为主](https://malun666.github.io/aicoder_vip_doc/images/font-line1.png) 

```markup
* ctx.fillText()      在画布上绘制“被填充的”文本
* ctx.strokeText()    在画布上绘制文本（无填充）
* ctx.measureText()   返回包含指定文本宽度的对象
* 单词：measure 测量；估量；权衡   英 ['meʒə]   美 ['mɛʒɚ]
//综合案例代码：
ctx.moveTo(300, 300);
ctx.fillStyle = 'purple'; //设置填充颜色为紫色
ctx.font = '20px "微软雅黑"'; //设置字体
ctx.textBaseline = 'bottom'; //设置字体底线对齐绘制基线
ctx.textAlign = 'left'; //设置字体对齐的方式
//ctx.strokeText( "left", 450, 400 );
ctx.fillText('Top-g', 100, 300); //填充文字
```

## 绘制图片（drawImage）

### 基本绘制图片的方式

```markup
context.drawImage(img,x,y);
参数说明： x,y 绘制图片左上角的坐标， img是绘制图片的dom对象。
```

### 在画布上绘制图像，并规定图像的宽度和高度

```markup
context.drawImage(img,x,y,width,height);
参数说明：width 绘制图片的宽度，  height：绘制图片的高度
如果指定宽高，最好成比例，不然图片会被拉伸</em>
    等比公式：  toH = Height * toW   /  Width;  //等比
             设置高 = 原高度 * 设置宽/ 原宽度;
```

### 图片裁剪，并在画布上定位被剪切的部分

```markup
context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
参数说明：
    sx,sy 裁剪的左上角坐标，
    swidth：裁剪图片的高度。 sheight:裁剪的高度
    其他同上
```

### 用 JavaScript 创建 img 对象

第一种方式：

```js
var img = document.getElementById('imgId');
```

第二种方式：

```js
var img = new Image(); //这个就是 img标签的dom对象
img.src = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png';
img.onload = function() {
  //图片加载完成后，执行此方法
};
```

### 利用雪碧图制作序列帧动画

```js
<canvas id="cvs" width="400" height="400" style="border:1px solid;">
        你的浏览器不支持canvas，请升级浏览器
    </canvas>
    <button id="go">慢走</button>
    <button id="run">快跑</button>
    <script>
        let canvas = document.getElementById('cvs'); //获得画布
        let context = canvas.getContext('2d'); //注意：2d小写， 3d：webgl

        let img = new Image()
        img.src = '../images/foxJump.png'
        let frameIndex=0
        let actionIndex=0
        img.onload = function () {
            setInterval(()=>{
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                context.drawImage(img,frameIndex*192,actionIndex*150,192,150, 100, 100, 192/2, 150/2);
                frameIndex++
                frameIndex%=4
            },1000/10)
        }
        document.getElementById('go').onclick=function(){
            actionIndex=1
        }
        document.getElementById('run').onclick=function(){
            actionIndex=0
        }
    </script>
```

# canvas 进阶

## Canvas 颜色样式和阴影

### 设置填充和描边的颜色（掌握）

- fillStyle : 设置或返回用于填充绘画的颜色
- strokeStyle: 设置或返回用于笔触的颜色

以上两个值都可以接受颜色名,16 进制数据，rgb 值，甚至 rgba. 一般先进行设置样式然后进行绘制。

例如：

```js
ctx.strokeStyle = 'red';
ctx.strokeStyle = '#ccc';
ctx.strokeStyle = 'rgb(255,0,0)';
ctx.strokeStyle = 'rgba(255,0,0,6)'
```

### 设置阴影（了解，少用，性能差）

- 类比于 CSS3 的阴影。
- shadowColor ： 设置或返回用于阴影的颜色
- shadowBlur ： 设置或返回用于阴影的模糊级别,大于 1 的正整数，数值越高，模糊程度越大
- shadowOffsetX： 设置或返回阴影距形状的水平距离
- shadowOffsetY： 设置或返回阴影距形状的垂直距离

```js
ctx.fillStyle = 'rgba(255,0,0, .9)';
ctx.shadowColor = 'teal';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.fillRect(100, 100, 100, 100)
```

例如：

- 案例： 12 设置 box 盒子阴影.html
- 设置 png 图片的阴影，图片透明部分不会被投影。

## 复杂样式（了解）

### 创建线性渐变的样式

- 一般不用，都是用图片代替，canvas 绘制图片效率更高。
- 线性渐变可以用于 矩形、圆形、文字等颜色样式
- 线性渐变是一个对象
- 语法：ctx.createLinearGradient(x0,y0,x1,y1); //参数：x0,y0 起始坐标，x1,y1 结束坐标

```js
//创建线性渐变的对象，
let grd = ctx.createLinearGradient(0, 0, 170, 0);
grd.addColorStop(0, 'black'); //添加一个渐变颜色，第一个参数介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置。
grd.addColorStop(1, 'white'); //添加一个渐变颜色
ctx.fillStyle = grd; //关键点，把渐变设置到 填充的样式
```

### 设置圆形渐变（径向渐变）

- 创建放射状/圆形渐变对象。可以填充文本、形状等
- context.createRadialGradient(x0,y0,r0,x1,y1,r1);
- radial 半径的；放射状的；光线的；光线状的 英 ['reɪdɪəl] 美 ['redɪəl]
- 参数详解：
  - x0: 渐变的开始圆的 x 坐标
  - y0: 渐变的开始圆的 y 坐标
  - r0: 开始圆的半径
  - x1: 渐变的结束圆的 x 坐标
  - y1: 渐变的结束圆的 y 坐标
  - r1: 结束圆的半径

```js
let rlg = ctx.createRadialGradient(300, 300, 10, 300, 300, 200);
rlg.addColorStop(0, 'teal'); //添加一个渐变颜色
rlg.addColorStop(0.4, 'navy');
rlg.addColorStop(1, 'purple');
ctx.fillStyle = rlg; //设置 填充样式为延续渐变的样式
ctx.fillRect(100, 100, 500, 500);
```

### 绘制背景图

- ctx.createPattern(img,repeat) 方法在指定的方向内重复指定的元素了解
- pattern：n. 模式；图案；样品 英 ['pæt(ə)n] 美 ['pætɚn]
- 第一参数：设置平铺背景的图片，第二个背景平铺的方式。
  - image ： 规定要使用的图片、画布或视频元素。
  - repeat ： 默认。该模式在水平和垂直方向重复。
  - repeat-x ： 该模式只在水平方向重复。
  - repeat-y ： 该模式只在垂直方向重复。
  - no-repeat： 该模式只显示一次（不重复）。

```js
let ctx = c.getContext('2d');
let img = document.getElementById('lamp');
let pat = ctx.createPattern(img, 'repeat');
ctx.rect(0, 0, 150, 100);
ctx.fillStyle = pat; //  把背景图设置给填充的样式
ctx.fill();
```

## 变换

### 缩放

- `scale()` 方法缩放当前绘图，更大或更小

- 语法：

  ```
  context.scale(scalewidth,scaleheight)
  ```

  - `scalewidth` : 缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%, 依次类推)
  - `scaleheight` : 缩放当前绘图的高度 (1=100%, 0.5=50%, 2=200%, etc.) +注意：缩放的是整个画布，缩放后，继续绘制的图形会被放大或缩小。

### 位移画布

- `ctx.translate(x,y)` 方法重新映射画布上的 (0,0) 位置
- 参数说明：
  - `x`： 添加到水平坐标（x）上的值
  - `y`： 添加到垂直坐标（y）上的值
- 发生位移后，相当于把画布的 0,0 坐标 更换到新的 x,y 的位置，所有绘制的新元素都被影响。
- 位移画布一般配合缩放和旋转等。

### 旋转

- `context.rotate(angle);` 方法旋转当前的绘图
- 注意参数是弧度（PI）
- 如需将角度转换为弧度，请使用 degrees*Math.PI/180 公式进行计算。

## 绘制环境保存和还原

- ```js
  ctx.save()
  ```

  保存当前环境的状态

  - 可以把当前绘制环境进行保存到缓存中。

- ```js
  ctx.restore()
  ```

  返回之前保存过的路径状态和属性

  - 获取最近缓存的 ctx

- 一般配合位移画布使用。

## 设置绘制环境的透明度

- context.globalAlpha=number;
- number:透明值。必须介于 0.0（完全透明） 与 1.0（不透明） 之间。
- 设置透明度是全局的透明度的样式。注意是全局的。

## 画布限定区域绘制（了解）

- ctx.clip(); 方法从原始画布中剪切任意形状和尺寸
- 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）
- 一般配合绘制环境的保存和还原。

## 画布保存 base64 编码内容（重要）

- 把 canvas 绘制的内容输出成 base64 内容。
- 语法：canvas.toDataURL(type, encoderOptions);
- 例如：canvas.toDataURL("image/jpg",1);
- 参数说明：
  - type，设置输出的类型，比如 image/png image/jpeg 等
  - encoderOptions： 0-1 之间的数字，用于标识输出图片的质量，1 表示无损压缩，类型为： image/jpeg 或者 image/webp 才起作用。

```js
    案例1：
    let canvas = document.getElementById("canvas");
    let dataURL = canvas.toDataURL();
    console.log(dataURL);
    // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby
    // blAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"

    let img = document.querySelector("#img-demo");//拿到图片的dom对象
    img.src = canvas.toDataURL("image/png");      //将画布的内容给图片标签显示
```

## 画布渲染画布（重要）

- context.drawImage(img,x,y);
- img 参数也可以是画布，也就是把一个画布整体的渲染到另外一个画布上。

```js
    let canvas1 = document.querySelector('#cavsElem1');
    let canvas2 = document.querySelector('#cavsElem2');
    let ctx1 = canvas1.getContext('2d');
    let ctx2 = canvas2.getContext('2d');
    ctx1.fillRect(20, 20, 40, 40);      //在第一个画布上绘制矩形

    ctx2.drawImage(canvas1, 10, 10);    //将第一个画布整体绘制到第二个画布上
```