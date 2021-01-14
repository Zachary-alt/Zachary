## 前端设计模式

> 设计模式（Design Pattern）是⼀套被反复使⽤、多数⼈知晓的、经过分类的、代码设计经验的总结。

任何事情都有套路，设计模式，就是写代码中的常⻅套路， 有些写法我们⽇常都⼀直在使⽤，下⾯我们来介绍⼀下。

### 订阅**/**发布模式 （观察者）

pub/sub 这个应该⼤家⽤到最⼴的设计模式了，

在这种模式中，并不是⼀个对象调⽤另⼀个对象的⽅法，⽽是⼀个对象订阅另⼀个对象的 特定活动并在 状态改变后获得通知。订阅者因此也成为观察者，⽽被观察的对象成为发布者或者主题。当发⽣了⼀个 重要事件时候 发布者会通知（调⽤）所有订阅者并且可能经常已事件对象的形式传递消息。

```js
class Event {
    constructor() {
        this.callbacks = {}
    }
    $off(name) {
        this.callbacks[name] = null
    }
    $emit(name, arg) {
        // 触发
        const cbs = this.callbacks[name];
        if (cbs) {
            cbs.forEach(c => {
                c.call(this, arg)
            });
        }
    }
    $on(name, fn) {
        // 监听
        (this.callbacks[name] || (this.callbacks[name] = [])).push(fn)
    }
}

let event = new Event();
event.$on('e1', function (arg) {
    console.log('e1', arg);
})
event.$emit('e1', { name: 'zhao' })
```

vue中的emit on源码 ⼤概也是这个样⼦ 

https://github.com/vuejs/vue/blob/dev/src/core/instance/events.js#L54

### 单例模式

> 单例模式的定义：保证⼀个类仅有⼀个实例，并提供⼀个访问它的全局访问点。实现的⽅法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了⼀个类只有⼀个实例对象。

