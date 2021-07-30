## [JavaScript运行机制](https://segmentfault.com/a/1190000018001871)

### JavaScript运行三部曲

1. 语法分析
2. 预编译
3. 解释执行

语法分析很简单，就是引擎检查你的代码有没有什么低级的语法错误； 解释执行顾名思义便是执行代码了； 预编译简单理解就是在内存中开辟一些空间，存放一些变量与函数 ；

### JS预编译什么时候发生

预编译到底什么时候发生? 误以为预编译仅仅发生在script内代码块执行前 这倒并没有错 预编译确确实实在script代码内执行前发生了 但是它大部分会发生在函数执行前

先来区分理解一下这2个概念： 变量声明 var ... 函数声明 function(){}

```html
<script>
var a = 1;
console.log(a);
function test(a) {
  console.log(a);
  var a = 123;
  console.log(a);
  function a() {}
  console.log(a);
  var b = function() {}
  console.log(b);
  function d() {}
}
var c = function (){
console.log("I at C function");
}
console.log(c);
test(2);
</script>
```

##### 分析过程如下：

1. 页面产生便创建了GO全局对象（Global Object）（也就是window对象）；
2. 第一个脚本文件加载；
3. 脚本加载完毕后，分析语法是否合法；
4. 开始预编译 查找变量声明，作为GO属性，值赋予undefined； 查找函数声明，作为GO属性，值赋予函数体；

##### 注意：

预编译阶段发生变量声明和函数声明，没有初始化行为（赋值），匿名函数不参与预编译 ； 只有在解释执行阶段才会进行变量初始化 ；

##### 预编译小结

