## 模板编译

模板编译的主要目标是将**模板(template)转换为渲染函数(render)**
Vue 2.0需要用到VNode描述视图以及各种交互，手写显然不切实际，因此用户只需编写类似HTML代码的Vue模板，通过编译器将模板转换为可返回VNode的render函数。

### 体验模板编译

带编译器的版本中，可以使用template或el的方式声明模板

```vue
<div id="demo">
    <h1>Vue.js测试</h1>
    <p>{{foo}}</p>
</div>
<script>
// 使用el方式
new Vue({
    data: { foo: 'foo' },
    el: "#demo",
});
</script>
```

然后输出渲染函数

```js
<script>
    const app = new Vue({});
    // 输出render函数
    console.log(app.$options.render);
</script>
```

> 输出结果大致如下：
>
> ```js
> ƒunction anonymous() {
>     with (this) {
>         return _c('div', { attrs: { "id": "demo" } }, [
>             _c('h1', [_v("Vue.js测试")]),
>             _v(" "),
>             _c('p', [_v(_s(foo))])
>         ])
>     }
> }
> ```
>
> 元素节点使用createElement创建，别名_c
> 本文节点使用createTextVNode创建，别名_v
> 表达式先使用toString格式化，别名_s

模板编译过程

实现模板编译共有三个阶段：解析、优化和生成

解析 - parse
解析器将模板解析为抽象语法树AST，只有将模板解析成AST后，才能基于它做优化或者生成代码字符串。
调试查看得到的AST，/src/compiler/parser/index.js

解析器内部分了HTML解析器、文本解析器和过滤器解析器，最主要是HTML解析器，核心算法说明：

```js
//src/compiler/parser/index.js
parseHTML(tempalte, {
    start(tag, attrs, unary){}, // 遇到开始标签的处理
    end(){},// 遇到结束标签的处理
    chars(text){},// 遇到文文本标签的处理
    comment(text){}// 遇到注释标签的处理
})
```

### 优化 - optimize

优化器的作用是在AST中找出静态子树并打上标记。静态子树是在AST中永远不不变的节点，如纯文本节点。
标记静态子树的好处：

- 每次重新渲染，不需要为静态子树创建新节点
- 虚拟DOM中patch时，可以跳过静态子树

代码实现，src/compiler/optimizer.js - optimize

```js
export function optimize (root: ?ASTElement, options: CompilerOptions) {
    if (!root) return
    isStaticKey = genStaticKeysCached(options.staticKeys || '')
    isPlatformReservedTag = options.isReservedTag || no
    // 找出静态节点并标记
    markStatic(root)
    // 找出静态根节点并标记
    markStaticRoots(root, false)
}
```

### 代码生成 - generate

将AST转换成渲染函数中的内容，即代码字符串。
generate方法生成渲染函数代码，src/compiler/codegen/index.js

```ts
export function generate(
    ast: ASTElement | void,
    options: CompilerOptions
): CodegenResult {
    const state = new CodegenState(options)
    const code = ast ? genElement(ast, state) : '_c("div")'
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    }
}
//生成的code长这样
`_c('div',{attrs:{"id":"demo"}},[
_c('h1',[_v("Vue.js测试")]),
_c('p',[_v(_s(foo))])
])`
```

### v-if、v-for

着重观察几个结构性指令的解析过程

```ts
// 解析v-if，parser/index.js
function processIf(el) {
    const exp = getAndRemoveAttr(el, 'v-if') // 获取v-if=“exp"中exp并删除v-if属性
    if (exp) {
        el.if = exp // 为ast添加if表示条件
        addIfCondition(el, { // 为ast添加ifConditions表示各种情况对应结果
            exp: exp,
            block: el
        })
    } else { // 其他情况处理理
        if (getAndRemoveAttr(el, 'v-else') != null) {
            el.else = true
        }
        const elseif = getAndRemoveAttr(el, 'v-else-if')
        if (elseif) {
            el.elseif = elseif
        }
    }
}
// 代码生成，codegen/index.js
function genIfConditions(
    conditions: ASTIfConditions,
    state: CodegenState,
    altGen?: Function,
    altEmpty?: string
): string {
    const condition = conditions.shift() // 每次处理一个条件
    if (condition.exp) { // 每种条件生成一个三元表达式
        return `(${condition.exp})?${genTernaryExp(condition.block)
            }:${genIfConditions(conditions, state, altGen, altEmpty)
            }`
    } else {
        return `${genTernaryExp(condition.block)}`
    }
    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) { }
}
```

