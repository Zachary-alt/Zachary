module.exports = {
    base:'/zachary/',
    title: 'Zachary',
    description: 'Zachary.cn',
    themeConfig: {
        lastUpdated: 'Last Updated',
        logo: '/assets/img/logo.jpg',
        nav: [
            { text: '首页', link: './' },
            { text: '最新', link: '/guide/' },
            { 
                text: 'babel', 
                link: '/babel/',
                items: [
                    { text: '概览', link: '/babel/' },
                    { text: '集成', link: '/babel/integration/' },
                    { text: 'Presets', link: '/babel/presets/' },
                    { text: '工具', link: '/babel/tools/' },
                    { text: 'Babel 用户手册', link: '/babel/user/' },
                    { text: 'Babel 插件手册', link: '/babel/plugin/' },
                ]
            },
            {text: '前端设计模式',link: '/design/'},
            {text: '前端算法和数据结构', link: '/algorithm/'},
            { text: 'github', link: 'https://github.com/Zachary-alt' },
        ],
        sidebar:[
            {
                title: 'Git',   // 必要的
                path: '/git/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/git/commitizen','git-commit规范']
                ]
            }, 
            {
                title: 'Vue',   // 必要的
                path: '/vue/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/vue/base','vue干货'],
                  ['/vue/source','源码解析'],
                  ['/vue/other','补充']
                ]
            },
            {
                title: 'React',   // 必要的
                path: '/react/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/react/base','react干货'],
                  ['/react/component','组件化'],
                  ['/react/redux','redux'],
                  ['/react/router','router'],
                  ['/react/umi','umi']
                ]
            },
            {
                title: 'ReactNative',   // 必要的
                path: '/reactNative/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            },
            {
                title: '可视化',   // 必要的
                path: '/visualization/',
                children: [
                    ['/visualization/canvas','canvas'],
                    ['/visualization/konva','konva'],
                  ]
            },
            {
                title: '微前端',
                path: '/microFrontend/'
            },
            {
                title: 'Node',   // 必要的
                path: '/node/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/node/http','网络编程'],
                  ['/node/mySql','mySql'],
                  ['/node/mongodb','mongodb'],
                ]
            },
            {
                title: 'Docker',   // 必要的
                path: '/docker/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/docker/mysql','搭建mysql服务'],
                ]
            },
        ]
    }
}