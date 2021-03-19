module.exports = {
    base:'/zachary/',
    title: 'Zachary',
    description: 'Zachary.cn',
    themeConfig: {
        lastUpdated: 'Last Updated',
        logo: '/assets/img/logo.jpg',
        nav: [
            { text: '首页', link: './' },
            { text: '最新', link: './guide/' },
            { text: 'github', link: 'https://github.com/DavidZhao0618' },
        ],
        sidebar:[
            {
                title: 'Git',   // 必要的
                path: '/git/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/git/base','git干货'],
                  ['/git/commitizen','git-commit规范']
                ]
            },
            {
                title: '前端设计模式',   // 必要的
                path: '/design/'
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
                title: 'Node',   // 必要的
                path: '/node/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/node/http','网络编程']
                ]
            },
            {
                title: '前端算法和数据结构',   // 必要的
                path: '/algorithm/'
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