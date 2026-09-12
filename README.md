# ygrowly.github.io

刘宇广的个人网站 —— AI 应用开发 / Agent 工程方向的求职展示，兼技术写作。

面向两类读者：HR 与筛选者（30 秒内要知道「做什么方向、什么时候能来、怎么联系」），以及技术面试官（要看到可验证的工程判断，而不是形容词）。

## 内容

- **Projects** —— 5 个系统案例：EnergyOps Agent、数驭穹图、RuleArena、PayTrace、Ovanta。每个案例都写了设计取舍（决定 / 为什么 / 代价）、非目标清单和开放问题；RuleArena 另有一张可交互系统图。
- **Blog / Notes** —— Agent 运行时、评测方法论、源码阅读的成稿与半成品。
- **Experience / About / Contact** —— 经历与职责范围、教育背景、技术栈、联系方式。

## 技术栈

Astro 5 + TypeScript，静态输出。交互部分用 React islands（首页终端、dev mode）与少量原生 Web Components（导航）。样式走 UnoCSS + 语义 token，Night Chapter 用 Three.js。

## 常用命令

```shell
bun install
bun dev                # 开发服务器
bun run build          # 构建到 dist/
bun preview            # 预览已构建的 dist/
bun test src/          # 单元测试
bun run check          # astro check + 类型检查（提交前必跑）
bun run format
bun run lint
```

## 部署

| | 位置 | 触发 |
|---|---|---|
| 生产 | GitHub Pages → https://ygrowly.github.io | push 到 `main`，由 `.github/workflows/deploy.yml` 构建 |
| 预览 | Cloudflare Pages → `<分支名>.ygrowly.pages.dev` | 任意分支 push，公开可访问 |

**不要用 Vercel 或 `*.workers.dev`**：这两个域在国内被 DNS 污染，站点部署成功也打不开。判断某个域是否可用，要看**编造的子域解析到谁的 IP**，而不是看是否 NXDOMAIN。

Cloudflare Pages 的构建命令必须写成 `bun install && bun run build` —— 只写 `bun run build` 会因为跳过依赖安装而 `astro: not found`。Build output directory 填 `dist`，Root directory 留空，环境变量 `NODE_VERSION=22`。

站内 URL 一律不带尾斜杠、不带 `.html`（`build.format: 'file'` + `src/lib/url.ts`）；引用 `public/` 下的静态资源时**不带扩展名**，这是 GitHub Pages 与 Cloudflare Pages 的公约数。

## 目录

```
src/content/blog/      正式文章，一篇文章一个文件夹（post.mdx + 同目录图片）
src/data/home.ts       首页与项目案例的全部文案（中英双语，同文件内成对维护）
src/diagrams/          Archify 系统图源文件（JSON），产物交付到 public/diagrams/
src/lib/               纯函数与状态逻辑，配套 *.test.ts
src/components/        按页面区域分组
public/                静态资源（favicon、图片、已交付的系统图）
```

## 约定文档

- `DESIGN.md` —— 颜色/排版/动效的 UI 约定，加新交互前先看这份
- `ANALYTICS.md` —— 埋点契约，改事件名或新增事件前先看这份
- `CLAUDE.md` —— 协作与提交流程

## 许可

代码基于 Apache 2.0。文章、图片、二维码与个人内容不在授权范围内。
