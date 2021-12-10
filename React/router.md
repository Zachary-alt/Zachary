## **react-router** 

react-router包含3个库，react-router、react-router-dom和react-router-native。react-router提供最 

基本的路由功能，实际使用的时候我们不会直接安装react-router，而是根据应用运行的环境选择安装 

react-router-dom（在浏览器中使用）或react-router-native（在rn中使用）。react-router-dom和 

react-router-native都依赖react-router，所以在安装时，react-router也会自动安装，创建web应用。

### 安装

```shell
npm install --save react-router-dom
```

### 基本使用

react-router中奉行⼀切皆组件的思想，路由器-**Router**、链接-**Link**、路由-**Route**、独占-**Switch**、重 

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

### 路由守卫 

思路：创建高阶组件包装Route使其具有权限判断功能 

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

需要服务器端对不同的URL返回不同的HTML，后端配置可[参考](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)。 

2. BrowserRouter使用HTML5历史API（ pushState，replaceState和popstate事件），让⻚面的UI同步与URL。 
3. HashRouter不支持location.key和location.state，动态路由跳转需要通过?传递参数。 
4. Hash history 不需要服务器任何配置就可以运行，如果你刚刚入⻔，那就使用它吧。但是我们不推荐在实际线上环境中用到它，因为每⼀个 web 应用都应该渴望使用 browserHistory 。

react-router秉承⼀切皆组件，因此实现的核心就是BrowserRouter、Route、Link

### 实现**BrowserRouter** 

**BrowserRouter**：历史记录管理对象history初始化及向下传递，location变更监听 

创建MyRouterTest.js，⾸先实现BrowserRouter

```jsx
import React, { Component,useContext } from "react";

import { createBrowserHistory } from "history";
const RouterContext = React.createContext();
export class BrowserRouter extends Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory(this.props);
    this.state = {
      location: this.history.location,
    };
    this.unlisten = this.history.listen((location) => {
      this.setState({ location });
    });
  }
  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }
  render() {
    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={{
          history: this.history,
          location: this.state.location,
        }}
      />
    );
  }
}
```

### 实现**Route** 

路由配置，匹配检测，内容渲染

```jsx
import matchPath from './matchPath'

export function Route(props) {
  const ctx = useContext(RouterContext);
  const { location } = ctx;
  const { path, component, children, render } = props;
  const match = matchPath(location.pathname, props);
  console.log("match", match);
  const matchCurrent = match && match.isExact;
  //const matchCurrent = path === location.pathname;
  const cmpProps = { ...ctx, match };
  console.log("render", render);
  if (matchCurrent && typeof children === "function") {
    return children(cmpProps);
  }
  return (
    <>
      {typeof children === "function" && children(cmpProps)}
      {matchCurrent && component
        ? React.createElement(component, cmpProps)
        : null}
      {matchCurrent && !component && render && render(cmpProps)}
    </>
  );
}
```

> 依赖：matchPath.js

```js
import pathToRegexp from "path-to-regexp";
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path]) return pathCache[path];
    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
/**
 * Public API for matching a URL pathname to a path.
*/
function matchPath(pathname, options = {}) {
    if (typeof options === "string") options = { path: options };
    const { path, exact = false, strict = false, sensitive = false } =
        options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (!path) return null;
        if (matched) return matched;
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        });
        const match = regexp.exec(pathname);
        if (!match) return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact) return null;
        return {
            path, // the path used to match
            url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}
export default matchPath;
```

### 实现**Link** 

Link.js: 跳转链接，处理点击事件

```jsx
export class Link extends Component {
  handleClick(event, history) {
    event.preventDefault();
    history.push(this.props.to);
  }
  render() {
    const { to, children } = this.props;
    return (
      <RouterContext.Consumer>
        {(context) => {
          return (
            <a
            //   {...rest}
              onClick={(event) => this.handleClick(event, context.history)}
              href={to}
            >
              {children}
            </a>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

