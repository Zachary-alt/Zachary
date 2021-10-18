## webpack打包原理分析

webpack 在执行npx webpack进行打包后，都干了什么事情？

```js
(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = (installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        });
        modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );
        module.l = true;
        return module.exports;
    }
    return __webpack_require__((__webpack_require__.s =
        "./index.js"));
})({
    "./index.js": function (module, exports) {
        eval(
            '// import a from "./a";\n\nconsole.log("hello word");\n\n\n//# sourceURL=webpack:///./index.js?'
        ),
            "./a.js": function(module, exports) {
                eval(
                    '// import a from "./a";\n\nconsole.log("hello word");\n\n\n//# sourceURL=webpack:///./index.js?'
                ),
                    "./b.js": function(module, exports) {
                        eval(
                            '// import a from "./a";\n\nconsole.log("hello word");\n\n\n//# sourceURL=webpack:///./index.js?'
                        );
                    }
            });
```

⼤概的意思就是，我们实现了⼀个webpack_require 来实现自己的模块化，把代码都缓存在installedModules里，代码⽂件以对象传递进来，key是路径，value是包裹的代码字符串，并且代码内部的require，都被替换成了webpack_require

### 自己实现⼀个bundle.js

#### 模块分析

读取入口文件，分析代码

```js
const fs = require("fs");
const fenximokuai = filename => {
 const content = fs.readFileSync(filename, "utf-8");
 console.log(content);
};
fenximokuai("./index.js");
```

拿到⽂件中依赖，这里我们不推荐使用字符串截取，引⼊的模块名越多，就越麻烦，不灵活，这里我们推荐使用@babel/parser，这是babel7的⼯具，来帮助我们分析内部的语法，包括es6，返回⼀个ast抽象语法树

```js
//安装@babel/parser
npm install @babel/parser --save
//bundle.js
const fs = require("fs");
const parser = require("@babel/parser");
const fenximokuai = filename => {
 const content = fs.readFileSync(filename, "utf-8");
 const Ast = parser.parse(content, {
 sourceType: "module"
 });
 console.log(Ast.program.body);
};
fenximokuai("./index.js");
```

接下来我们就可以根据body里⾯的分析结果，遍历出所有的引⼊模块，但是比较麻烦，这里还是推荐babel推荐的⼀个模块@babel/traverse，来帮我们处理。

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fenximokuai = filename => {
 const content = fs.readFileSync(filename, "utf-8");
 const Ast = parser.parse(content, {
 sourceType: "module"
 });
 const dependencies = [];
 //分析ast抽象语法树，根据需要返回对应数据，
 //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
 traverse(Ast, {
 ImportDeclaration({ node }) {
 console.log(node);
 dependencies.push(node.source.value);
 }
 });
 console.log(dependencies);
};
fenximokuai("./index.js");
```

我们要分析出信息：

- 入口文件
- 入口文件引⼊的模块
  - 引⼊路径
  - 在项⽬中里的路径
- 可以在浏览器里执行的代码

处理现在的路径问题：

```js
//需要用到path模块
const parser = require("@babel/parser");
//修改 dependencies 为对象，保存更多的信息
const dependencies = {};
//分析出引⼊模块，在项⽬中的路径
const newfilename =
 "./" + path.join(path.dirname(filename),
node.source.value);
//保存在dependencies里
dependencies[node.source.value] = newfilename;
```

把代码处理成浏览器可运行的代码，需要借助@babel/core，和@babel/preset-env，把ast语法树转换成合适的代码

```js
const babel = require("@babel/core");
const { code } = babel.transformFromAst(Ast, null, {
 presets: ["@babel/preset-env"]
 });
```

导出所有分析出的信息：

```js
return {
 filename,
 dependencies,
 code
 };
```

完成代码参考：

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

// 模块的分析
const moduleAnalyser = filename => {
    const content = fs.readFileSync(filename, "utf-8");
    let codes;
    const dependencies = {};
    if (filename.indexOf('.json') > -1) {
        codes = content;
    } else {
        const Ast = parser.parse(content, {
            sourceType: "module"
        });
        const { code } = babel.transformFromAst(Ast, null, {
            presets: ["@babel/preset-env"]
        });
        codes = code;
        //分析ast抽象语法树，根据需要返回对应数据，
        //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
        traverse(Ast, {
            CallExpression({ node }) {
                // console.log(11,node.callee.name,node.arguments[0].value);
                if (node.callee.name === 'require') {
                    //分析出引⼊模块，在项⽬中的路径
                    const newfilename =
                        "./" + path.join(path.dirname(filename),
                            node.arguments[0].value);
                    //保存在dependencies里
                    dependencies[node.arguments[0].value] = newfilename;
                }
            },
            ImportDeclaration({ node }) {
                //分析出引⼊模块，在项⽬中的路径
                const newfilename =
                    "./" + path.join(path.dirname(filename),
                        node.source.value);
                //保存在dependencies里
                dependencies[node.source.value] = newfilename;
            }
        });
    }

    return {
        filename,
        dependencies,
        code: codes
    }
};
const moduleInfo = moduleAnalyser('./src/index.json');
console.log(moduleInfo);
```

#### 分析依赖

上⼀步我们已经完成了⼀个模块的分析，接下来我们要完成项⽬里所有模块的分析：

```js
// 分析依赖
const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);
    const graphArray = [entryModule];

    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;
        if (dependencies) {
            for (let j in dependencies) {
                graphArray.push(
                    moduleAnalyser(dependencies[j])
                );
            }
        }
    };

    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        };
    });
    return graph;
};

const graghInfo = makeDependenciesGraph('./src/index.js');
console.log(graghInfo);
```

#### 生成代码

```js
const generateCode = (entry) => {
    const graph = makeDependenciesGraph(entry);
    return `
        (function(graph){
            function require(module) {
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                }
                var exports = {};
                (function(require, exports, code){
                    eval(code)
                })(localRequire, exports, graph[module].code);
                return exports;
            };
            require('${entry}')
         })(${graph});
        `;
}
const code = generateCode('./src/index.js');
console.log(code);
```

