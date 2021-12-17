## 起步

### **Generator**

Generator 函数是 ES6 提供的⼀种异步编程解决方案，语法行为与传统函 

数完全不同，详细参考参考[阮⼀峰](https://es6.ruanyifeng.com/#docs/generator)。 

1.  function关键字与函数名之间有⼀个*; 

2.  函数体内部使用yield表达式，定义不同的内部状态。 

3.  yield表达式只能在 Generator 函数里使用，在其他地方会报错。

   ```js
   function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending'; 
   }
   var hw = helloWorldGenerator();
   //执行
   console.log(hw.next());
   console.log(hw.next());
   console.log(hw.next());
   console.log(hw.next());
   ```

   由于 Generator 函数返回的遍历器对象，只有调用 next方法才会遍历下⼀个内部状态，所以其实提供了⼀种可以暂停执行的函数。 yield表达式就是暂停标志。

### **redux-saga**

- 概述：redux-saga使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理 
- 地址：https://github.com/redux-saga/redux-saga 
- 安装：**npm install --save redux-saga** 

使用：用户登录

用**saga**的方式实现： 

- 创建⼀个./store/mySagas.js处理用户登录请求 

  call： 调用异步操作 

  put：状态更新 

  takeEvery：做saga监听

  ```js
  import { call, put, takeEvery } from 'redux-saga/effects';
  
  // 模拟登录接口
  const UserService = {
      login(name) {
          return new Promise((resolve, reject) => {
              console.log("omg");
              setTimeout(() => {
                  if (name === "小明") {
                      resolve({ name: "小明" });
                  } else {
                      reject("用户名或密码错误");
                  }
              }, 1000);
          });
      },
  };
  
  //worker saga
  function* loginHandle(action){
      try {
          const res = yield call(UserService.login, action.name);
          yield put({ type: "loginSuccess", res });
      } catch (error) {
          yield put({ type: "loginFail", error });
      }
  }
  
  //watcher saga
  function* mySaga() {
      yield takeEvery("login", loginHandle);
  }
  
  export default mySaga;
  ```

  

- 注册redux-saga，创建store/index.js

  ```js
  import { createStore, applyMiddleware, combineReducers } from 'redux'
  import logger from 'redux-logger'
  // import thunk from 'redux-thunk'
  
  import createSagaMiddleware from "redux-saga";
  import mySaga from "./mySaga";
  
  import { counterReducer } from './counterReducer'
  import { loginReducer } from './loginReducer'
  
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(combineReducers({ counter: counterReducer,user:loginReducer }), applyMiddleware(logger, sagaMiddleware))
  sagaMiddleware.run(mySaga); //这里注意sagaMiddleware.run 不能放于创建store引用saga中间件之前，否则会出现一个错误
  
  export default store
  ```

  

- 登录页面pages/LoginPage.js

  ```js
  import React, { Component } from 'react'
  import { connect } from "react-redux";
  import {Redirect} from "react-router-dom"
  
  class Login extends Component {
      render() {
          const {userInfo,login,location}=this.props
          const isLogin = userInfo.isLogin;
          const redirect = location.state.redirect || "/"; //重定向地址
          if (isLogin) {
              return <Redirect to={redirect} />;
          }
          return (
              <div>
                  <h1>LoginPage</h1>
                  <button onClick={()=>{login('小明')}}>登录</button>
              </div>
          )
      }
  }
  const mapStateToProps = (state, ownProps) => {
      return {
          userInfo: state.user
      }
  }
  const mapDispatchToProps = {
      login: name =>  ({ type: "login", name }),
  }
  export default connect(
      mapStateToProps, //状态映射
      mapDispatchToProps //派发事件映射
  )(Login);
  ```

> redux-saga基于generator实现，使用前搞清楚generator相当重要

## **[umi](https://umijs.org/zh-CN)**

### **why umi** 

- 🎉 **可扩展**，Umi 实现了完整的生命周期，并使其插件化，Umi 内部功能也全由插件完成。此外还支持插件和插件集，以满足功能和垂直域的分层需求。
- 📦 **开箱即用**，Umi 内置了路由、构建、部署、测试等，仅需一个依赖即可上手开发。并且还提供针对 React 的集成插件集，内涵丰富的功能，可满足日常 80% 的开发需求。
- 🐠 **企业级**，经蚂蚁内部 3000+ 项目以及阿里、优酷、网易、飞猪、口碑等公司项目的验证，值得信赖。
- 🚀 **大量自研**，包含微前端、组件打包、文档工具、请求库、hooks 库、数据流等，满足日常项目的周边需求。
- 🌴 **完备路由**，同时支持配置式路由和约定式路由，同时保持功能的完备性，比如动态路由、嵌套路由、权限路由等等。
- 🚄 **面向未来**，在满足需求的同时，我们也不会停止对新技术的探索。比如 dll 提速、modern mode、webpack@5、自动化 external、bundler less 等等。

### Dva

一个基于`redux`和`redux-saga`的数据流方案，然后为了简化开发体验，dva 还额外内置了`react-router`和`fetch`，所以也可以理解为一个轻量级的应用框架。

#### Dva 解决的问题

大家应该都能理解 redux 的概念，并认可这种数据流的控制可以让应用更可控，以及让逻辑更清晰。但随之而来通常会有这样的疑问：概念太多，并且 reducer, saga, action 都是分离的（分文件）。

- 文件切换问题。redux 的项目通常要分 reducer, action, saga, component 等等，他们的分目录存放造成的文件切换成本较大。
- 不便于组织业务模型 (或者叫 domain model) 。比如我们写了一个 userlist 之后，要写一个 productlist，需要复制很多文件。
- saga 创建麻烦，每监听一个 action 都需要走 fork -> watcher -> worker 的流程
- entry 创建麻烦。可以看下这个[redux entry](https://github.com/ant-design/antd-init/blob/master/boilerplates/redux/src/entries/index.js)的例子，除了 redux store 的创建，中间件的配置，路由的初始化，Provider 的 store 的绑定，saga 的初始化，还要处理 reducer, component, saga 的 HMR 。这就是真实的项目应用 redux 的例子，看起来比较复杂。

#### Dva 的优势

- **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，配合 umi 使用后更是降低为 0 API
- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如dva-loading可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于babel-plugin-dva-hmr实现 components、routes 和 models 的 HMR

> 对于绝大多数不是特别复杂的场景来说，目前可以被 Hooks 取代

[umi-demo](https://github.com/Zachary-alt/umi-demo)

