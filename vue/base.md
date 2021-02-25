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