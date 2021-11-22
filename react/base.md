### React实现同步的三种方式：

```js
// 同步方式1：
        this.setState(nextState=>{
            return {
                counter:nextState.counter+1
            }
        })
        // 同步方式2：
        setTimeout(()=>{
            this.setState({counter:this.state.counter+1})
        })
        // 同步方式3：
        componentDidMount(){
        document.getElementsByTagName('button')[0].addEventListener('click',()=>{
            this.setState({counter:this.state.counter+2})
            console.log(11,this.state.counter);
        })
    }
```

## 组件通信

### Props属性传递 

Props属性传递可用于父子组件相互通信

```js
// index.js
ReactDOM.render(<App title="app" />, document.querySelector('#root'));
// App.js
<h2>{this.props.title}</h2>

```

如果父组件传递的是函数，则可以把子组件信息传入父组件，这个 常称为状态提升

```js
// StateMgt
<Clock change={this.onChange}/>
// Clock
this.timerID = setInterval(() => {
    this.setState({
      date: new Date()
    }, () => {
      // 每次状态更更新就通知⽗父组件
      this.props.change(this.state.date);
    });
  }, 1000);

```

### context

跨层级组件之间通信，主要用于组件库开发

React中使用Context实现祖代组件向后代组件跨层级传值。Vue中 的provide & inject来源于Context
在Context模式下有两个角色：
Provider：外层提供数据的组件   Consumer ：内层获取数据的组件 

##### 使用Context 

创建Context => 获取Provider和Consumer => Provider提供值 => Consumer消费值

```jsx
// app.js
import React from 'react'
const Context = React.createContext() 
const Provider = Context.Provider 
const Consumer = Context.Consumer
const store={
  userinfo:{
    userName:'jack'
  }
}
<Provider value={store}>
        <Home></Home>
</Provider>

// Home.jsx
<Consumer>
    {
        ctx=><HomeHandle {...ctx}>
        </HomeHandle>
    }
</Consumer>

// HomeHandle.jsx
function HomeHandle(props) {
    console.log('hah',props);
    return(
        <div>
            HomeHandle
        </div>
    )
}
```

在React的官方文档中，Context被归类为高级部分(Advanced)， 属于React的高级API，但官方并不建议在稳定版的App中使用 Context。

不过，这并非意味着我们不需要关注Context。事实上，很多优秀 的React组件都通过Context来完成自己的功能，比如react-redux 的<Provider />，就是通过Context提供一个全局态的store， 拖拽组件react-dnd，通过Context在组件中分发DOM的Drag和 Drop事件，路由组件react-router通过Context管理路由状态等 等。在React组件开发中，如果用好Context，可以让你的组件变 得强大，而且灵活。

### redux

类似vuex，无明显关系的组件间通信

## 生命周期

##### React V16.3之前的生命周期：

开始：constructor，componentWillMount，render，componentDidMount

组件运行时：componentWillReceiveProps，shouldComponentUpdate，componentWillUpdate，render，componentDidMount

组件卸载：componentWillUnmount

##### V16.4之后的生命周期：

V17可能会废弃的三个⽣生命周期函数用用getDerivedStateFromProps 替代，目前使用用的话加上UNSAFE_：componentWillMount，componentWillReceiveProps，componentWillUpdate

引入入两个新的⽣生命周期函数：
static getDerivedStateFromProps，getSnapshotBeforeUpdate

###### 变更缘由

原来（React v16.0前）的生命周期在React v16推出的Fiber之后就 不合适了，因为如果要开启async rendering，在render函数之前 的所有函数，都有可能被执行多次。

用一个静态函数getDerivedStateFromProps来取代被 deprecate的几个生命周期函数，就是强制开发者在render之前只 做无副作用的操作，而且能做的操作局限在根据props和state决定 新的state

```js
static getDerivedStateFromProps(props, state) {
        // getDerivedStateFromProps 会在调用 render 方法之 前调用，   
        //并且在初始挂载及后续更新时都会被调用。    
        //它应返回⼀个对象来更新 state，如果返回 null 则不更新 任何内容。    
        const { counter } = state;
        console.log("getDerivedStateFromProps", counter);
        return counter < 8 ? null : { counter: 0 };
    }
```

