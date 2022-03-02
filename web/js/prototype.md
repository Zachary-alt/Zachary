## 原型/原型链

### **JavaScript数据类型：**

值类型(基本类型)：字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol。

引用数据类型：对象(Object)、数组(Array)、函数(Function)。

注：Symbol 是 ES6 引入了一种新的原始数据类型，表示独一无二的值。

### typeof

typeof 返回一个表达式的数据类型的字符串，返回结果为javascript中的基本数据类型，包括：number、boolean、string、object、undefined、function等6种数据类型。

```js
typeof 100; //number
typeof (1==1); //boolean
typeof 'onepixel'; //string
typeof {} ; //object
typeof onepixel; // undefined
typeof parseInt; // function
typeof [];//object
typeof new Date(); //object
```

可以看出，typeof 可以准确的判断除object以外的基础数据类型，但不能区分object类型的具体类型，比如 Array 、Date 以及自定义类。

### instanceof

instanceof 本意是用来判断 A 是否为 B 的实例对象，表达式为：A instanceof B，如果A是B的实例，则返回true,否则返回false。 在这里需要特别注意的是：instanceof检测的是原型，那它是怎么检测的呢，我们用一段伪代码来模拟其内部执行过程：

```js
instanceof (A,B) = {
var L = A.__proto__;
var R = B.prototype;
if(L === R) {
//A的内部属性__proto__指向B的原型对象
return true;
}
return false;
}
```

从上述过程可以看出，当A的__proto__ 指向B的prototype时，就认为A就是B的实例对象，我们再来看几个例子：

```js
[] instanceof Array; //true
{} instanceof Object;//true
new Date() instanceof Date;//true
function Person(){};
new Person() instanceof Person;
[] instanceof Object; //true
new Date() instanceof Object;//true
new Person instanceof Object;//true
```

