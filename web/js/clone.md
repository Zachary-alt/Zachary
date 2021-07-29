## 浅拷贝与深拷贝

- 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以**如果其中一个对象改变了这个地址，就会影响到另一个对象**。
- 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。

### 浅拷贝的实现方式

- Object.assign()
- 函数库lodash的_.clone方法
- 展开运算符...
- Array.prototype.concat()
- Array.prototype.slice()

### 深拷贝的实现方式

- JSON.parse(JSON.stringify())

  > 利用JSON.stringify将对象转成JSON字符串，再用JSON.parse把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

  但是该方法也是有局限性的：会忽略 undefined，会忽略 symbol，不能序列化函数，无法处理正则，不能解决循环引用的对象（直接报错）

  ```js
  let obj = {
      age: 1,
      jobs: {
        first: "fe"
      },
      gf: undefined,
      reg:/w/g,
      run() {
        console.log("1");
      },
      sy:Symbol('xx')
    };
    // obj.jobs.c=obj.jobs
    console.log(JSON.parse(JSON.stringify(obj)))
  ```

- 通过MessageChannel

  可以处理 undefined 和循环引用对象，注意该方法是异步的，但处理函数\正则时会报错。

  ```js
  function structuralClone(obj) {
      return new Promise(res => {
        const { port1, port2 } = new MessageChannel();
        port2.onmessage = ev => res(ev.data); //接收来自port1
        port1.postMessage(obj); //发送给port2
      });
    }
    (async () => {
      const clone = await structuralClone(obj);
      console.log(clone);
    })();
  ```

- 函数库lodash的_.cloneDeep方法

- jQuery.extend()方法

  ```js
  $.extend(deepCopy, target, object1, [objectN])//第一个参数为true,就是深拷贝
  ```

- 手写递归方法

  递归方法实现深度克隆原理：**遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝**。

  **循环引用**的情况需要特殊处理下，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。关于这块如有疑惑，请仔细阅读[如何写出一个惊艳面试官的深拷贝?](https://juejin.cn/post/6844903929705136141)这篇文章。

  ```js
  function deepClone(obj, hash = new WeakMap()) {
    if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
    if (typeof obj !== "object") return obj;
    // 是对象的话就要进行深拷贝
    if (hash.get(obj)) return hash.get(obj);
    let cloneObj = new obj.constructor();
    // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
    hash.set(obj, cloneObj);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 实现一个递归拷贝
        cloneObj[key] = deepClone(obj[key], hash);
      }
    }
    return cloneObj;
  }
  let obj = { name: 1, address: { x: 100 } };
  obj.o = obj; // 对象存在循环引用的情况
  let d = deepClone(obj);
  obj.address.x = 200;
  console.log(d);
  ```

- [劫持拷贝](https://juejin.cn/post/6844904021627502599)

  对于庞大的数据来说，遍历递归的性能并不好，因为需要把整个对象都遍历一遍。

  `Proxy`，通过拦截 `set` 和 `get` 就能达到我们想要的，当然 `Object.defineProperty()` 也可以。其实 [Immer](https://github.com/immerjs/immer) 这个库就是用了这种做法来生成不可变对象的，接下来就让我们来试着通过 `Proxy` 来实现高性能版的深拷贝。

  整体核心思路，其实就三点：

  - 拦截 `set`，所有赋值都在 copy （原数据浅拷贝的对象）中进行，这样就不会影响到原对象
  - 拦截 `get`，通过属性是否修改的逻辑分别从 copy 或者原数据中取值
  - 最后生成不可变对象的时候遍历原对象，判断属性是否被修改过，也就是判断是否存在 copy。如果没有修改过的话，就返回原属性，并且也不再需要对子属性对象遍历，提高了性能。如果修改过的话，就需要把 copy 赋值到新对象上，并且递归遍历

  