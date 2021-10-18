## 使用第三方组件 

范例：试用 ant-design组件库

```shell
npm install antd --save 
```

```js
import React, { Component } from 'react' 
import Button from 'antd/lib/button' 
import "antd/dist/antd.css"
class App extends Component {  
    render() {    
        return (      
            <div className="App">        
            <Button type="primary">Button</Button>      
            </div>    
        )  
    } 
} 
export default App

```

#### 配置按需加载 

安装react-app-rewired取代react-scripts，可以扩展webpack的配置 ，类似vue.conﬁg.js

```shell
npm install react-app-rewired customize-cra babel-plugin-import -D
```

```js
//根目目录创建config-overrides.js 
const { override, fixBabelImports,addDecoratorsLegacy } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addDecoratorsLegacy()//配置装饰器 
);

// 修改package.json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```

### 支持装饰器配置

```shell
npm install -D @babel/plugin-proposal-decorators
```

```jsx
import React, { Component } from 'react'
import {Button}  from 'antd';

const foo = Cmp=>props=>{
    return (
        <div className="border" style={{border:'1px solid #aaa'}}>
            <Cmp {...props}></Cmp>
        </div>
    )
}
const foo2 = Cmp=>props=>{
    return (
        <div className="border" style={{border:'1px solid red'}}>
            <Cmp {...props}></Cmp>
        </div>
    )
}
@foo
@foo2
class Child extends Component{
    render(){
        return <div>Child</div>
    }
}

@foo2
class HocPage extends Component {
    render() {
        // const Foo = foo2(foo(Child))
        return (
            <div>
                <h1>HocPage</h1>
                {/* <Foo></Foo> */}
                <Child></Child>
                <Button type="primary" >btn</Button>
            </div>
        )
    }
}
export default HocPage

```

## 表单组件设计与实现 

### 表单组件设计思路路 

- 表单组件要求实现数据收集、校验、提交等特性，可通过高阶组件扩展

- 高阶组件给表单组件传递一个input组件包装函数接管其输入事件并统一管理表单数据 

- 高阶组件给表单组件传递一个校验函数使其具备数据校验功能

表单基本结构，创建MyFormPage.js

```jsx
//校验规则 
const nameRules = { required: true, message: "please input your name" };
const passwordRules = { required: true, message: "please input your password" };

class MyFormPage extends Component {
    submit = () => {
        const {getFieldsValue,getFieldValue,validateFields} =this.props
        // console.log('submit',getFieldsValue(),getFieldValue('name'));
        validateFields((err, values) => { 
            if (err) { 
                console.log("err", err); 
            } else { 
                console.log("submit", values); 
            } 
        });
    }
    render() {
        const {getFieldDecorator} =this.props
        return (
            <div>
                <h1>MyFormPage</h1>
                {getFieldDecorator("name",{rules:[nameRules]})(<input type="text"/>)}
                {getFieldDecorator("password",{rules:[passwordRules]})(<input type="password"/>)}
                <button onClick={this.submit}>提交</button>
            </div>
        )
    }
}
export default zFormCreate(MyFormPage)
```

高阶组件zFormCreate：扩展现有表单，./components/zFormTest.js

```jsx
import React, { Component } from 'react'

export default function zFormCreate(Cmp){
    return class extends Component{
        constructor(props){
            super(props)
            this.options={} //存储配置字段项
            this.state={} //存储字段值
        }
        handleChange=(e)=>{
            let {name,value}=e.target;
            this.setState({[name]:value})
        }
        getFieldDecorator=(field,option)=>{
            this.options[field]=option;
            return InputCmp=><div className="border">
                { // 由React.createElement生成的元素不能修改，需要克隆一份再扩展
                    React.cloneElement(InputCmp,{
                        name:field,
                        value:this.state[field]||"",
                        onChange:this.handleChange
                    })
                }
            </div>
        }
        getFieldsValue=()=>{
            return {...this.state}
        }
        getFieldValue=(field)=>{
            return this.state[field]
        }
        validateFields=(cb)=>{
            const tmp={...this.state},err=[]
            for(let i in this.options){
                if(tmp[i]===undefined){
                    err.push({[i]:'err'})
                }
            }
            if(err.length>0){
                cb(err,tmp)
            }else{
                cb(undefined,tmp)
            }
            
        }
        render(){
            return (
                <div className="border">
                    <Cmp {...this.props} 
                    getFieldDecorator={this.getFieldDecorator}
                    getFieldsValue={this.getFieldsValue}
                    getFieldValue={this.getFieldValue}
                    validateFields={this.validateFields}
                    ></Cmp>
                </div>
            )
        }
    }
}
```

