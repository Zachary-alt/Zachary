## **组件化常用技术** 

### **组件传值、通信** 

#### **父组件** **=>** **子组件：** 

属性props

```vue
// child 
props: { msg: String } 

// parent 
<HelloWorld msg="Welcome to Your Vue.js App"/> 
```

引用refs 

```vue
// parent 

<HelloWorld ref="hw"/> 
this.$refs.hw.xx = 'xxx' 
```

子组件chidren 

```js
// parent 

this.$children[0].xx = 'xxx' 
```

#### **子组件** **=>** **父组件：自定义事件** 

```vue
// child 
this.$emit('add', good) 

// parent 
<Cart @add="cartAdd($event)"></Cart> 
```

#### **兄弟组件：通过共同祖辈组件** 

通过共同的祖辈组件搭桥，$parent或$root。 

```js
// brother1 
this.$parent.$on('foo', handle) 

// brother2 
this.$parent.$emit('foo')
```

#### **祖先和后代之间** 

provide/inject：能够实现祖先给后代传值 

```js
// ancestor 
provide() { 
	return {foo: 'foo'} 
}

// descendant 
inject: ['foo'] 
```

**任意两个组件之间：事件总线 或** **vuex** 

事件总线：创建一个Bus类负责事件派发、监听和回调管理 

```js
// Bus：事件派发、监听和回调管理 

class Bus{ 
    constructor(){ 
        // { 
        // eventName1:[fn1,fn2], 
        // eventName2:[fn3,fn4], 
        // } 
        this.callbacks = {} 
    }
    $on(name, fn){ 
        this.callbacks[name] = this.callbacks[name] || [] 
        this.callbacks[name].push(fn) 
    }
    $emit(name, args){ 
        if(this.callbacks[name]){ 
        	this.callbacks[name].forEach(cb => cb(args)) 
    	} 
	} 
}

// main.js 
Vue.prototype.$bus = new Bus() 

// child1 
this.$bus.$on('foo', handle) 

// child2 
this.$bus.$emit('foo')
```

vuex：创建唯一的全局数据管理者store，通过它管理数据并通知组件状态变更 

### **插槽** 

> Vue 2.6.0之后采用全新v-slot语法取代之前的slot、slot-scope

#### **匿名插槽** 

```vue
// comp1 
<div>
	<slot></slot> 
</div> 

// parent 
<comp>hello</comp> 
```

#### **具名插槽** 

```vue
// comp2 
<div>
    <slot></slot> 
    <slot name="content"></slot> 
</div> 

// parent 
<Comp2> 
    <!-- 默认插槽用default做参数 --> 
    <template v-slot:default>具名插槽</template> 
    <!-- 具名插槽用插槽名做参数 --> 
    <template v-slot:content>内容...</template> 
</Comp2> 
```

#### **作用域插槽** 

```vue
// comp3 
<div>
	<slot :foo="foo"></slot> 
</div> 

// parent 
<Comp3> 
    <!-- 把v-slot的值指定为作用域上下文对象 --> 
    <template v-slot:default="ctx"> 
    	来自子组件数据：{{ctx.foo}} 
    </template> 
</Comp3>
```

### **表单组件实现** 

- Input 

  双向绑定：@input、:value 

  派发校验事件 

  ```vue
  <template>
    <div>
        <!-- $attrs存储的是props之外的部分 -->
        <input :value="value" @input="onInput" v-bind="$attrs">
    </div>
  </template>
  
  <script>
  export default {
      inheritAttrs: false, // 避免顶层容器继承属性
      props:{
          value: { 
              type: String, 
              default: "" 
          } 
      },
      methods:{
          onInput(e){
              this.$emit('input',e.target.value)
              // 通知formitem校验
              this.$parent.$emit('validate'); 
          }
      }
  }
  </script>
  ```

