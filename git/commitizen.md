在`git-commit-message`中约束规范`message`信息，提高`message`中信息的质量

[Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 模块配置

### commitizen

> 提供定制化的，提交信息规范，系统会提示您在提交时填写所有必需的提交字段。不再等到以后再运行`git commit`钩子并拒绝您的提交

#### 安装

如果你的**npm<5.2**则需要全局安装

```bash
npm install -g commitizen
```

如果你使用**npm 5.2+**，则可以使用局部安装，然后使用一下命令运行

```bash
npx git-cz
```

#### 配置提示规则

##### 引用规则

**npm**

```bash
commitizen init cz-conventional-changelog --save-dev --save-exact
```

**yarn**

```bash
commitizen init cz-conventional-changelog --yarn --dev --exact
```

并在`package.json`中配置

```json
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```

##### 自定义规则

需要借助[cz-customizable](https://shimingw.cn/docs/2019-10-11-git-git-commit规范/#cz-customizable)

### commitlint

> 制定`commit`信息规范，对`commit`信息进行校验，如果不满足，则不允许提交

#### 安装

```bash
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

#### 配置

##### 引用规则

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

##### 自定义规则

rule 由 name 和配置数组组成，如：`'name:[0, 'always', 72]'`

- **level**：可选`0,1,2`，0 为 disable，1 为 warning，2 为 error
- **Applicable**：`always|never`是否应用
- **Value**：此规则需要匹配的值

具体规则配置见

[配置说明](https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md)

**配置规则的同时还需要注意[commitlint 解析器预设](https://commitlint.js.org/#/reference-configuration?id=parser-presets)能否正常解析**

### Husky

> 这使我们可以通过 husky.hooks 字段将 git 钩子直接添加到 package.json 中。

#### 安装

```bash
npm install -D husky
```

#### 配置

在`package.json`中添加挂钩

```json
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
```

### cz-customizable

> 可定制的`Commitizen`插件

#### 安装

```bash
npm install cz-customizable --save-dev
```

#### 配置

在`package.json`中配置

```json
"config": {
  "commitizen": { // not needed for standlone usage
    "path": "node_modules/cz-customizable"
  },
  // 配置文件路径，默认配置文件为根目录下的.cz-config.js文件
  "cz-customizable": {
    "config": "config/path/to/my/config.js"
  }
```

##### 配置规则

- **subjectLimit**：header 的长度
- **types**：自定义`type`类型选项

```json
    types: [{
            value: '新功能',
            name: '新功能 : 新增加一个功能'
        },
        {
            value: '修复',
            name: '修复   : 一个 bug 修复'
        },
        {
            value: '优化',
            name: '优化   : 提升性能的代码更改'
        },
        {
            value: '重构',
            name: '重构   : 不涉及修复bug和新功能开发的代码更改'
        },
        {
            value: '文档',
            name: '文档   : 只有文档发生改变'
        },
        {
            value: '构建',
            name: '构建   : 修改持续集成的配置文件和脚本'
        },
        {
            value: '撤销',
            name: '撤销   : 撤销一个历史提交'
        }
    ]
```

- **scopes**：自定义`scopes`类型选项

```json
    scopes: [{
        name: '小'
    }, {
        name: '中'
    }, {
        name: '大'
    }, {
        name: '全局'
    }]
```

- **scopeOverrides**：针对每个`type`可以自定义对应的`scope`

```json
    scopeOverrides: {
      fix: [
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    }
```

- **allowBreakingChanges**：需要填写影响范围的类型
- **skipQuestions**：跳过的问题列表
- **footerPrefix**：自定义页脚前缀
- **breaklineChar**：自定义换行字符串