## Vue3快速上手篇

### [组合式 API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)

当我们的组件开始变得更大时，**逻辑关注点**的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。

如果能够将同一个逻辑关注点相关代码收集在一起会更好。而这正是组合式 API 使我们能够做到的。

#### `setup` 组件选项

新的 `setup` 选项在组件创建**之前**执行，一旦 `props` 被解析，就将作为组合式 API 的入口。

`setup` 选项是一个接收 `props` 和 `context` 的函数，我们将在[之后](https://v3.cn.vuejs.org/guide/composition-api-setup.html#参数)进行讨论。此外，我们将 `setup` 返回的所有内容都暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。

#### 带 `ref` 的响应式变量

`ref` 接收参数并将其包裹在一个带有 `value` property 的对象中返回，然后可以使用该 property 访问或更改响应式变量的值

将值封装在一个对象中，看似没有必要，但为了保持 JavaScript 中不同数据类型的行为统一，这是必须的。这是因为在 JavaScript 中，`Number` 或 `String` 等基本类型是通过值而非引用传递的

> 换句话说，`ref` 为我们的值创建了一个**响应式引用**。在整个组合式 API 中会经常使用**引用**的概念。

#### 在 `setup` 内注册生命周期钩子

为了使组合式 API 的功能和选项式 API 一样完整，我们还需要一种在 `setup` 中注册生命周期钩子的方法。这要归功于 Vue 导出的几个新函数。组合式 API 上的生命周期钩子与选项式 API 的名称相同，但前缀为 `on`：即 `mounted` 看起来会像 `onMounted`。

```vue
// components/composition.vue
<template>
  <button type="button" @click="counter++">count is: {{ counter }}</button>
  <p>doudle: {{doudleCounter}}</p>
  <p ref="desc"></p>
</template>

<script>
import { ref,watch } from 'vue'
import useCounter from '../composition/useCounter.js'
export default {
  setup(props){
    const {counter,doudleCounter} = useCounter()
    // 使用元素引用
    const desc = ref(null)

    watch(counter,(val,oval)=>{
      const p = desc.value
      p.textContent = `counter change from ${oval} to ${val}`
    })
    return {
      counter,doudleCounter,desc
    }
  }
};
</script>
```

```js
// composition/useCounter.js
import { toRefs, reactive, computed, onMounted, onUnmounted } from 'vue'
export default function useCounter() {
    const data = reactive({
        counter: 1,
        doudleCounter: computed(() => data.counter * 2)
    })
    let timer
    onMounted(() => {
        timer = setInterval(() => {
            data.counter++
        }, 1000);
    })
    onUnmounted(() => {
        clearInterval(timer)
    })
    return toRefs(data)
}
```

### [Teleport](https://v3.cn.vuejs.org/guide/teleport.html)传送门

有时组件模板的一部分逻辑上属于该组件，而从技术角度来看，最好将模板的这一部分移动到 DOM 中 Vue app 之外的其他位置。

一个常见的场景是创建一个包含全屏模式的组件。在大多数情况下，你希望模态框的逻辑存在于组件中，但是模态框的快速定位就很难通过 CSS 来解决，或者需要更改组件组合。

```vue
<template>
  <button @click="visibel = true">open</button>
  <teleport to="body">
    <div class="model" v-if="visibel">
      <p>ahjsdhjkashdkjashd</p>
      <button @click="visibel = false">cancel</button>
    </div>
  </teleport>
</template>
<script>
export default {
  data() {
    return {
      visibel: false,
    };
  },
};
</script>
<style>
.model {
  position: absolute;
  border: 1px solid #aaa;
  top: 40%;
  left: 40%;
}
</style>
```

### [片段](https://v3.cn.vuejs.org/guide/migration/fragments.html)

在 2.x 中，由于不支持多根节点组件，当其被开发者意外地创建时会发出警告。结果是，为了修复这个问题，许多组件被包裹在了一个 `<div>` 中。

在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里

```vue
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

有关 attribute 继承如何工作的详细信息，见[非 Prop 的 Attribute](https://v3.cn.vuejs.org/guide/component-attrs.html)。

### 全局 API

vue2中有很多全局api可以改变vue的行为，比如Vue.component等。这会导致一些问题：

- Vue 2 没有“app”的概念，我们定义的应用只是通过 `new Vue()` 创建的根 Vue 实例。从同一个 Vue 构造函数创建的每个根实例**共享相同的全局配置**，在测试期间，全局配置很容易意外地污染其他测试用例。
- 全局配置使得在同一页面上的多个“应用”在全局配置不同时共享同一个 Vue 副本非常困难。

调用 `createApp` 返回一个*应用实例*，一个 Vue 3 中的新概念。

```js
import { createApp } from 'vue'

const app = createApp({})
```

以下是 Vue2 全局 API 及其相应的实例 API 列表：

| 2.x 全局 API               | 3.x 实例 API (`app`)                                         |
| -------------------------- | ------------------------------------------------------------ |
| Vue.config                 | app.config                                                   |
| Vue.config.productionTip   | *移除* ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#config-productiontip-移除)) |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#config-ignoredelements-替换为-config-iscustomelement)) |
| Vue.component              | app.component                                                |
| Vue.directive              | app.directive                                                |
| Vue.mixin                  | app.mixin                                                    |
| Vue.use                    | app.use ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#插件开发者须知)) |
| Vue.prototype              | app.config.globalProperties ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#vue-prototype-替换为-config-globalproperties)) |
| Vue.extend                 | *移除* ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#vue-extend-移除)) |

所有其他不全局改变行为的全局 API 现在都是具名导出，文档见[全局 API Treeshaking](https://v3.cn.vuejs.org/guide/migration/global-api-treeshaking.html)。

### [全局和内部 API 已经被重构为支持 tree-shake](https://v3.cn.vuejs.org/guide/migration/global-api-treeshaking.html)

`Vue.nextTick()` 是一个直接暴露在单个 Vue 对象上的全局 API，但是，如果你从来都没有过手动操作 DOM 的必要，也没有在你的应用中使用或测试过异步组件，在这种情况下，`nextTick()` 的代码就会变成死代码。

在 Vue 3 中，全局和内部 API 都经过了重构，并考虑到了 tree-shaking 的支持。因此，对于 ES 模块构建版本来说，全局 API 现在通过具名导出进行访问。

```js
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和 DOM 有关的东西
})
```

#### 受影响的 API

Vue 2.x 中的这些全局 API 受此更改的影响：

- `Vue.nextTick`
- `Vue.observable` (用 `Vue.reactive` 替换)
- `Vue.version`
- `Vue.compile` (仅完整构建版本)
- `Vue.set` (仅兼容构建版本)
- `Vue.delete` (仅兼容构建版本）

### 模板指令

vue2中的.sync和v-model功能有重叠，容易混淆，vue3中做了统一

以下是对变化的总体概述：

- 非兼容：用于自定义组件时，v-model prop 和事件默认名称已更改：
  - prop：`value` -> `modelValue`；
  - 事件：`input` -> `update:modelValue`；
- **非兼容**：`v-bind` 的 `.sync` 修饰符和组件的 `model` 选项已移除，可在 `v-model` 上加一个参数代替；
- **新增**：现在可以在同一个组件上使用多个 `v-model` 绑定；
- **新增**：现在可以自定义 `v-model` 修饰符。

```vue
// vmodelTest.vue
<template>
  <!-- <div @click="$emit('update:modelValue',modelValue+1)">
      counter : {{modelValue}}
  </div> -->
  <div @click="$emit('update:counter',counter+1)">
      counter : {{counter}}
  </div>
