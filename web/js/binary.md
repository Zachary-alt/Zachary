## 进制转换

进制转换只能发生在数字上，也就是Number类型，所以要进行进制转换，那就是需要用到Number类型上的方法了，有两种方法：

- parseInt(string , radix)或者parseInt(string , radix)，前者是全局的方法，是以前的规范，现在规范改了变成了Number下面的方法。
- Number.toString(radix)
  

但是由于大部分语言只支持八进制，十进制和十六进制的字面量数值，所以js在进行转换的时候，只能在字符串和数字类型之间转换，即只能将其他进制的字符串转换为十进制的数字，或者将十进制的数字转换为其他进制的字符串。

#### Number.parseInt(string , radix)

这个是把字符串(只能由字母和数字组成)，只能是由低进制转高进制，如二进制转八进制，但是八进制不能转二进制，radix表示进制，取值2~36。

```js
Number.parseInt('010',8) // 8
Number.parseInt('20',2) // NaN
```

#### Number.toString(radix)

返回指定 [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 对象的字符串表示形式，同样，radix表示进制，取值2~36。

```js
(10).toString(2) // '1010'
(10).toString(16) // 'a'
(1000).toString(36) // 'rs'
```

