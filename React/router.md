## **react-router** 

react-router包含3个库，react-router、react-router-dom和react-router-native。react-router提供最 

基本的路由功能，实际使⽤的时候我们不会直接安装react-router，⽽是根据应⽤运⾏的环境选择安装 

react-router-dom（在浏览器中使⽤）或react-router-native（在rn中使⽤）。react-router-dom和 

react-router-native都依赖react-router，所以在安装时，react-router也会⾃动安装，创建web应⽤。

### 安装

```shell
npm install --save react-router-dom
```

### 基本使用

react-router中奉⾏⼀切皆组件的思想，路由器-**Router**、链接-**Link**、路由-**Route**、独占-**Switch**、重 

定向-**Redirect**都以组件形式存在 

Route渲染优先级：children>component>render 

创建RouterPage.js

```jsx
import React, { Component } from 'react'
import {BrowserRouter,Link,Route,Switch} from "react-router-dom"
import User1 from '../User1'
import Home1 from '../Home1'
import PrivateRoute from './PrivateRoute'

function News(prpos){
    console.log(prpos);
    return (
        <div>
            <h1>News</h1>
            <p>id:{prpos.match.params.id}</p>
        </div>
    )
}
export default class RouterPage extends Component {
    render() {
        return (
            <div>
                <h1>RouterPage</h1>
                <BrowserRouter>
                    <nav>
                        <Link to="/">首页</Link>
                        <Link to="/user">用户中心</Link>
                        <Link to="/news/1">新闻</Link>
                    </nav>
                    {/* 添加Switch表示仅匹配⼀个*/}
                    <Switch>
                        {/* 根路由要添加exact，实现精确匹配 */}
                        <Route exact path="/" component={Home1}></Route>
                        <Route path="/user" component={User1}></Route>
                        {/* <PrivateRoute path="/user" component={User1}></PrivateRoute> */}
                        <Route path="/news/:id" component={News}></Route>
                        <Route component={()=><div>404</div>}></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
```

## 路由守卫 

思路：创建⾼阶组件包装Route使其具有权限判断功能 

创建PrivateRoute

```jsx
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class PrivateRoute extends Component {
  render() {
    const { component: Cmp, userInfo, ...rest } = this.props;
    const isLogin = userInfo.isLogin;
    console.log(123, this.props);
    return (
      <Route
        {...rest}
        render={(props) => {
          return isLogin ? (
            <Cmp {...props}></Cmp>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { redirect: this.props.location.pathname },
              }}
            />
          );
        }}
      ></Route>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userInfo: state.user,
  };
};
export default connect(
  mapStateToProps //状态映射
)(PrivateRoute);
```

创建LoginPage.js

```jsx
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
                <button onClick={login}>登录</button>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        userInfo: state.user
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        login: () => {
            dispatch({type:"loginSuccess"})
        }
    }
}
export default connect(
    mapStateToProps, //状态映射
    mapDispatchToProps //派发事件映射
)(Login);
```

配置路由，RouterPage

```jsx
<Route exact path="/login" component={Login}></Route>
<PrivateRoute path="/user" component={User1}></PrivateRoute>
```

整合redux，获取和设置登录态，创建./store/index.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counterReducer'
import { loginReducer } from './loginReducer'

const store = createStore(combineReducers({ counter: counterReducer,user:loginReducer }), applyMiddleware(logger, thunk))

export default store

// loginReducer
const initalLogin={
    isLogin:false,
    name:null
}
export const loginReducer = (state = {...initalLogin}, action) => {
    switch (action.type) {
        case 'getUserInfo':
            return {...state,isLogin:false,name:null}
        case 'loginSuccess':
            return {...state,isLogin:true,name:"jack"}
        case 'loginFail':
            return {...state,isLogin:false,name:null}
        default:
            return state
    }
}
```

### 与HashRouter对比： 

1. HashRouter最简单，不需要服务器端渲染，靠浏览器的#的来区分path就可以，BrowserRouter 

需要服务器端对不同的URL返回不同的HTML，后端配置可参考。 

2. BrowserRouter使⽤HTML5历史API（ pushState，replaceState和popstate事件），让⻚⾯的UI同步与URL。 
3. HashRouter不⽀持location.key和location.state，动态路由跳转需要通过?传递参数。 
4. Hash history 不需要服务器任何配置就可以运⾏，如果你刚刚⼊⻔，那就使⽤它吧。但是我们不推荐在实际线上环境中⽤到它，因为每⼀个 web 应⽤都应该渴望使⽤ browserHistory 。