- FormItem 

  给Input预留插槽 - slot 

  能够展示label和校验信息 

  能够进行校验 

  ```vue
  <template> 
      <div> 
          <label v-if="label">{{label}}</label> 
          <slot></slot> 
          <p v-if="errorMessage">{{errorMessage}}</p> 
      </div> 
  </template> 
  
  <script> 
  import Schema from 'async-validator' 
  export default { 
      inject: ["form"], 
      props: { 
          label: { 
              type: String, 
              default: "" 
          },
          prop: { 
              type: String 
          } 
      },
      data() { 
          return { 
              errorMessage: "" 
          }; 
      },
      mounted() { 
          // 监听校验事件、并执行监听
          this.$on('validate', ()=>{this.validate()}) 
      },
      methods: { 
          validate() { 
              // 做校验 
              const value = this.form.model[this.prop] 
              const rules = this.form.rules[this.prop] 
  
              // npm i async-validator -S 
              const desc = {[this.prop]: rules}; 
              const schema = new Schema(desc); 
  
              // return的是校验结果的Promise 
              return schema.validate({[this.prop]: value}, errors => { 
                  if (errors) { 
                      this.errorMessage = errors[0].message; 
                  }else { 
                      this.errorMessage = '' 
                  } 
              }) 
          } 
      }, 
  };
  </script> 
  ```

- Form 

  给FormItem留插槽 

  设置数据和校验规则 

  全局校验 

  ```vue
  <template> 
      <div> 
      	<slot></slot> 
      </div> 
  </template> 
  
  <script> 
  export default { 
      provide() { 
          return { 
              form: this // 传递form实例给后代，比如fromitem用来校验
          }; 
      },
      props: { 
          model: { 
              type: Object, 
              required: true
          },
          rules: { 
              type: Object 
          } 
      },
      methods: { 
          validate(cb) { 
              const tasks = this.$children 
                  .filter(item => item.prop) 
                  .map(item => item.validate()); 
  
              // 所有任务都通过才算校验通过 
              Promise.all(tasks) 
              .then(() => cb(true)) 
              .catch(() => cb(false)); 
          } 
      } 
  };
  </script>
  ```

试验代码

```vue
<template>
  <div>
      <kForm :model="form" :rules="rules" ref="form">
        <kFormItem label="用户名" prop="name">
            <KInput :value="form.name" v-model="form.name"></KInput>
        </kFormItem>
        <kFormItem label="密码" prop="pwd">
            <KInput v-model="form.pwd" type="password"></KInput>
        </kFormItem>
        <kFormItem>
            <button @click="login">登录</button>
        </kFormItem>

      </kForm>
      
      {{form}}
  </div>
</template>

<script>
import KInput from './KInput'
import kFormItem from './kFormItem'
import kForm from './kForm'
export default {
    components:{KInput,kFormItem,kForm},
    data(){
        return{
            form:{
                name:"",
                pwd:""
            },
            rules:{
                name:[{required:true,message:"必填"}],
                pwd:[{required:true,message:"必填"}],
            }
        }
    },
    methods: {
        login() {
            this.$refs.form.validate(isValid=>{
                console.log(isValid);
            })
        }
    },
}
</script>
```

#### .sync和v-model的异同

```vue
v-model和.sync
<!--v-model是语法糖-->
<Input v-model="username">
<!--默认等效于下面面这行行行-->
<Input :value="username" @input="username=$event">
// 但是你也可以通过设置model选项修改默认行行行为，Checkbox.vue
{
    model: {
        prop: 'checked',
        event: 'change'
    }
}
// 上面面这样设置会导致上级使用用v-model时行行行为变化，相当于
<KCheckBox :checked="model.remember" @change="model.remember = $event">
</KCheckBox>
// 场景：v-model通常用用于表单控件，它有默认行行行为，同时属性名和事件名均可在子子组件定义
<!-- sync修饰符添加于v2.4，类似于v-model，它能用用于修改传递到子子组件的属性，如果像下面面
这样写 -->
<Input :value.sync="model.username">
<!-- 等效于下面面这行行行，那么和v-model的区别只有事件名称的变化 -->
<Input :value="username" @update:value="username=$event">
<!-- 这里里里绑定属性名称更更改，相应的属性名也会变化 -->
<Input :foo="username" @update:foo="username=$event">
// 场景：⽗父组件传递的属性子子组件想修改
// 所以sync修饰符的控制能力力力都在⽗父级，事件名称也相对固定update:xx
// 习惯上表单元素用用v-model
```

