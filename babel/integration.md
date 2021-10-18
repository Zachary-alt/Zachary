# 集成

## [@babel/cli](https://www.babeljs.cn/docs/babel-cli)

Babel 自带了一个内置的 CLI 命令行工具，可通过命令行编译文件。

此外，各种可直接调用脚本都存放在 `@babel/cli/bin` 中。一个可通过 shell 执行的实用脚本 - `babel-external-helpers.js`，以及 Babel cli 主脚本 `babel.js`。

## @babel/polyfill

🚨 从Babel 7.4.0开始，这个包已经被弃用，取而代之的是直接包含`core-js/stable`(用于填充ECMAScript特性)和`regenerator-runtime/runtime`(需要使用编译后的生成器函数):

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```

Babel包括一个包含自定义 [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)和core-js的polyfill。
这将模拟一个完整的ES2015+环境(不< Stage 4提案)，并打算在应用程序中使用，而不是库/工具。(此polyfill在使用babel-node时自动加载)。

这意味着你可以使用新的内置函数，如Promise或WeakMap，静态方法如Array.from或Object。assign，实例方法如Array.prototype。包括，和生成器函数(提供使用再生器插件)。polyfill添加到全局范围以及本地原型，如String，以实现这一点。

```js
npm install --save @babel/polyfill
```

> 因为这是一个polyfill(它将在你的源代码之前运行)，我们需要它是一个依赖，而不是一个devDependency

### Size

polyfill提供了一个便利，但你应该使用@babel/preset-env和useBuiltIns选项，这样它就不包括整个polyfill，这不是总是需要的。否则，我们建议您手动导入单个polyfills。

### TC39建议

如果你需要使用的建议不是阶段4，@babel/polyfill将不会自动为你导入这些。你必须从另一个polyfill，如core-js单独导入这些。我们可能很快会把它作为单独的文件包含在@babel/polyfill中

### Usage in Node / Browserify / Webpack

在应用程序的入口顶部，你需要引入它。

> 确保在所有其他代码/require语句之前调用它!

```js
import "@babel/polyfill";
// or
require("@babel/polyfill");
```

使用webpack，有多种方法来包含polyfills:

- 当与@babel/preset-env一起使用时

  - 如果在.babelrc中指定了useBuiltIns: 'usage'，那么不要在webpack.config.js条目数组或source中包含@babel/polyfill。注意，@babel/polyfill仍然需要安装。

  - 如果useBuiltIns: 'entry'是在.babelrc中指定的，那么在你的应用程序的入口点的顶部包括@babel/polyfill，通过上面讨论的require或import。

  - 如果没有指定useBuiltIns键，或者在.babelrc中使用useBuiltIns: false显式设置，直接将@babel/polyfill添加到webpack.config.js的条目数组中

    ```js
    module.exports = {
      entry: ["@babel/polyfill", "./app/js"],
    };
    ```

- 如果@babel/preset-env没有被使用，那么将@babel/polyfill添加到上面讨论过的webpack条目数组中。仍然可以通过导入或要求将其添加到应用程序的入口点顶部，但不建议这样做。

### Usage in Browser

可以从@babel/polyfill npm发行版中的dist/polyfill.js文件中获得。这需要在所有编译后的Babel代码之前包含在内。您可以将其添加到已编译代码中，也可以将其包含在前面的`<script>`中。

注意:不需要通过browserify等，使用@babel/polyfill。

## @babel/plugin-transform-runtime

一个插件，允许重用Babel注入的助手代码，以节省代码大小。

> 注意:实例方法如"foobar".includes("foo")只适用于core-js@3。如果你需要polyfill它们，你可以直接导入"core-js"或者使用@babel/preset-env的useBuiltIns选项。

### Installation

```js
npm install --save-dev @babel/plugin-transform-runtime
```

同时@babel/runtime作为一个生产依赖项(因为它是“运行时”)。

```js
npm install --save @babel/runtime
```

转换插件通常只在开发中使用，但是运行时本身将依赖于您部署的代码。参见下面的示例了解更多细节。

### Why?

Babel为常用函数(如_extend)使用非常小的帮助程序。默认情况下，它将被添加到需要它的每个文件中。这种重复有时是不必要的，特别是当您的应用程序分布在多个文件中时。

这就是@babel/plugin-transform-runtime插件的用途:所有的helpers都将引用@babel/runtime模块，以避免在编译后的输出中出现重复。运行时将被编译到构建中。

这个转换器的另一个目的是为您的代码创建一个沙箱环境。如果你直接导入core-js或@babel/polyfill以及它提供的内置功能，比如Promise, Set和Map，这些会污染全局范围。虽然这对于应用程序或命令行工具来说是可以的，但如果你的代码是一个库，你打算发布给其他人使用，或者你不能精确地控制代码运行的环境，这就会成为一个问题。

转换器将这些内置组件别名到core-js，所以你可以无缝使用它们，而不需要polyfill。

请参阅[技术细节](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#technical-details)部分，以获得更多关于这是如何工作的以及发生的转换类型的信息

### Usage

##### 使用配置文件(推荐)

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```

