# 一、关于微前端

## 1.What?什么是微前端?

微前端就是将不同的功能按照不同的维度拆分成多个子应用。通过主应用来加载这些子应用。
微前端的核心在于拆, 拆完后在合!

## 2.Why?为什么去使用他?

不同团队间开发同一个应用技术栈不同怎么破？ 希望每个团队都可以独立开发，独立部署怎么破？ 项目中还需要老的应用代码怎么破？
我们可以将一个应用划分成若干个子应用，将子应用打包成一个个的lib。当路径切换 时加载不同的子应用。这样每个子应用都是独立的，技术栈也不用做限制了！从而解决了前 端协同开发问题

## 3.How?怎样落地微前端?

2018年 Single-SPA诞生了， single-spa 是一个用于前端微服务化的 JavaScript 前端解决 方案 (本身没有处理样式隔离， js 执行隔离) 实现了路由劫持和应用加载(即根据不同的路由加载不同的应用)
2019年 qiankun 基于Single-SPA, 提供了更加开箱即用的 API （ single-spa + sandbox + import-html-entry ）做到了，技术栈无关、并且接入简单（像i frame 一样简单）
总结：子应用可以独立构建，运行时动态加载,主子应用完全解耦，技术栈无关，靠的是协 议接入（子应用必须导出 bootstrap、mount、unmount方法）
这不是 iframe 吗？
如果使用 iframe ， iframe 中的子应用切换路由时用户刷新页面就尴尬了。
应用通信:
基于URL来进行数据传递，但是传递消息能力弱(最简单)
基于 CustomEvent 实现通信(window的原生API)
基于props主子应用间通信
使用全局变量、 Redux 进行通信
公共依赖:
CDN - externals
webpack 联邦模块

# 二 、SingleSpa 

让我们用SingleSpa开始微前端的开发吧

### 第一步:首先我们创建两个应用;一个子应用,一个父应用;(我们需要父应用加载子应用)

### 第二步:子应用相关操作

**1.在子应用中安装single-spa-vue**

`npm i single-spa-vue -S`

**2.使用single-spa-vue**
在child-vue的main.js中我们使用以下代码:

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'
Vue.config.productionTip = false

const appOptions = {
  el: '#vue', // 挂载到父应用中id为vue的标签中
  router,
  render: h => h(App)
}

// 使用 singleSpaVue 包装 Vue,
// 包装后返回的对象中vue包装好的三个生命周期,bootstrap,mount,unmount,
const vueLifeCycle = singleSpaVue({ Vue, appOptions })
// 协议接入,我们定好了协议,父应用会调用这些方法
export const bootstrap = vueLifeCycle.bootstrap;
export const mount = vueLifeCycle.mount;
export const unmount = vueLifeCycle.unmount;
```

**3.设置子应用的路由**

```js
const router = new VueRouter({
  mode: 'history',
  base: "/myVueApp", // 须一致
  routes
})
```

**4.因为父应用需要加载子应用,所以我们配置好main.js之后,我们需要将子应用打包成一个lib去给父应用使用,所以我们在子应用的vue配置文件vue.config.js中使用以下代码:**

```js
module.exports = {
     configureWebpack:{
        output:{
            library:'singleVue',
            library:'umd'
        },
        devServer:{
            port :20000
        }
    }
}
```

当我们执行 npm run serve 时 子应用并不会跑起来,而是打包成了一个类库

### **第三步:父应用相关操作**

**App.vue中:**

```vue
<template>
  <div id="app">
    <router-link to="/myVueApp">加载Vue应用</router-link> |
    <!-- 将子应用将会挂载到 id="vue" 标签中 -->
    <div id="vue"></div>
  </div>
</template>
```

**main.js:**

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { registerApplication, start } from 'single-spa';
Vue.config.productionTip = false
async function loadScript (url) {
  return new Promise((resolve, reject) => {
    // 创建标签,并将标签加到head中
    let script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
// 注册应用
registerApplication('myVueApp',
  async () => {
    // 加载子组件导出的类库和资源,注意先后顺序
    await loadScript(`http://localhost:20000/js/chunk-vendors.js`);
    await loadScript(`http://localhost:20000/js/app.js`)
    return window.singleVue; // 返回子应用里导出的生命周期,mount,ummount,bootstrap
  },
  location => location.pathname.startsWith('/myVueApp'));// 当用户切换到/myVueApp的路径下时，加载刚才定义子子应用
start();
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

## 三. CSS 隔离方案

**子应用之间样式隔离：**

Dynamic Stylesheet 动态样式表，当应用切换时移除老应用样式，添加新应用样式

**主应用和子应用之间的样式隔离：**