### 实现弹窗组件

弹窗这类组件的特点是它们在当前vue实例之外独立存在，通常挂载于body；它们是通过JS动态创建
的，不需要在任何组件中声明。常见使用姿势：

```js
this.$create(Notice, {
    title: '来搬砖',
    message: '提示信息',
    duration: 1000
}).show();
```

#### create

create函数用于动态创建指定组件实例并挂载至body

```js
import Vue from "vue";

// 创建函数接收要创建组件定义
function create(Component, props){
    // 创建⼀个Vue新实例例
    const vm = new Vue({
        render(h){
            // render函数将传入组件配置对象转换为虚拟dom
            console.log(h(Component, { props }));
            return h(Component, { props });
        }
    }).$mount(); //执行挂载函数，但未指定挂载目标，表示只执行初始化工作

    // 将生成dom元素追加至body
    document.body.appendChild(vm.$el);

    // 给组件实例添加销毁方法
    const comp = vm.$children[0];
    comp.remove = () => {
        document.body.removeChild(vm.$el);
        vm.$destroy();
    };
    return comp;
}

export default create;
```

> render函数的作用是得到描述dom结构的虚拟dom

创建通知组件，Notice.vue

```vue
<template>
  <div class="box" v-if="isShow">
    <h3>{{ title }}</h3>
    <p class="box-content">{{ message }}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(this.hide, this.duration);
    },
    hide() {
      this.isShow = false;
      this.remove();
    },
  },
};
</script>
<style>
.box {
  position: fixed;
  width: 100%;
  top: 16px;
  left: 0;
  text-align: center;
  pointer-events: none;
}
.box-content {
  width: 200px;
  margin: 10px auto;
  font-size: 14px;
  border: blue 3px solid;
  padding: 8px 16px;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 8px;
}
</style>
```

**使用create api**
测试，components/form/index.vue

```vue
<script>
import create from "@/utils/create";
import Notice from "@/components/Notice";

export default {
  methods: {
    login() {
      this.$refs.form.validate((isValid) => {
        console.log(isValid);
        const notice = create(Notice, {
          title: "提示",
          message: isValid ? "请求登录!" : "校验失败!",
          duration: 1000,
        });
        notice.show();
      });
    },
  },
};
</script>
```

### 递归组件

递归组件是可以在它们自己模板中调用自身的组件。

#### 实现Tree组件

Tree组件是典型的递归组件，其他的诸如菜单组件都属于这一类，也是相当常见的。

##### 组件设计

Tree组件最适合的结构是无序列表ul，创建一个递归组件Item表示Tree选项，如果当前Item存在
children，则递归渲染子树，以此类推；同时添加一个标识管理当前层级item的展开状态。

##### 实现Item组件

```vue
<template>
  <li>
    <div @click="toggle">
      {{ model.title }}
      <span v-if="isFolder">[{{ open ? "-" : "+" }}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="model in model.children"
        :model="model"
        :key="model.title"
      ></item>
    </ul>
  </li>
</template>
<script>
export default {
  name: "Item",// name对递归组件是必要的
  props: {
    model: Object,
  },
  data: function () {
    return {
      open: false,
    };
  },
  computed: {
    isFolder: function () {
      return this.model.children && this.model.children.length;
    },
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
  },
};
</script>
```

**使用**

```vue
<template>
  <div>
    <ul>
      <item class="item" :model="treeData"></item>
    </ul>
  </div>
</template>
<script>
import Item from "@/components/TreeItem";
export default {
  name: "app",
  data() {
    return {
      treeData: {
        title: "Web全栈架构师",
        children: [
          {
            title: "Java架构师",
          },
          {
            title: "JS高级",
            children: [
              {
                title: "ES6",
              },
              {
                title: "动效",
              },
            ],
          }
        ],
      },
    };
  },
  components: { Item },
};
</script>
```

### 路由守卫

路由导航过程中有若干生命周期钩子，可以在这里实现逻辑控制。
**全局的导航守卫**： router.beforeEach、router.beforeResolve、router.afterEach

