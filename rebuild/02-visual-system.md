# 02：视觉系统与响应式规格

## 1. 设计语言

固定关键词：

```text
克制
清晰
编辑感
工程化
持续生长
局部惊喜
```

网站框架保持低饱和度，项目截图或真实工程图可以保留自身颜色。禁止使用大面积渐变、玻璃拟态和无意义光效。

## 2. 设计令牌

### 颜色

```css
:root,
[data-theme="light"] {
  --bg-page: #F4F2EC;
  --bg-surface: #FBFAF6;
  --bg-elevated: #FFFFFF;
  --text-primary: #151817;
  --text-secondary: #66706B;
  --text-tertiary: #8A928E;
  --border-default: #D8DDD8;
  --border-strong: #BFC7C2;
  --accent: #087A5B;
  --accent-hover: #066348;
  --accent-soft: #DDF3E9;
  --focus-ring: #087A5B;
  --selection-bg: #BFE8D8;
}

[data-theme="dark"] {
  --bg-page: #111513;
  --bg-surface: #171C19;
  --bg-elevated: #1D231F;
  --text-primary: #F1F3EF;
  --text-secondary: #A4ADA8;
  --text-tertiary: #7F8A84;
  --border-default: #2A332F;
  --border-strong: #3A4741;
  --accent: #67E2B7;
  --accent-hover: #8CEAC8;
  --accent-soft: #173A30;
  --focus-ring: #67E2B7;
  --selection-bg: #285A49;
}

.project-theater {
  --theater-bg: #090C0B;
  --theater-surface: #111613;
  --theater-elevated: #151C18;
  --theater-text: #F3F5F1;
  --theater-muted: #9EAAA4;
  --theater-border: #26312C;
  --theater-accent: #67E2B7;
  --theater-accent-soft: #173A30;
}

[data-theme="dark"] .project-theater {
  --theater-bg: #050706;
  --theater-surface: #0C100E;
  --theater-elevated: #111613;
  --theater-text: #F3F5F1;
  --theater-muted: #97A39D;
  --theater-border: #202923;
  --theater-accent: #67E2B7;
  --theater-accent-soft: #122E26;
}
```

颜色使用约束：

- Accent 占可视面积不超过约 10%；
- 主按钮、链接、终端光标、状态点、架构路径和少数关键数字可使用 Accent；
- 正文段落、整张卡背景、大面积章节背景不得使用 Accent；
- 错误、警告、成功状态如果现有系统已有语义色，保留语义色；不得全部改成绿色。

### 字体

不依赖 Google Fonts 在线请求。使用本地已有字体文件；不存在时使用下面的系统回退。

```css
--font-sans: "Instrument Sans", "Geist", "Noto Sans SC",
  "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;

--font-mono: "JetBrains Mono", "SFMono-Regular", Consolas,
  "Liberation Mono", monospace;
```

规则：

- 中文和正文统一使用 `--font-sans`；
- 英文眉题、数字、状态和导航可使用大写并增加字距；
- Terminal 全部使用 `--font-mono`；
- 不引入装饰性衬线字体；
- 字重只使用 `400 / 500 / 600 / 700`。

### 字号

```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 32px;
--text-4xl: 44px;
--text-hero: clamp(48px, 5.2vw, 76px);
```

行高：

| 内容 | 行高 |
|---|---|
| Hero 标题 | `1.04` |
| 区块大标题 | `1.10` |
| 卡片标题 | `1.20` |
| 正文 | `1.65` |
| 导航和状态 | `1.35` |
| Terminal | `1.60` |

### 间距

使用 8px 基础尺度：

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-10: 128px;
```

禁止出现无规律的 `19px / 27px / 37px` 等间距。

### 圆角

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-terminal: 18px;
--radius-pill: 999px;
```

使用规则：

- 按钮和小状态：`8px`，状态点或短标签可以使用 pill；
- 普通内容卡：`12px`；
- 重点文章卡、项目视觉面板：`16px`；
- Terminal：`18px`；
- 不使用 `24px` 以上大圆角。

### 边框与阴影

默认边框：

```css
border: 1px solid var(--border-default);
```

阴影仅用于 Terminal 和浮层：

```css
--shadow-terminal:
  0 1px 2px rgba(0, 0, 0, 0.08),
  0 18px 60px rgba(0, 0, 0, 0.12);

--shadow-menu:
  0 12px 40px rgba(0, 0, 0, 0.14);
```

普通卡片不用常驻阴影。

## 3. 页面网格

### 桌面宽屏：`>= 1280px`

- 页面容器最大宽度：`1200px`；
- 左右页边距：至少 `32px`；
- 12 列网格；
- 列间距：`24px`；
- 区块上下间距：`128px`。

### 小桌面 / 平板横屏：`1024px–1279px`

- 页边距：`32px`；
- 区块上下间距：`96px`；
- Hero 仍为双栏；
- Terminal 不小于 `440px` 宽。

### 平板：`768px–1023px`

- 页边距：`24px`；
- 区块上下间距：`88px`；
- Hero 改为单栏，Terminal 位于文案下方；
- Selected Systems 取消 Sticky；
- Writing 改为上下两栏。

### 移动端：`< 768px`

- 页边距：`20px`；
- 区块上下间距：`72px`；
- 所有区块单列；
- 卡片宽度 `100%`；
- 最小可点击区域 `44px × 44px`；
- 禁止横向滚动。

## 4. Hero 布局

### 桌面

- 导航下方 Hero 最小高度：`calc(100svh - 72px)`；
- 最小整体高度 `680px`，最大不强制；
- Hero 容器为 12 列：
  - 左侧文案占 6 列；
  - 中间空隙 1 列；
  - Terminal 占 5 列；
