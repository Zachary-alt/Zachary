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
            { text: 'github', link: 'https://github.com/DavidZhao0618/repositories' },
        ],
        sidebar:[
            // {
            //     title: 'webpack',   // 必要的
            //     path: '/webpack/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            //     children: [
            //       ['/webpack/test','test']
            //     ]
            // },
            {
                title: 'Git',   // 必要的
                path: '/git/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/git/base','git干货'],
                  ['/git/commitizen','git-commit规范']
                ]
            },
            {
                title: 'React',   // 必要的
                path: '/react/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/react/base','react干货'],
                  ['/react/component','组件化']
                ]
            },
        ]
    }
}