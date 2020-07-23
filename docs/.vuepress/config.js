module.exports = {
  title: '毛金宇的博客',
  description: '前端知识笔记',
  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }]
  ],
  // 主题配置
  themeConfig: {
    // HOME页logo
    // logo: '/img/logo.jpg',
    // 最新更新时间
    lastUpdated: 'Last Updated', // string | boolean
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    // nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    // prevLinks: true,
    // HOME页导航栏
    sidebarDepth: 2,
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: '笔记',
        link: '/start/'
      },
      {
        text: '面试题',
        link: '/interviewQuestions/'
      }
    ],
    // 侧边栏
    sidebar: {
      '/start': [
        {
          title: "HTML",
          collabsable: true,
          children: [
            ['/start/html/', 'html'],
            ['/start/html/canvas', 'Canvas']
          ]
        },
        {
          title: "CSS",
          collabsable: true,
          children: [
            ['/start/css/', "Flex布局"],
            ['/start/css/adaptation', "移动端适配方案"]
          ]
        },
        {
          title: 'JavaScript',
          collabsable: true,
          children: [
            ['/start/js/es6', 'ES6'],
            ['/start/js/module', '模块化'],
            ['/start/js/data-structure', '数据结构'],
            ['/start/js/', '闭包']
          ]
        },
        {
          title: '网络协议',
          collabsable: true,
          children: [
            {
              title: 'HTTP',
              collabsable: true,
              children: [
                ['/start/http/', 'HTTP协议'],
                ['/start/http/http-cache', 'HTTP缓存'],
              ]
            },
            {
              title: 'WebSoket',
              collabsable: true,
              path: '/start/http/websoket'
            }
          ]
        },
        {
          title: 'TypeScript',
          collabsable: true,
          children: [
            ['/start/js/typescript', '基本语法'],
            ['/start/js/project+ts', '框架中使用TypeScript']
          ]
        },
        {
          title: '项目',
          collabsable: true,
          children: [
            ['/start/project/jenkins', 'Jenkins']
          ]
        }
      ],
      '/interviewQuestions': [
        {
          title: "JS",
          collabsable: true,
          path: '/interviewQuestions/JS'
        },
        {
          title: "浏览器",
          collabsable: true,
          path: '/interviewQuestions/Browser'
        },
        {
          title: "Vue",
          collabsable: true,
          children: [
            ['/interviewQuestions/Vue/Vue', 'Vue'],
            ['/interviewQuestions/Vue/Vuex', 'Vuex']
          ]
        },
        {
          title: "项目",
          collabsable: true,
          path: '/interviewQuestions/project'
        }
      ]
    }
  }
}