> 在 2.5.0+ 这三个方法都返回一个移除已注册的守卫/钩子的函数。

**路由独享守卫**

```js
beforeEnter(to, from, next) {
	// 路路由内部知道自自⼰己需要认证
    if (!window.isLogin) {
    	// ...
    } else {
    	next();
    }
},
```

**组件内的守卫**

- `beforeRouteEnter`
- `beforeRouteUpdate` (2.2 新增)
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
      next(vm => {
        // 通过 `vm` 访问组件实例
      })
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

### vue-router拓展

#### 动态路由

利用$router.addRoutes()可以实现动态路由添加，常用于用户权限控制。

```js
// router.js
// 返回数据可能是这样的
//[{
// path: "/",
// name: "home",
// component: "Home", //Home
//}]
// 异步获取路路由
api.getRoutes().then(routes => {
    const routeConfig = routes.map(route => mapComponent(route));
    router.addRoutes(routeConfig);
})
// 映射关系
const compMap = {
	'Home': () => import("./view/Home.vue")
}
// 递归替换
function mapComponent(route) {
    route.component = compMap[route.component];
    if(route.children) {
    	route.children = route.children.map(child => mapComponent(child))
    }
    return route
}
```

#### 面包屑

利用$route.matched可得到路由匹配数组，按顺序解析可得路由层次关系。

```js
// Breadcrumb.vue
watch: {
    $route() {
        // [{name:'home',path:'/'},{name:'list',path:'/list'}]
        console.log(this.$route.matched);
        // ['home','list']
        this.crumbData = this.$route.matched.map(m => m.name)
    },
    immediate: true
}
```

### vue-router源码实现 

#### 通常用法

```js
// zrouter.js
import Home from "./views/Home";
import About from "./views/About";
import VueRouter from "./zvue-router";
Vue.use(VueRouter);
export default new VueRouter({
 routes: [
 { path: "/", component: Home },
 { path: "/about", component: About }
 ]
});
// main.js
import router from './zrouter'
```

#### 具体实现

```js
let Vue;
class VueRouter {
    constructor(options) {
        this.$options = options;
        this.routeMap = {};
        this.app = new Vue({
            data: {
                current: "/"
            }
        });
    }
    // 绑定事件
    init() {
        this.bindEvents();
        this.createRouteMap(this.$options);
        this.initComponent();
    }
    bindEvents() {
        window.addEventListener("load", this.onHashChange.bind(this), false);
        window.addEventListener("hashchange", this.onHashChange.bind(this),
            false);
    }
    // 路由映射表
    createRouteMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item;
        });
    }
    initComponent() {
        Vue.component("router-link", {
            props: {
                to: String
            },
            render(h) {
                return <a href={this.to}>{this.$slots.default}</a>;
                // return h('a', {
                //     attrs: {
                //         href: '#' + this.to
                //     }
                // }, [
                //     this.$slots.default
                // ])
            }
        });
        Vue.component("router-view", {
            render: h => {
                var component = this.routeMap[this.app.current].component;
                return h(component);
            }
        });
    }
    // 设置当前路径
    onHashChange() {
        this.app.current = window.location.hash.slice(1) || "/";
    }
}
// 插件逻辑
VueRouter.install = function (_Vue) {
    Vue = _Vue;

    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                // 确保是根组件时执行⼀次，将router实例放到Vue原型，以后所有组件实例就均有$router
                Vue.prototype.$router = this.$options.router;
                this.$options.router.init();
            }
        }
    });
};
```
### vue插件

```js
// 插件定义
MyPlugin.install = function (Vue, options) {
 // 1. 添加全局方法或属性
 Vue.myGlobalMethod = function () {
 	// 逻辑...
 }
 // 2. 添加全局资源
 Vue.directive('my-directive', {
     bind (el, binding, vnode, oldVnode) {
     	// 逻辑...
     }
 })
 // 3. 注入组件选项
 Vue.mixin({
     created: function () {
     	// 逻辑...
     }
     ...
 })
 // 4. 添加实例方法
 Vue.prototype.$myMethod = function (methodOptions) {
 	// 逻辑...
 }
}
// 插件使用
Vue.use(MyPlugin)
```

