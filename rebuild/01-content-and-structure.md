# 01：首页内容与信息结构

## 1. 全局导航

### 桌面端

导航高度固定为 `72px`，内容与首页主容器对齐。

中文：

```text
Ygrowly

项目  经历  写作  关于

中 / EN  [主题切换]  简历 PDF ↗
```

英文：

```text
Ygrowly

Projects  Experience  Writing  About

中 / EN  [Theme]  Résumé ↗
```

导航目标：

| 标签 | 中文目标 | 英文目标 |
|---|---|---|
| Ygrowly | `/` | `/en` |
| 项目 / Projects | 首页 `#projects`，若已有独立项目页则保留其二级入口 | `/en#projects` |
| 经历 / Experience | `#experience` | `/en#experience` |
| 写作 / Writing | `#writing` | `/en#writing` |
| 关于 / About | `/about` | `/en/about` |
| 中 / EN | 当前页面对应语言；无对应页时回到对应语言首页 | 同左 |
| 简历 | `/resume.pdf`，新标签页 | `/resume-en.pdf`，新标签页 |

若英文简历文件不存在：

- 英文导航仍显示 `Résumé · CN ↗`；
- 链接到 `/resume.pdf`；
- 不创建假的英文简历文件；
- Contact 同步显示 `Chinese PDF`。

### 移动端

- 高度 `64px`；
- 左侧品牌，右侧主题按钮和菜单按钮；
- 展开菜单后按“项目、经历、写作、关于、语言、简历”顺序排列；
- 菜单打开时锁定页面背景滚动；
- 点击链接、按 `Esc`、点击遮罩后关闭；
- 菜单必须是正常 DOM 内容，不使用仅视觉可见的 Canvas 或自定义绘制。

## 2. 首页区块顺序

顺序固定，不得调整：

1. `Hero`
2. `Selected Systems`
3. `Experience + Lab & Open Source`
4. `Writing + Talks & Demos`
5. `Profile`
6. `Contact`
7. `Footer`

对应锚点固定为：

```text
#top
#projects
#experience
#writing
#profile
#contact
```

## 3. Hero

### 中文文案

眉题：

```text
刘宇广 · AI APPLICATION DEVELOPER · 2027
```

主标题：

```text
把 AI 接进真实业务，
也把系统做得可靠。
```

介绍：

```text
专注 Agent Engineering、Python 后端与数据系统。
做过园区能耗、企业 AI BI 与智能信息分析平台，
持续实践工具调用、评测与可恢复工作流。
```

CTA 顺序：

1. `查看简历 PDF ↗` → `/resume.pdf`，新标签页，主按钮；
2. `浏览精选项目 ↓` → `#projects`，次按钮；
3. `阅读最新文章 →` → 最新已发布 Blog 的详情页，文本链接。

状态行：

```text
2027 届
AI 应用开发 / Python 后端
广州、深圳优先
Open to opportunities
```

经历索引：

```text
近期经历
金山办公
企业 AI BI
AI 资讯平台
tRPC Agent 开源实践
```

### 英文文案

眉题：

```text
YUGUANG LIU · AI APPLICATION DEVELOPER · CLASS OF 2027
```

主标题：

```text
I bring AI into real workflows—
and engineer the system around it.
```

介绍：

```text
Focused on agent engineering, Python backends, and data systems.
I build observable, recoverable AI applications across enterprise energy,
analytics, and information workflows.
```

CTA：

1. `View Résumé ↗`
2. `Explore Selected Systems ↓`
3. `Read Latest Writing →`

状态行：

```text
Class of 2027
AI Application / Python Backend
Guangzhou or Shenzhen preferred
Open to opportunities
```

经历索引：

```text
Recent work
Kingsoft Office
Enterprise AI BI
AI Intelligence Platform
tRPC Agent Open Source
```

## 4. Hero Terminal 的默认内容

Terminal 首次静态渲染以下内容，不能让用户等待打字动画结束后才看到信息：

中文：

```bash
$ whoami
刘宇广 / Ygrowly
AI Application Developer · Data Systems

$ ls systems/
energyops-agent
ai-bi-platform
paytrace  [building]

$ help
projects  experience  writing  resume  contact
```