- BEM (Block Element Modifier) 约定项目前缀
- CSS-Modules 打包时生成不冲突的选择器名
- ShadowDOM 真正意义上的隔离 css-in-js Shadow DOM隔离css:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <p>hello world</p>
        <div id="x"></div>
    </div>
    <script>
        // dom的api
        let shadowDOM = document.getElementById('x').attachShadow({mode:'closed'}); // 外界无法访问 shadow dom
        let pElm = document.createElement('p');
        pElm.innerHTML = 'hello zf';
        let styleElm = document.createElement('style');

        styleElm.textContent = `
            p{color:red}
        `
        shadowDOM.appendChild(styleElm)
        shadowDOM.appendChild(pElm);

        // document.body.appendChild(pElm);
    </script>
</body>
</html>
```

attachShadow是浏览器原生的方法,可以用来创建Shadow-dom;Shadow-dom 是游离在 DOM 树之外的节点树，Shadow-dom 具有良好的密封性;当attachShadow的mode:'closed"时; 外界无法访问 shadow dom,从而实现真正的样式隔离

## 四. JS 沙箱机制

<img src="https://img-blog.csdnimg.cn/20200927173033721.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70#pic_center" alt="1604728604168" style="zoom:80%;" />

当运行子应用时应该跑在内部沙箱环境中
快照沙箱，在应用沙箱挂载或卸载时记录快照，在切换时依据快照恢复环境 (无法支持多实 例)
Proxy 代理沙箱,不影响全局环境
1).快照沙箱
1.激活时将当前window属性进行快照处理
2.失活时用快照中的内容和当前window属性比对
3.如果属性发生变化保存到 modifyPropsMap 中，并用快照还原window属性
4.在次激活时，再次进行快照，并用上次修改的结果还原window

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    // 如果应用 加载 刚开始我加载A应用 window.a  B应用 (window.a);
    // 单应用切换  沙箱 创造一个干净的环境给这个子应用使用，当切换时 可以选择丢弃属性和恢复属性
    // 快照沙箱  1年前拍一张  现在再拍一张  （将区别保存起来） 在回到一年前
    class SnapshotSandbox {
      constructor() {
        this.proxy = window; // window属性
        this.modifyPropsMap = {}; // 记录在window上的修改那些属性 
        this.active();
      }
      active() { // 激活
        this.windowSnapshot = {}; // 拍照 
        for (const prop in window) {
          if (window.hasOwnProperty(prop)) {
             // 将window上的属性进行拍照 
            this.windowSnapshot[prop] = window[prop];
          }
        }
        Object.keys(this.modifyPropsMap).forEach(p => {
          window[p] = this.modifyPropsMap[p];
        })
      }
      inactive() { // 失活
        for (const prop in window) {// diff 差异 
          if (window.hasOwnProperty(prop)) {
               // 将上次拍照的结果和本次window属性做对比 
            if (window[prop] !== this.windowSnapshot[prop]) {
                // 保存修改后的结果 
              this.modifyPropsMap[prop] = window[prop];
               // 还原window 
              window[prop] = this.windowSnapshot[prop]
            }
          }
        }
      }
    }
    let sandbox = new SnapshotSandbox();

    // 应用的运行 从开始到结束 ，切换后不会影响全局 
    ((window) => {
      window.a = 1;
      window.b = 2;
      console.log(window.a, window.b);
      sandbox.inactive();
      console.log(window.a, window.b);
      sandbox.active();
      console.log(window.a, window.b);
    })(sandbox.proxy); // sandbox.proxy就是window
    
  </script>
</body>

</html>
```

**注意:**

为什么要用沙箱呢?因为当我们父应用再加载完A应用后要切换成B应用时,如果不A应用从window中清除的话,会造成全局资源的污染,而沙箱就能保证应用的运行 从开始到结束 ，切换后不会影响全局
快照沙箱只能针对单实例应用场景,如果是多个实例同时挂载的情况则无法解决，只能通过 proxy代理沙箱来实现;es6的proxy代理沙箱可以实现多应用沙箱。把不同的应用用不同的代理来处理

2).Proxy 代理沙箱

```js
class ProxySandbox {
  constructor() {
    const rawWindow = window;
    const fakeWindow = {}
    const proxy = new Proxy(fakeWindow, {
      set(target, p, value) {
        target[p] = value;
        return true
      },
      get(target, p) {
        return target[p] || rawWindow[p];
      }
    });
    this.proxy = proxy
  }
}

let sandbox1 = new ProxySandbox();
let sandbox2 = new ProxySandbox();
window.a = 1;
((window) => {
  window.a = 'hello';
  console.log(window.a)
})(sandbox1.proxy);
((window) => {
  window.a = 'world';
  console.log(window.a)
})(sandbox2.proxy);
```

每个应用都创建一个proxy来代理window，好处是每个应用都是相对独立，不需要直接更 改全局window属性！

## 五、qiankun

[qiankun](https://qiankun.umijs.org/zh/guide) 是一个基于 [single-spa](https://github.com/CanopyTax/single-spa) 的[微前端](https://micro-frontends.org/)实现库，是当前较为完善的微解决方案。