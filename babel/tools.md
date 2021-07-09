# 工具

## @babel/parser

Babel解析器(以前是Babylon)是在Babel中使用的JavaScript解析器。

- 默认启用的最新ECMAScript版本(ES2020)。
- 注解附件。
- 支持JSX, Flow, Typescript。
- 支持实验性语言提案(接受PRs，至少为阶段0接受任何东西)。

### API

#### `babelParser.parse(code, [options])`

#### `babelParser.parseExpression(code, [options])`

parse()将代码解析为整个ECMAScript程序，而parseExpression()则考虑到性能，尝试解析单个表达式。当有疑问时，使用.parse()。

#### Options

**allowImportExportEverywhere**: 默认情况下，import和export声明只能出现在程序的顶层。将此选项设置为true允许在任何允许语句的地方使用它们。

**allowAwaitOutsideFunction**: 默认情况下，await只允许在async函数中使用，或者当topLevelAwait插件启用时，在模块的顶级作用域中使用。将此设置为true，以便在脚本的顶级作用域中也接受它。这个选项不建议使用topLevelAwait插件。

**allowReturnOutsideFunction**: 默认情况下，顶层的return语句会引发错误。将此设置为true以接受此类代码。

**allowSuperOutsideMethod**: 默认情况下，不允许在类和对象方法之外使用`super`方法。将此设置为true以接受此类代码。

**allowUndeclaredExports**:默认情况下，导出当前模块范围内未声明的标识符将引发错误。虽然ECMAScript模块规范要求这种行为，但Babel的解析器不能预测插件管道中稍后可能插入适当声明的转换，因此，有时重要的是将该选项设置为true，以防止解析器过早地抱怨将在稍后添加的未声明的导出。

**createParenthesizedExpressions**: 默认情况下，解析器会在表达式节点上设置`extra.parenthesized`（括号）。当此选项设置为true时，将创建`parenthesedexpression` AST节点。

**errorRecovery**: 默认情况下，Babel总是在发现一些无效代码时抛出错误。当此选项设置为true时，它将存储解析错误并尝试继续解析无效的输入文件。得到的AST将具有一个errors属性，表示所有解析错误的数组。请注意，即使启用了这个选项，@babel/parser也可能抛出不可恢复的错误。

**plugins**: 包含要启用的插件的数组。

**sourceType**: 指示代码应该被解析的模式。可以是`"script"`, `"module"`, 或者 `"unambiguous"`之一。默认为`“script”`。`“unambiguous”`将让@babel/parser根据ES6 import或export语句的存在进行猜测。带有ES6导入和导出的文件被认为是“module”，否则是“script”。

**sourceFilename**:将输出AST节点与其源文件名关联起来。在从多个输入文件的ast生成代码和源映射时非常有用。

**startLine**: 默认情况下，解析的第一行代码被视为第1行。可以提供一个行号数字作为开头。用于与其他源工具集成。

**strictMode**:默认情况下，ECMAScript代码只有在“use strict”;指令，或者被解析的文件是一个ECMAScript模块。将此选项设置为true表示始终以严格模式解析文件。

**ranges**: 为每个节点添加一个范围属性:`[node.start, node.end]`

**tokens**:将所有已解析的tokens添加到File节点上的tokens属性

#### Output

Babel解析器根据Babel AST格式生成AST。它是基于ESTree规范的，有以下偏差:

- Literal标记被替换为StringLiteral, NumericLiteral, BigIntLiteral, BooleanLiteral, NullLiteral, RegExpLiteral
- 属性令牌替换为ObjectProperty和ObjectMethod
- MethodDefinition被ClassMethod代替
- Program和BlockStatement包含附加的Directive和DirectiveLiteral指令字段
- ClassMethod、ObjectProperty和ObjectMethod值属性在FunctionExpression中的属性被强制/带入主方法节点。
- ChainExpression被替换为OptionalMemberExpression和optionalcallexexpression
- ImportExpression被替换为callexexpression，其被调用者是一个Import节点。

> 现在有一个estree插件可以恢复这些偏差

AST for JSX的代码是基于Facebook的JSX AST。

## @babel/core

```js
var babel = require("@babel/core");
import { transform } from "@babel/core";
import * as babel from "@babel/core";
```

所有转换都将使用本地配置文件。

### transform

> babel.transform(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object, callback: Function)

转换已经通过的代码。使用带有生成代码、源映射和AST的对象调用回调函数。

```js
babel.transform(code, options, function(err, result) {
  result; // => { code, map, ast }
});
```

> 兼容注意:
> 在Babel 6中，这种方法是同步的，transformSync并不存在。为了向后兼容，如果没有给出回调函数，这个函数将同步运行。如果你从Babel 7开始，需要同步行为，请使用transformSync，因为这个向后兼容性将在Babel 8中被删除。

