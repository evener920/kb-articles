import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar';

const siteName = '文章库';
const siteDescription = 'Notion 同步文章 · VitePress 渲染 · Cloudflare 静态站';
const siteUrl = 'https://articles.201573.xyz/';

export default defineConfig({
  title: siteName,
  description: siteDescription,
  lang: 'zh-CN',
  // 自定义子域根路径部署
  base: '/',
  outDir: './.vitepress/dist',
  cleanUrls: true,
  lastUpdated: true,
  // 【2026-10-09】自动同步的内容站：文章可能含任意外链（含失效/localhost 链接），
  // 不能因单篇死链就让整站构建失败。关闭死链致命检查。
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#2f5d50' }],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '标签', link: '/tags/' },
      { text: 'GitHub', link: 'https://github.com/evener920/kb-articles' },
    ],
    sidebar,
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: '目录',
    },
    lastUpdated: {
      text: '最后更新于',
    },
    editLink: {
      pattern: 'https://github.com/evener920/kb-articles/edit/main/articles/:path',
      text: '在 GitHub 编辑源文',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/evener920/kb-articles' },
    ],
    footer: {
      message: '文章库',
      copyright: '由 Notion → GitHub → VitePress 自动构建',
    },
  },
});
