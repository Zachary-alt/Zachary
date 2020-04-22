module.exports = {
    base:'/',
    title: 'Zachary',
    description: 'Zachary.cn',
    themeConfig: {
        lastUpdated: 'Last Updated',
        logo: '/assets/img/logo.jpg',
        nav: [
            { text: '首页', link: '/' },
            { text: '最新', link: '/guide/' },
            { text: 'github', link: 'https://github.com/DavidZhao0618/repositories' },
        ],
        sidebar:[
            {
                title: 'webpack',   // 必要的
                path: '/webpack/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                children: [
                  ['/webpack/test','test']
                ]
              },
        ]
    }
}