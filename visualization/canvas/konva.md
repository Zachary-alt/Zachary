# Konva 的使用快速上手

## Konva 的整体理念

- 舞台的概念的引入。整个视图看做是一个舞台 stage
- 舞台中可以绘制很多个层 layer
- layer 下面可以有很多的 group
- group 下面可以有 矩形、图片、其他形状等
- 参考：[快速上手文档](http://konvajs-doc.bluehymn.com/docs/)

```
                  Stage
                    |
             +------+------+
             |             |
           Layer         Layer
             |             |
       +-----+-----+     Shape
       |           |
     Group       Group
       |           |
       +       +---+---+
       |       |       |
    Shape   Group    Shape
               |
               +
               |
             ShapeCopy to clipboardErrorCopied
```

## Konva 矩形案例

### 创建一个矩形： Konva.Rect(option);

```js
<div id="container"></div>
    <script>
        //Konva使用的基本案例
        //第一步：创建舞台
        let stage = new Konva.Stage({
            container:'container',
            width:window.innerWidth,//设置全屏
            height:window.innerHeight
        })

        //第二步：创建层
        let layer = new Konva.Layer()//创建一个层
        stage.add(layer)//把层添加到舞台

        //第三步： 创建矩形
        let rect= new Konva.Rect({
            x: 100,                     //矩形的x坐标，相对其父容器的坐标
            y: 100,
            width: 100,                 //矩形的宽度
            height: 100,                //矩形高度
            fill: 'gold',               //矩形填充的颜色
            stroke: 'navy',             //矩形描边的颜色
            strokeWidth: 4,             //填充宽度
            opactity: .2,               //矩形的透明度
            scale: 1.2,                 //矩形的缩放 1：原来大小
            rotation: 30,               //旋转的角度，是deg不是弧度。
            cornerRadius: 10,           //圆角的大小（像素）
            id: 'rect1',                //id属性，类似dom的id属性
            name: 'rect',
            draggable: true             //是否可以进行拖拽
        })

        //创建一个组
        var group = new Konva.Group({
            x: 40,
            y: 40,
        });
        group.add( rect );  //把矩形添加到组中

        //第四步： 把形状放到层中
        layer.add( group ); //把组添加到层中
        layer.draw();       //绘制层到舞台上
    </script>
```

