# 持续集成-jekins

使开发者从繁杂的集成中解脱出来，专注于更为重要的业务逻辑实现上

持续集成的原则

1. 需要版本控制软件保障团队成员提交的代码不会导致集成失败。常用的版本控制软件有 svn,Git, ClearCase 等；
2. 需要有专门的集成服务器来执行集成构建。根据项目的具体实际，集成构建可以被软件的修改来直接触发，也可以定时启动，如每半个小时构建一次；
3. 必须保证构建的成功。如果构建失败，修复构建过程中的错误是优先级最高的工作。一旦修复，需要手动启动一次构建

## 下载

[www.jenkins.io/download/](https://link.juejin.cn?target=https%3A%2F%2Fwww.jenkins.io%2Fdownload%2F)

根据平台系统下载相应的安装包，本次实例在Mac环境使用Docker进行安装。

### 搜索jenkins镜像

```sql
docker search jenkins
复制代码
```

### 拉取jenkins镜像

选择镜像并进行安装

```bash
docker pull jenkins/jenkins
复制代码
```

### 部署jenkins

```arduino
sudo docker run -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins
复制代码
```

### 查看是否启动成功

```
docker ps -l
复制代码
```

### **访问Jenkins**

地址：127.0.0.1:8080

初始密码：密码在docker的jekins容器中/var/jenkins/secrets/initialAdminPassword文件保存

如果找不到文件也可以在jekins运行的日志中找到初始密码

![截屏2023-03-21 14.43.06.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0aea0baffed644d992293348835f9bef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 准备工作

#### 安装插件

安装推荐插件。

登录完成后，进入Dashbord -> Manage Jekins选择插件进入管理插件页面，并安装如下插件：

[NodeJS Plugin](https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fnodejs)

[Publish Over SSH](https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fpublish-over-ssh)

[Extended Choice Parameter](https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fextended-choice-parameter) 自定义参数化构建，可根据需要任意添加参数

[Git Parameter Plug-In](https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fgit-parameter) git参数化构建，可选择分支、标签构建

[Build Timestamp Plugin](https://link.juejin.cn?target=https%3A%2F%2Fplugins.jenkins.io%2Fbuild-timestamp)

#### 工具配置

Dashbord -> Manage Jekins -> Tools 选择NodeJs，安装nodejs

![截屏2023-03-21 15.11.09.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3915201d904678bcf356197bb1dde6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 系统配置

Dashbord -> Manage Jekins -> System 拉到底部选择Publish over SSH，配置目标服务器信息。

![截屏2023-03-21 15.16.52.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43c790845eee4c7b9c4b1b98cd088db6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

配置时间插件

![截屏2023-03-21 15.18.24.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc4ef65ffa294dceba5c17eef31ab3b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 创建项目

New item 选择**Freestyle project**输入任务名称

#### General配置

##### git参数化配置

![截屏2023-03-21 15.29.09.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a070cd8983c46b3a0e6f7d8f9ff9b99~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 源码管理

##### 配置git项目资源地址及权限

![截屏2023-03-21 15.32.00.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64e609ba70547759bf9574a89b1a589~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 构建环境配置选择node

![截屏2023-03-21 15.32.52.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/680649e38d2a4190b7191d7d3c2a7a0f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### Build Steps

##### 添加shell执行脚本

```bash
cd ./ruoyi-ui
npm i
npm run build:prod
复制代码
```

##### **Send files or execute commands over SSH**

配置目标服务器及路径

![截屏2023-03-21 15.37.35.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7ff10bc0dcb45a689c8b26c943affd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 构建后操作

构建成功后自动打tag，方便找到对应部署版本。tag内容可根据需求自己填写，我使用时间加分支形式，BUILDTIMESTAMP为当前时间，{BUILD_TIMESTAMP}为当前时间，BUILDTIMESTAMP为当前时间，{GIT_BRANCH}为分支

![截屏2023-03-21 15.40.42.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5ff3d035d8f483b8f2a34d666dca2a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 保存配置并构建

构建日志可以在控制台进行查看，如果有报错可以进行查看。

