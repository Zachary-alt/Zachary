# Babel 是什么？

Babel 是一个 JavaScript 编译器Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 [core-js](https://github.com/zloirock/core-js)，实现）
- 源码转换 (codemods)
- 更多资源！（请查看这些 [视频](https://www.babeljs.cn/videos.html) 以获得启发）

## JSX 与 React

Babel 能够转换 JSX 语法！查看 [React preset](https://www.babeljs.cn/docs/babel-preset-react) 了解更多信息。通过和 [babel-sublime](https://github.com/babel/babel-sublime) 一起使用还可以把语法高亮的功能提升到一个新的水平。

## 类型注释 (Flow 和 TypeScript)

Babel 可以删除类型注释！查看 [Flow preset](https://www.babeljs.cn/docs/babel-preset-flow) 或 [TypeScript preset](https://www.babeljs.cn/docs/babel-preset-typescript) 了解如何使用。务必牢记 **Babel 不做类型检查**，你仍然需要安装 Flow 或 TypeScript 来执行类型检查的工作。

## 插件化

Babel 构建在插件之上。使用现有的或者自己编写的插件可以组成一个转换管道。通过使用或创建一个 [preset](https://www.babeljs.cn/docs/plugins#presets) 即可轻松使用一组插件。 [了解更多 →](https://www.babeljs.cn/docs/plugins)

利用 [astexplorer.net](https://astexplorer.net/#/KJ8AjD6maa) 可以立即创建一个插件，或者使用 [generator-babel-plugin](https://github.com/babel/generator-babel-plugin) 生成一个插件模板。

### 插件

Babel的代码转换是通过在配置文件中应用插件(或预设)来实现的。

#### 插件顺序

> 插件的排列顺序很重要。

这意味着如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。

- 插件在 Presets 前运行。
- 插件顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。

## 可调试

由于 Babel 支持 **Source map**，因此你可以轻松调试编译后的代码。

## 符合规范

Babel 尽最大可能遵循 ECMAScript 标准。不过，Babel 还提供了特定的选项来对标准和性能做权衡。

## 代码紧凑

Babel 尽可能用最少的代码并且不依赖太大量的运行环境。

有些情况是很难达成的这一愿望的，因此 Babel 提供了 "loose" 选项，用以在特定的转换情况下在符合规范、文件大小和速度之间做折中。