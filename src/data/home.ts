import type { Lang } from '@/i18n/ui'

export type HomeProject = {
  slug: string
  eyebrow: string
  name: string
  title: string
  summary: string
  responsibility: string
  flow: string[]
  highlights: { label: string; text: string }[]
  evidence: { label: string; value: string }[]
  stack?: string
  cta: string
}

export type HomeContent = {
  meta: { title: string; description: string }
  hero: {
    eyebrow: string
    title: string
    description: string
    projects: string
    writing: string
    status: string[]
    recentLabel: string
    recent: string[]
  }
  systems: {
    code: string
    label: string
    status: string
    title: string
    projects: HomeProject[]
  }
  experience: {
    code: string
    label: string
    status: string
    title: string
    expand: string
    collapse: string
    items: {
      period: string
      company: string
      role: string
      contribution: string
      focus: string
    }[]
  }
  lab: {
    label: string
    items: { name: string; status: string; description: string; href: string; external?: boolean }[]
  }
  writing: {
    code: string
    label: string
    status: string
    title: string
    latest: string
    notes: string
    emptyBlog: string
    emptyNotes: string
    readMore: string
  }
  talks: { label: string }
  profile: {
    code: string
    label: string
    status: string
    title: string
    rows: { label: string; value: string }[]
    statement: string
    cta: string
  }
  contact: {
    code: string
    label: string
    status: string
    title: string
    text: string
    email: string
    github: string
  }
  night: {
    echoCode: string
    echoLabel: string
    echoTitle: string
    echoSub: string
    echoStatus: string
    echoes: { text: string; source: string }[]
    exploreCode: string
    exploreLabel: string
    exploreTitle: string
    exploreSub: string
    exploreStatus: string
    exploreCards: { title: string; sub: string; href: string; kind: SkyKind }[]
  }
  footer: { copyright: string; note: string; backToTop: string }
}

export type SkyKind = 'projects' | 'blog' | 'experience' | 'about'