- 内容垂直居中；
- Hero 顶部和底部内边距均为 `72px`。

左侧：

- 眉题与主标题间距 `20px`；
- 主标题与介绍间距 `28px`；
- 介绍最大宽度 `580px`；
- CTA 与介绍间距 `32px`；
- 状态行与 CTA 间距 `40px`；
- 经历索引位于 Hero 底部，与主内容间距至少 `48px`。

主标题：

- 最大两行；
- 不对单个汉字做强调色；
- 不使用渐变文字、描边字和发光字。

CTA：

- 前两个按钮同一行；
- 第三个为下一行文本链接；
- 按钮高度 `48px`；
- 水平内边距 `20px`；
- 间距 `12px`。

### 移动端

- Hero 不强制占满一屏；
- 顶部内边距 `48px`，底部 `72px`；
- 标题字号 `clamp(40px, 12vw, 56px)`；
- CTA 主次按钮纵向排列、宽度 `100%`；
- 文本链接单独放置；
- Terminal 与 CTA 间距 `40px`；
- 经历索引允许换行，不做横向跑马灯。

## 5. Terminal 外观

- 宽度占满右侧网格；
- 桌面高度 `460px`；
- 平板高度 `400px`；
- 移动端高度 `320px`；
- 背景固定使用：
  - Light：`#101512`
  - Dark：`#080B09`
- 文本：`#DCE5E0`；
- 次要文本：`#87938D`；
- Accent：`#67E2B7`；
- 错误：`#FF8A80`；
- 标题栏高度 `44px`；
- 内容内边距：桌面 `24px`，移动端 `16px`；
- 字号：桌面 `14px`，移动端 `12px`；
- 不绘制 macOS 红黄绿三色窗口点，避免无意义拟物；
- 标题栏左侧显示 `ygrowly — terminal`；
- 右侧只保留已有 DevMode 入口或一个 `?` 帮助按钮；
- Terminal 首次加载前使用相同尺寸骨架，避免 CLS。

## 6. Selected Systems 项目剧场

- 全宽背景使用 `--theater-bg`；
- 内容容器仍为 `1200px`；
- 上下内边距：桌面 `128px`，移动端 `80px`；
- 区块标题最大宽度 `720px`；
- 项目序号使用 `14px` Mono；
- 项目主标题桌面 `clamp(44px, 5vw, 68px)`；
- 正文字号 `17px`，最大宽度 `560px`；
- 视觉面板背景 `--theater-surface`，边框 `--theater-border`，圆角 `16px`。

视觉面板只允许两种内容：

1. 现有真实、脱敏截图；
2. 规格中的文本证据面板、流程图或已有代码生成的架构图。

禁止图库图片、随机 AI 图、彩色设备插画。

## 7. Experience

- 返回全局页面背景，不使用卡片墙；
- 每段经历是一条横向记录；
- 行上边框 `1px solid var(--border-default)`；
- 最后一行增加下边框；
- 桌面网格：
  - 时间 2 列；
  - 公司与职位 4 列；
  - 核心职责 5 列；
  - 展开箭头 1 列；
- 行内边距 `28px 0`；
- Hover 只改变文字和箭头颜色，不改变整行背景；
- 展开内容从职责列下方出现，不跨到时间列。

## 8. Lab & Open Source

- 桌面为三列紧凑卡；
- 卡片背景透明或 `--bg-surface`；
- `12px` 圆角；
- 内边距 `20px`；
- 状态位于标题上方，使用 `12px` Mono；
- 不使用项目大图。

## 9. Writing

桌面采用 7:5 网格：

- Blog 主卡占 7 列；
- Notes 占 5 列；
- 间距 `32px`；
- Blog 主卡至少 `420px` 高；
- Notes 每行至少 `116px` 高。

Blog 无封面时：

- 使用纯文本卡；
- 标题从卡片上部开始；
- 底部显示日期、阅读时间、关联项目；
- 不显示空白图片框。

移动端顺序：

1. Blog 主卡；
2. 第二篇 Blog 文本入口；
3. Notes 三条；
4. Talks & Demos。

## 10. Profile

- 使用四行二维信息，不做四张独立卡；
- 每行上边框；
- 左侧标签宽 `180px`，右侧内容自适应；
- 移动端标签在上、内容在下；
- 个人主张字号桌面 `32px`，移动端 `26px`，最大宽度 `860px`。

## 11. Contact

- 使用深色但不等同于项目剧场：
  - Light：`#151A17`
  - Dark：`#0B0E0C`
- 文本白色；
- Accent 使用 `#67E2B7`；
- 上下内边距桌面 `112px`，移动端 `72px`；
- 主文案最大宽度 `760px`；
- 三个入口横向排列，移动端纵向；
- 不放背景照片、世界地图、渐变光球。

## 12. Hover、Focus 与动效

Hover：

- 卡片上移 `translateY(-4px)`；
- 持续时间 `180ms`；
- 箭头向右移动 `3px`；
- 只用于可点击卡片；
- 不可点击内容不加 Hover 动画。

Focus：

```css
outline: 2px solid var(--focus-ring);
outline-offset: 3px;
```

Transition：

```css
transition-duration: 180ms;
transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
```

`prefers-reduced-motion: reduce` 时：

- 动画和过渡时长设为 `0.01ms`；
- 停止 Terminal 自动输入；
- 项目视觉不做淡入、位移或交叉切换；
- 页面仍保持完整内容和正常锚点跳转。