getSnapshotBeforeUpdate

在render之后，在componentDidUpdate之前。
getSnapshotBeforeUpdate() 在近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中 捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作 为参数传递给 componentDidUpdate()。
此用法并不常见，但它可能出现在 UI 处理理中，如需要以特殊方式 处理滚动位置的聊天线程等。
应返回 snapshot 的值（或 null）。

```js
componentDidUpdate(prevProps, prevState, snapshot) {
        //如果我们有snapshot值, 我们已经添加了了 新的items.    
        // 调整滚动以至于这些新的items 不会将旧items推出视图。    
        // (这边的snapshot是 getSnapshotBeforeUpdate方法的 返回值)    
        if (snapshot !== null) { 
            const list = this.listRef.current; list.scrollTop =  list.scrollHeight - snapshot; 
        }
    }
```

## 组件复合-Composition 

复合组件给与你足够的敏捷去定义自定义组件的外观和行为，这种 方式更明确和安全。如果组件间有公用的非UI逻辑，将它们抽取为 JS模块导入使用而不是继承它。 

```jsx
// Home.jsx
import Layout from './Layout';
export default class Home extends Component {
    render() {
        return (
            <Layout showTab={false} title="商城首页">
                <div>
                    <h1>home</h1>
                </div>
                {/* 具名 */}
                    {/* {
                        { btns: <button>下载</button>}
                    } */}
            </Layout>
        )
    }
}

// Layout.jsx
import React, { Component } from 'react'
import TabBar from './components/TabBar';

export default class Layout extends Component {
    render() {
        const {children,showTab,title="商城"}=this.props
        document.title=title
        return (
            <div>
                {children}
                {showTab&&<TabBar></TabBar>}
            </div>
        )
    }
}

// tabBar.jsx
export default class tabBar extends Component {
    render() {
        return (
            <div>
                <h1>tabBar</h1>
            </div>
        )
    }
}
```

## 高阶组件-Hoc

为了提高组件复用率，可测试性，就要保证组件功能单一性；但是 若要满足复杂需求就要扩展功能单一的组件，在React里就有了 HOC（Higher-Order Components）的概念，
定义：高阶组件是一个工厂函数，它接收一个组件并返回另一个组 件。 

```jsx
// AppContext.js
export const consumerHandle = Cmp => props => {
    return <Consumer>{ctx=><Cmp {...props} {...ctx}></Cmp>}</Consumer>
}

// User.jsx
function UserHandle(props) {
    console.log('hah',props);
    return(
        <div>
            UserHandle
        </div>
    )
}
export default consumerHandle(UserHandle)
```

## 装饰器写法 

高阶组件本身是对装饰器模式的应用，自然可以利用ES7中出现的 装饰器语法来更优雅的书写代码。 CRA项目中默认不支持js代码使 用装饰器语法，可修改后缀名为tsx则可以直接支持

```tsx
// 装饰器器只能用用在class上 
// 执行行行顺序从下往上 
@withLog 
@withContent 
class Lesson2 extends React.Component {
 render() {    
     return (<div>        
                 {this.props.stage} - {this.props.title}      
             </div>
     );  
 } 
}
export default function HocTest() {  
    // 这里使用Lesson2  
    return (    
        <div>
            {[0, 0, 0].map((item, idx) => (        
                <Lesson2 idx={idx} key={idx} />      
            ))}    
        </div>  
    ); 
}

```

### Hooks

Hook是React16.8一个新增项，它可以让你在不编写 class 的情况 下使用 state 以及其他的 React 特性。

Hooks的特点：

- 使你在无需修改组件结构的情况下复用状态逻辑

- 可将组件中相互关联的部分拆分成更小的函数，复杂组件将变得 更容易理解 

- 更简洁、更易理解的代码