// 实习项目对外一律模糊化：不写内部绝对量（设备数、日增条数、评测集大小），
// 改进幅度用约数，内部平台/工具细节泛化；个人项目保留具体数字。
const zh: HomeContent = {
  meta: {
    title: '刘宇广｜AI 应用开发、Python 后端与 Agent Engineering',
    description:
      '刘宇广的个人网站：EnergyOps Agent、数驭穹图、RuleArena 与 PayTrace——Agent 工程、Python 后端、数据系统与技术写作。'
  },
  hero: {
    eyebrow: '刘宇广 · AI APPLICATION DEVELOPER · CLASS OF 2027',
    title: '把 AI 接进真实业务，也把系统做得可靠。',
    description:
      '专注 Agent 工程化与 Python 后端：数据可信 → 执行可控 → 结果可证。实习期间主导 EnergyOps Agent 的运行时治理与评测闭环，个人项目 RuleArena 把规则变更验证做成发布门禁——能由代码确定性保证的，不交给模型。',
    projects: '浏览精选项目 ↓',
    writing: '阅读最新文章 →',
    status: ['2027 届', 'AI 应用开发 / Agent 后端', '可连续实习到毕业', 'Open to opportunities'],
    recentLabel: '近期经历',
    recent: ['金山 EnergyOps', '数驭穹图', 'RuleArena', 'PayTrace']
  },
  systems: {
    code: '01',
    label: 'SELECTED SYSTEMS',
    status: '运行中 · 可验证',
    title: '不是功能堆叠，而是可运行、可验证的工程链路。',
    projects: [
      {
        slug: 'energyops-agent',
        eyebrow: 'Enterprise Agent System · 2026',
        name: 'EnergyOps Agent',
        title: '从园区累计读数，到可信的账本与受控 Agent 操作。',
        summary:
          '园区能耗智能运营平台：把数百台水电表的原始累计读数整理为用能、异常与结算三本可信的账，并通过 WPS Comate 提供受权限与人工确认约束的对话式 Agent 入口。',
        responsibility:
          '业务问题：不稳定的累计读数要变成可追溯的统计与结算，Agent 又要在不越权的前提下操作业务能力。我主导 Agent 运行时治理与评测闭环的方案和交付，Mentor 把关业务方向。',
        flow: [
          '累计读数',
          '质量判定',
          '区间用量',
          '多层聚合',
          '异常诊断',
          '告警闭环',
          'Agent 调用'
        ],
        highlights: [
          {
            label: 'Data Quality',
            text: '7 类质量状态判定 + 可信白名单，仅可信区间进入聚合，不做无依据估算。'
          },
          {
            label: 'Runtime Governance',
            text: '数十个 MCP 工具收敛为 6 类能力包，R0/R1/R2 风险分级 + Before/After Tool Hook 链校验。'
          },
          {
            label: 'Recoverable Ops',
            text: '幂等窗口、任务状态持久化与启动自动回补，重启与乱序补数不产生聚合缺口。'
          }
        ],
        evidence: [
          { label: 'Eval', value: '回放评测 · 任务完成率约 +12pt' },
          { label: 'Security', value: '内部越权用例全部拦截' },
          { label: 'Perf', value: '核心接口 P95 约 -86%（固定查询集）' },
          { label: 'Ops', value: '人工补数约 -70% · 调度成功率 99%+' },
          { label: 'Pipeline', value: 'raw → interval → hourly → daily' }
        ],
        stack: 'Python · FastAPI · PostgreSQL · MCP · WPS Comate · pytest',
        cta: '查看系统案例 →'
      },
      {
        slug: 'ai-bi-platform',
        eyebrow: 'Enterprise AI Data Platform · 2025–2026',
        name: '数驭穹图 AI BI',
        title: '让自然语言问数有来源、有口径、可验证。',
        summary:
          '面向缺少专业数据团队企业的 AI 数据分析与协作平台：自然语言提问，结果绑定证据与口径，可沉淀为表格、报告与看板。',
        responsibility:
          '业务问题：SQL 能执行 ≠ 业务答案正确——口径歧义必须澄清，结果必须可复现。我作为初创团队核心开发，主责语义层与领域路由、查询安全与证据绑定，支撑轻量湖仓。',
        flow: [
          '意图路由',
          'Schema 检索',
          '语义解析',
          'SQL 生成',
          '安全校验',
          '证据绑定',
          '图表 / 报告'
        ],
        highlights: [
          {
            label: 'Semantic Layer',
            text: '行业领域包沉淀指标口径与术语别名，两级意图契约让业务理解与 SQL 实现可独立归因。'
          },
          {
            label: 'Query Safety',
            text: '权限上下文、受治理工具、SQL AST 审查与输出脱敏分层设防，租户隔离由服务端注入。'
          },
          {
            label: 'Evidence Binding',
            text: '口径歧义必须澄清；图表绑定 call_id + query_fingerprint + result_hash，失败降级不阻断。'
          }
        ],
        evidence: [
          { label: 'Eval', value: '端到端查询成功率约 +13pt（跨行业评测集）' },
          { label: 'Recall', value: 'Schema 召回约 +14pt（固定评测集）' },
          { label: 'Safety', value: '对抗请求全部拦截 · 误拦约 3%' },
          { label: 'Cost', value: '分析上下文 Token 约 -80%' },
          { label: 'Trust', value: '图表绑定 call_id + fingerprint + hash' }
        ],
        stack: 'Python · FastAPI · PostgreSQL · DuckDB · Parquet · R2 · Univer · MCP',
        cta: '查看系统案例 →'
      },
      {
        slug: 'rulearena',
        eyebrow: 'Personal Project · Independent Build',
        name: 'RuleArena',
        title: '把规则变更的验证，做成发布门禁。',
        summary:
          '电商规则对抗验证平台：自然语言规则编译为人工确认的可执行契约，受控 Agent 搜索高风险动作序列，干净环境真实 HTTP 重放，确定性 Oracle 裁决，沉淀可回归的最小反例。',
        responsibility:
          '业务问题：促销、退款、积分与会员权益规则频繁变更，人工回归跟不上——Agent 负责寻找人没有想到的路径，确定性程序负责证明路径是否真的有问题。',
        flow: [
          '规则变更',
          'RuleSpec 契约',
          '人工确认',
          '对抗搜索',
          '沙箱重放',
          'Oracle 裁决',
          '最小反例',
          '发布门禁'
        ],
        highlights: [
          {
            label: 'Anti Self-Proof',
            text: '候选风险 ≠ 确认漏洞——Agent 全程无法触达 Ground Truth，只有沙箱重放 + Oracle 违规才确认问题。'
          },
          {
            label: 'Bounded Exploration',
            text: '禁止动态表达式求值，仅限固定领域原语；未确认规则不进入攻击运行。'
          },
          {
            label: 'Regression Assets',
            text: '最小反例绑定完整证据链，一键导出 pytest；修复版本自动重放历史反例与正常用例。'
          }
        ],
        evidence: [
          { label: 'Eval Set', value: '24 Case 双评测集 · 16 开发 + 8 隔离' },
          { label: 'False Positive', value: '正常场景 0' },
          { label: 'Replay', value: '同版本独立重放 3/3' },
          { label: 'GT Leak', value: '0' },
          { label: 'Gate', value: '反例 → pytest 回归 → 发布门禁' }
        ],
        stack: 'FastAPI · PostgreSQL · Redis · 显式 FSM · Delta Debugging · pytest',
        cta: '查看系统案例 →'
      }
    ]
  },
  experience: {
    code: '02',
    label: 'EXPERIENCE',
    status: '2025 → 现在',
    title: '在真实项目中，把数据、后端和 AI 能力接成闭环。',
    expand: '展开重点',
    collapse: '收起重点',
    items: [
      {
        period: '2026.05 — NOW',
        company: '金山',
        role: 'AI 开发实习生 · EnergyOps Agent',
        contribution: 'Agent 运行时治理、数据可信链路与评测闭环',
        focus: '重点：工具风险分级与 Hook 链治理、可恢复调度、回放评测驱动的可靠性。'
      },
      {
        period: '2025.10 — 2026.03',
        company: '深圳市慧泽致远',
        role: 'AI 应用开发实习生 · 数驭穹图',
        contribution: '语义层与领域路由、查询安全与证据绑定',
        focus: '重点：让自然语言问数有口径、有来源、可验证。'
      },
      {
        period: '2025.09 — 2026.01',
        company: '成都启点拓界',
        role: '全栈开发实习生 · Ovanta',
        contribution: '内容系统、支付链路与多版本站点交付',
        focus: '重点：结构化内容建模、支付回调 Hook 链与权益一致性。'
      }
    ]
  },
  lab: {
    label: 'LAB & OPEN SOURCE',
    items: [
      {
        name: 'Ovanta',
        status: 'Live',
        description: '跨区域签证与海外身份自助申请平台',
        href: 'https://www.ovanta.cn/',
        external: true
      },
      {
        name: 'PayTrace',
        status: 'Open Source',
        description: '支付异常归因诊断 Agent · 模拟数据与故障注入',
        href: 'https://github.com/Ygrowly/PayTrace',
        external: true
      }
    ]
  },
  writing: {
    code: '03',
    label: 'WRITING',
    status: '持续更新',
    title: '记录系统如何被设计、验证和修正。',
    latest: '最新 Blog',
    notes: 'Notes',
    emptyBlog: '博客文章整理中——先看看',
    emptyNotes: '笔记整理中，欢迎先逛逛',
    readMore: '继续阅读 →'
  },
  talks: { label: 'TALKS & DEMOS' },
  profile: {
    code: '05',
    label: 'PROFILE',
    status: '公开档案',
    title: '教育、技术栈与工作方式。',
    rows: [
      { label: 'Education', value: '南华大学 · 数据科学与大数据技术 · 2027 届' },
      { label: 'Focus', value: 'AI 应用开发 / Agent 后端（Python）' },
      { label: 'Backend', value: 'Python · FastAPI · PostgreSQL · Redis · DuckDB' },
      { label: 'Agent Engineering', value: 'MCP · Hook 链治理 · Eval · Trace · Observability' }
    ],
    statement: '能由代码确定性保证的，不交给模型。',
    cta: '了解更多关于我 →'
  },
  contact: {
    code: '06',
    label: 'CONTACT',
    status: '在线 · 接洽中',
    title: '聊聊系统、Agent 与下一步。',
    text: '正在寻找 2027 届 AI 应用开发 / Agent 后端（Python）方向的机会，可提前实习、可连续实习到毕业；也欢迎交流 Agent 工程、数据系统与开源实践。',
    email: '发送邮件',
    github: 'GitHub'
  },
  night: {
    echoCode: '04 · A',
    echoLabel: 'SYSTEM ECHOES',
    echoTitle: '系统回声',
    echoSub: '真实项目留下的可验证证据，而不是形容词。',
    echoStatus: '回放中',
    echoes: [
      {
        text: '累计读数经 7 类质量状态判定才进入聚合——不可确认的区间保留原始事实，不做无依据估算。',
        source: 'EnergyOps Agent · 数据可信底座'
      },
      {
        text: '数十个 MCP 工具收敛为 6 类能力包，R0/R1/R2 风险分级加 Hook 链校验——Agent 操作不越权，高风险需确认。',
        source: 'EnergyOps Agent · 运行时治理'
      },
      {
        text: 'SQL 能执行 ≠ 业务答案正确：口径歧义必须澄清，图表绑定 call_id + query_fingerprint + result_hash。',
        source: '数驭穹图 · 证据契约'
      },
      {
        text: '回放评测与固定查询集驱动可靠性：任务完成率、接口 P95 与上下文开销均有两位数改善。',
        source: 'EnergyOps Agent · 评测闭环'
      },
      {
        text: 'Agent 全程无法触达 Ground Truth：候选风险只有经干净环境重放与 Oracle 裁决才确认为漏洞。',
        source: 'RuleArena · 防自证架构'
      },
      {
        text: '确定性代码计算损失与异常，模型只组织调查；每条结论绑定证据，无依据归因被阻断。',
        source: 'PayTrace · Deterministic Core'
      }
    ],
    exploreCode: '04 · B',
    exploreLabel: 'EXPLORE BEYOND',
    exploreTitle: '再往前走一点',
    exploreSub: '四个方向，继续浏览。',
    exploreStatus: '浏览',
    exploreCards: [
      {
        title: '我构建的东西',
        sub: 'EnergyOps、数驭穹图、RuleArena、PayTrace 的完整案例与证据。',
        href: '/projects',
        kind: 'projects'
      },
      {
        title: '沿途的写作',
        sub: '系统如何被设计、验证和修正——Blog 与 Notes。',
        href: '/blog',
        kind: 'blog'
      },
      {
        title: '进行中的实验',
        sub: '实习经历、Lab 与开源实践的时间线。',
        href: '/experience',
        kind: 'experience'
      },
      {
        title: '关于我',
        sub: '教育、技术栈与工作方式，还有联系入口。',
        href: '/about',
        kind: 'about'
      }
    ]
  },
  footer: {
    copyright: '© 2026 Liu Yuguang / Ygrowly',
    note: 'Built with care for systems that keep growing.',
    backToTop: '回到顶部 ↑'
  }
}

