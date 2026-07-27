# 03：组件、状态与交互规格

## 1. 组件边界

组件名称是职责约定。若仓库已有等价组件，修改原组件，不创建重复实现。

```text
HomePage
├─ SiteHeader
├─ HeroSection
│  ├─ HeroCopy
│  ├─ HeroActions
│  ├─ HeroStatus
│  └─ HeroTerminal
├─ SelectedSystems
│  ├─ ProjectNarrative
│  ├─ ProjectFlow
│  └─ ProjectEvidence
├─ ExperienceSection
│  ├─ ExperienceRow
│  └─ LabProjectCard
├─ WritingSection
│  ├─ FeaturedPost
│  ├─ NoteRow
│  └─ TalksStrip
├─ ProfileSection
├─ ContactSection
└─ SiteFooter
```

内容数据与视图分离：

- 项目、经历、Lab、Profile 文案不得硬编码散落在多个组件中；
- 中英文内容分别从现有 i18n/content 数据源读取；
- Blog 和 Notes 必须从现有内容集合读取；
- Terminal 命令可引用统一的路由和内容配置，不能另存一份易失同步的链接表。

## 2. SiteHeader

### 状态

```text
top
scrolled
mobile-open
mobile-closed
light-theme
dark-theme
```

### 行为

- 页面顶部时背景透明；
- 滚动超过 `24px` 后：
  - Light 使用 `rgba(244, 242, 236, 0.88)`；
  - Dark 使用 `rgba(17, 21, 19, 0.88)`；
  - 加 `backdrop-filter: blur(12px)`；
  - 加底边框；
- 不因进入项目剧场自动改变全局主题；
- 当项目剧场位于导航下方时，导航仅切换为适合局部背景的可读前景色；
- 离开剧场恢复当前主题前景色；
- 主题按钮必须更新已有主题状态和持久化值，不新建第二套主题状态。

### 当前区块

- 使用 IntersectionObserver 更新当前锚点；
- 仅通过字体颜色和 `2px` 下划线表示；
- 不修改浏览器 URL；
- 不在页面加载时自动滚动。

## 3. Hero

### 首屏呈现顺序

页面首次渲染必须立即包含：

1. 姓名与职位；
2. 主标题；
3. 描述；
4. 简历和项目入口；
5. Terminal 默认结果。

Terminal JavaScript 未加载或执行失败时，这些信息仍然可见。

### 简历链接

- 使用 `<a>`；
- `target="_blank"`；
- `rel="noopener noreferrer"`；
- 不用 JavaScript 拦截后再下载；
- 文件不存在时在构建或测试阶段报错，不静默链接到 404。

## 4. Terminal

### 保留原则

- 复用现有 Terminal、DevMode、虚拟文件系统和命令解析器；
- 不创建只有动画、不能输入的第二个终端；
- 不删除任何已有公开命令；
- 新命令使用别名或命令注册方式接入；
- 不读取真实本地文件、环境变量、仓库密钥或构建时私有配置。

### 状态机

```text
static
→ demo-pending
→ demo-running
→ interactive
```

进入页面：

1. SSR/静态 HTML 先输出默认内容；
2. 客户端挂载后等待 `800ms`；
3. 如果用户没有交互且不属于 reduced-motion，进入 demo-running；
4. 演示只输入一条命令：`cat focus.md`；
5. 总演示时间不得超过 `4s`；
6. 演示结束进入 interactive。

下列任意事件立即取消演示并进入 interactive：

- 点击 Terminal；
- Terminal 获得键盘焦点；
- 用户输入；
- 页面滚动超过 `40px`；
- 切换主题或语言；
- 页面变为后台标签页。

取消后不重新自动播放，当前会话中使用 `sessionStorage` 记录。

### 演示命令输出

中文：

```bash
$ cat focus.md
Agent Engineering
Python Backend
Data Systems
Observable · Recoverable · Testable
```

英文相同。

### 命令清单