</template>

<script>
export default {
    // props:{
    //     modelValue:{
    //         type:Number,
    //         default:0
    //     }
    // }
    props:{
        counter:{
            type:Number,
            default:0
        }
    }
}
</script>
```

```vue
// 使用
<!-- <vmodelTest v-model="counter"></vmodelTest> -->
<vmodelTest v-model:counter="counter"></vmodelTest>
<!--等效于--->
<vmodelTest :counter="counter" @update:counter="counter=$event"></vmodelTest>
```

### `key`Attribute

- 新增

  ：对于`v-if`/`v-else`/`v-else-if`的各分支项`key`将不再是必须的，因为现在 Vue 会自动生成唯一的`key`。

  - **非兼容**：如果你手动提供 `key`，那么每个分支必须使用唯一的 `key`。你将不再能通过故意使用相同的 `key` 来强制重用分支。

- **非兼容**：`<template v-for>` 的 `key` 应该设置在 `<template>` 标签上 (而不是设置在它的子节点上)。

### 在同一元素上使用的 `v-if` 和 `v-for` 优先级已更改

3.x 版本中 `v-if` 总是优先于 `v-for` 生效。

### `v-bind="object"` 现在排序敏感

在 3.x 中，如果一个元素同时定义了 `v-bind="object"` 和一个相同的独立 attribute，那么绑定的声明顺序将决定它们如何被合并。换句话说，相对于假设开发者总是希望独立 attribute 覆盖 `object` 中定义的内容，现在开发者能够对自己所希望的合并行为做更好的控制。

```html
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<!-- 模板 -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- 结果 -->
<div id="red"></div>
```

### 移除`v-on.native`修饰符

`v-on` 的 `.native` 修饰符已被移除。同时，[新增的 `emits` 选项](https://v3.cn.vuejs.org/guide/migration/emits-option.html)允许子组件定义真正会被触发的事件。

因此，对于子组件中*未*被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 `inheritAttrs: false`)。

### v-for 中的 Ref 数组

在 Vue 3 中，此类用法将不再自动创建 `$ref` 数组。要从单个绑定获取多个 ref，请将 `ref` 绑定到一个更灵活的函数上 (这是一个新特性)：

```vue
<div v-for="item in list" :ref="setItemRef"></div>

