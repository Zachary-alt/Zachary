(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{442:function(t,a,e){"use strict";e.r(a);var s=e(42),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"持续集成-jekins"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#持续集成-jekins"}},[t._v("#")]),t._v(" 持续集成-jekins")]),t._v(" "),e("p",[t._v("使开发者从繁杂的集成中解脱出来，专注于更为重要的业务逻辑实现上")]),t._v(" "),e("p",[t._v("持续集成的原则")]),t._v(" "),e("ol",[e("li",[t._v("需要版本控制软件保障团队成员提交的代码不会导致集成失败。常用的版本控制软件有 svn,Git, ClearCase 等；")]),t._v(" "),e("li",[t._v("需要有专门的集成服务器来执行集成构建。根据项目的具体实际，集成构建可以被软件的修改来直接触发，也可以定时启动，如每半个小时构建一次；")]),t._v(" "),e("li",[t._v("必须保证构建的成功。如果构建失败，修复构建过程中的错误是优先级最高的工作。一旦修复，需要手动启动一次构建")])]),t._v(" "),e("h2",{attrs:{id:"下载"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#下载"}},[t._v("#")]),t._v(" 下载")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fwww.jenkins.io%2Fdownload%2F",target:"_blank",rel:"noopener noreferrer"}},[t._v("www.jenkins.io/download/"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("根据平台系统下载相应的安装包，本次实例在Mac环境使用Docker进行安装。")]),t._v(" "),e("h3",{attrs:{id:"搜索jenkins镜像"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#搜索jenkins镜像"}},[t._v("#")]),t._v(" 搜索jenkins镜像")]),t._v(" "),e("div",{staticClass:"language-sql extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[t._v("docker search jenkins\n")])])]),e("h3",{attrs:{id:"拉取jenkins镜像"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#拉取jenkins镜像"}},[t._v("#")]),t._v(" 拉取jenkins镜像")]),t._v(" "),e("p",[t._v("选择镜像并进行安装")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("docker pull jenkins/jenkins\n")])])]),e("h3",{attrs:{id:"部署jenkins"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#部署jenkins"}},[t._v("#")]),t._v(" 部署jenkins")]),t._v(" "),e("div",{staticClass:"language-arduino extra-class"},[e("pre",{pre:!0,attrs:{class:"language-arduino"}},[e("code",[t._v("sudo docker "),e("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("run")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("p "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("8080")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("8080")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("p "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("50000")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("50000")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("--")]),t._v("name jenkins jenkins"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("jenkins\n")])])]),e("h3",{attrs:{id:"查看是否启动成功"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#查看是否启动成功"}},[t._v("#")]),t._v(" 查看是否启动成功")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("docker ps -l\n")])])]),e("h3",{attrs:{id:"访问jenkins"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#访问jenkins"}},[t._v("#")]),t._v(" "),e("strong",[t._v("访问Jenkins")])]),t._v(" "),e("p",[t._v("地址：127.0.0.1:8080")]),t._v(" "),e("p",[t._v("初始密码：密码在docker的jekins容器中/var/jenkins/secrets/initialAdminPassword文件保存")]),t._v(" "),e("p",[t._v("如果找不到文件也可以在jekins运行的日志中找到初始密码")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0aea0baffed644d992293348835f9bef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 14.43.06.png"}})]),t._v(" "),e("h3",{attrs:{id:"准备工作"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#准备工作"}},[t._v("#")]),t._v(" 准备工作")]),t._v(" "),e("h4",{attrs:{id:"安装插件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装插件"}},[t._v("#")]),t._v(" 安装插件")]),t._v(" "),e("p",[t._v("安装推荐插件。")]),t._v(" "),e("p",[t._v("登录完成后，进入Dashbord -> Manage Jekins选择插件进入管理插件页面，并安装如下插件：")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fnodejs",target:"_blank",rel:"noopener noreferrer"}},[t._v("NodeJS Plugin"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fpublish-over-ssh",target:"_blank",rel:"noopener noreferrer"}},[t._v("Publish Over SSH"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fextended-choice-parameter",target:"_blank",rel:"noopener noreferrer"}},[t._v("Extended Choice Parameter"),e("OutboundLink")],1),t._v(" 自定义参数化构建，可根据需要任意添加参数")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fgit-parameter",target:"_blank",rel:"noopener noreferrer"}},[t._v("Git Parameter Plug-In"),e("OutboundLink")],1),t._v(" git参数化构建，可选择分支、标签构建")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fbuild-timestamp",target:"_blank",rel:"noopener noreferrer"}},[t._v("Build Timestamp Plugin"),e("OutboundLink")],1)]),t._v(" "),e("h4",{attrs:{id:"工具配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#工具配置"}},[t._v("#")]),t._v(" 工具配置")]),t._v(" "),e("p",[t._v("Dashbord -> Manage Jekins -> Tools 选择NodeJs，安装nodejs")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3915201d904678bcf356197bb1dde6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.11.09.png"}})]),t._v(" "),e("h4",{attrs:{id:"系统配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#系统配置"}},[t._v("#")]),t._v(" 系统配置")]),t._v(" "),e("p",[t._v("Dashbord -> Manage Jekins -> System 拉到底部选择Publish over SSH，配置目标服务器信息。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43c790845eee4c7b9c4b1b98cd088db6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.16.52.png"}})]),t._v(" "),e("p",[t._v("配置时间插件")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc4ef65ffa294dceba5c17eef31ab3b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.18.24.png"}})]),t._v(" "),e("h3",{attrs:{id:"创建项目"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#创建项目"}},[t._v("#")]),t._v(" 创建项目")]),t._v(" "),e("p",[t._v("New item 选择"),e("strong",[t._v("Freestyle project")]),t._v("输入任务名称")]),t._v(" "),e("h4",{attrs:{id:"general配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#general配置"}},[t._v("#")]),t._v(" General配置")]),t._v(" "),e("h5",{attrs:{id:"git参数化配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#git参数化配置"}},[t._v("#")]),t._v(" git参数化配置")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a070cd8983c46b3a0e6f7d8f9ff9b99~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.29.09.png"}})]),t._v(" "),e("h4",{attrs:{id:"源码管理"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#源码管理"}},[t._v("#")]),t._v(" 源码管理")]),t._v(" "),e("h5",{attrs:{id:"配置git项目资源地址及权限"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#配置git项目资源地址及权限"}},[t._v("#")]),t._v(" 配置git项目资源地址及权限")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64e609ba70547759bf9574a89b1a589~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.32.00.png"}})]),t._v(" "),e("h4",{attrs:{id:"构建环境配置选择node"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#构建环境配置选择node"}},[t._v("#")]),t._v(" 构建环境配置选择node")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/680649e38d2a4190b7191d7d3c2a7a0f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.32.52.png"}})]),t._v(" "),e("h4",{attrs:{id:"build-steps"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#build-steps"}},[t._v("#")]),t._v(" Build Steps")]),t._v(" "),e("h5",{attrs:{id:"添加shell执行脚本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#添加shell执行脚本"}},[t._v("#")]),t._v(" 添加shell执行脚本")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" ./ruoyi-ui\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run build:prod\n")])])]),e("h5",{attrs:{id:"send-files-or-execute-commands-over-ssh"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#send-files-or-execute-commands-over-ssh"}},[t._v("#")]),t._v(" "),e("strong",[t._v("Send files or execute commands over SSH")])]),t._v(" "),e("p",[t._v("配置目标服务器及路径")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7ff10bc0dcb45a689c8b26c943affd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.37.35.png"}})]),t._v(" "),e("h4",{attrs:{id:"构建后操作"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#构建后操作"}},[t._v("#")]),t._v(" 构建后操作")]),t._v(" "),e("p",[t._v("构建成功后自动打tag，方便找到对应部署版本。tag内容可根据需求自己填写，我使用时间加分支形式，BUILDTIMESTAMP为当前时间，{BUILD_TIMESTAMP}为当前时间，BUILDTIMESTAMP为当前时间，{GIT_BRANCH}为分支")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5ff3d035d8f483b8f2a34d666dca2a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?",alt:"截屏2023-03-21 15.40.42.png"}})]),t._v(" "),e("h4",{attrs:{id:"保存配置并构建"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#保存配置并构建"}},[t._v("#")]),t._v(" 保存配置并构建")]),t._v(" "),e("p",[t._v("构建日志可以在控制台进行查看，如果有报错可以进行查看。")])])}),[],!1,null,null,null);a.default=r.exports}}]);