# 预设（Presets）

Babel 的预设（preset）可以被看作是一组 Babel 插件和/或 [`options`](https://www.babeljs.cn/docs/options) 配置的可共享模块。

## @babel/preset-env

`@babel/preset-env`是一个智能的预设，允许你使用最新的JavaScript，而不需要微管理哪些语法转换(和可选的浏览器插件)是你的目标环境需要的。这既使您的工作更轻松，也使JavaScript包更小!

```shell
npm install --save-dev @babel/preset-env
```

### 它是如何工作的

@babel/preset-env如果没有一些很棒的开源项目，比如browserslist、compat-table和electronic -to-chromium，就不可能实现。

我们利用这些数据源来维护我们所支持的目标环境的哪个版本获得了JavaScript语法或浏览器特性的支持的映射，以及这些语法和特性到Babel转换插件和core-js polyfill的映射。

@babel/preset-env接受您指定的任何目标环境，并根据其映射检查它们，以编译插件列表并将其传递给Babel。

### Browserslist 集成

对于基于浏览器或电子的项目，我们建议使用.browserslistrc文件来指定目标。您可能已经有了这个配置文件，因为生态系统中的许多工具都在使用它，比如autoprefixer、stylelint、eslint-plugin-compat和许多其他工具。

默认情况下@babel/preset-env将使用browserslist配置源，除非设置了targets或ignoreBrowserslistConfig选项。

> 请注意，如果您依赖于browserslist的默认查询(无论是显式查询还是通过没有browserslist配置)，您将希望查看no targets部分以获得关于preset-env行为的信息。

例如，只包含浏览器拥有>0.25%市场份额的用户所需的代码填充和代码转换(忽略没有安全更新的浏览器，如IE 10和黑莓):

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

**browserslist**

```
> 0.25%
not dead
```

或者

**package.json**

```
"browserslist": "> 0.25%, not dead"
```

> 请注意，从v7.4.5开始，browserslist查询被解析为mobileToDesktop: true。例如，如果你想创建一个查询的快照，运行npx browserslist -mobile-to-desktop ">0.25%， not dead"

### Options

有关为预设设置选项的更多信息，请参阅预设选项文档。

#### `targets`

string | Array<string> | {[string]: string}，如果@babel/preset-env的文档中没有指定browserslist相关选项，则默认为顶级目标选项，否则为{}。

描述项目支持/目标的环境。
这可以是兼容browserslist的查询(注意事项):

```js
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

示例环境:chrome, opera, edge, firefox, safari, ie, ios, android, node, electron。

##### No targets

由于preset-env的最初目标之一是帮助用户轻松地从使用preset-latest过渡，当没有指定目标时，它的行为类似:preset-env将转换所有ES2015-ES2020代码为ES5兼容。

> 我们不建议以这种方式使用preset-env，因为它没有利用其针对特定环境/版本的能力。

因此，preset-env的行为与browserslist不同:当在您的Babel或browserslist配置中没有找到目标时，它不使用默认查询。如果你想使用默认查询，你需要显式地将它作为目标传递:

```js
{
  "presets": [["@babel/preset-env", { "targets": "defaults" }]]
}
```

我们意识到这并不理想，并将在Babel v8中重新审视这一点

##### `targets.esmodules`

您也可以针对支持ES模块的浏览器(https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。当指定此选项时，浏览器字段将被忽略。您可以将这种方法与<script type="module"></script>结合使用，有条件地为用户提供较小的脚本(https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility)。

> 请注意:当指定esmodules目标时，浏览器目标将被忽略。

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true
        }
      }
    ]
  ]
}
```

##### `targets.node`

string | "current"

如果希望根据当前节点版本进行编译，可以指定"node": "current"，与"node": process.versions.node相同。

##### `targets.safari`

如果你想编译Safari的技术预览版本，你可以指定" Safari ": "tp"。

##### `targets.browsers`

string | Array<string>

使用browserslist选择浏览器(例如:上2个版本，> 5%，safari tp)的查询。
注意，浏览器的结果会被目标中的显式项覆盖。

注意:这将在以后的版本中删除，以支持直接设置“目标”查询。

#### `useBuiltIns`

"usage" | "entry" | false，默认为false。

此选项配置@babel/preset-env如何处理polyfills填充。
当使用了usage或entry选项时，@babel/preset-env将作为裸导入(或要求)添加对core-js模块的直接引用。这意味着core-js将相对于文件本身进行解析，并且需要可访问。

由于@babel/polyfill在7.4.0中已弃用，我们建议直接添加core-js，并通过corejs选项设置版本。

```js
npm install core-js@3 --save
# or
npm install core-js@2 --save
```

##### `useBuiltIns: 'entry'`

> 注意:只使用`import "core-js"`;和`import "regenerator-runtime/runtime"`;如果你使用@babel/polyfill，它已经包含了core-js和regenerator-runtime:导入两次会抛出错误。对这些包的多次导入或要求可能会导致全局冲突和其他难以跟踪的问题。我们建议创建一个只包含import语句的单个条目文件。

##### `useBuiltIns: 'usage'`

在每个文件中使用polyfills时添加特定的导入。我们利用了这样一个事实:一个bundle只会加载一次相同的polyfill。

##### `useBuiltIns: false`

不要为每个文件自动添加polyfills，也不要将import "core-js"或import "@babel/polyfill"转换为单个polyfills。

#### `corejs`

Added in: `v7.4.0`

这个选项只有在与useBuiltIns: usage或useBuiltIns: entry一起使用时才有效果，并确保@babel/preset-env注入core-js版本支持的填充包。建议指定小版本，否则“3”将被解释为“3.0”，可能不包含最新特性的polyfills。

默认情况下，只有稳定ECMAScript特性的polyfills填充会被注入:如果你想要polyfills填充提案，你有三个不同的选项:

- 当使用useBuiltIns: "entry"时，你可以直接导入一个提议填充:`import "core-js/proposals/string-replace-all"`
- 当使用useBuiltIns: "usage"时，你有两个不同的选择:
  - 将shippedproposal选项设置为true。这将为已经在浏览器中提供了一段时间的提案启用polyfills填充和转换。
  - 使用corejs: {version: "3.8"， proposal: true}。这将支持对core-js@3.8支持的每个提案进行填充。



## [@babel/preset-react](https://www.babeljs.cn/docs/babel-preset-react)

## [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)

## [@babel/preset-flow](https://www.babeljs.cn/docs/babel-preset-flow)