| 命令 | 行为 |
|---|---|
| `help` | 列出下面所有公开命令及一句话说明 |
| `whoami` | 显示姓名、定位、届别 |
| `about` | 显示个人主张，并提供 About 路径 |
| `projects` | 列出 EnergyOps、数驭穹图、PayTrace |
| `open energyops-agent` | 跳转 EnergyOps 详情页 |
| `open ai-bi-platform` | 跳转数驭穹图详情页 |
| `open paytrace` | 跳转 PayTrace 详情页 |
| `experience` | 输出三段经历的时间、公司和一句职责 |
| `writing` | 输出最新 Blog 和最新三条 Notes |
| `skills` | 输出 Backend 与 AI Engineering 两行 |
| `resume` | 输出简历链接，并在用户确认或点击链接后新标签打开；不能由自动演示触发 |
| `github` | 输出 GitHub 链接 |
| `contact` | 输出邮箱和求职状态 |
| `theme` | 输出当前主题和可用参数 |
| `theme light` | 切换到 Light |
| `theme dark` | 切换到 Dark |
| `theme system` | 跟随系统 |
| `lang zh` | 跳转当前页中文对应路由 |
| `lang en` | 跳转当前页英文对应路由 |
| `clear` | 清空输出并保留输入行 |
| `devmode` | 进入或提示现有 DevMode |

命令要求：

- 大小写不敏感；
- 首尾空格忽略；
- 连续空格归一化；
- 未知命令显示：

```text
Command not found: {command}
Type "help" to see available commands.
```

- 输入历史支持 `↑ / ↓`；
- `Ctrl+L` 等同 `clear`；
- `Esc` 退出命令建议或 DevMode 浮层；
- Terminal 不自动抢焦点；
- Terminal 区域有可见标签，例如 `aria-label="Interactive portfolio terminal"`；
- 状态变化通过 `aria-live="polite"` 宣布，但连续打字动画字符不逐字播报。

### 移动端 Terminal

- 默认只显示 `whoami`、`ls systems/` 与快捷命令；
- 快捷命令为 `Projects / Resume / Contact` 三个可点击文本按钮；
- 点击输入区才展开完整命令输入；
- 不显示完整虚拟文件树；
- DevMode 入口放入帮助菜单，不占标题栏主位置。

## 5. Selected Systems

### 桌面 Sticky Scroll：`>= 1024px`

结构：

- 区块标题正常滚动；
- 项目舞台为两列：
  - 左侧叙述 `5/12`；
  - 右侧视觉证据 `7/12`；
- 右侧证据面板 `position: sticky`；
- `top: 112px`；
- 最大高度 `calc(100vh - 144px)`；
- 每个项目叙述块最小高度 `90vh`；
- 两个项目正常位于文档流中；
- 不拦截滚轮；
- 不改变滚动速度；
- 不锁定 body；
- 不做横向页面移动。

激活规则：

- 项目叙述块中心进入视口 `35%–65%` 区间时激活；
- 同一时刻只激活一个项目；
- 从项目 1 切到项目 2 时，右侧内容在 `240ms` 内做透明度切换；
- 不缩放、不旋转、不视差移动；
- 激活状态不能隐藏另一个项目的正文。

### 平板和移动端：`< 1024px`

- 取消 `position: sticky`；
- 每个项目按照“标题 → 描述 → 流程 → 证据面板 → CTA”纵向排列；
- 两个项目间距 `80px`；
- 不使用 IntersectionObserver 控制可见内容。

### 项目流程

- 桌面允许一行或两行排列；
- 移动端纵向排列；
- 每一步为普通文字与连接线；
- 不使用需要 Hover 才出现的解释；
- Accent 只用于当前项目的连接线和状态点。

### Evidence 面板

EnergyOps 使用四行指标面板。数驭穹图使用系统链路和技术栈面板。

若存在脱敏真实截图：

- 截图作为主区域；
- 证据指标固定放在截图下方；
- 图片必须有有意义的 alt；
- 不在图片内重复大段正文。

若没有截图：

- 直接使用文本证据面板；
- 不显示“图片即将上线”；
- 不生成占位插画。

## 6. ExperienceRow

### 默认状态

