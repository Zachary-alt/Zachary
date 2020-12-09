## Reducer

### 什么是[reducer](https://cn.redux.js.org/docs/basics/Reducers.html)

**reducer** 就是⼀个纯函数，接收旧的 **state** 和 **action**，返回新的 **state**。

之所以将这样的函数称之为 reducer，是因为这种函数与被传⼊[Array.prototype.reduce(reducer, ?initialValue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) ⾥的回调函数属 于相同的类型。保持 reducer 纯净⾮常重要。**永远不要**在 reducer ⾥做这 

些操作： 

- 修改传⼊参数； 

- 执⾏有副作⽤的操作，如 API 请求和路由跳转； 

- 调⽤⾮纯函数，如 Date.now() 或 Math.random()。

### 什么是reduce

此例来⾃https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce

```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator
+ currentValue;
// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10
// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

思考：有如下函数， 想要顺序输出1 2 3，如何处理。

```js
function f1() {
    console.log("f1");
}
function f2() {
    console.log("f2");
}
function f3() {
    console.log("f3");
}
```

```js
// 想要顺序输出1 2 3
// f1();f2();f3();
// f3(f2(f1()));
compose(
    f1,
    f2,
    f3,
   )();
function compose(...funcs) {
    if(funcs.length===0){
        return arg=>arg
    }else if(funcs.length===1){
        return funcs[0]
    }
    return funcs.reduce((left,right)=>(...args)=>right(left(...args)))
}
```

## Redux 上手

Redux是JavaScript应⽤的状态容器。它保证程序⾏为⼀致性且易于测试。 

### 安装redux

```shell
npm install redux --save
```

### redux上手

redux较难上⼿，是因为上来就有太多的概念需要学习，⽤⼀个累加器举例

1. 需要⼀个store来存储数据 

2. store⾥的reducer初始化state并定义state修改规则 

3. 通过dispatch⼀个action来提交对数据的修改 

4. action提交到reducer函数⾥，根据传⼊的action的type，返回新的 state

创建store，src/store/ReduxStore.js

```js
import { createStore } from 'redux'
const counterReducer = (state = 0, action) => {
    console.log(state);
    switch (action.type) {
        case 'add':
            return state + 1
        case 'minus':
            return state - 1
        default:
            return state
    }
}
const store = createStore(counterReducer)

export default store
```

创建ReduxPage

```jsx
import React, { Component } from 'react';
import store from '../store/reduxStore'
class ReduxPage extends Component {
    componentDidMount(){
        store.subscribe(()=>{
            this.forceUpdate()
            // this.setState({})
        })
    }
    render() {
        console.log('ReduxPage',store);
        return (
            <div>
                <h1>ReduxPage</h1>
                <p>{store.getState()}</p>
                <button onClick={()=>{store.dispatch({type:"add"})}}>add</button>
            </div>
        );
    }
}

export default ReduxPage;
```

## react-redux

每次都重新调⽤render和getState太low了，想⽤更react的⽅式来写，需要react-redux的⽀持

```shell
npm install react-redux --save
```

### 提供了两个api 

1. Provider 为后代组件提供store 

2. connect 为组件提供数据和变更⽅法

全局提供store，index.js

```js
import React from 'react';
import ReactReduxPage from './pages/ReactReduxPage.jsx';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/reduxStore'


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ReactReduxPage></ReactReduxPage>
      </div>
    </Provider>
  );
}

export default App;