<script>
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
</script>
```

### 组件

- [只能使用普通函数创建函数式组件](https://v3.cn.vuejs.org/guide/migration/functional-components.html)

- [`functional` attribute 在单文件组件 (SFC) 的 `template`和`functional`组件选项中被废弃](https://v3.cn.vuejs.org/guide/migration/functional-components.html#%E6%A6%82%E8%A7%88)

- [异步组件现在需要使用 `defineAsyncComponent` 方法来创建](https://v3.cn.vuejs.org/guide/migration/async-components.html)

  以前，异步组件是通过将组件定义为返回 Promise 的函数来创建的，例如：

  ```js
  const asyncModal = () => import('./Modal.vue')
  ```

  现在，在 Vue 3 中，由于函数式组件被定义为纯函数，因此异步组件需要通过将其包裹在新的 `defineAsyncComponent` 助手方法中来显式地定义：

  ```js
  import { defineAsyncComponent } from 'vue'
  const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))
  ```

- [组件事件现在需要在 `emits` 选项中声明](https://v3.cn.vuejs.org/guide/migration/emits-option.html)

### 渲染函数

- [渲染函数 API 更改](https://v3.cn.vuejs.org/guide/migration/render-function-api.html)
- [`$scopedSlots` property 已移除，所有插槽都通过 `$slots` 作为函数暴露](https://v3.cn.vuejs.org/guide/migration/slots-unification.html)
- [`$listeners` 被移除或整合到 `$attrs`](https://v3.cn.vuejs.org/guide/migration/listeners-removed)
- [`$attrs` 现在包含 `class` 和 `style` attribute](https://v3.cn.vuejs.org/guide/migration/attrs-includes-class-style.html)

### 自定义元素

- [自定义元素检测现在在模板编译时执行](https://v3.cn.vuejs.org/guide/migration/custom-elements-interop.html)
- [特殊的 `is` attribute 的使用被严格限制在被保留的 `component` 标签中](https://v3.cn.vuejs.org/guide/migration/custom-elements-interop.html#定制内置元素)

### 其他小改变

- `destroyed` 生命周期选项被重命名为 `unmounted`
- `beforeDestroy` 生命周期选项被重命名为 `beforeUnmount`
- [`default` prop 工厂函数不再可以访问 `this` 上下文](https://v3.cn.vuejs.org/guide/migration/props-default-this.html)
- [自定义指令的 API 已更改为与组件生命周期一致，且 `binding.expression` 已移除](https://v3.cn.vuejs.org/guide/migration/custom-directives.html)
- [`data` 选项应始终被声明为一个函数](https://v3.cn.vuejs.org/guide/migration/data-option.html)
- [来自 mixin 的 `data` 选项现在为浅合并](https://v3.cn.vuejs.org/guide/migration/data-option.html#mixin-合并行为变更)
- [Attribute 强制策略已更改](https://v3.cn.vuejs.org/guide/migration/attribute-coercion.html)
- [一些过渡的 class 被重命名](https://v3.cn.vuejs.org/guide/migration/transition.html)
- [`` 不再默认渲染包裹元素](https://v3.cn.vuejs.org/guide/migration/transition-group.html)
- [当侦听一个数组时，只有当数组被替换时，回调才会触发，如果需要在变更时触发，则必须指定 `deep` 选项](https://v3.cn.vuejs.org/guide/migration/watch.html)
- 没有特殊指令的标记 (`v-if/else-if/else`、`v-for` 或 `v-slot`) 的 `<template>` 现在被视为普通元素，并将渲染为原生的 `<template>` 元素，而不是渲染其内部内容。
- [已挂载的应用不会取代它所挂载的元素](https://v3.cn.vuejs.org/guide/migration/mount-changes.html)
- [生命周期的 `hook:` 事件前缀改为 `vnode-`](https://v3.cn.vuejs.org/guide/migration/vnode-lifecycle-events.html)

## [vue-router@4](https://next.router.vuejs.org/zh/guide/migration/index.html)

```shell
npm install vue-router@4
```

### new Router 变成 createRouter

### 新的 `history` 配置取代 `mode`

### 删除了 `*`（星标或通配符）路由

```js
const routes = [
  // pathMatch 是参数的名称，例如，跳转到 /not/found 会得到
  // { params: { pathMatch: ['not', 'found'] } }
  // 这要归功于最后一个 *，意思是重复的参数，如果你
  // 打算直接使用未匹配的路径名称导航到该路径，这是必要的
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // 如果你省略了最后的 `*`，在解析或跳转时，参数中的 `/` 字符将被编码
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]
// 如果使用命名路由，不好的例子：
router.resolve({
  name: 'bad-not-found',
  params: { pathMatch: 'not/found' },
}).href // '/not%2Ffound'
// 好的例子:
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'
```

### `<router-view>`、`<keep-alive>` 和 `<transition>`

`transition` 和 `keep-alive` 现在必须通过 `v-slot` API 在 `RouterView` **内部**使用：

```vue
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

