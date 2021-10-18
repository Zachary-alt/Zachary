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
  
  // 模拟登录接⼝
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

  

- 登录⻚⾯pages/LoginPage.js

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

