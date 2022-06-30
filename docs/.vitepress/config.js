export default {
  title: "前端博客",
  description: "前端知识笔记",
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  // 主题配置
  themeConfig: {
    // HOME页logo
    // logo: '/img/logo.jpg',
    // 最新更新时间
    lastUpdatedText: "上次更新：", // string | boolean
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    // nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    // prevLinks: true,
    // HOME页导航栏
    // sidebarDepth: 2,
    nav: [
      {
        text: "Webpack源码",
        link: "/webpackSource/"
      },
      {
        text: "React源码",
        link: "/reactSource/"
      },
      {
        text: "笔记",
        link: "/start/html/"
      },
      {
        text: "面试题",
        link: "/interviewQuestions/base"
      }
    ],
    // 侧边栏
    sidebar: {
      "/start/": [
        {
          text: "DOM",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "HTML", link: "/start/html/" },
            { text: "Canvas", link: "/start/html/canvas" }
          ]
        },
        {
          text: "CSS",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "Flex布局", link: "/start/css/" },
            { text: "移动端适配方案", link: "/start/css/adaptation" }
          ]
        },
        {
          text: "JavaScript",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "ES6", link: "/start/js/es6" },
            { text: "模块化", link: "/start/js/module" },
            { text: "数据结构", link: "/start/js/data-structure" },
            { text: "闭包", link: "/start/js/" }
          ]
        },
        {
          text: "TypeScript",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "基本语法", link: "/start/js/typescript" },
            { text: "框架中使用TypeScript", link: "/start/js/project+ts" }
          ]
        },
        {
          text: "网络协议",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "HTTP协议", link: "/start/http/" },
            { text: "HTTP缓存", link: "/start/http/http-cache" },
            { text: "WebSocket", link: "/start/http/websocket" }
          ]
        },
        {
          text: "框架",
          collapsed: true,
          collapsible: true,
          items: [
            {
              text: "Vue",
              link: "/start/framework/Vue/Vue3"
            },
            {
              text: "React",
              link: "/start/framework/Vue/Vue3"
            }
          ]
        },
        {
          text: "工具",
          collapsed: true,
          collapsible: true,
          items: [
            { text: "Jenkins", link: "/start/project/jenkins" },
            { text: "Git", link: "/start/project/git" },
            { text: "Webpack4", link: "/start/project/webpack" },
            { text: "Gulp4", link: "/start/project/gulp" },
            { text: "Vite", link: "/start/project/vite" },
            { text: "Mock", link: "/start/project/mock" },
            { text: "Nginx", link: "/start/project/nginx" }
          ]
        }
      ],
      "/interviewQuestions": [
        {
          text: "面试题",
          items: [
            {
              text: "基础",
              link: "/interviewQuestions/base"
            },
            {
              text: "语法",
              link: "/interviewQuestions/syntax"
            },
            {
              text: "浏览器",
              link: "/interviewQuestions/browser"
            },
            {
              text: "框架",
              link: "/interviewQuestions/frame"
            },
            {
              text: "工程",
              link: "/interviewQuestions/project"
            },
            {
              text: "网络",
              link: "/interviewQuestions/internet"
            },
            {
              text: "性能",
              link: "/interviewQuestions/performance"
            },
            {
              text: "插件",
              link: "/interviewQuestions/plugin"
            }
          ]
        }
      ],
      "/webpackSource": [
        {
          text: "Webpack源码",
          items: [
            {
              text: "基础知识",
              link: "/webpackSource/"
            },
            {
              text: "源码调试",
              link: "/webpackSource/debugger"
            },
            {
              text: "优化",
              link: "/webpackSource/optimization"
            }
          ]
        },
        {
          text: "源码学习",
          collapsible: true,
          items: [
            { text: "Webpack-cli", link: "/webpackSource/source/webpack-cli" },
            { text: "Webpack", link: "/webpackSource/source/webpack" },
            { text: "内置插件", link: "/webpackSource/source/plugins" },
            {
              text: "ModuleFactory",
              link: "/webpackSource/source/moduleFactory"
            },
            { text: "Module", link: "/webpackSource/source/module" }
          ]
        }
      ],
      "/reactSource": [
        {
          text: "源码调试",
          collapsible: true,
          link: "/reactSource/"
        }
      ]
    }
  }
};

// home: true
// heroText: 前端学习笔记
// tagline: 一份随笔
// actionText: 开始学习吧
// actionLink: /start/css/
// footer: MIT Licensed | Copyright © 京ICP备20024791号-1 MrMJY