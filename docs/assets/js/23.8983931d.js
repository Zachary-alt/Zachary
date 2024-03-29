(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{398:function(e,r,t){"use strict";t.r(r);var a=t(42),s=Object(a.a)({},(function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"babel-是什么"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#babel-是什么"}},[e._v("#")]),e._v(" Babel 是什么？")]),e._v(" "),t("p",[e._v("Babel 是一个 JavaScript 编译器Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：")]),e._v(" "),t("ul",[t("li",[e._v("语法转换")]),e._v(" "),t("li",[e._v("通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 "),t("a",{attrs:{href:"https://github.com/zloirock/core-js",target:"_blank",rel:"noopener noreferrer"}},[e._v("core-js"),t("OutboundLink")],1),e._v("，实现）")]),e._v(" "),t("li",[e._v("源码转换 (codemods)")]),e._v(" "),t("li",[e._v("更多资源！（请查看这些 "),t("a",{attrs:{href:"https://www.babeljs.cn/videos.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("视频"),t("OutboundLink")],1),e._v(" 以获得启发）")])]),e._v(" "),t("h2",{attrs:{id:"jsx-与-react"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#jsx-与-react"}},[e._v("#")]),e._v(" JSX 与 React")]),e._v(" "),t("p",[e._v("Babel 能够转换 JSX 语法！查看 "),t("a",{attrs:{href:"https://www.babeljs.cn/docs/babel-preset-react",target:"_blank",rel:"noopener noreferrer"}},[e._v("React preset"),t("OutboundLink")],1),e._v(" 了解更多信息。通过和 "),t("a",{attrs:{href:"https://github.com/babel/babel-sublime",target:"_blank",rel:"noopener noreferrer"}},[e._v("babel-sublime"),t("OutboundLink")],1),e._v(" 一起使用还可以把语法高亮的功能提升到一个新的水平。")]),e._v(" "),t("h2",{attrs:{id:"类型注释-flow-和-typescript"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#类型注释-flow-和-typescript"}},[e._v("#")]),e._v(" 类型注释 (Flow 和 TypeScript)")]),e._v(" "),t("p",[e._v("Babel 可以删除类型注释！查看 "),t("a",{attrs:{href:"https://www.babeljs.cn/docs/babel-preset-flow",target:"_blank",rel:"noopener noreferrer"}},[e._v("Flow preset"),t("OutboundLink")],1),e._v(" 或 "),t("a",{attrs:{href:"https://www.babeljs.cn/docs/babel-preset-typescript",target:"_blank",rel:"noopener noreferrer"}},[e._v("TypeScript preset"),t("OutboundLink")],1),e._v(" 了解如何使用。务必牢记 "),t("strong",[e._v("Babel 不做类型检查")]),e._v("，你仍然需要安装 Flow 或 TypeScript 来执行类型检查的工作。")]),e._v(" "),t("h2",{attrs:{id:"插件化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#插件化"}},[e._v("#")]),e._v(" 插件化")]),e._v(" "),t("p",[e._v("Babel 构建在插件之上。使用现有的或者自己编写的插件可以组成一个转换管道。通过使用或创建一个 "),t("a",{attrs:{href:"https://www.babeljs.cn/docs/plugins#presets",target:"_blank",rel:"noopener noreferrer"}},[e._v("preset"),t("OutboundLink")],1),e._v(" 即可轻松使用一组插件。 "),t("a",{attrs:{href:"https://www.babeljs.cn/docs/plugins",target:"_blank",rel:"noopener noreferrer"}},[e._v("了解更多 →"),t("OutboundLink")],1)]),e._v(" "),t("p",[e._v("利用 "),t("a",{attrs:{href:"https://astexplorer.net/#/KJ8AjD6maa",target:"_blank",rel:"noopener noreferrer"}},[e._v("astexplorer.net"),t("OutboundLink")],1),e._v(" 可以立即创建一个插件，或者使用 "),t("a",{attrs:{href:"https://github.com/babel/generator-babel-plugin",target:"_blank",rel:"noopener noreferrer"}},[e._v("generator-babel-plugin"),t("OutboundLink")],1),e._v(" 生成一个插件模板。")]),e._v(" "),t("h3",{attrs:{id:"插件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#插件"}},[e._v("#")]),e._v(" 插件")]),e._v(" "),t("p",[e._v("Babel的代码转换是通过在配置文件中应用插件(或预设)来实现的。")]),e._v(" "),t("h4",{attrs:{id:"插件顺序"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#插件顺序"}},[e._v("#")]),e._v(" 插件顺序")]),e._v(" "),t("blockquote",[t("p",[e._v("插件的排列顺序很重要。")])]),e._v(" "),t("p",[e._v("这意味着如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。")]),e._v(" "),t("ul",[t("li",[e._v("插件在 Presets 前运行。")]),e._v(" "),t("li",[e._v("插件顺序从前往后排列。")]),e._v(" "),t("li",[e._v("Preset 顺序是颠倒的（从后往前）。")])]),e._v(" "),t("h2",{attrs:{id:"可调试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#可调试"}},[e._v("#")]),e._v(" 可调试")]),e._v(" "),t("p",[e._v("由于 Babel 支持 "),t("strong",[e._v("Source map")]),e._v("，因此你可以轻松调试编译后的代码。")]),e._v(" "),t("h2",{attrs:{id:"符合规范"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#符合规范"}},[e._v("#")]),e._v(" 符合规范")]),e._v(" "),t("p",[e._v("Babel 尽最大可能遵循 ECMAScript 标准。不过，Babel 还提供了特定的选项来对标准和性能做权衡。")]),e._v(" "),t("h2",{attrs:{id:"代码紧凑"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#代码紧凑"}},[e._v("#")]),e._v(" 代码紧凑")]),e._v(" "),t("p",[e._v("Babel 尽可能用最少的代码并且不依赖太大量的运行环境。")]),e._v(" "),t("p",[e._v('有些情况是很难达成的这一愿望的，因此 Babel 提供了 "loose" 选项，用以在特定的转换情况下在符合规范、文件大小和速度之间做折中。')])])}),[],!1,null,null,null);r.default=s.exports}}]);