- 预编译两个小规则
  1. 函数声明整体提升-(具体点说，无论函数调用和声明的位置是前是后，系统总会把函数声明移到调用前面）
  2. 变量 声明提升-(具体点说，无论变量调用和声明的位置是前是后，系统总会把声明移到调用前，注意仅仅只是声明，所以值是undefined）
- 预编译前奏
  1. imply global 即任何变量，如果未经声明就赋值，则此变量就位全局变量所有。(全局域就是Window)
  2. 一切声明的全局变量，全是window的属性； var a = 12;等同于Window.a = 12;
- 函数预编译发生在函数执行前一刻。

### 作用域链

- 全局作用域： 代码在程序的任何地方都能被访问，window 对象的内置属性都拥有全局作用域

- 函数作用域： 在固定的代码片段才能被访问

- 每个 `js` 函数都是一个对象，对象中有些属性我们可以访问，有些不可以，这些属性仅供 `js` 引擎存取，[[scope]]就是其中一个，指的就是我们所说的作用域，其中存储了执行期上下文的集合。这个集合呈链式链接，我们把这种链式链接叫做作用域链，通俗点说就是在函数作用域中查找变量时，在当前作用域找不到则向上级作用域查找，直到全局作用域的过程。

  ```js
  function fn() {
    console.log(111)
  }
  fn()
  //fn defined [[scope]]  0 GO
  //fn running [[scope]]  0 fnAO
  //                      1 GO
  //fn定义时作用域链只有GO，执行时会生成自己的AO，在作用域链顶端
  ```

- 词法作用域：函数的作用域在函数定义的时候就决定了

  ```js
  var value = 1;
  function foo() {
    console.log(value);
  }
  function bar() {
    var value = 2;
    foo();
  }
  bar() // 1
  ```

### JS 堆栈内存释放

- 堆内存：存储引用类型值，对象类型就是键值对，函数就是代码字符串。
- 堆内存释放：将引用类型的空间地址变量赋值成 `null`，或没有变量占用堆内存了浏览器就会释放掉这个地址
- 栈内存：提供代码执行的环境和存储基本类型值。
- 栈内存释放：一般当函数执行完后函数的私有作用域就会被释放掉。

> **但栈内存的释放也有特殊情况：① 函数执行完，但是函数的私有作用域内有内容被栈外的变量还在使用的，栈内存就不能释放里面的基本值也就不会被释放。② 全局下的栈内存只有页面被关闭的时候才会被释放**

## 堆，栈、队列



![img](https://user-gold-cdn.xitu.io/2019/1/17/16859c984806c78d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 堆（Heap）

**堆**是一种数据结构，是利用完全二叉树维护的一组数据，**堆**分为两种，一种为最大**堆**，一种为**最小堆**，将根节点**最大**的**堆**叫做**最大堆**或**大根堆**，根节点**最小**的**堆**叫做**最小堆**或**小根堆**。
 **堆**是**线性数据结构**，相当于**一维数组**，有唯一后继。

如最大堆



![img](https://user-gold-cdn.xitu.io/2019/1/17/16859dbb5b9c7ca1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 栈（Stack）

**栈**在计算机科学中是限定仅在**表尾**进行**插入**或**删除**操作的线性表。  **栈**是一种数据结构，它按照**后进先出**的原则存储数据，**先进入**的数据被压入**栈底**，**最后的数据**在**栈顶**，需要读数据的时候从**栈顶**开始**弹出数据**。
 **栈**是只能在**某一端插入**和**删除**的**特殊线性表**。



![img](https://user-gold-cdn.xitu.io/2019/1/17/16859ed4f6143043?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 队列（Queue）

特殊之处在于它只允许在表的前端（`front`）进行**删除**操作，而在表的后端（`rear`）进行**插入**操作，和**栈**一样，**队列**是一种操作受限制的线性表。
 进行**插入**操作的端称为**队尾**，进行**删除**操作的端称为**队头**。  队列中没有元素时，称为**空队列**。

**队列**的数据元素又称为**队列元素**。在队列中插入一个队列元素称为**入队**，从**队列**中**删除**一个队列元素称为**出队**。因为队列**只允许**在一端**插入**，在另一端**删除**，所以只有**最早**进入**队列**的元素**才能最先从队列中**删除，故队列又称为**先进先出**（`FIFO—first in first out`）



![img](https://user-gold-cdn.xitu.io/2019/1/17/16859f2f4f5da2a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## Event Loop

`Event Loop`即事件循环，是指浏览器或`Node`的一种解决`javaScript`单线程运行时不会阻塞的一种机制，也就是我们经常使用**异步**的原理。

在`JavaScript`中，任务被分为两种，一种宏任务（`MacroTask`）也叫`Task`，一种叫微任务（`MicroTask`）。

### MacroTask（宏任务）

- `script`全部代码、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有IE10支持，具体可见[`MDN`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate)）、`I/O`、`UI Rendering`。

### MicroTask（微任务）

- `Process.nextTick（Node独有）`、`Promise`、`Object.observe(废弃)`、`MutationObserver`（具体使用方式查看[这里](http://javascript.ruanyifeng.com/dom/mutationobserver.html)）

## 浏览器中的Event Loop

`Javascript` 有一个 `main thread` 主线程和 `call-stack` 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

### JS调用栈

JS调用栈采用的是后进先出的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。

### 同步任务和异步任务

`Javascript`单线程任务被分为**同步任务**和**异步任务**，同步任务会在调用栈中按照顺序等待主线程依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。



![img](https://user-gold-cdn.xitu.io/2019/1/18/1685f03d7f88792b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 任务队列`Task Queue`





![img](https://user-gold-cdn.xitu.io/2019/1/18/1685f037d48da0de?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

导图要表达的内容用文字来表述的话：

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
- 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
- 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)。

### 执行进入microtask检查点时，用户代理会执行以下步骤：

- 设置microtask检查点标志为true。
- 当事件循环`microtask`执行不为空时：选择一个最先进入的`microtask`队列的`microtask`，将事件循环的`microtask`设置为已选择的`microtask`，运行`microtask`，将已经执行完成的`microtask`为`null`，移出`microtask`中的`microtask`。
- 清理IndexDB事务
- 设置进入microtask检查点的标志为false。

上述可能不太好理解，下图是我做的一张图片。



![img](https://user-gold-cdn.xitu.io/2019/1/18/1686078c7a2f63e5?imageslim)



执行栈在执行完**同步任务**后，查看**执行栈**是否为空，如果执行栈为空，就会去检查**微任务**(`microTask`)队列是否为空，如果为空的话，就执行`Task`（宏任务），否则就一次性执行完所有微任务。
 每次单个**宏任务**执行完毕后，检查**微任务**(`microTask`)队列是否为空，如果不为空的话，会按照**先入先**出的规则全部执行完**微任务**(`microTask`)后，设置**微任务**(`microTask`)队列为`null`，然后再执行**宏任务**，如此循环。

### 举个例子

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
console.log('script end');
```

以上执行帧动画可以查看[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
或许这张图也更好理解些。



![img](https://user-gold-cdn.xitu.io/2019/1/18/16860ae5ad02f993?imageslim)

## [NodeJS的Event Loop](https://juejin.cn/post/6844903764202094606#heading-25)

## [闭包](https://www.w3school.com.cn/js/pro_js_functions_closures.asp)

> 了解闭包前先来了解一下上级作用域和堆栈内存释放问题。

### 上级作用域的概念

- 函数的上级作用域在哪里创建创建的，上级作用域就是谁

```js
var a = 10
function foo(){
    console.log(a)
}

function sum() {
    var a = 20
    foo()
}

sum()
/* 输出
    10
/
```

> **函数 foo() 是在全局下创建的，所以 a 的上级作用域就是 window，输出就是 10**

### 闭包是什么

> 在 JS 忍者秘籍(P90)中对闭包的定义：闭包允许函数访问并操作函数外部的变量。红宝书上对于闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数。 MDN 对闭包的定义为：闭包是指那些能够访问自由变量的函数。这里的自由变量是外部函数作用域中的变量。

概述上面的话，**闭包是指有权访问另一个函数作用域中变量的函数**

### 形成闭包的原因

**内部的函数存在外部作用域的引用就会导致闭包**。

```js
var a = 0
function foo(){
    var b =14
    function fo(){
        console.log(a, b)
    }
    fo()
}
foo()
复制代码
```

这里的子函数 `fo` 内存就存在外部作用域的引用 `a, b`，所以这就会产生闭包

### 闭包的作用

- 保护函数的私有变量不受外部的干扰。形成不销毁的栈内存。
- 保存，把一些函数内的值保存下来。闭包可以实现方法和属性的私有化

### 闭包经典使用场景

- `return` 回一个函数

```js
var n = 10
function fn(){
    var n =20
    function f() {
       n++;
       console.log(n)
     }
    return f
}

var x = fn()
x() // 21
```

> 这里的 return `f`, `f()`就是一个闭包，存在上级作用域的引用。

- 函数作为参数

```js
var a = '林一一'
function foo(){
    var a = 'foo'
    function fo(){
        console.log(a)
    }
    return fo
}

function f(p){
    var a = 'f'
    p()
}
f(foo())
/* 输出
*   foo
/ 
```

> 使用 return `fo` 返回回来，`fo()` 就是闭包，`f(foo())` 执行的参数就是函数 `fo`，因为 `fo() 中的 a`  的上级作用域就是函数`foo()`，所以输出就是`foo`

- IIFE（自执行函数）

```js
var n = '林一一';
(function p(){
    console.log(n)
})()
/* 输出
*   林一一
/ 
```

> 同样也是产生了闭包`p()`，存在 `window`下的引用 `n`。

- 循环赋值

```js
for(var i = 0; i<10; i++){
  (function(j){
       setTimeout(function(){
        console.log(j)
    }, 1000) 
  })(i)
}
```

> 因为存在闭包的原因上面能依次输出1~10，闭包形成了10个互不干扰的私有作用域。将外层的自执行函数去掉后就不存在外部作用域的引用了，输出的结果就是连续的 10。为什么会连续输出10，因为 JS 是单线程的遇到异步的代码不会先执行(会入栈)，等到同步的代码执行完 `i++` 到 10时，异步代码才开始执行此时的 `i=10` 输出的都是 10。

- 使用回调函数就是在使用闭包

```js
window.name = '林一一'
setTimeout(function timeHandler(){
  console.log(window.name);
}, 100)
```

### 使用闭包需要注意什么

容易导致内存泄漏。闭包会携带包含其它的函数作用域，因此会比其他函数占用更多的内存。过度使用闭包会导致内存占用过多，所以要谨慎使用闭包。

### 经典面试题

- for 循环和闭包(号称必刷题)

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]()
/* 输出
    3
    3
    3
/
```

> 这里的 `i` 是全局下的 `i`，共用一个作用域，当函数被执行的时候这时的 `i=3`，导致输出的结构都是3。

- 使用闭包改善上面的写法达到预期效果，写法1：自执行函数和闭包

```js
var data = [];

for (var i = 0; i < 3; i++) {
    (function(j){
      setTimeout( data[j] = function () {
        console.log(j);
      }, 0)
    })(i)
}

data[0]();
data[1]();
data[2]()
```

- 写法2：使用 `let`

```js
var data = [];

for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]()
```

> `let` 具有块级作用域，形成的3个私有作用域都是互不干扰的。

