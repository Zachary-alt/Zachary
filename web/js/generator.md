## [Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)

## [Generator 函数的异步应用](https://es6.ruanyifeng.com/#docs/generator-async)

## async await的最简实现

经常有人说async函数是generator函数的语法糖，那么到底是怎么样一个糖呢？让我们来一层层的剥开它的糖衣。

### 示例

```js
const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))

async function test() {
  const data = await getData()
  console.log('data: ', data);
  const data2 = await getData()
  console.log('data2: ', data2);
  return 'success'
}

// 这样的一个函数 应该再1秒后打印data 再过一秒打印data2 最后打印success
test().then(res => console.log(res))
```

## 思路

对于这个简单的案例来说，如果我们把它用generator函数表达，会是怎么样的呢？

```js
function* testG() {
  // await被编译成了yield
  const data = yield getData()
  console.log('data: ', data);
  const data2 = yield getData()
  console.log('data2: ', data2);
  return 'success'
}
```

我们知道，generator函数是不会自动执行的，每一次调用它的next方法，会停留在下一个yield的位置。

利用这个特性，我们只要编写一个自动执行的函数，就可以让这个generator函数完全实现async函数的功能。

```js
const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))
  
var test = asyncToGenerator(
    function* testG() {
      // await被编译成了yield
      const data = yield getData()
      console.log('data: ', data);
      const data2 = yield getData()
      console.log('data2: ', data2);
      return 'success'
    }
)

test().then(res => console.log(res))
```

那么大体上的思路已经确定了，

`asyncToGenerator`接受一个`generator`函数，返回一个`promise`，

关键就在于，里面用`yield`来划分的异步流程，应该如何自动执行。

**下一次调用next的时候，传的参数会被作为上一个yield前面接受的值**

```js
function asyncToGenerator(generatorFunc) {
    return function () {
        let gen = generatorFunc.apply(this, arguments)
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let generatorResult
                try {
                    generatorResult = gen[key](arg)
                } catch (error) {
                    return reject(error)
                }
                const { value, done } = generatorResult
                if (done) {
                    resolve(value)
                } else {
                    Promise.resolve(value).then(res => step('next', res), err => step('throw', err))
                }
            }
            step('next')
        })
    }
}
```