const en: HomeContent = {
  meta: {
    title: 'Yuguang Liu | AI Application & Python Backend Engineer',
    description:
      'Portfolio of Yuguang Liu, focused on agent engineering, Python backends, and data systems — EnergyOps Agent, DataSphere, RuleArena, PayTrace, and technical writing.'
  },
  hero: {
    eyebrow: 'YUGUANG LIU · AI APPLICATION DEVELOPER · CLASS OF 2027',
    title: 'I bring AI into real workflows—and engineer the system around it.',
    description:
      'Focused on agent engineering and Python backends: trustworthy data, controlled execution, provable results. I led runtime governance and the eval loop for EnergyOps Agent during my internship, and built RuleArena to turn rule-change verification into release gates — what code can guarantee deterministically stays out of the model.',
    projects: 'Explore Selected Systems ↓',
    writing: 'Read Latest Writing →',
    status: [
      'Class of 2027',
      'AI Application / Agent Backend',
      'Internship through graduation',
      'Open to opportunities'
    ],
    recentLabel: 'Recent work',
    recent: ['Kingsoft EnergyOps', 'DataSphere', 'RuleArena', 'PayTrace']
  },
  systems: {
    code: '01',
    label: 'SELECTED SYSTEMS',
    status: 'RUNNING · VERIFIED',
    title: 'Not feature collections, but systems that can be operated and verified.',
    projects: [
      {
        slug: 'energyops-agent',
        eyebrow: 'Enterprise Agent System · 2026',
        name: 'EnergyOps Agent',
        title: 'From campus meter readings to trusted ledgers and governed agent operations.',
        summary:
          'A campus energy operations platform: raw cumulative readings from hundreds of meters become three trustworthy ledgers — usage, anomalies, and settlement — with a permission- and confirmation-bound conversational agent inside WPS Comate.',
        responsibility:
          'Business problem: unstable cumulative readings must become auditable statistics and settlement, while the agent must operate business capabilities without overstepping. I led the design and delivery of agent runtime governance and the eval loop; my mentor owned business direction.',
        flow: [
          'Cumulative readings',
          'Quality states',
          'Interval usage',
          'Layered aggregation',
          'Diagnosis',
          'Alert loop',
          'Agent calls'
        ],
        highlights: [
          {
            label: 'Data Quality',
            text: 'Seven quality states plus a trusted whitelist; only trusted intervals enter aggregation — no unsupported estimates.'
          },
          {
            label: 'Runtime Governance',
            text: 'Dozens of MCP tools consolidated into six capability bundles with R0/R1/R2 risk tiers and Before/After Tool hook chains.'
          },
          {
            label: 'Recoverable Ops',
            text: 'Idempotency windows, persisted task state, and startup backfill — restarts and out-of-order data leave no aggregation gaps.'
          }
        ],
        evidence: [
          { label: 'Eval', value: 'replay eval · task completion ≈ +12pt' },
          { label: 'Security', value: 'all internal privilege cases blocked' },
          { label: 'Perf', value: 'core API P95 ≈ −86% (fixed query set)' },
          { label: 'Ops', value: 'manual backfills ≈ −70% · scheduler 99%+' },
          { label: 'Pipeline', value: 'raw → interval → hourly → daily' }
        ],
        stack: 'Python · FastAPI · PostgreSQL · MCP · WPS Comate · pytest',
        cta: 'View system case →'
      },
      {
        slug: 'ai-bi-platform',
        eyebrow: 'Enterprise AI Data Platform · 2025–2026',
        name: 'DataSphere AI BI',
        title: 'Natural-language analytics with sources, definitions, and verifiable results.',
        summary:
          'An AI data-analysis and collaboration platform for teams without dedicated data staff: ask in natural language, and results bind evidence and metric definitions before settling into tables, reports, and dashboards.',
        responsibility:
          'Business problem: a SQL query executing is not the same as the business answer being right — ambiguous metrics must be clarified and results must be reproducible. As a core developer on a small team, I owned the semantic layer and domain routing, query safety, and evidence binding, and supported the lightweight lakehouse.',
        flow: [
          'Intent routing',
          'Schema retrieval',
          'Semantic parse',
          'SQL generation',
          'Safety checks',
          'Evidence binding',
          'Charts & reports'
        ],
        highlights: [
          {
            label: 'Semantic Layer',
            text: 'Industry domain packs hold metric definitions and term aliases; a two-level intent contract separates business understanding from SQL implementation.'
          },
          {
            label: 'Query Safety',
            text: 'Layered defenses — permission context, governed tools, read-only SQL AST review, and output masking — with tenant isolation injected server-side.'
          },
          {
            label: 'Evidence Binding',
            text: 'Ambiguous metrics must be clarified; charts bind call_id + query_fingerprint + result_hash and degrade instead of blocking.'
          }
        ],
        evidence: [
          { label: 'Eval', value: 'end-to-end success ≈ +13pt (cross-industry set)' },
          { label: 'Recall', value: 'schema recall ≈ +14pt (fixed set)' },
          { label: 'Safety', value: 'all adversarial requests blocked · ~3% false blocks' },
          { label: 'Cost', value: 'analysis context tokens ≈ −80%' },
          { label: 'Trust', value: 'charts bind call_id + fingerprint + hash' }
        ],
        stack: 'Python · FastAPI · PostgreSQL · DuckDB · Parquet · R2 · Univer · MCP',
        cta: 'View system case →'
      },
      {
        slug: 'rulearena',
        eyebrow: 'Personal Project · Independent Build',
        name: 'RuleArena',
        title: 'Turning rule-change verification into release gates.',
        summary:
          'An adversarial verification platform for e-commerce rule changes: natural-language rules compile into human-confirmed executable contracts, a governed agent searches for high-risk action sequences, a clean environment replays them over real HTTP, and a deterministic oracle adjudicates — distilling minimal, reproducible counterexamples.',
        responsibility:
          'Business problem: promotion, refund, points, and membership rules change faster than manual regression can follow. The agent finds paths humans did not think of; deterministic code proves whether a path is actually broken.',
        flow: [
          'Rule change',
          'RuleSpec contract',
          'Human confirm',
          'Adversarial search',
          'Sandbox replay',
          'Oracle verdict',
          'Minimal counterexample',
          'Release gate'
        ],
        highlights: [
          {
            label: 'Anti Self-Proof',
            text: 'Candidate risk ≠ confirmed bug — the agent never touches ground truth; only a sandbox replay plus an oracle violation confirms an issue.'
          },
          {
            label: 'Bounded Exploration',
            text: 'No dynamic expression evaluation; a fixed set of domain primitives only, and unconfirmed rules never enter attack runs.'
          },
          {
            label: 'Regression Assets',
            text: 'Minimal counterexamples bind a full evidence chain, export to pytest in one click, and repaired versions replay historical cases.'
          }
        ],
        evidence: [
          { label: 'Eval Set', value: '24 cases · 16 dev + 8 hidden (physically isolated)' },
          { label: 'False Positive', value: '0 on normal scenarios' },
          { label: 'Replay', value: '3/3 independent same-version replays' },
          { label: 'GT Leak', value: '0' },
          { label: 'Gate', value: 'counterexample → pytest regression → release gate' }
        ],
        stack: 'FastAPI · PostgreSQL · Redis · Explicit FSM · Delta Debugging · pytest',
        cta: 'View system case →'
      }
    ]
  },
  experience: {
    code: '02',
    label: 'EXPERIENCE',
    status: '2025 → NOW',
    title: 'Connecting data, backend systems, and AI inside real projects.',
    expand: 'Show focus',
    collapse: 'Hide focus',
    items: [
      {
        period: '2026.05 — NOW',
        company: 'Kingsoft',
        role: 'AI Development Intern · EnergyOps Agent',
        contribution: 'Agent runtime governance, trusted data pipelines, and the eval loop',
        focus:
          'Focus: tool risk tiers and hook-chain governance, recoverable scheduling, and replay-eval-driven reliability.'
      },
      {
        period: '2025.10 — 2026.03',
        company: 'Shenzhen Huize Zhiyuan',
        role: 'AI Application Development Intern · DataSphere',
        contribution: 'Semantic layer, domain routing, query safety, and evidence binding',
        focus:
          'Focus: natural-language analytics with metric definitions, sources, and verifiable results.'
      },
      {
        period: '2025.09 — 2026.01',
        company: 'Chengdu Qidian Tuojie',
        role: 'Full-stack Intern · Ovanta',
        contribution: 'Content system, payment pipeline, and multi-site delivery',
        focus:
          'Focus: content modeling, payment callback hook chains, and entitlement consistency.'
      }
    ]
  },
  lab: {
    label: 'LAB & OPEN SOURCE',
    items: [
      {
        name: 'Ovanta',
        status: 'Live',
        description: 'Self-service platform for visas and overseas identity',
        href: 'https://www.ovanta.cn/',
        external: true
      },
      {
        name: 'PayTrace',
        status: 'Open Source',
        description: 'Payment anomaly diagnosis agent · simulated data and fault injection',
        href: 'https://github.com/Ygrowly/PayTrace',
        external: true
      }
    ]
  },
  writing: {
    code: '03',
    label: 'WRITING',
    status: 'UPDATING',
    title: 'Notes on how systems are designed, verified, and corrected.',
    latest: 'Latest Blog',
    notes: 'Notes',
    emptyBlog: 'Blog posts are being organized — browse',
    emptyNotes: 'Notes are being organized — meanwhile, browse',
    readMore: 'Continue reading →'
  },
  talks: { label: 'TALKS & DEMOS' },
  profile: {
    code: '05',
    label: 'PROFILE',
    status: 'PUBLIC RECORD',
    title: 'Education, stack, and how I work.',
    rows: [
      { label: 'Education', value: 'University of South China · Data Science and Big Data · 2027' },
      { label: 'Focus', value: 'AI Application / Agent Backend (Python)' },
      { label: 'Backend', value: 'Python · FastAPI · PostgreSQL · Redis · DuckDB' },
      { label: 'Agent Engineering', value: 'MCP · Hook-chain governance · Eval · Trace · Observability' }
    ],
    statement: 'What code can guarantee deterministically stays out of the model.',
    cta: 'More about me →'
  },
  contact: {
    code: '06',
    label: 'CONTACT',
    status: 'ONLINE · OPEN',
    title: 'Let’s talk systems, agents, and what comes next.',
    text: 'I’m looking for 2027 new-grad opportunities in AI application and agent backend engineering (Python), and I can start early and keep interning through graduation — always open to conversations about agents, data systems, and open source.',
    email: 'Email',
    github: 'GitHub'
  },
  night: {
    echoCode: '04 · A',
    echoLabel: 'SYSTEM ECHOES',
    echoTitle: 'System Echoes',
    echoSub: 'Verifiable evidence left by real systems, not adjectives.',
    echoStatus: 'PLAYBACK',
    echoes: [
      {
        text: 'Cumulative readings pass seven quality states before entering aggregation — unconfirmable intervals keep their raw facts instead of unsupported estimates.',
        source: 'EnergyOps Agent · trusted data foundation'
      },
      {
        text: 'Dozens of MCP tools consolidate into six capability bundles with R0/R1/R2 risk tiers and hook-chain checks — no overstepping, confirmation for high-risk actions.',
        source: 'EnergyOps Agent · runtime governance'
      },
      {
        text: 'A SQL query executing ≠ the business answer being right: ambiguous metrics must be clarified, and charts bind call_id + query_fingerprint + result_hash.',
        source: 'DataSphere · evidence contract'
      },
      {
        text: 'Replay evals and a fixed query set drive reliability: task completion, API P95, and context overhead all improved by double digits.',
        source: 'EnergyOps Agent · eval loop'
      },
      {
        text: 'The agent never touches ground truth: candidate risk becomes a confirmed bug only after clean-environment replay and an oracle violation.',
        source: 'RuleArena · anti self-proof'
      },
      {
        text: 'Deterministic code computes losses and anomalies; the model only organizes the investigation. Every claim binds evidence — unsupported attribution is blocked.',
        source: 'PayTrace · Deterministic Core'
      }
    ],
    exploreCode: '04 · B',
    exploreLabel: 'EXPLORE BEYOND',
    exploreTitle: 'Explore Beyond This Page',
    exploreSub: 'Four directions to keep browsing.',
    exploreStatus: 'BROWSE',
    exploreCards: [
      {
        title: 'Things I Built',
        sub: 'Full cases and evidence for EnergyOps, DataSphere, RuleArena, and PayTrace.',
        href: '/en/projects',
        kind: 'projects'
      },
      {
        title: 'Writing Along the Way',
        sub: 'How systems are designed, verified, and corrected — blog and notes.',
        href: '/en/blog',
        kind: 'blog'
      },
      {
        title: 'Experiments in Flight',
        sub: 'Internships, the lab, and open-source practice over time.',
        href: '/en/experience',
        kind: 'experience'
      },
      {
        title: 'About Me',
        sub: 'Education, stack, and how I work — plus ways to reach me.',
        href: '/en/about',
        kind: 'about'
      }
    ]
  },
  footer: {
    copyright: '© 2026 Liu Yuguang / Ygrowly',
    note: 'Built with care for systems that keep growing.',
    backToTop: 'Back to top ↑'
  }
}
export const homeContent: Record<Lang, HomeContent> = { zh, en }