- 显示时间、公司、职位和一条核心贡献；
- 关键信息全部可见；
- 箭头按钮带 `aria-expanded="false"`。

### 展开状态

- 只展开规范中的一条“重点”；
- 动画仅为高度和透明度 `180ms`；
- 同时允许多行展开；
- 页面刷新后不保存展开状态；
- reduced-motion 下立即展开。

整行不作为一个模糊大按钮。只有公司/项目详情链接和展开按钮可点击。

## 7. LabProjectCard

- 卡片整体可点击时必须使用链接元素；
- 状态始终可见；
- PayTrace 的 `Building` 不使用“即将上线”等营销词；
- 外链右上角使用 `↗`，站内链接使用 `→`；
- Hover 不展示新的关键事实。

## 8. Writing

### 数据规则

- `FeaturedPost`：按发布日期倒序选第一篇已发布 Blog；
- 次要 Blog：选第二篇；
- Notes：按更新时间倒序选前三条已发布 Notes；
- 草稿、未来发布日期和无 slug 内容不得进入首页；
- 中英文分别从各自可用内容中选择；
- 英文内容不足时不自动翻译中文文章。

### 空状态

如果某语言没有 Blog：

```text
Writing is being prepared.
Browse notes or switch language.
```

如果没有 Notes：

```text
Notes are being organized.
```

空状态使用普通文字，不显示空白卡和插画。

### 交互

- 不做拖动、叠卡或自动轮播；
- 卡片 Hover 上移 `4px`；
- 标题、摘要、日期均属于链接可点击区域；
- 链接 Focus 有清晰边框；
- 图片为装饰时使用空 alt，承载内容时使用描述 alt。

## 9. TalksStrip

- 有内容时显示；
- 无内容时整个区块不渲染；
- 最多三条；
- 每条显示类型、标题、日期；
- 不使用水平自动滚动；
- 移动端纵向排列。

## 10. Theme

主题优先级继续沿用现有实现：

```text
用户显式选择
> 已持久化选择
> 系统 prefers-color-scheme
> Light 默认值
```

项目剧场：

- 只使用局部 CSS 变量；
- 不写入主题存储；
- 不改变 `<html data-theme>`；
- 导航局部可读性通过 `data-over-theater` 或等价状态解决；
- 离开剧场后清除局部状态。

主题切换时：

- 不显示全屏遮罩；
- 只做颜色 `150ms` 过渡；
- reduced-motion 下立即切换；
- Terminal 内容和输入状态保持不变。

## 11. Language

- 当前页面存在对应语言时，切换到对应页面；
- 不存在对应翻译时：
  - 中文切英文：跳到 `/en`；
  - 英文切中文：跳到 `/`；
- 不产生 404；
- 不使用机器翻译临时填充；
- 设置 `html[lang="zh-CN"]` 或 `html[lang="en"]`；
- 每个双语页面输出 canonical 和互相对应的 `hreflang`；
- 语言切换按钮的可访问名称必须包含目标语言。

## 12. SEO 与分享

中文首页 title：

```text
刘宇广｜AI 应用开发、Python 后端与 Agent Engineering
```

中文 description：

```text
刘宇广的个人网站：园区能耗、企业 AI BI、Agent 工程、Python 后端、开源实践与技术写作。
```

英文 title：

```text
Yuguang Liu | AI Application & Python Backend Engineer
```

英文 description：

```text
Portfolio of Yuguang Liu, focused on agent engineering, Python backends, data systems, open source, and technical writing.
```

Open Graph：

- 优先使用现有个人品牌 OG 图；
- 无 OG 图时使用网站名称、主张和固定配色生成的现有模板；
- 不使用头像、公司 Logo 拼贴或项目内部截图；
- OG 图尺寸 `1200 × 630`。

结构化数据：

- 使用 `Person`；
- `name`: `Yuguang Liu`；
- `alternateName`: `刘宇广, Ygrowly`；
- `url`: 使用部署后的正式域名；
- `sameAs`: GitHub；
- `email`: 可使用公开邮箱；
- 不添加未获得的职位、奖项或公司雇佣关系。

