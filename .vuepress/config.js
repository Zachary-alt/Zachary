module.exports = {
    base:'/zachary/',
    title: 'Zachary',
    description: '前端学习笔记',
    themeConfig: {
        lastUpdated: 'Last Updated',
        logo: '/assets/img/logo.jpg',
        nav: [
            { text: '首页', link: './' },
            // { text: '最新', link: '/guide/' },
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
            {
                text: 'webpack',link: '/webpack/',
                items: [
                    { text: '概览', link: '/webpack/' },
                    { text: '原理分析', link: '/webpack/source/' },
                ]
            },
            { text: 'github', link: 'https://github.com/Zachary-alt' },
        ],
        sidebar:'auto',
        displayAllHeaders: true
    }
}