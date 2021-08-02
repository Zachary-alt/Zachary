## 防抖

触发事件后在规定时间内回调函数只执行一次，如果在规定时间内又触发了该事件，则会重新开始计算时间

常见例子：input搜索框,客户输完过一会就会自动搜索

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>防抖</title>
  </head>

  <body>
    <button id="button">点击防抖</button>
    <script>
      function debounce(fn, delay) {
        let timer = null
        return function() {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            fn.apply(this, arguments)
          }, delay)
        }
      }
      function clickBtn(a) {
        console.log('防抖成功', a)
      }
      let debounceClick = debounce(clickBtn, 1000)
      document.getElementById('button').addEventListener('click', function() {
        debounceClick('dada')
      })
    </script>
  </body>
</html>
```

## 节流

持续触发事件时，在规定时间内只能调用一次回调函数，如果在规定时间内再次触发了该事件，不做任何操作

```js
function throttle(fn, delay=500) {
          let canRun = true; // 通过闭包保存一个标记
          return function() {
            if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
            canRun = false; // 立即设置为false
            setTimeout(() => {
              // 将外部传入的函数的执行放在setTimeout中
              fn.apply(this, arguments);
              // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
              canRun = true;
            }, delay);
          };
        }
        function sayHi1(e) {
          console.log(e.target.innerWidth, e.target.innerHeight);
        }
        window.addEventListener("resize", throttle(sayHi1));
```

## 函数柯里化

柯里化，英语：Currying，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

Currying有哪些作用：

1. 参数复用

   ```js
   function curryingCheck(reg){
       return function(txt){
           return reg.test(txt)
       }
   }
   var hasNumber = curryingCheck(/\d+/g)
   var hasLetter = curryingCheck(/[a-z]+/g)
   
   hasNumber('test1')      // true
   hasNumber('testtest')   // false
   hasLetter('21212')      // false
   ```

2. 提前执行

3. 延迟运行

提前返回 和 延迟执行 也很好理解，因为每次调用函数时，它只接受一部分参数，并返回一个函数（提前返回），直到(延迟执行)传递所有参数为止。

像我们js中经常使用的bind，实现的机制就是Currying.

```js
Function.prototype.bind1=function (ctx) { 
    let _this=this;
    // args 获取第一个方法内的全部参数
    let args=Array.prototype.slice.call(arguments,1)
    return function () {  
        // 将后面方法里的全部参数和args进行合并
        var newArgs = args.concat(Array.prototype.slice.call(arguments))
        // 把合并后的参数通过apply作为fn的参数并执行
        return _this.apply(ctx,newArgs)
    }
}
console.log(sub.bind1(add)(1, 2));
```

[彻底搞懂柯里化](https://juejin.cn/post/6864378349512065038#heading-27)