export const projectCases: Record<Lang, HomeProject[]> = {
  zh: [
    ...zh.systems.projects,
    {
      slug: 'ovanta',
      eyebrow: 'Full-stack Product · 2025–2026',
      name: 'Ovanta',
      title: '跨区域签证、移民与海外身份自助申请平台。',
      summary:
        '面向中国及国际用户的签证、移民与海外身份自助申请平台，一套核心代码支撑国内版与国际版，覆盖结构化内容、区域化登录支付与会员权益，已上线 ovanta.cn。',
      responsibility:
        '业务问题：把分散、专业且持续变化的官方政策组织为可审核、可组合的结构化指南，并通过订阅、支付与权益完成商业化交付。我主导内容模型、区域化与支付幂等设计。',
      flow: ['政策内容', '结构化建模', '资格评估', '订阅支付', '权益发放', '顾问服务', '运营回流'],
      highlights: [
        {
          label: 'Content System',
          text: '16 类内容模型与类型化组件，支撑多产品、200+ 页面统一编辑与发布。'
        },
        {
          label: 'Payment Hook Chain',
          text: '支付回调走阻断型 Hook 链：验签、金额、状态机与幂等校验——写侧阻断、读侧降级。'
        },
        {
          label: 'Regional Architecture',
          text: '国内/国际共享核心业务代码，构建期区域配置 + 渠道适配器，区域重复开发大幅下降。'
        }
      ],
      evidence: [
        { label: 'Content Models', value: '16 模型 · 25 组件 · 200+ 页面' },
        { label: 'Entitlements', value: '对账一致率 99.9%+ · 千次级回放零重复发放' },
        { label: 'Events API', value: 'P95 < 100ms · 重复率 < 0.1%' },
        { label: 'E2E', value: 'Given-When-Then 通过率 ≥ 98%' }
      ],
      stack: 'React · Vite · Django · DRF · Strapi · MySQL · PostgreSQL · Redis · Celery · Docker Compose · Cloudflare',
      cta: '查看项目详情 →'
    }
  ],
  en: [
    ...en.systems.projects,
    {
      slug: 'ovanta',
      eyebrow: 'Full-stack Product · 2025–2026',
      name: 'Ovanta',
      title: 'A cross-region self-service platform for visas, immigration, and overseas identity.',
      summary:
        'A self-service application platform for Chinese and international users. One codebase powers both regional sites with structured policy content, regional login and payments, and membership entitlements. Live at ovanta.cn.',
      responsibility:
        'Business problem: organizing scattered, professional, and ever-changing official policies into auditable, composable structured guides — then completing commercial delivery through subscriptions, payments, and entitlements. I led content modeling, regionalization, and payment idempotency.',
      flow: [
        'Policy content',
        'Structured modeling',
        'Eligibility check',
        'Subscription & payment',
        'Entitlements',
        'Consulting',
        'Operations loop'
      ],
      highlights: [
        {
          label: 'Content System',
          text: '16 content models and typed components power multiple products and 200+ pages through one editing and publishing flow.'
        },
        {
          label: 'Payment Hook Chain',
          text: 'Payment callbacks pass a blocking hook chain — signature, amount, state machine, and idempotency checks — blocking on write, degrading on read.'
        },
        {
          label: 'Regional Architecture',
          text: 'Both regions share the core business code with build-time regional config and channel adapters, sharply reducing duplicated work.'
        }
      ],
      evidence: [
        { label: 'Content Models', value: '16 models · 25 components · 200+ pages' },
        { label: 'Entitlements', value: '99.9%+ reconciliation · zero duplicate grants across 1k+ replays' },
        { label: 'Events API', value: 'P95 < 100ms · duplicate rate < 0.1%' },
        { label: 'E2E', value: 'Given-When-Then pass rate ≥ 98%' }
      ],
      stack: 'React · Vite · Django · DRF · Strapi · MySQL · PostgreSQL · Redis · Celery · Docker Compose · Cloudflare',
      cta: 'View project →'
    }
  ]
}

export function projectHref(slug: string, lang: Lang) {
  return `${lang === 'en' ? '/en' : ''}/projects/${slug}`
}