**原因**: 这是一个必要的变化。详见 [related RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0034-router-view-keep-alive-transitions.md).

### 删除 `<router-link>` 中的 一些 属性

`<router-link>` 中的 `append` 属性已被删除。你可以手动将值设置到现有的 `path` 中

`<router-link>` 中的 `event` 和 `tag` 属性都已被删除。你可以使用 [`v-slot` API](https://next.router.vuejs.org/zh/api/#router-link-s-v-slot) 来完全定制 `<router-link>`

`exact` 属性已被删除，因为不再存在要修复的警告，所以你应该能够安全地删除它。

### **所有**的导航现在都是异步的

```js
app.use(router)
// 注意：在服务器端，你需要手动跳转到初始地址。
router.isReady().then(() => app.mount('#app'))
```

**如果在初始导航时有导航守卫**，你可能不想阻止程序渲染，直到它们被解析，除非你正在进行服务器端渲染。否则，在这种情况下，不等待路由准备好挂载应用会产生与 Vue2 中相同的结果。

## [Vuex4](https://next.vuex.vuejs.org/zh/)

```shell
npm install vuex@next --save
```

为了与 Vue 3 初始化过程保持一致，Vuex 的安装方式已经改变了。用户现在应该使用新引入的 `createStore` 方法来创建 store 实例。

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'
// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
const app = createApp({ /* 根组件 */ })
// 将 store 实例作为插件安装
app.use(store)
```

### 全新的“useStore”组合式函数

Vuex 4 引入了一个新的 API 用于在组合式 API 中与 store 进行交互。可以在组件的 `setup` 钩子函数中使用 `useStore` 组合式函数来检索 store。

```js
import { useStore } from 'vuex'
import { toRefs } from 'vuex'

export default {
  setup () {
    const store = useStore()
    return {
        ...toRefs(store.state),
        add(){
            store.commit('add')
        }
    }
  }
}
```