适⽤场景：⼀个单⼀对象。⽐如：弹窗，⽆论点击多少次，弹窗只应该被创建⼀次' 实现起来也很简单，⽤⼀个变量缓存即可

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        .model {
            border: 1px solid black;
            position: fixed;
            width: 300px;
            height: 300px;
            top: 20%;
            left: 50%;
            margin-left: -150px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div id="loginBtn">点我</div>

    <script>

        var getSingle = function (fn) {
            var result;
            return function () {
                return result || (result = fn.apply(this, arguments));
            }
        };
        var createLoginLayer = function () {

            var div = document.createElement('div');
            div.innerHTML = '我是登录浮窗';
            div.className = 'model'
            div.style.display = 'none';
            document.body.appendChild(div);

            return div;
        };
        var createSingleLoginLayer = getSingle(createLoginLayer);
        document.getElementById('loginBtn').onclick = function () {
            var loginLayer = createSingleLoginLayer();
            loginLayer.style.display = 'block';
        };



    </script>
</body>

</html>
```

**应⽤场景**

我们再element中的弹窗代码中，可以看到单例模式的实际案例 保证全局唯⼀性 https://github.com/ElemeFE/element/blob/dev/packages/message-box/src/main.js#L79

### 策略模式

策略模式的定义：定义⼀系列的算法，把他们⼀个个封装起来，并且使他们可以相互替换。 

策略模式的⽬的就是将算法的使⽤算法的实现分离开来。

⼀个基于策略模式的程序⾄少由两部分组成。

第⼀个部分是⼀组策略类（可变），策略类封装了具体的算法，并负责具体的计算过程。

第⼆个部分是环境类Context（不变），Context接受客户的请求，随后将请求委托给某⼀个策略类。要做到这⼀点，说明Context中要维持对某个策略对象的引⽤。



举个栗⼦

奖⾦计算，绩效为 S 的⼈年 终奖有 4 倍⼯资，绩效为 A 的⼈年终奖有 3 倍⼯资，⽽绩效为 B 的⼈年奖是 2 倍⼯资

```js
var calculateBonus = function( performanceLevel, salary ){
 if ( performanceLevel === 'S' ){
 return salary * 4;
 }
 if ( performanceLevel === 'A' ){
 return salary * 3;
 }
 if ( performanceLevel === 'B' ){
 return salary * 2;
 }
};
calculateBonus( 'B', 20000 ); // 输出:40000
calculateBonus( 'S', 6000 ); // 输出:24000
```

使⽤策略模式

```js
var strategies = {
 "S": function( salary ){
 return salary * 4;
 },
 "A": function( salary ){
 return salary * 3;
 },
 "B": function( salary ){
 return salary * 2;
 }
};
var calculateBonus = function( level, salary ){
 return strategies[ level ]( salary );
};
console.log( calculateBonus( 'S', 20000 ) );// 输出:80000
console.log( calculateBonus( 'A', 10000 ) );// 输出:30000
```

### 代理模式

代理模式的定义：为⼀个对象提供⼀个代⽤品或占位符，以便控制对它的访问。 

常⽤的虚拟代理形式：某⼀个花销很⼤的操作，可以通过虚拟代理的⽅式延迟到这种需要它的时候才去创建（例：使⽤虚拟代理实现图⽚懒加载） 

图⽚懒加载的⽅式：先通过⼀张loading图占位，然后通过异步的⽅式加载图⽚，等图⽚加载好了再把完成的图⽚加载到img标签⾥⾯。

```js
var imgFunc = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();
var proxyImage = (function () {
    var img = new Image();
    img.onload = function () {
        imgFunc.setSrc(this.src);
    }
    return {
        setSrc: function (src) {
            imgFunc.setSrc('./loading.gif');
            img.src = src;
        }
    }
})();
proxyImage.setSrc('./pic.png');
```

假设我们在做⼀个⽂件同步的功能，当我们选中⼀个 checkbox 的时候，它对应的⽂件就会被同 步到另外⼀台备⽤服务器上⾯。当⼀次选中过多时，会产⽣频繁的⽹络请求。将带来很⼤的开销。可以通过⼀个代理函数 proxySynchronousFile 来收集⼀段时间之内的请求， 最后⼀次性发送给服务器

```js
var synchronousFile = function (id) {
    console.log('开始同步⽂件，id 为: ' + id);
};
var proxySynchronousFile = (function () {
    var cache = [], // 保存⼀段时间内需要同步的 ID
        timer; // 定时器
    return function (id) {
        cache.push(id);
        if (timer) { // 保证不会覆盖已经启动的定时器
            return;
        }
        timer = setTimeout(function () {
            synchronousFile(cache.join(','));
            clearTimeout(timer); // 清空定时器
            timer = null;
            cache.length = 0; // 清空 ID 集合
        }, 2000);
    }// 2 秒后向本体发送需要同步的 ID 集合
})();
var checkbox = document.getElementsByTagName('input');
for (var i = 0, c; c = checkbox[i++];) {
    c.onclick = function () {
        if (this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
}
```

### 中介者模式

中介者模式的定义：通过⼀个中介者对象，其他所有的相关对象都通过该中介者对象来通信，⽽不是相互引⽤，当其中的⼀个对象发⽣改变时，只需要通知中介者对象即可。通过中介者模式可以解除对象与对象之间的紧耦合关系。

例如：现实⽣活中，航线上的⻜机只需要和机场的塔台通信就能确定航线和⻜⾏状态，⽽不需要和所有⻜机通信。同时塔台作为中介者，知道每架⻜机的⻜⾏状态，所以可以安排所有⻜机的起降和航线安排。

中介者模式适⽤的场景：例如购物⻋需求，存在商品选择表单、颜⾊选择表单、购买数量表单等等，都会触发change事件，那么可以通过中介者来转发处理这些事件，实现各个事件间的解耦，仅仅维护中介者对象即可。

redux，vuex 都属于中介者模式的实际应⽤，我们把共享的数据，抽离成⼀个单独的store， 每个都通过store这个中介来操作对象

⽬的就是减少耦合

### 装饰器模式

装饰者模式的定义：在不改变对象⾃身的基础上，在程序运⾏期间给对象动态地添加⽅法。常⻅应⽤，react的⾼阶组件, 或者react-redux中的@connect 或者⾃⼰定义⼀些⾼阶组件