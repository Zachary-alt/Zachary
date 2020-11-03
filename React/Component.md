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
//根⽬目录创建config-overrides.js 
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