### render函数详解

⼀些场景中需要 JavaScript 的完全编程的能力，这时可以用渲染函数，它比模板更接近编译器。

```js
render(h) {
	return h(tag, {...}, [children])
}
```

createElement函数

```js
{
 // 与 `v-bind:class` 的 API 相同，
 // 接受⼀个字符串、对象或字符串和对象组成的数组
 'class': {
     foo: true,
     bar: false
 },
 // 与 `v-bind:style` 的 API 相同，
 // 接受⼀个字符串、对象，或对象组成的数组
 style: {
     color: 'red',
     fontSize: '14px'
 },
 // 普通的 HTML 特性
 attrs: {
 	id: 'foo'
 },
 // 组件 prop
 props: {
 	myProp: 'bar'
 },
 // DOM 属性
 domProps: {
 	innerHTML: 'baz'
 },
 // 事件监听器在 `on` 属性内，
 // 但不再⽀持如 `v-on:keyup.enter` 这样的修饰器。
 // 需要在处理函数中⼿动检查 keyCode。
 on: {
 	click: this.clickHandler
 },
}
```

### 函数式组件

组件若没有管理任何状态，也没有监听任何传递给它的状态，也没有⽣命周期方法，只是⼀个接受⼀些prop 的，可标记为函数式组件，此时它没有上下文

> - props ：提供所有 prop 的对象 
> - children : VNode 子节点的数组 
> - slots : ⼀个函数，返回了包含所有插槽的对象 
> - scopedSlots : (2.6.0+) ⼀个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。 
> - data ：传递给组件的整个数据对象，作为 createElement 的第⼆个参数传入组件 
> - parent ：对⽗组件的引用 
> - listeners : (2.3.0+) ⼀个包含了所有⽗组件为当前组件注册的事件监听器的对象。这是data.on 的⼀个别名。 
> - injections : (2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的属性。 

[文档](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)

### Vuex数据管理 

Vuex 是⼀个专为 Vue.js 应用开发的状态管理模式，集中式存储管理应用所有组件的状态。 

Vuex遵循“单向数据流”理念，易于问题追踪以及提⾼代码可维护性。 

Vue中多个视图依赖于同⼀状态时，视图间传参和状态同步比较困难，Vuex能够很好解决该问题。

#### 核心概念 

- state 状态、数据 
- mutations 更改状态的函数 
- actions 异步操作 
- store 包含以上概念的容器

#### 派生状态 - getters

从state派⽣出新状态，类似计算属性

```js
export default new Vuex.Store({
 getters: {
     score(state) {
        return `共扔出：${state.count}`
     }
 }
})
```

### vuex原理解析 

初始化：Store声明、install实现，zvuex.js：

```js
let Vue;
function install(_Vue) {
    Vue = _Vue;

    // 这样store执行的时候，就有了Vue，不用import
    // 这也是为啥Vue.use必须在新建store之前
    Vue.mixin({
        beforeCreate() {
            // 这样才能获取到传递进来的store
            // 只有root元素才有store，所以判断⼀下
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    });
}
class Store {
    constructor(options = {}) {
        this.state = new Vue({
            data: options.state
        });
        this.mutations = options.mutations || {};
        this.actions = options.actions;
        options.getters && this.handleGetters(options.getters);
    }
    // 注意这里用箭头函数形式，后面actions实现时会有作用
    commit = (type, arg) => {
        this.mutations[type](this.state, arg);
    };
    dispatch(type, arg) {
        this.actions[type](
            {
                commit: this.commit,
                state: this.state
            },
            arg
        );
    }
    handleGetters(getters) {
        this.getters = {}; // 定义this.getters
        // 遍历getters选项，为this.getters定义property
        // 属性名就是选项中的key，只需定义get函数保证其只读性
        Object.keys(getters).forEach(key => {
            // 这样这些属性都是只读的
            Object.defineProperty(this.getters, key, {
                get: () => { // 注意依然是箭头函数
                    return getters[key](this.state);
                }
            });
        });
    }
}
export default { Store, install };
```