从上面的例子中，我们发现虽然instanceof能够正确判断[] 是Array的实例对象，但不能辨别 [] 不是Object的实例对象，为什么呢，这还需要从javascript的原型链说起，我们首先来分析一下[]、Array、Object 三者之间的关系，从instanceof判断能够得出：[].__proto__ ->Array.prototype， 而Array.prototype.__proto__指向了Object.prototype，Object.prototype.__proto__ 指向了null,标志着原型链的结束。（ps:关于JS原型链请阅读：[浅谈javascript原型和原型链](https://juejin.cn/post/6844903475021627400)） 因此，[]、Array、Object就形成了一条原型链：

![img](https://img.jbzj.com/file_images/article/201601/201601130904581.png)

从原型链可以看出，[]的__proto__最终指向了Object.prototype，类似的new Date()、new Person() 也会形成这样一条原型链，因此，我们用 instanceof 也不能完全精确的判断object类的具体数据类型。

### 原型

原型是`function`的一个属性，它定义了构造函数制造出的对象实例的公共祖先，通过该构造函数产生的实例，可以继承该原型的属性和方法

```js
function Person(name, age) {
  this.name = name;
  this.age = age; 
}
Person.prototype.size = "small";
const person = new Person("a", 18);
console.log(person.size); //"small"
```

#### constructor

每个原型都有一个 constructor 属性，指向该关联的构造函数

```js
function Car(){}
const car = new Car()
Car.prototype.constructor == Car //true
car.constructor == Car //true
// 当获取car.constructor时，其实car是没有这个属性的，当不能读取car的constructor属性时，会从car的原型链上读取
car.constructor == Car.prototype.constructor //true
```

#### `__proto__`

每个对象实例(除 null 外)都会有`__proto__`属性，函数有`prototype`属性,对象实例由函数生成，生成对象实例时，实例的`__proto__`属性指向函数的`prototype`属性

#### new 操作符

创建一个空对象 obj 将这个空对象的`__proto__`成员指向了 F 函数对象的 `prototype` 将 F 函数对象的 this 指针替换成 obj

```js
function createNew(F, ...args) {
  var obj = {}
  obj.__proto__ = F.prototype
  F.call(obj, ...args)
  return obj
}
```

### 原型链

> 每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。那么假如我们让原型对象等于另一个类型的实例，结果会怎样？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立。如此层层递进，就构成了实例与原型的链条。这就是所谓的原型链的基本概念。——摘自《`javascript` 高级程序设计》

虽然描述有点绕，但可以自行体会

## 继承

### 构造函数继承

> 缺点：只能继承父类构造函数的属性，不能继承父类原型的属性；每次构造实例都执行两个构造函数

```js
function Parent1(){
    this.name='jack';
    this.age=18
	console.log(1)
}
function Child1(){
    Parent1.call(this);
    this.address='南京'
	console.log(2)
}
var s1=new Child1()
console.log(s1.name);  //jack

//  父类添加say方法
Parent1.prototype.say = function () {
    console.log('say bye bye')
}
//  子类中直接打印这个say方法
// console.log(s1.say())  //报错
```
### 原型链继承

> 缺点：所有实例都会共享父类实例的属性；无法向父类构造函数传参

```js
function Parent2 () {
    this.name = '祝敏',
    this.play = [1,2,3]
}
//  一样在父类添加say方法
Parent2.prototype = {
    say () {
        console.log('say bye bye')
    }
}
function Child2 () {
    this.address = '硚口区'
}
// 让子类的原型直接等于父类实例
Child2.prototype = new Parent2()
//  生成两个子类的实例s2、s3
var s2 = new Child2()
var s3 = new Child2()
// s2实例继承了父类中的name属性
console.log(s2.name)  //祝敏
//  s2实例也同样继承了父类原型上的say方法
console.log(s2.say())  //say bye bye

//  给s2实例继承的play属性的数组中push一个新数字
s2.play.push(4)
console.log(s2.play)  //[1, 2, 3, 4]
console.log(s3.play)  //[1, 2, 3, 4]
// 改变了s2的play属性之后因为s2的原型对象和s3的原型对象相等，所以s3也跟着一起改变
```

### 组合继承（原型链和构造函数 ）

> 性能占用，调用了两次父类构造函数，第一次是将父类实例赋值给子类的prototype属性，让子类的实例继承父类原型对象的方法，第二次是实例化子类的时候，Person.call(this,..)时

```js
function Parent3 () {
    this.name = '许风',
    this.age = 20,
    this.play = [4,5,6]
}
function Child3 () {
    Parent3.call(this)
    this.address = '江夏区'
}
Child3.prototype = new Parent3()
var s4 = new Child3()
var s5 = new Child3()
s4.play.push(7)
console.log(s4.play)  //  [4, 5, 6, 7]
console.log(s5.play)  //  [4, 5, 6]
```

**优化一波**

```js
//  解决父级函数的两次调用问题
function Parent4 () {
    this.name = '季亮',
    this.age = 20,
    this.play = [4,5,6]
}
function Child4 () {
    Parent4.call(this)
    this.address = '汉南区'
}
Child4.prototype = Parent4.prototype //  子类的原型和父类的原型相等
```

将new出来的实例转换成父级的构造函数的原型对象，因为实例的_ proto _原型对象和父级构函数的原型对象相等，而实例可以继承原型链上的属性和方法，所以这里解决了多次调用父级构造函数的问题。

但是这里还存在一个问题，我们来看下面的这个栗子

```js
var s6 = new Child4()
var s7 = new Child4()
var s8 = new Parent4()
// s6、s7实例是子类Child4构造函数生成
console.log(s6.constructor) //  父类构造函数Parent4()
console.log(s8.constructor)  //  父类构造函数Parent4()
```

Child4构造函数生成的实例在程序里无法区分到底是由父类创造的还是子类创造的，好吧，如何解决这个问题，就需要用到Object.create()这种创建对象的方法进行隔离，并指定自己的constructor。

**完美版**（貌似也叫寄生组合式继承）

```js
function Parent5 () {
    this.name = '许风',
    this.age = 20,
    this.play = [4,5,6]
}
function Child5 () {
    Parent5.call(this)
    this.address = '江夏区'
}
// 比较关键的一步
Child5.prototype = Object.create(Parent5.prototype)
Child5.prototype.constructor=Child5
console.log(Child5.prototype)  //Parent5 {} 
console.log(Child5.prototype.constructor)  //构造函数Child5
```


### 寄生式继承

> 原型式继承外面套一个函数返回对象，无法复用

```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
function subobject(o){
  var sub = object(o)
  sub.xx = 'xx'
  return sub
}
```