```

```jsx
import React, { Component } from 'react';
import { connect } from "react-redux";
class ReduxPage extends Component {
    render() {
        console.log('ReduxPage',this.props);
        const {num,add,minus} = this.props
        return (
            <div>
                <h1>ReduxPage</h1>
                <p>{num}</p>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        num: state
    }
}
const mapDispatchToProps = dispatch => {
    return {
        add: () => {
            dispatch({type:'add'})
        },
        minus: () => {
            dispatch({type:'minus'})
        },
    }
}

export default connect(
    mapStateToProps, //状态映射
    mapDispatchToProps //派发事件映射
)(ReduxPage);
```

> connect中的参数：state映射和事件映射

## 异步 

Redux只是个纯粹的状态管理器，默认只⽀持同步，实现异步任务 ⽐如延 迟，⽹络请求，需要中间件的⽀持，⽐如我们试⽤最简单的redux-thunk和 redux-logger

```shell
npm install redux-thunk redux-logger --save
```

应⽤中间件，store.js

```js
import { createStore,applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import counterReducer from './counterReducer'

const store = createStore(counterReducer,applyMiddleware(logger,thunk))

export default store
```

使⽤异步操作时的变化

```js
const mapDispatchToProps =  {
        asyncAdd: ()=>dispatch => {
            setTimeout(()=>{
                dispatch({type:'add'})
            },1000)
        },
        add: () => {
            return {type:'add'}
        },
        minus: () => {
            return {type:'minus'}
        },
}
```

### 代码抽取

抽离reducer和action: 

1. 抽离action 

action/reactReduxPage.js

```js
export const asyncAdd = () => dispatch => {
    setTimeout(() => {
        dispatch({ type: 'add' })
    }, 1000)
}
export const add = () => {
    return { type: 'add' }
}
export const minus = () => {
    return { type: 'minus' }
}
```

//对应的ReactReduxPage⽂件直接引⽤

```jsx
import React, { Component } from 'react';
import { connect } from "react-redux";
import { add, minus, asyncAdd } from
"../action/reactReduxPage";//此处直接引⽤

class ReduxPage extends Component {
    render() {
        console.log('ReduxPage',this.props);
        const {num,add,minus,asyncAdd} = this.props
        return (
            <div>
                <h1>ReduxPage</h1>
                <p>{num}</p>
                <button onClick={asyncAdd}>asyncAdd</button>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        num: state
    }
}
const mapDispatchToProps =  {
    add, minus, asyncAdd
}
// const mapDispatchToProps = dispatch => {
//     return {
//         asyncAdd: () => {
//             setTimeout(()=>{
//                 dispatch({type:'add'})
//             },1000)
//         },
//         add: () => {
//             dispatch({type:'add'})
//         },
//         minus: () => {
//             dispatch({type:'minus'})
//         },
//     }
// }

export default connect(
    mapStateToProps, //状态映射
    mapDispatchToProps //派发事件映射
)(ReduxPage);
```

2. 抽离reducer 

store/counterReducer.js

```js
export const counterReducer = (state = 0, action) => {
    console.log(state);
    switch (action.type) {
        case 'add':
            return state + 1
        case 'minus':
            return state - 1
        default:
            return state
    }
}
```

store/index.js也是直接引⽤counterReducer即可

```js
import { createStore,applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import {counterReducer} from './counterReducer'

const store = createStore(counterReducer,applyMiddleware(logger,thunk))

export default store
```

### 模块化

**combineReducers**，store/index.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counterReducer'

const store = createStore(combineReducers({ counter: counterReducer }), applyMiddleware(logger, thunk))

export default store
```

ReactReduxPage.js

```jsx
import React, { Component } from 'react';
import { connect } from "react-redux";
import { add, minus, asyncAdd } from
"../action/reactReduxPage";//此处直接引⽤

class ReduxPage extends Component {
    render() {
        console.log('ReduxPage',this.props);
        const {num,add,minus,asyncAdd} = this.props
        return (
            <div>
                <h1>ReduxPage</h1>
                <p>{num}</p>
                <button onClick={asyncAdd}>asyncAdd</button>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        num: state.counter
    }
}
const mapDispatchToProps =  {
    add, minus, asyncAdd
}

export default connect(
    mapStateToProps, //状态映射
    mapDispatchToProps //派发事件映射
)(ReduxPage);
```

## redux原理

### 核心实现

- 存储状态state 

- 获取状态getState 

- 更新状态dispatch

- 变更订阅subscribe

  zRedux.js

```js
export function createStore(reducer,enhancer){
    if(enhancer){
        return enhancer(createStore)(reducer)
    }
    let currentState=undefined,listeners=[];
    function getState(){
        return currentState
    }
    function dispatch(action){
        currentState=reducer(currentState,action)
        listeners.map(cl=>cl())
    }
    function subscribe(listener){
        listeners.push(listener)
    }
    dispatch({type:'zhaozz'})
    return {
        getState,
        dispatch,
        subscribe,
    }
}
```

⻚⾯可以⽤原来的ReduxPage.js测试以上代码

### 中间件实现 

核⼼任务是实现函数序列执⾏ 

//把下⾯加⼊zRedux.js

```js
export function applyMiddleware(...middlewares) {
    // 返回强化以后函数
    return createStore=>(...arg)=>{
        const store = createStore(...arg)
        const midApi={
            getState:store.getState,
            dispatch:store.dispatch
        }
        // 使中间件可以获取状态值、派发action
        const chain = middlewares.map(mw=>mw(midApi))
        // compose可以middlewareChain函数数组合并成⼀个函数
        const dispatch = compose(...chain)(store.dispatch)
        return{
            ...store,
            dispatch
        }
    }
}

function compose(...funcs) {
    if(funcs.length===0){
        return arg=>arg
    }else if(funcs.length===1){
    return funcs[0]
    }
    return funcs.reduce((left,right)=>(...args)=>right(left(...args)))
}
```

logger加⼊MyReduxStore.js

```js
import { createStore,applyMiddleware } from '../zRedux'
import { counterReducer } from './counterReducer'

const store = createStore(counterReducer,applyMiddleware(logger))

export default store

function logger(dispatch,getState){
    return dispatch=>action=>{
        console.log(action.type + "done!");
        return dispatch(action)
    }
}
```

### **redux-thunk**原理 

thunk增加了处理函数型action的能⼒，把下⾯加⼊MyReduxStore.js

```js
function thunk(dispatch,getState){
    return dispatch=>action=>{
        if(typeof action === "function") return action(dispatch,getState);
        return dispatch(action)
    }
}
```

测试代码

```jsx
import React, { Component } from 'react';
import store from '../../store/myReduxStore'
class MyReduxPage extends Component {
    componentDidMount(){
        store.subscribe(()=>{
            this.forceUpdate()
            // this.setState({})
        })
    }
    render() {
        // console.log('MyReduxPage',store);
        return (
            <div>
                <h1>MyReduxPage</h1>
                <p>{store.getState()}</p>
                <button onClick={()=>{store.dispatch({type:"add"})}}>add</button>
                <button onClick={()=>{store.dispatch({type:"minus"})}}>minus</button>
                <button onClick={()=>{store.dispatch(dispatch=>{
                    setTimeout(()=>{
                        dispatch({type:"add"})
                    },1000)
                })}}>asyncadd</button>
            </div>
        );
    }
}

export default MyReduxPage;
```

## **react-redux**原理 

### 实现zreact-redux

核⼼任务：

- 实现⼀个⾼阶函数⼯⼚connect，可以根据传⼊状态映射规则函数和派发器映射规则函数映射需要的属性，可以处理变更检测和刷新任务 

- 实现⼀个Provider组件可以传递store

```js
import React, { useState, useContext, useEffect } from 'react';
const Context = React.createContext()

export const Provider = props => {
    return <Context.Provider value={props.store}>{props.children}</Context.Provider>
}
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => {
    return Cmp => {
        return () => {
            const store = useContext(Context)
            const getProps = () => {
                const stateProps = mapStateToProps(store.getState())
                const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
                return { ...stateProps, ...dispatchProps }
            }
            useEffect(() => {
                // effect
                store.subscribe(() => {
                    setProps({ ...props, ...getProps() })
                })
                return () => {
                    // cleanup
                }
            }, [])
            const [props, setProps] = useState({ ...getProps() })
            return <Cmp {...props}></Cmp>
        }
    }
}

function bindActionCreators(creators, dispatch) {
    return Object.keys(creators).reduceRight((ret, item) => {
        ret[item] = bindActionCreator(creators[item], dispatch)
        return ret
    }, {})
}
function bindActionCreator(creator, dispatch) {
    return (...args) => dispatch(creator(...args))
}
```

测试代码

src/App.js

```jsx
import React from 'react';
import MyReactReduxPage from './pages/my/MyReactReduxPage';
import './App.css';
import { Provider } from "./zreact-redux";
import store from './store/myReactReduxStore'


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MyReactReduxPage></MyReactReduxPage>
      </div>
    </Provider>
  );
}

export default App;
```

MyReactReduxPage.js

```jsx
import React, { Component } from 'react'
import { connect } from '../../zreact-redux'

class MyReactReduxPage extends Component {
    render() {
        console.log('MyReactReduxPage',this.props);
        const {num,add,minus} = this.props
        return (
            <div>
                <h1>MyReactReduxPage</h1>
                <p>{num}</p>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        num: state
    }
}
const mapDispatchToProps ={
    add: () => {
        return {type:'add'}
    },
    minus: () => {
        return {type:'minus'}
    },
}
export default connect(mapStateToProps,mapDispatchToProps)(MyReactReduxPage)
```