## 弹窗类组件设计与实现 

## 设计思路 

弹窗类组件的要求弹窗内容在A处声明，却在B处展示。react中相当于弹窗内容看起来被render到一个组件里面 去，实际改变的是网页上另一处的DOM结构，这个显然不符合正常逻辑。但是通过使用框架提供的特定API创建 组件实例并指定挂载目标仍可完成任务。

### 具体实现 方案1：Portal

传送门，react v16之后出现的portal可以实现内容传送功能。 它做得事情是通过调用createPortal把要画的东西画在DOM树上另一个角落。

范例：Dialog组件

```jsx
// DialogPage.jsx
import React, { Component } from 'react'
import Dialog from './components/Dialog'
import {Button} from 'antd'
export default class DialogPage extends Component {
    state={
        visible:false
    }
    change=()=>{
        this.setState({
            visible:!this.state.visible
        })
        setTimeout(()=>{
            console.log(111,this.state.visible);
            
        })
    }
    render() {
        const {visible} = this.state
        return (
            <div>
                <h1>DialogPage</h1>
                {visible&&<Dialog hide={true}>hahahaha</Dialog>}
                <Button onClick={this.change}>Dialog toggle</Button>
            </div>
        )
    }
}

```

```jsx
// components/Dialog.jsx
import React, { Component } from 'react'
import {createPortal } from 'react-dom'

export default class Dialog extends Component {
    constructor(props){
        super(props)
        this.node=document.createElement('div')
        document.body.appendChild(this.node)
    }
    componentWillUnmount(){
        document.body.removeChild(this.node)
    }
    render() {
        const {children,hide}=this.props
        return createPortal(
            <div className="border" style={{visibility:hide?"":''}}>
                <h1>Dialog</h1>
                {children}
            </div>,
            this.node
        )
    }
}

```

### 方案2：unstable_renderSubtreeIntoContainer 

在v16之前，实现“传送门”，要用到react中两个秘而不宣的React API

```jsx
export class Dialog2 extends React.Component {
    render() { return null; }
    componentDidMount() {
        const doc = window.document; this.node = doc.createElement("div"); doc.body.appendChild(this.node);
        this.createPortal(this.props);
    }
    componentDidUpdate() { this.createPortal(this.props); }
    componentWillUnmount() { unmountComponentAtNode(this.node); window.document.body.removeChild(this.node); }
    createPortal(props) {
        unstable_renderSubtreeIntoContainer(
            this, //当前组件      
            <div className="dialog">{props.children}</div>, // 塞进传送门的JSX      
            this.node // 传送门另一端的DOM node    
        );
    }
}
```

## 树形组件设计与实现 

### 设计思路

递归：自己调用自己
react中实现递归组件更加纯粹，就是组件递归渲染即可。假设我们的节点组件是TreeNode，它的render中只要 发现当前节点拥有子节点就要继续渲染自己。节点的打开状态可以通过给组件一个open状态来维护。 