英文：

```bash
$ whoami
Yuguang Liu / Ygrowly
AI Application Developer · Data Systems

$ ls systems/
energyops-agent
ai-bi-platform
paytrace  [building]

$ help
projects  experience  writing  resume  contact
```

详细命令行为见 `03-components-and-interactions.md`。

## 5. Selected Systems

区块标题：

中文：

```text
SELECTED SYSTEMS
不是功能堆叠，而是可运行、可验证的工程链路。
```

英文：

```text
SELECTED SYSTEMS
Not feature collections, but systems that can be operated and verified.
```

### 项目 01：EnergyOps Agent

状态：

```text
Enterprise System · 2026
```

中文标题：

```text
EnergyOps Agent
从累计读数，到可信统计、异常诊断与 Agent 工具调用。
```

个人职责：

```text
参与能耗数据接入与时序处理、异常规则和告警闭环，
并将业务能力封装为 WPS Comate 专家、Skill 与 MCP 工具。
```

系统链路：

```text
累计读数
→ 区间用量
→ 小时 / 日聚合
→ 数据质量
→ 异常诊断
→ 告警闭环
→ Agent 调用
```

首页只展示三项工程要点：

1. `Data Quality`：处理首次读数、回退、长间隔、异常跳变与部分覆盖；
2. `Reliability`：调度、检查点、启动自愈、补数与 partial 状态透明；
3. `Agent Integration`：专家、Skill、MCP 工具与高风险操作确认边界。

证据面板：

```text
Backend tests    225 passed
MCP tests         97 passed
Frontend          Build verified
Pipeline          raw → interval → hourly → daily
```

如果仓库内容中的最新真实测试数字不同：

- 只能使用测试命令实际得到的新数字替换；
- 不得估算或四舍五入；
- 无法验证时删除数字，仅保留 `Tested`，不能编造。

详情 CTA：

```text
查看系统案例 →
```

链接到现有 EnergyOps 项目详情路由；若不存在，则按现有项目内容系统创建，不自行改变 slug，默认 slug 使用 `energyops-agent`。

英文摘要：

```text
From cumulative meter readings to trustworthy aggregation,
anomaly diagnosis, alert handling, and agent-accessible tools.
```

### 项目 02：数驭穹图 AI BI

状态：

```text
Enterprise AI BI · 2025–2026
```

中文标题：

```text
数驭穹图 AI BI
把多源数据、协同表格、分析查询与 Agent 交互接入同一工作流。
```

个人职责：

```text
参与协同表格、湖仓数据处理与组织权限模块的设计和开发，
并接触 Text-to-SQL、BI 分析及 Agent 工具接入。
```

系统链路：

```text
多源数据
→ 对象存储 / 湖仓
→ 协同表格
→ Text-to-SQL
→ BI 分析
→ Agent 交互
```

首页只展示三项工程要点：

1. `Collaborative Data`：在线协同表格既是编辑界面，也是统一数据源；
2. `Lakehouse Query`：PostgreSQL、R2、DuckDB 组合支持数据存储与分析；
3. `Permission Context`：组织、成员与数据范围进入查询和 Agent 上下文。

技术栈行：

```text
Next.js · PostgreSQL · R2 · DuckDB · Univer · MCP
```

详情 CTA：

```text
查看系统案例 →
```

英文标题和摘要：

```text
DataSphere AI BI
A unified workflow for multi-source data, collaborative tables,
analytical queries, and agent interaction.
```

英文项目名可以展示为 `DataSphere AI BI`，但详情页第一次出现时保留中文原名“数驭穹图”。

## 6. Experience

区块标题：

```text
EXPERIENCE
在真实项目中，把数据、后端和 AI 能力接成闭环。
```

经历按时间倒序固定展示：

### 金山办公

```text
2026.05 — NOW
金山办公
安全开发实习生 · EnergyOps Agent
能耗数据链路、异常告警、MCP / WPS Comate 接入
```

展开后只增加一条：