```js
import React,{useEffect,useState} from 'react'

export default function User() {
    // const date = new Date()
    const [date,setDate]=useState(new Date())
    useEffect(()=>{
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000);
        return ()=>{
            clearInterval(timer)
        }
    }, [date])
    return (
        <div>
            <h1>user</h1>
            <p>{date.toLocaleTimeString()}</p>
        </div>
    )
}

```

#### 副作用钩子 Eﬀect Hook 

useEffect 给函数组件增加了执行副作用操作的能力。

副作用（Side Eﬀect）是指一个 function 做了和本身运算返回值无 关的事，比如：修改了了全局变量量、修改了传入的参数、甚至是 console.log()，所以 ajax 操作，修改 dom 都是算作副作用。

- 设置依赖

  ```js
  // 设置空数组意为没有依赖，则副作用操作仅执行一次 
  useEffect(()=>{...}, [])
  // 如果副作用操作对某状态有依赖，务必添加依赖选项
   useEffect(() => {  document.title = fruit; }, [fruit]);
  ```

- 清除工作

  有一些副作用是需要清除的，清除工作非常重要的， 可以防止引起内存泄露

  ```js
  useEffect(()=>{
          const timer = setInterval(() => {
              setDate(new Date())
          }, 1000);
          return ()=>{
              clearInterval(timer)
          }
      }, [date])
  ```

## useReducer

useReducer是useState的可选项，常用于组件有复杂状态逻辑 时，类似于redux中reducer概念。

- 商品列列表状态维护

  ```jsx
  import React, {useReducer,useEffect} from 'react'
  import { FruitsList,FruitAdd } from './components/HoocksPage';
  
  function fruitsReducer(state,action) {
      switch(action.type){
          case 'init':
          case 'replace':
              return action.payload
          case 'add':
              return [...state,action.payload]
          default:
              return state
      }
  }
  
  export default function HooksReducer() {
      const [fruits,dispatch] = useReducer(fruitsReducer,[])
      useEffect(() => {
          // effect
          setTimeout(()=>{
              dispatch({type:'init',payload:['apple','banana']})
          },1000)
          return () => {
              // cleanup
          }
      }, [])
      return (
          <div>
              <h1>HooksReducer</h1>
              <FruitAdd addFruit={newF=>{dispatch({type:'add',payload:newF})}}></FruitAdd>
              <FruitsList fruits={fruits} setFruits={newFruit=>{dispatch({type:'replace',payload:newFruit})}}></FruitsList>
          </div>
      )
  }
  
  // HoocksPage
  import React, {  useState } from 'react'
  
  export function FruitsList({fruits,setFruits}) {
      const del = (index) => {
          const temp = [...fruits];
          temp.splice(index, 1)
          setFruits(temp)
      }
      return (
          <div>
              <ul>
                  {
                      fruits.map((item, index) => {
                          return <li key={index} onClick={() => { del(index) }}>{item}</li>
                      })
                  }
              </ul>
          </div>
      )
  }
  export function FruitAdd({addFruit}) {
      const [name, setName] = useState(""); 
      return (
          <div>      
              <input type="text" value={name} onChange={e => setName(e.target.value)} />      
              <button onClick={() => addFruit(name)}>add</button>
          </div>);
  }
  ```

## useContext

useContext用于在快速在函数组件中导入上下文。

```js
import React,{useContext} from 'react'
import { Context,Provider,Consumer } from '../AppContext';

export default function HooksContext() {
    const store={
        user:{
            name:'Tom'
        }
    }
    return (
        <div>
            <Provider value={store}>
                <ContextChild></ContextChild>
            </Provider>
        </div>
    )
}

function ContextChild(props){
    console.log(useContext(Context));
    const {user} = useContext(Context)
    return <div>ContextChild
        <p>name: {user.name}</p>
    </div>
    
}

// AppContext.js
import React from 'react'
export const Context = React.createContext() 
export const Provider = Context.Provider 
export const Consumer = Context.Consumer
export const consumerHandle = Cmp => props => {
    return <Consumer>{ctx=><Cmp {...props} {...ctx}></Cmp>}</Consumer>
}
```

