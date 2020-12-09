module.exports = ctx => ({
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '浪淘沙令',
      description: '最怕问初衷，大梦成空，眉间鬓上老英雄。剑甲鞮鍪封厚土，说甚擒龙。壮志付西风，逝去无踪，少年早做一闲翁。诗酒琴棋终日里，岁月匆匆。'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  theme: '@vuepress/vue',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    editLinks: false,
    docsDir: 'packages/docs/docs',
    algolia: ctx.isProd ? ({
      apiKey: '3a539aab83105f01761a137c61004d85',
      indexName: 'vuepress'
    }) : null,
    smoothScroll: true,
    nextLinks: true,
    prevLinks: true,
    displayAllHeaders: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: require('./nav/zh'),
        sidebar: 'auto'
      }
    }
  },
})