```jsx
import React, { Component } from 'react'
import TreeNode from './components/TreeNode'

//数据源 
const treeData = {
    key: 0,//标识唯⼀一性  
    title: "全国", //节点名称显示  
    children: [    //子子节点数组    
        {
            key: 6, title: "北方区域",
            children: [
                {
                    key: 1, title: "黑龙江省",
                    children: [
                        { key: 6, title: "哈尔滨", },],
                }, 
                { key: 2, title: "北京", },
            ],
        },
        {
            key: 3, title: "南方区域",
            children: [
                { key: 4, title: "上海", }, { key: 5, title: "深圳", },
            ],
        },
    ],
};

export default class TreePage extends Component {
    render() {
        return (
            <div>
                <h1>TreePage</h1>
                <TreeNode data={treeData}></TreeNode>
            </div>
        )
    }
}

```

```jsx
// TreeNode.jsx
import React, { Component } from 'react'
import {Icon} from 'antd'

export default class TreeNode extends Component {
    constructor(props){
        super(props);
        this.state={
            expanded:false
        }
    }
    handleExpand=()=>{
        this.setState({
            expanded:!this.state.expanded
        })
    }
    render() {
        const {key,title,children} = this.props.data
        const hasChild=children&&children.length
        const {expanded} = this.state
        return (
            <div className="treeNode">
                <div key={key} onClick={this.handleExpand}>
                {hasChild&&(expanded?<Icon type="caret-down" />:<Icon type="caret-right" />)}
                    <span>{title}</span>
                </div>
                {expanded&&hasChild&&(
                        children.map(item=>{
                            return <TreeNode key={item.key} data={item}></TreeNode>
                        })
                    )}
            </div>
        )
    }
}

```

## 常见组件优技术 

### 定制组件的shouldComponentUpdate钩子

范例：通过shouldComponentUpdate优化组件

```jsx
import React, { Component } from "react";
export default class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        };
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                comments: [{ author: "小小明", body: "这是小小明写的文文章", }, { author: "小小红", body: "这是小小红写的文文章", },],
            });
        }, 1000);
    }
    render() {
        const { comments } = this.state;
        return (<div>
            <h1>CommentList</h1>
            {comments.map((c, i) => { return <Comment key={i} data={c} />; })}
        </div>);
    }
}
class Comment extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { author, body } = nextProps.data;
        const { author: nowAuthor, body: nowBody } = this.props.data;
        if (body === nowBody && author === nowAuthor) {
            return false; //如果不执行这里，将会多次render    
        }
        return true;
    }
    render() {
        console.log("hah");
        const { body, author } = this.props.data;
        return (<div>
            <p>作者： {author}</p>
            <p>正文：{body}</p>
            <p>---------------------------------</p>
        </div>);
    }
}

```

## PureComponent 

定制了shouldComponentUpdate后的Component;

缺点是必须要用class形式，而且要注意是浅比较。

```jsx
import React, { Component, PureComponent } from "react";
export default class PuerComponentPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            obj: { num: 100, },
        };
    }
    setCounter = () => {
        this.setState({
            counter: 1,
            obj: { num: 200, },
        });
        console.log("setCounter");
    };
    render() {
        console.log("render");
        const { counter, obj } = this.state;
        return (<div>
            <button onClick={this.setCounter}>setCounter</button>
            <div>counter: {counter}</div>
            <div>obj.num: {obj.num}</div>
        </div>);
    }
}
```

## React.memo 

React.memo(...)是React v16.6引进来的新属性。它的作用和React.PureComponent类似，是用来控制函数 组件的重新渲染的。React.memo(...) 其实就是函数组件的React.PureComponent。

```jsx
import React, { Component, memo } from "react";
export default class MemoPage extends Component {
    constructor(props) {
        super(props);
        this.state = { counter: 0, obj: { num: -1 }, };
    }
    setCounter = () => {
        this.setState({
            counter: 1 /* ,      
                obj: {        num: 100,      }, */,
        });
    };
    render() {
        const { counter } = this.state;
        return (<div>
            <h1>MemoPage</h1>
            <button onClick={this.setCounter}>按钮</button>
            {/* <PuerCounter counter={counter} obj={obj} /> */}
            <PuerCounter counter={counter} />
        </div>);
    }
}
const PuerCounter = memo(props => {
    console.log("render");
    return <div>{props.counter}</div>;
});

```