### transformSync

> babel.transformSync(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

转换已经通过的代码。返回一个带有生成的代码、源映射和AST的对象。

```js
babel.transformSync(code, options); // => { code, map, ast }
```

### transformAsync

> babel.transformAsync(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

```js
babel.transformAsync(code, options); // => Promise<{ code, map, ast }>
```

### transformFile

> babel.transformFile(filename: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object, callback: Function)

异步转换文件的全部内容。

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

### transformFileSync

> babel.transformFileSync(filename: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

babel.transformFile的同步版本。返回已转换的文件名内容。

```js
babel.transformFileSync(filename, options); // => { code, map, ast }
```

### transformFileAsync

> babel.transformFileAsync(filename: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

babel.transformFile的Promise版本。为文件名的转换内容返回一个Promise

```js
babel.transformFileAsync(filename, options); // => Promise<{ code, map, ast }>
```

### transformFromAst

> babel.transformFromAst(ast: Object, code?: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object, callback: Function): FileNode | null

给定一个AST，转换它。

```js
const sourceCode = "if (true) return;";
const parsedAst = babel.parseSync(sourceCode, {
  parserOpts: { allowReturnOutsideFunction: true },
});
babel.transformFromAst(parsedAst, sourceCode, options, function(err, result) {
  const { code, map, ast } = result;
});
```

### transformFromAstAsync

> babel.transformFromAstAsync(ast: Object, code?: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

```js
const sourceCode = "if (true) return;";
babel
  .parseAsync(sourceCode, { parserOpts: { allowReturnOutsideFunction: true } })
  .then(parsedAst => {
    return babel.transformFromAstAsync(parsedAst, sourceCode, options);
  })
  .then(({ code, map, ast }) => {
    // ...
  });
```

### parse

> babel.parse(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object, callback: Function)

给定一些代码，使用Babel的标准行为解析它。引用的预设和插件将被加载，这样可选的语法插件将被自动启用。

> 兼容注意:
> 在Babel 7的早期测试版中，这种方法是同步的，parseSync并不存在。为了向后兼容，如果没有给出回调函数，这个函数将同步运行。如果你从Babel 7开始，需要同步行为，请使用parseSync，因为这种向后兼容性将在Babel 8中被删除。

### parseSync

> babel.parseSync(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

返回一个AST。
给定一些代码，使用Babel的标准行为解析它。引用的预设和插件将被加载，这样可选的语法插件将被自动启用。

### parseAsync

> babel.parseAsync(code: string, [options?](https://www.babeljs.cn/docs/babel-core#options): Object)

Returns a promise for an AST.

### Advanced APIs

许多包了Babel的系统喜欢自动注入插件和预设，或覆盖选项。为了实现这个目标，Babel公开了几个功能，这些功能可以在不进行转换的情况下部分地加载配置。

#### loadOptions

> babel.loadOptions([options?](https://www.babeljs.cn/docs/babel-core#options): Object)

完全解决Babel的选项，产生一个options对象:

- `opts.plugins`是Plugin实例的完整列表。
- `opts.presets`是空的，所有预设都被压平成选项。
- 可以安全地传递回Babel。像“babelrc”这样的字段被设置为false，以便以后调用Babel时不会再次尝试加载配置文件。

Plugin实例并不意味着要被直接操作，但调用者通常会将这个opts序列化到JSON，以使用它作为缓存键，表示Babel收到的选项。在此缓存不能100%保证正确地失效，但这是目前我们最好的。

#### loadPartialConfig

> babel.loadPartialConfig([options?](https://www.babeljs.cn/docs/babel-core#options): Object): PartialConfig

为了让系统方便地操作和验证用户的配置，该函数解析插件和预设，不再继续。期望的是，调用者将接受配置.options，按照他们认为合适的方式操纵它，然后再传给Babel。

除了标准选项外，这个函数还接受一个附加选项作为选项对象的一部分:showIgnoredFiles。当设置为true时，loadPartialConfig在忽略文件时总是返回一个结果，而不是null。这对于允许调用者访问影响此结果的文件列表非常有用，例如对于监视模式。调用者可以根据返回的fileHandling属性确定文件是否被忽略。

- `babelrc: string | void` - 文件相关配置文件的路径(如果有的话)。
- `babelignore: string | void` - babelignore文件的路径(如果有的话)。
- `config: string | void` - 项目范围的配置文件文件的路径(如果有的话)。
- `options: ValidatedOptions` - 部分解决的选项，可以操纵并再次传递回Babel。
  - `plugins: Array<ConfigItem>` - 见下文
  - `presets: Array<ConfigItem>` - 见下文
  - 可以安全地返回Babel。像“babelrc”这样的选项被设置为false，以便以后调用Babel时不会再次尝试加载配置文件。
- `hasFilesystemConfig(): boolean` - 检查已解析的配置是否从文件系统加载了任何设置。
- `fileHandling` - 它被设置为“transpile”、“ignored”或“unsupported”来指示调用者该如何处理这个文件。
- `files` - 一个文件路径Set，用于构建结果，包括项目范围的配置文件、本地配置文件、扩展配置文件、忽略文件等。用于实现监视模式或缓存失效。

ConfigItem实例公开属性以内省值，但每个项都应视为不可变的。如果需要进行更改，则应该从列表中删除该项，并用普通的Babel配置值或由Babel . createconfigitem创建的替换项替换。有关ConfigItem字段的信息，请参见该函数。

#### createConfigItem

> babel.createConfigItem(value: string | {} | Function | [string | {} | Function, {} | void], { dirname?: string, type?: "preset" | "plugin" }): ConfigItem

允许构建工具预先创建和缓存配置项。如果这个函数在一个给定的插件中被多次调用，Babel就会多次调用插件本身的函数。如果您有一组清晰的预期插件和要注入的预设，那么建议预先构造配置项。

## [@babel/generator](https://www.babeljs.cn/docs/babel-generator)

> 将AST转换为代码。

```js
import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = "class Example {}";
const ast = parse(code);

const output = generate(
  ast,
  {
    /* options */
  },
  code
);
```

## [@babel/code-frame](https://www.babeljs.cn/docs/babel-code-frame)

设置代码结构

```js
import { codeFrameColumns } from "@babel/code-frame";

const rawLines = `class Foo {
  constructor() {
    console.log("hello");
  }
}`;
const location = {
  start: { line: 2, column: 17 },
  end: { line: 4, column: 3 },
};

const result = codeFrameColumns(rawLines, location, {
  /* options */
});

console.log(result);
```

```js
  1 | class Foo {
> 2 |   constructor() {
    |                 ^
> 3 |     console.log("hello");
    | ^^^^^^^^^^^^^^^^^^^^^^^^^
> 4 |   }
    | ^^^
  5 | };
```

## @babel/runtime

@babel/runtime是一个包含babel模块化运行时helpers和一个版本的`regenerator-runtime`(再生器运行时)。

### 安装

```
npm install --save @babel/runtime
```

> 另请参见：[`@babel/runtime-corejs2`](https://www.babeljs.cn/docs/babel-runtime-corejs2).。

### 使用

这意味着将与Babel plugin [`@babel/plugin-transform-runtime`](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)一起用作运行时依赖项。请查阅该软件包中的文档以供使用。

### 为什么

有时Babel可能会在输出中注入一些跨文件相同的代码，因此可能会被重用。

例如，使用类转换（无松散模式）：

```js
class Circle {}
```

转换成

```js
function _classCallCheck(instance, Constructor) {
  //...
}

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

这意味着每个包含类的文件每次都会重复使用_classCallCheck 函数。

对于@babel/plugin transform runtime，它将替换对@babel/runtime版本的函数引用。

```js
var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

@babel/runtime包中的函数实现是模块化的。

## [@babel/template](https://www.babeljs.cn/docs/babel-template)

在计算机科学中，这被称为准引号的实现。

### 字符串的使用

当使用带字符串参数的函数调用template时，可以提供占位符，当使用模板时，占位符将被替换。

你可以使用两种不同的占位符:语法占位符(例如%%name%%)或标识符占位符(例如name)。@babel/template默认支持这两种方法，但不能混合使用。如果需要明确所使用的语法，可以使用syntacticplaceholder选项。

请注意，在Babel 7.4.0中引入了语法占位符。如果你不能控制@babel/template版本(例如，从@babel/core@^7.0.0对等依赖中导入它)，你必须使用标识符占位符。另一方面，语法占位符有一些优点:它们可以用于标识符可能是一个语法错误的地方(例如，替换函数体，或在导出声明中)，而且它们不会与大写变量冲突(例如，new URL())。

## @babel/traverse

### 安装

```
$ npm install --save @babel/traverse
```

### 使用

我们可以使用它与babel解析器一起遍历和更新节点：

```js
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

此外，我们可以针对语法树中的特定[节点类型](https://babeljs.io/docs/en/babel-types#api)

```js
traverse(ast, {
    FunctionDeclaration: function(path) {
             path.node.id.name = "x";
    }
})
```

## [@babel/types](https://www.babeljs.cn/docs/babel-types)

此模块包含用于手动构建AST和检查AST节点类型的方法。

```
npm install --save-dev @babel/types
```

