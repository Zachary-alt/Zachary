## 类型转换

### 显式类型转换

- Number()、parseInt(arg, radix)、parseFloat(arg)、String()、Boolean()

- toString(radix)

  xx.toString(),以十进制为基底，转化成 radix 进制

  > `undefined`和`null`不能使用 toString()，没有原型不会产生包装类，所以调不到 Object.prototype.toString()方法

```js
//将一个二进制的数转换成十六进制
var num = 10101010
parseInt(num).toString(16)
```

[ToPrimitive](https://juejin.cn/post/6844903895991353352)

当一个对象转换为对应的原始值时，会调用此函数

该函数被调用时，会被传递一个字符串参数 hint ，表示要转换到的原始值的预期类型。

hint 参数的取值是 "number"、"string" 和 "default" 中的任意一个。 转换过程如下：

1. number: val → val.valueOf() → val.toString() → error
2. string: val → val.toString() → val.valueOf() → error
3. default: 同 number

### 隐式类型转换

**隐式转换规则**：

1. 转化成字符串：使用字符串连接符 +

2.  转化成数字： 2.1 ++/-- （自加/自减） 2.2 + - * / % （算术运算）2.3 > < >= <= == !=  !== （[关系运算符](https://www.w3school.com.cn/js/pro_js_operators_relational.asp)）

3. 转成布尔值：使用！非运算符

   > 以下情况使用Boolean()转化将会得到false：0、-0、undefined、null、NaN、false、''(空字符串)、document.all

- isNaN

  先用 Number()转换之后再和 NaN 比较

  ```js
  isNaN(NaN) // true
  isNaN(undefined) // true
  isNaN(null) // false
  ```

- ++/--/正/负

  调用 Number()

  ```js
  +'1.1' // 1.1
  +'asdf' // NaN
  +true // 1
  +false // 0
  +null // 0
  +undefined // NaN
  +{} // NaN
  +[] // 0
  +new Date() // 1556258367546
  ```

- 加号+

  调用 String()

  > 如果两个操作符都是数值，执行常规的加法计算 如果有一个操作数是 NaN，则结果是 NaN； 如果两个操作数都是字符串，则将第二个操作数与第一个操作数拼接起来； 如果只有一个操作数是字符串，则将另一个操作数转换为字符串，然后再将两个字符串拼接起来。 如果有一个操作数是对象，则执行抽象操作 ToPrimitive 的返回值，然后再应用前面关于字符串的规则。 对于 undefined 和 null，则分别调用 String()函数并取得字符串"undefined"和"null"。

  ```js
  null+undefined // 'nullundefined'
  [] + {} //"[object Object]"
  {} + [] //0   js会将{}当成代码块 只执行+[]
  ```

#### valueof() 和 toString()

- valueof()

  返回指定对象的原始值

  ```js
  // Array 返回数组对象本身
  // Boolean 布尔值
  // Date 返回时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC
  // Function 函数本身
  // Number 数字值
  // Object 对象本身，这是默认情况。
  // String 字符串值
  // Reg 正则本身
  var arr = []; arr.valueOf() //[]
  var obj = {}; obj.valueOf() //{}
  var fun = function(){}; fun.valueOf() //ƒ (){}
  var bol = true; bol.valueOf() //true
  var num = 1; num.valueOf() //1
  var str = 'aaa'; str.valueOf() //'aaa'
  ```

- toString()

  > toString()函数的作用是返回object的字符串表示

  ```js
  // Array 返回数组元素的字符串，默认以逗号链接。
  // Boolean 布尔值的字符串值
  // Date 日期UTC标准格式
  // Function 函数的字符串值
  // Number 数字值的字符串值
  // Object [Object Object]
  // String 字符串值
  // Reg 正则的字符串值
  var arr = []; arr.toString() //""
  var obj = {}; obj.toString() //"[object Object]"
  var fun = function(){}; fun.toString() //"function(){}"
  var bol = true; bol.toString() //'true'
  var num = 1; num.toString() //'1'
  var str = 'aaa'; str.toString() //'aaa'
  ```

1. 复杂类型数据指的是对象或数组这类数据进行隐式转换时，会先调用valueOf后调用toString方法转化成数据。

2. 如果这个对象的valueOf方法和toString方法被重写过，则会根据valueOf返回的数据类型判断是否执行toString。

   > valueOf返回的数据类型决定是否调用toString，如果返回的类型是数字或者字符串(其实用基础数据类型更准确点)，toString方法就不执行了。

```js
let a = {
    valueOf: function () {
        console.log('执行valueOf')
        // return 'a'
        // return 1
        return {}
    },
    toString: function () {
        console.log('执行toString')
        return 'a'
    }
}
console.log(a == 'a')
// 执行valueOf
// true

// 执行valueOf
// false

// 执行valueOf
// 执行toString
// true
```

##### 逻辑非隐式转换与关系运算符隐式转换混淆

当使用!逻辑非运算符进行转化的时候，会尝试把数据转化成布尔值

```js
console.log([] == 0)    // true
console.log(![] == 0)   // true
// [] == 0 --> [].valueOf().toString()得到空字符串，Number('') == 0 成立
// ![] == 0 --> Boolean([])得到true再取反，最后转化成数字0，Number(!true) == 0 成立
```

```js
console.log([] == ![])  // true
console.log([] == [])   // false
// [] == ![] --> [].valueOf().toString()得到空字符串，Number('')取得0，Boolean([])得到true再取反，转化成数字0，最后Number('') == Number(!true) 成立
// [] == [] --> 两个数组比较是因为两个数据的引用指向不一致，所以 [] == [] 不成立
```

```js
console.log({} == !{})  // false
console.log({} == {})   // false
// {} == !{} --> {}.valueOf().toString()得到'[object Object]'，Boolean({})得到true再取反，所以 '[object Object]' == false 不成立
// {} == {} --> 两个对象比较是因为两个数据的引用指向不一致，所以 {} == {} 不成立
```
