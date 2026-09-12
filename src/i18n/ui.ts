import { servedPath } from '@/lib/url'

export const languages = {
  zh: '中',
  en: 'EN'
} as const

export const defaultLang = 'zh' as const

export type Lang = keyof typeof languages

export const ui = {
  zh: {
    'nav.blog': 'Blog',
    'nav.notes': 'Notes',
    'nav.curated': 'Curated',
    'nav.projects': 'Projects',
    'nav.links': 'Links',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'nav.toggleMenu': 'Menu',
    'nav.toggleDarkMode': '切换主题',
    'theme.system': '自动',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'nav.toggleLang': '切换语言',
    'nav.homeProjects': '项目',
    'nav.homeExperience': '经历',
    'nav.homeWriting': '写作',
    'nav.homeAbout': '关于',
    'nav.homeContact': '联系',
    'nav.openMenu': '打开导航菜单',
    'nav.closeMenu': '关闭导航菜单',
    'notice.translating': '网站界面已提供英文版，但大部分博客与笔记仍为中文，翻译正在进行中。',
    'home.title': '首页',
    'back.home': '← 返回首页',
    'back.blog': '← 返回博客',
    'back.notes': '← 返回笔记',
    'sidebar.toggle': '切换侧边栏',
    'backToTop': '返回顶部',
    'blog.prev': '← 上一页',
    'blog.next': '下一页 →',
    'blog.pageInfo': '第 {current} 页 · 本页 {count} 篇 · 共 {total} 篇',
    'blog.tags': '标签',
    'blog.viewAll': '查看全部 →',
    'blog.listAria': '博客文章列表',
    'blog.categoriesAria': '查看全部博客分类',
    'blog.empty': '还没有文章。',
    'notes.empty': '还没有笔记。',
    'tags.empty': '还没有标签。',
    'tags.prev': '← 上一页',
    'tags.next': '下一页 →',
    'search.title': '搜索',
    'search.desc': '输入关键词搜索博客文章。',
    'search.meta': '搜索整个博客的文章',
    'notFound.title': '页面不存在',
    'notFound.desc': '你访问的页面可能已被移动或删除。',
    'notFound.home': '返回首页'
  },
  en: {
    'nav.blog': 'Blog',
    'nav.notes': 'Notes',
    'nav.curated': 'Curated',
    'nav.projects': 'Projects',
    'nav.links': 'Links',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'nav.toggleMenu': 'Menu',
    'nav.toggleDarkMode': 'Switch theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'nav.toggleLang': 'Switch language',
    'nav.homeProjects': 'Projects',
    'nav.homeExperience': 'Experience',
    'nav.homeWriting': 'Writing',
    'nav.homeAbout': 'About',
    'nav.homeContact': 'Contact',
    'nav.openMenu': 'Open navigation menu',
    'nav.closeMenu': 'Close navigation menu',
    'notice.translating':
      "The site's interface is available in English, but most posts and notes are still in Chinese — translation is a work in progress.",
    'home.title': 'Home',
    'back.home': '← Back to home',
    'back.blog': '← Back to blog',
    'back.notes': '← Back to notes',
    'sidebar.toggle': 'Toggle sidebar',
    'backToTop': 'Back to Top',
    'blog.prev': '← Previous Posts',
    'blog.next': 'Next Posts →',
    'blog.pageInfo': 'Page {current} - Showing {count} of {total} posts',
    'blog.tags': 'Tags',
    'blog.viewAll': 'View all →',
    'blog.listAria': 'Blog posts list',
    'blog.categoriesAria': 'View all blog categories',
    'blog.empty': 'No posts yet.',
    'notes.empty': 'No note entries yet.',
    'tags.empty': 'No tags yet.',
    'tags.prev': '← Previous',
    'tags.next': 'Next →',
    'search.title': 'Search',
    'search.desc': 'Enter a search term or phrase to search the blog.',
    'search.meta': 'Search posts across the blog',
    'notFound.title': 'Page not found.',
    'notFound.desc': 'This page may have been moved or deleted.',
    'notFound.home': 'Back to home'
  }
} as const satisfies Record<Lang, Record<string, string>>

export function getLangFromUrl(url: URL | string): Lang {
  const raw = typeof url === 'string' ? url : url.pathname
  // `build.format: 'file'` means the /en page reports itself as `/en.html`, so
  // normalize before reading the leading segment — otherwise every English
  // page falls back to the default language.
  const pathname = servedPath(raw)
  const first = pathname.split('/').filter(Boolean)[0]
  if (first === 'en') return 'en'
  return defaultLang
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key]
  }
}

export function stripLangPrefix(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

export function withLangPrefix(pathname: string, lang: Lang): string {
  const bare = stripLangPrefix(pathname)
  if (lang === defaultLang) return bare
  if (bare === '/') return '/en'
  return `/en${bare}`
}

export function localizedPath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path
  if (path === '/') return '/en'
  return `/en${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Whether a bare (zh-form) path has a real `/en` mirror page.
 *
 * Drives hreflang + og:locale:alternate emission: we only declare an English
 * alternate for pages that genuinely exist in both languages. Chinese-only
 * content — blog posts, note entries, tag/year indexes — returns false so we
 * never fabricate an `/en/...` URL that 404s and never claim a translation that
 * isn't there. When a post is actually translated later, extend this.
 */
export function hasEnAlternate(barePath: string): boolean {
  if (barePath === '/') return true
  if (
    [
      '/about',
      '/projects',
      '/experience',
      '/links',
      '/contact',
      '/search',
      '/curated',
      '/tags'
    ].includes(barePath)
  )
    return true
  // blog & notes: only the paginated list is mirrored under /en, not detail pages
  if (/^\/blog(\/\d+)?$/.test(barePath)) return true
  if (/^\/notes(\/\d+)?$/.test(barePath)) return true
  // project case pages are authored in both languages from src/data/home.ts
  if (/^\/projects\/[^/]+$/.test(barePath)) return true
  // /tags/<tag> detail pages are NOT mirrored: en posts carry translated tag
  // names, so there is no 1:1 /en/tags/<zh-tag> URL
  return false
}