```text
重点：复杂时序数据质量、可恢复调度与 Agent 工具调用边界。
```

### 慧泽致远

```text
2025.10 — 2026.03
深圳市慧泽致远
AI 应用开发实习生 · 数驭穹图
协同表格、湖仓、Text-to-SQL 与组织权限
```

展开：

```text
重点：多源数据进入可协同、可查询、可由 Agent 使用的统一工作流。
```

### 启点拓界

```text
2025.09 — 2026.01
成都启点拓界
后端开发实习生 · AI 资讯筛选平台
多源采集、清洗、AI 摘要分类与通知链路
```

展开：

```text
重点：合规采集、内容处理与结果分发的后端链路。
```

英文版使用相同事实，不逐字翻译职位描述，保持简洁。

## 7. Lab & Open Source

与 Experience 同一区块，作为右侧或下方辅助区域，不与公司经历混排：

| 项目 | 状态 | 一句话 |
|---|---|---|
| PayTrace | Building | 跨境支付异常归因与诊断 Agent |
| tRPC Agent #91 | Open Source | Eval → 失败归因 → Prompt 优化 → 回归验证 |
| 星币六 | Hackathon | 闲置物品估值、心愿与财商管理体验 |

状态使用英文短词，说明使用当前页面语言。

## 8. Writing

区块标题：

```text
WRITING
记录系统如何被设计、验证和修正。
```

### Blog

- 左侧主卡固定取“最新一篇已发布 Blog”；
- 下方最多显示第二篇 Blog 的文本入口；
- 主卡显示：分类、标题、一句话摘要、发布日期、阅读时间、关联项目；
- 封面仅使用文章已有封面或真实脱敏工程图；
- 无封面时使用纯文本排版，不生成随机图片。

### Notes

右侧固定取按更新时间倒序的前三条已发布 Notes。

每条显示：

```text
标题
一句话结论
更新时间
```

无图，不显示大摘要。

推荐的首批内容标题可使用：

```text
Agent 的完成与成功有什么区别
累计读数为什么不能直接相减
从一次 AI Coding 任务中学到的上下文工程
```

只有内容集合中存在对应文章时才显示；不存在时按“最新三条”规则取值，不新建空文章。

## 9. Talks & Demos

放在 Writing 底部的宽幅行，不单独占用导航。

标题：

```text
TALKS & DEMOS
```

内容最多三条：

```text
Hackathon Pitch
Open Source Demo
Internal Technical Sharing
```

每条必须显示真实类型和时间。没有对应内容时不显示占位卡，也不虚构大会、主办方或观众规模。

## 10. Profile

区块标题：

```text
PROFILE
```

四组信息固定为：

| 信息 | 中文内容 |
|---|---|
| Education | 数据科学与大数据技术 · 2027 届 |
| Focus | AI Application Engineering · Agent · Data Systems |
| Backend | Python · FastAPI · PostgreSQL · Redis · Docker |
| AI Engineering | MCP · Tool Use · Eval · Memory · Observability |

个人主张：

```text
我更关注 AI 如何进入可观测、可恢复的业务流程，
而不只是完成一次看起来正确的回答。
```

CTA：

```text
了解更多关于我 →
```

## 11. Contact

中文：

```text
OPEN TO OPPORTUNITIES

正在寻找 2027 届 AI 应用开发 / Python 后端相关机会，
也欢迎交流 Agent 工程、数据系统与开源实践。

发送邮件
GitHub
查看简历
```

英文：

```text
OPEN TO OPPORTUNITIES

I’m looking for 2027 graduate opportunities in AI application
and Python backend engineering, and I’m always open to conversations
about agents, data systems, and open source.

Email
GitHub
View Résumé
```

链接：

- 邮箱：`mailto:lyg3044@qq.com`
- GitHub：`https://github.com/Ygrowly`
- 简历：按当前语言选择稳定地址。

不添加联系表单。

## 12. Footer

内容：

```text
© 2026 Liu Yuguang / Ygrowly
Built with care for systems that keep growing.
```

右侧：

```text
Back to top ↑
```

Footer 不重复完整导航，不添加社交图标墙。