插件默认假设所有的可填充api将由用户提供。否则，需要指定corejs选项。

### Options

#### `corejs`


`false`, `2`, `3` or `{ version: 2 | 3, proposals: boolean }`, defaults to `false`

e.g. `['@babel/plugin-transform-runtime', { corejs: 3 }],`

请注意，corejs: 2只支持全局变量(例如Promise)和静态属性(例如Array.from)，而corejs: 3也支持实例属性(例如[].includes)。

默认情况下，@babel/plugin-transform-runtime不会填充建议。如果您正在使用corejs: 3，您可以通过使用proposal: true选项来选择它。

此选项需要变化，用于提供必要运行时助手的依赖项:

| `corejs` option | Install command                             |
| --------------- | ------------------------------------------- |
| `false`         | `npm install --save @babel/runtime`         |
| `2`             | `npm install --save @babel/runtime-corejs2` |
| `3`             | `npm install --save @babel/runtime-corejs3` |

#### `helpers`

`boolean`, defaults to `true`.

切换内联Babel助手(classCallCheck、extends等)是否被moduleName调用所替换。

有关更多信息，请参见[Helper aliasing](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#helper-aliasing).

#### `polyfill` `useBuiltIns`

> v7中删除了这个选项，只将其设置为默认值。

#### `regenerator`

`boolean`, defaults to `true`.

切换是否将生成器函数转换为使用不污染全局作用域的再生器运行时。

#### `useESModules`

> 这个选项已被弃用:从7.13.0版本开始，@babel/runtime的包。json使用“exports”选项自动在CJS和ESM helper之间进行选择

#### `absoluteRuntime`

`boolean` or `string`, defaults to `false`

这允许用户在整个项目中广泛地运行转换运行时。默认情况下，转换运行时直接从@babel/runtime/foo导入，但只有当@babel/runtime在正在编译的文件的node_modules中时才有效。对于嵌套的node_modules、npm链接的模块或驻留在用户项目之外的cli，以及其他情况，这可能会有问题。为了避免担心如何解析运行时模块的位置，这允许用户预先解析运行时一次，然后将运行时的绝对路径插入到输出代码中。

如果文件被编译以供以后使用，那么使用绝对路径是不可取的，但是在文件被编译然后立即被使用的上下文中，绝对路径是非常有用的。

#### `version`

默认情况下，transform-runtime假定安装了@babel/runtime@7.0.0。如果你有更高版本的@babel/runtime(或它们的corejs对应版本，例如@babel/runtime- corej3)安装或作为依赖项列出，转换运行时可以使用更高级的特性。

例如，如果你依赖@babel/runtime-corejs2@7.7.4，你可以用它来编译你的代码

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2,
        "version": "^7.7.4"
      }
    ]
  ]
}
```

这将导致更小的包体积。

### 技术细节

transform-runtime transformer插件做三件事:

- 自动引用@babel/runtime/regenerator当你使用generators/async函数(使用regenerator选项切换)。
- 如果需要，可以使用core-js作为helper，而不是假设它将被用户polyfill(使用corejs选项切换)
- 自动删除内联Babel helpers，并使用@babel/runtime/helpers模块代替(可通过helpers选项切换)。

这到底意味着什么呢?基本上，你可以使用内置的`Promise`, `Set`, `Symbol`等，以及使用所有的Babel功能（需要一个无缝的polyfill），没有全局污染，使它非常适合库。

确保包含@babel/runtime作为依赖项

## [@babel/register](https://www.babeljs.cn/docs/babel-register)

另一个使用 Babel 的方法是通过 require 钩子（hook）。require 钩子 将自身绑定到 node 的 `require` 模块上，并在运行时进行即时编译。 这和 CoffeeScript 的 [coffee-script/register](http://coffeescript.org/v2/annotated-source/register.html) 类似。

作用：babel-register 实际上为require加了一个钩子（hook），node 后续运行时所需要 require 进来的扩展名为 `.es6`、`.es`、`.jsx`、 `.mjs` 和 `.js` 的文件将由 Babel 自动转换。

## @babel/standalone

@babel/standalone提供了在浏览器和其他非node .js环境中使用的独立的Babel构建。

### 何时(不)使用@babel/standalone

如果在生产环境中使用Babel，通常不应该单独使用@babel/standalone。相反，你应该使用一个运行在Node.js上的构建系统，比如Webpack、Rollup或Parcel，来提前编译你的JS。
然而，@babel/standalone有一些有效的用例:

- 它提供了一种简单、方便的方法来使用Babel原型。使用@babel/standalone，您可以通过HTML中的一个简单的脚本标记开始使用Babel。
- 实时编译用户提供的JavaScript的网站，如JSFiddle, JS Bin, Babel网站上的REPL, JSitor等。
- 直接嵌入像V8这样的JavaScript引擎，并且想要使用Babel进行编译的应用程序
- 想要使用JavaScript作为脚本语言来扩展应用本身的应用程序，包括ES2015提供的所有东西。
- 其他非node .js环境(ReactJS。NET、ruby-babel-transpiler、php-babel-transpiler等)。