生成结果：

```js
"with(this){return _c('div',{attrs:{"id":"demo"}},[
(foo) ? _c('h1',[_v(_s(foo))]) : _c('h1',[_v("no title")]),
_v(" "),_c('abc')],1)}"
```

### 插槽

组件编译的顺序是**先编译父组件，再编译子组件**。

**普通插槽是在父组件编译**和渲染阶段生成  `vnodes` ，数据的作用域是父组件，子组件渲染的时候直接拿到这些渲染好的  `vnodes`。
**作用域插槽**，父组件在编译和渲染阶段并不会直接生成  `vnodes`，而是在父节点保留一个`scopedSlots` 对象，**存储着不同名称的插槽以及它们对应的渲染函数**，只有在编译和**渲染子组件阶段才会执行**这个渲染函数生成  `vnodes` ，由于是在子组件环境执行的，所以对应的**数据作用域是子组件实例**。
解析相关代码：

```js
// processSlotContent：处理<template v-slot:xxx="yyy">
const slotBinding = getAndRemoveAttrByRegex(el, slotRE) // 查找v-slot:xxx
if (slotBinding) {
    const { name, dynamic } = getSlotName(slotBinding) // name是xxx
    el.slotTarget = name // xxx赋值到slotTarget
    el.slotTargetDynamic = dynamic
    el.slotScope = slotBinding.value || emptySlotScopeToken // yyy赋值到
    slotScope
}
// processSlotOutlet：处理理<slot>
if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name') // 获取slot的name并赋值到slotName
}
```

生成相关代码：

```js
// genScopedSlot：这里里把slotScope作为形参转换为工⼚函数返回内容
const fn = `function(${slotScope}){` +
    `return ${el.tag === 'template'
        ? el.if && isLegacySyntax
            ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
            : genChildren(el, state) || 'undefined'
        : genElement(el, state)
    }}`
// reverse proxy v-slot without scope on this.$slots
const reverseProxy = slotScope ? `` : `,proxy:true`
return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
```

## vue.js项目中一些最佳实践

范例：项目要使用icon，传统方案是图标字体(字体文件+样式文件)，不便维护；svg方案采用svg-sprite-loader自动加载打包，方便维护。

使用icon前先安装依赖：svg-sprite-loader

```shell
npm i svg-sprite-loader -D
```

下载图标，存入src/icons/svg中
修改规则和新增规则，vue.config.js

```js
// resolve定义一个绝对路径获取函数
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
//...
chainWebpack(config) {
    // 配置svg规则排除icons目录中svg文件处理
    config.module
        .rule("svg")
        .exclude.add(resolve("src/icons"));
    // 新增icons规则，设置svg-sprite-loader处理icons目录中的svg
    config.module.rule("icons") //新增icons规则
        .test(/\.svg$/) //test选项
        .include.add(resolve("src/icons")) // include选项是数组
        .end() //add完上下文是数组不是icons规则，使用end()回退
        .use("svg-sprite-loader") //添加use选项
        .loader("svg-sprite-loader") //切换上下文为svg-sprite-loader
        .options({ symbolId: "icon-[name]" }) // 为svg-sprite-loader新增选项
        .end();// 回退
}
```

图标自动导入

```js
// icons/index.js
// 指定require上下文
const req = require.context('./svg', false, /\.svg$/)
// 遍历加载上下文中所有项
req.keys().map(req);
// main.js
import './icons'
```

