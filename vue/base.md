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
<!--默认等效于下⾯面这⾏行行-->
<Input :value="username" @input="username=$event">
// 但是你也可以通过设置model选项修改默认⾏行行为，Checkbox.vue
{
    model: {
        prop: 'checked',
        event: 'change'
    }
}
// 上⾯面这样设置会导致上级使⽤用v-model时⾏行行为变化，相当于
<KCheckBox :checked="model.remember" @change="model.remember = $event">
</KCheckBox>
// 场景：v-model通常⽤用于表单控件，它有默认⾏行行为，同时属性名和事件名均可在⼦子组件定义
<!-- sync修饰符添加于v2.4，类似于v-model，它能⽤用于修改传递到⼦子组件的属性，如果像下⾯面
这样写 -->
<Input :value.sync="model.username">
<!-- 等效于下⾯面这⾏行行，那么和v-model的区别只有事件名称的变化 -->
<Input :value="username" @update:value="username=$event">
<!-- 这⾥里里绑定属性名称更更改，相应的属性名也会变化 -->
<Input :foo="username" @update:foo="username=$event">
// 场景：⽗父组件传递的属性⼦子组件想修改
// 所以sync修饰符的控制能⼒力力都在⽗父级，事件名称也相对固定update:xx
// 习惯上表单元素⽤用v-model
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
	// 路路由内部知道⾃自⼰己需要认证
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
    }
}
```

