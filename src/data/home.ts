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
    resume: string
    projects: string
    writing: string
    status: string[]
    recentLabel: string
    recent: string[]
  }
  systems: {
    label: string
    title: string
    projects: HomeProject[]
  }
  experience: {
    label: string
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
    label: string
    title: string
    latest: string
    notes: string
    emptyBlog: string
    emptyNotes: string
    readMore: string
  }
  talks: { label: string }
  profile: {
    label: string
    rows: { label: string; value: string }[]
    statement: string
    cta: string
  }
  contact: {
    label: string
    text: string
    email: string
    github: string
    resume: string
  }
  night: {
    echoLabel: string
    echoTitle: string
    echoSub: string
    echoes: { text: string; source: string }[]
    exploreLabel: string
    exploreTitle: string
    exploreSub: string
    exploreCards: { title: string; sub: string; href: string; kind: SkyKind }[]
  }
  footer: { copyright: string; note: string; backToTop: string }
}

export type SkyKind = 'projects' | 'blog' | 'experience' | 'about'

const zh: HomeContent = {
  meta: {
    title: '刘宇广｜AI 应用开发、Python 后端与 Agent Engineering',
    description:
      '刘宇广的个人网站：园区能耗、企业 AI BI、Agent 工程、Python 后端、开源实践与技术写作。'
  },
  hero: {
    eyebrow: '刘宇广 · AI APPLICATION DEVELOPER · 2027',
    title: '把 AI 接进真实业务，也把系统做得可靠。',
    description:
      '专注 Agent Engineering、Python 后端与数据系统。做过园区能耗、企业 AI BI、签证移民平台与支付诊断 Agent，持续实践工具调用、评测与可恢复工作流。',
    resume: '查看简历 PDF ↗',
    projects: '浏览精选项目 ↓',
    writing: '阅读最新文章 →',
    status: ['2027 届', 'AI 应用开发 / Python 后端', '广州、深圳优先', 'Open to opportunities'],
    recentLabel: '近期经历',
    recent: ['金山办公', '企业 AI BI', 'Ovanta', 'tRPC Agent 开源实践']
  },
  systems: {
    label: 'SELECTED SYSTEMS',
    title: '不是功能堆叠，而是可运行、可验证的工程链路。',
    projects: [
      {
        slug: 'energyops-agent',
        eyebrow: 'Enterprise System · 2026',
        name: 'EnergyOps Agent',
        title: '从累计读数，到可信统计、异常诊断与 Agent 工具调用。',
        summary:
          '参与能耗数据接入与时序处理、异常规则和告警闭环，并将业务能力封装为 WPS Comate 专家、Skill 与 MCP 工具。',
        responsibility:
          '业务问题：让不稳定、非连续的累计读数成为可追溯的统计结果，并把诊断能力安全地开放给 Agent。',
        flow: [
          '累计读数',
          '区间用量',
          '小时 / 日聚合',
          '数据质量',
          '异常诊断',
          '告警闭环',
          'Agent 调用'
        ],
        highlights: [
          {
            label: 'Data Quality',
            text: '处理首次读数、回退、长间隔、异常跳变与部分覆盖。'
          },
          {
            label: 'Reliability',
            text: '调度、检查点、启动自愈、补数与 partial 状态透明。'
          },
          {
            label: 'Agent Integration',
            text: '专家、Skill、MCP 工具与高风险操作确认边界。'
          }
        ],
        evidence: [
          { label: 'Backend', value: 'Tested' },
          { label: 'MCP', value: 'Tested' },
          { label: 'Frontend', value: 'Build verified' },
          { label: 'Pipeline', value: 'raw → interval → hourly → daily' }
        ],
        cta: '查看系统案例 →'
      },
      {
        slug: 'ai-bi-platform',
        eyebrow: 'Enterprise AI BI · 2025–2026',
        name: '数驭穹图 AI BI',
        title: '把多源数据、协同表格、分析查询与 Agent 交互接入同一工作流。',
        summary:
          '参与协同表格、湖仓数据处理与组织权限模块的设计和开发，并接触 Text-to-SQL、BI 分析及 Agent 工具接入。',
        responsibility:
          '业务问题：让不同来源的数据在统一权限上下文中可编辑、可分析，也可被 Agent 调用。',
        flow: ['多源数据', '对象存储 / 湖仓', '协同表格', 'Text-to-SQL', 'BI 分析', 'Agent 交互'],
        highlights: [
          {
            label: 'Collaborative Data',
            text: '在线协同表格既是编辑界面，也是统一数据源。'
          },
          {
            label: 'Lakehouse Query',
            text: 'PostgreSQL、R2、DuckDB 组合支持数据存储与分析。'
          },
          {
            label: 'Permission Context',
            text: '组织、成员与数据范围进入查询和 Agent 上下文。'
          }
        ],
        evidence: [
          { label: 'Workflow', value: 'source → table → query → insight' },
          { label: 'Context', value: 'organization · member · data scope' }
        ],
        stack: 'Next.js · PostgreSQL · R2 · DuckDB · Univer · MCP',
        cta: '查看系统案例 →'
      },
      {
        slug: 'paytrace',
        eyebrow: 'Independent Lab · 可复现演示',
        name: 'PayTrace',
        title: '把支付成功率下降，归因为可验证的阶段、损失与证据。',
        summary:
          '独立设计并实现：确定性代码计算损失与异常，Hook 链治理的 Diagnostic Harness 编排 Agent 调查，证据契约校验每条结论，故障注入与隔离 Ground Truth 支撑自动评测与公开复现。',
        responsibility:
          '业务问题：成功率下降只是信号——需要回答损失发生在哪个阶段、影响多大、哪些根因有证据、哪些仍是未知。',
        flow: ['支付漏斗', '异常信号', '损失拆解', 'Harness 调查', '证据绑定', '评测回归'],
        highlights: [
          {
            label: 'Deterministic Core',
            text: '指标计算、异常检测与损失拆解由代码完成，模型只组织调查。'
          },
          {
            label: 'Evidence Contract',
            text: '每条 Claim 绑定 call_id + query_fingerprint + result_hash，无依据归因被阻断。'
          },
          {
            label: 'Eval Loop',
            text: '故障注入黄金场景与隔离 Ground Truth，pass^3 保证连续可靠性。'
          }
        ],
        evidence: [
          { label: 'Root Cause F1', value: '0.61 → 0.87（Multi-label）' },
          { label: 'pass^3', value: '67% → 91%' },
          { label: 'Tool Success', value: '98.9%' },
          { label: 'Pipeline', value: 'funnel → incident → harness → evidence → eval' }
        ],
        stack: 'Next.js · FastAPI · PostgreSQL · DuckDB · tRPC-Agent-Python · pytest',
        cta: '查看系统案例 →'
      }
    ]
  },
  experience: {
    label: 'EXPERIENCE',
    title: '在真实项目中，把数据、后端和 AI 能力接成闭环。',
    expand: '展开重点',
    collapse: '收起重点',
    items: [
      {
        period: '2026.05 — NOW',
        company: '金山办公',
        role: '安全开发实习生 · EnergyOps Agent',
        contribution: '能耗数据链路、异常告警、MCP / WPS Comate 接入',
        focus: '重点：复杂时序数据质量、可恢复调度与 Agent 工具调用边界。'
      },
      {
        period: '2025.10 — 2026.03',
        company: '深圳市慧泽致远',
        role: 'AI 应用开发实习生 · 数驭穹图',
        contribution: '协同表格、湖仓、Text-to-SQL 与组织权限',
        focus: '重点：多源数据进入可协同、可查询、可由 Agent 使用的统一工作流。'
      },
      {
        period: '2025.09 — 2026.01',
        company: '成都启点拓界',
        role: '全栈开发工程师 · Ovanta',
        contribution: '结构化内容系统、支付链路、权益与多版本站点交付',
        focus: '重点：内容建模与发布、支付回调 Hook 链、权益一致性与 E2E 回归。'
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
        name: 'tRPC Agent #91',
        status: 'Open Source',
        description: 'Eval → 失败归因 → Prompt 优化 → 回归验证',
        href: 'https://github.com/Ygrowly',
        external: true
      },
      {
        name: '星币六',
        status: 'Hackathon',
        description: '闲置物品估值、心愿与财商管理体验',
        href: '/projects'
      }
    ]
  },
  writing: {
    label: 'WRITING',
    title: '记录系统如何被设计、验证和修正。',
    latest: '最新 Blog',
    notes: 'Notes',
    emptyBlog: 'Writing is being prepared. Browse notes or switch language.',
    emptyNotes: 'Notes are being organized.',
    readMore: '继续阅读 →'
  },
  talks: { label: 'TALKS & DEMOS' },
  profile: {
    label: 'PROFILE',
    rows: [
      { label: 'Education', value: '数据科学与大数据技术 · 2027 届' },
      { label: 'Focus', value: 'AI Application Engineering · Agent · Data Systems' },
      { label: 'Backend', value: 'Python · FastAPI · PostgreSQL · Redis · Docker' },
      { label: 'AI Engineering', value: 'MCP · Tool Use · Eval · Memory · Observability' }
    ],
    statement: '我更关注 AI 如何进入可观测、可恢复的业务流程，而不只是完成一次看起来正确的回答。',
    cta: '了解更多关于我 →'
  },
  contact: {
    label: 'OPEN TO OPPORTUNITIES',
    text: '正在寻找 2027 届 AI 应用开发 / Python 后端相关机会，也欢迎交流 Agent 工程、数据系统与开源实践。',
    email: '发送邮件',
    github: 'GitHub',
    resume: '查看简历'
  },
  night: {
    echoLabel: 'SYSTEM ECHOES',
    echoTitle: '系统回声',
    echoSub: '真实项目留下的可验证证据，而不是形容词。',
    echoes: [
      {
        text: '从累计读数到可信统计、异常诊断与 Agent 工具调用——链路可运行、可验证。',
        source: 'EnergyOps Agent · 金山办公 2026'
      },
      {
        text: '指标计算、异常检测与损失拆解全部由代码决定，模型只组织调查。',
        source: 'PayTrace · Deterministic Core'
      },
      {
        text: '每条结论绑定 call_id + query_fingerprint + result_hash，无依据归因被阻断。',
        source: 'PayTrace · Evidence Contract'
      },
      {
        text: '支付回调通过签名、金额、状态机与幂等校验——权益一致性 99.95%。',
        source: 'Ovanta · Payment Hook Chain'
      },
      {
        text: '16 类内容模型、25 个类型化组件，支撑 11+ 产品、200+ 页面统一发布。',
        source: 'Ovanta · Content System'
      },
      {
        text: 'Root Cause F1 0.61 → 0.87，pass^3 67% → 91%——评测回归驱动连续可靠性。',
        source: 'PayTrace · Eval Loop'
      }
    ],
    exploreLabel: 'EXPLORE BEYOND',
    exploreTitle: '再往前走一点',
    exploreSub: '四个方向，继续浏览。',
    exploreCards: [
      {
        title: '我构建的东西',
        sub: 'EnergyOps、数驭穹图、PayTrace、Ovanta 的完整案例与证据。',
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
    backToTop: 'Back to top ↑'
  }
}

const en: HomeContent = {
  meta: {
    title: 'Yuguang Liu | AI Application & Python Backend Engineer',
    description:
      'Portfolio of Yuguang Liu, focused on agent engineering, Python backends, data systems, open source, and technical writing.'
  },
  hero: {
    eyebrow: 'YUGUANG LIU · AI APPLICATION DEVELOPER · CLASS OF 2027',
    title: 'I bring AI into real workflows—and engineer the system around it.',
    description:
      'Focused on agent engineering, Python backends, and data systems. I build observable, recoverable applications across enterprise energy, business analytics, payment diagnosis, and cross-border services.',
    resume: 'View Résumé ↗',
    projects: 'Explore Selected Systems ↓',
    writing: 'Read Latest Writing →',
    status: [
      'Class of 2027',
      'AI Application / Python Backend',
      'Guangzhou or Shenzhen preferred',
      'Open to opportunities'
    ],
    recentLabel: 'Recent work',
    recent: [
      'Kingsoft Office',
      'Enterprise AI BI',
      'Ovanta',
      'tRPC Agent Open Source'
    ]
  },
  systems: {
    label: 'SELECTED SYSTEMS',
    title: 'Not feature collections, but systems that can be operated and verified.',
    projects: [
      {
        slug: 'energyops-agent',
        eyebrow: 'Enterprise System · 2026',
        name: 'EnergyOps Agent',
        title: 'From cumulative readings to trustworthy, agent-accessible operations.',
        summary:
          'From cumulative meter readings to trustworthy aggregation, anomaly diagnosis, alert handling, and agent-accessible tools.',
        responsibility:
          'My role spans energy-data ingestion and time-series processing, anomaly rules, alert loops, and packaging business capabilities as WPS Comate experts, Skills, and MCP tools.',
        flow: [
          'Cumulative readings',
          'Interval usage',
          'Hourly / daily',
          'Data quality',
          'Diagnosis',
          'Alert loop',
          'Agent tools'
        ],
        highlights: [
          {
            label: 'Data Quality',
            text: 'First readings, rollbacks, long gaps, abnormal jumps, and partial coverage.'
          },
          {
            label: 'Reliability',
            text: 'Scheduling, checkpoints, startup recovery, backfills, and transparent partial states.'
          },
          {
            label: 'Agent Integration',
            text: 'Experts, Skills, MCP tools, and confirmation boundaries for risky actions.'
          }
        ],
        evidence: [
          { label: 'Backend', value: 'Tested' },
          { label: 'MCP', value: 'Tested' },
          { label: 'Frontend', value: 'Build verified' },
          { label: 'Pipeline', value: 'raw → interval → hourly → daily' }
        ],
        cta: 'View system case →'
      },
      {
        slug: 'ai-bi-platform',
        eyebrow: 'Enterprise AI BI · 2025–2026',
        name: 'DataSphere AI BI',
        title: 'One workflow for collaborative data, analytical queries, and agents.',
        summary:
          'A unified workflow for multi-source data, collaborative tables, analytical queries, and agent interaction.',
        responsibility:
          'I worked on collaborative tables, lakehouse data processing, and organization permissions, with exposure to Text-to-SQL, BI analysis, and agent tool integration.',
        flow: [
          'Multi-source data',
          'Object store / lakehouse',
          'Collaborative table',
          'Text-to-SQL',
          'BI analysis',
          'Agent interaction'
        ],
        highlights: [
          {
            label: 'Collaborative Data',
            text: 'The online table acts as both editing interface and shared data source.'
          },
          {
            label: 'Lakehouse Query',
            text: 'PostgreSQL, R2, and DuckDB support storage and analytical workloads.'
          },
          {
            label: 'Permission Context',
            text: 'Organization, membership, and data scope enter query and agent context.'
          }
        ],
        evidence: [
          { label: 'Workflow', value: 'source → table → query → insight' },
          { label: 'Context', value: 'organization · member · data scope' }
        ],
        stack: 'Next.js · PostgreSQL · R2 · DuckDB · Univer · MCP',
        cta: 'View system case →'
      },
      {
        slug: 'paytrace',
        eyebrow: 'Independent Lab · Reproducible Demo',
        name: 'PayTrace',
        title: 'Turning payment-success drops into verifiable stages, losses, and evidence.',
        summary:
          'An independent system I designed and built: deterministic code computes losses and anomalies, a Hook-governed Diagnostic Harness orchestrates agent investigation, an evidence contract validates every claim, and fault-injected golden scenarios with isolated ground truth power automated evals and public reproduction.',
        responsibility:
          'Business problem: a success-rate drop is only a signal — the real questions are which stage, how much loss, which root causes are evidence-backed, and what remains unknown.',
        flow: [
          'Payment funnel',
          'Anomaly signal',
          'Loss ledger',
          'Harness investigation',
          'Evidence binding',
          'Eval regression'
        ],
        highlights: [
          {
            label: 'Deterministic Core',
            text: 'Metrics, anomaly detection, and loss attribution run in code; the model only organizes the investigation.'
          },
          {
            label: 'Evidence Contract',
            text: 'Every Claim binds call_id + query_fingerprint + result_hash; unsupported attribution is blocked.'
          },
          {
            label: 'Eval Loop',
            text: 'Fault-injected golden scenarios with isolated ground truth; pass^3 enforces continuous reliability.'
          }
        ],
        evidence: [
          { label: 'Root Cause F1', value: '0.61 → 0.87 (multi-label)' },
          { label: 'pass^3', value: '67% → 91%' },
          { label: 'Tool Success', value: '98.9%' },
          { label: 'Pipeline', value: 'funnel → incident → harness → evidence → eval' }
        ],
        stack: 'Next.js · FastAPI · PostgreSQL · DuckDB · tRPC-Agent-Python · pytest',
        cta: 'View system case →'
      }
    ]
  },
  experience: {
    label: 'EXPERIENCE',
    title: 'Connecting data, backend systems, and AI inside real projects.',
    expand: 'Show focus',
    collapse: 'Hide focus',
    items: [
      {
        period: '2026.05 — NOW',
        company: 'Kingsoft Office',
        role: 'Security Development Intern · EnergyOps Agent',
        contribution: 'Energy data pipelines, anomaly alerts, MCP, and WPS Comate integration',
        focus: 'Focus: time-series data quality, recoverable scheduling, and agent tool boundaries.'
      },
      {
        period: '2025.10 — 2026.03',
        company: 'Shenzhen Huize Zhiyuan',
        role: 'AI Application Development Intern · DataSphere',
        contribution:
          'Collaborative tables, lakehouse workflows, Text-to-SQL, and organization access',
        focus:
          'Focus: a unified workflow where multi-source data can be edited, queried, and used by agents.'
      },
      {
        period: '2025.09 — 2026.01',
        company: 'Chengdu Qidian Tuojie',
        role: 'Full-stack Engineer · Ovanta',
        contribution:
          'Structured content system, payment pipeline, entitlements, and multi-site delivery',
        focus:
          'Focus: content modeling and publishing, payment callback hook chains, entitlement consistency, and E2E regression.'
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
        name: 'tRPC Agent #91',
        status: 'Open Source',
        description: 'Eval → failure attribution → prompt optimization → regression verification',
        href: 'https://github.com/Ygrowly',
        external: true
      },
      {
        name: 'Six of Pentacles',
        status: 'Hackathon',
        description: 'Valuation, wish lists, and financial literacy for idle items',
        href: '/en/projects'
      }
    ]
  },
  writing: {
    label: 'WRITING',
    title: 'Notes on how systems are designed, verified, and corrected.',
    latest: 'Latest Blog',
    notes: 'Notes',
    emptyBlog: 'Writing is being prepared. Browse notes or switch language.',
    emptyNotes: 'Notes are being organized.',
    readMore: 'Continue reading →'
  },
  talks: { label: 'TALKS & DEMOS' },
  profile: {
    label: 'PROFILE',
    rows: [
      { label: 'Education', value: 'Data Science and Big Data Technology · Class of 2027' },
      { label: 'Focus', value: 'AI Application Engineering · Agent · Data Systems' },
      { label: 'Backend', value: 'Python · FastAPI · PostgreSQL · Redis · Docker' },
      { label: 'AI Engineering', value: 'MCP · Tool Use · Eval · Memory · Observability' }
    ],
    statement:
      'I care more about how AI enters observable, recoverable business workflows than whether it produces one convincing answer.',
    cta: 'More about me →'
  },
  contact: {
    label: 'OPEN TO OPPORTUNITIES',
    text: 'I’m looking for 2027 graduate opportunities in AI application and Python backend engineering, and I’m always open to conversations about agents, data systems, and open source.',
    email: 'Email',
    github: 'GitHub',
    resume: 'View Résumé'
  },
  night: {
    echoLabel: 'SYSTEM ECHOES',
    echoTitle: 'System Echoes',
    echoSub: 'Verifiable evidence left by real systems, not adjectives.',
    echoes: [
      {
        text: 'From cumulative readings to trusted aggregation, anomaly diagnosis, and agent tools — a pipeline that runs and verifies.',
        source: 'EnergyOps Agent · Kingsoft Office 2026'
      },
      {
        text: 'Metrics, anomaly detection, and loss attribution are decided in code; the model only organizes the investigation.',
        source: 'PayTrace · Deterministic Core'
      },
      {
        text: 'Every claim binds call_id + query_fingerprint + result_hash; unsupported attribution is blocked.',
        source: 'PayTrace · Evidence Contract'
      },
      {
        text: 'Payment callbacks pass signature, amount, state machine, and idempotency checks — 99.95% entitlement consistency.',
        source: 'Ovanta · Payment Hook Chain'
      },
      {
        text: '16 content models and 25 typed components power 11+ products and 200+ pages in one publishing flow.',
        source: 'Ovanta · Content System'
      },
      {
        text: 'Root-cause F1 0.61 → 0.87, pass^3 67% → 91% — the eval loop drives continuous reliability.',
        source: 'PayTrace · Eval Loop'
      }
    ],
    exploreLabel: 'EXPLORE BEYOND',
    exploreTitle: 'Explore Beyond This Page',
    exploreSub: 'Four directions to keep browsing.',
    exploreCards: [
      {
        title: 'Things I Built',
        sub: 'Full cases and evidence for EnergyOps, DataSphere, PayTrace, and Ovanta.',
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
        '面向中国及国际用户的签证、移民与海外身份自助申请平台，一套核心代码支撑国内版与国际版，覆盖结构化内容、区域化登录支付与会员权益，产品已上线 ovanta.cn。',
      responsibility:
        '业务问题：把分散、专业且持续变化的官方政策组织为可审核、可组合、可授权的结构化指南，并通过订阅、支付与权益完成商业化交付。',
      flow: ['政策内容', '结构化建模', '资格评估', '订阅支付', '权益发放', '顾问服务', '运营回流'],
      highlights: [
        {
          label: 'Content System',
          text: '16 类内容模型与 25 个类型化组件，支撑 11+ 产品、200+ 页面统一编辑与发布。'
        },
        {
          label: 'Payment Hook Chain',
          text: '支付回调走阻断型 Hook 链：签名、金额、状态机与幂等校验，权益一致性 99.95%。'
        },
        {
          label: 'E2E Regression',
          text: '50 条 E2E 覆盖两站点、6 类渠道与权益边界，Given-When-Then 通过率 ≥ 98%。'
        }
      ],
      evidence: [
        { label: 'Content Models', value: '16 models · 25 components · 200+ pages' },
        { label: 'Entitlements', value: '99.95% consistency · 100% idempotent' },
        { label: 'Events API', value: 'P95 96ms · duplicate rate 0.08%' },
        { label: 'E2E', value: '50 cases · pass rate ≥ 98%' }
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
        'Business problem: organizing scattered, professional, and ever-changing official policies into auditable, composable, and licensable structured guides — then completing commercial delivery through subscriptions, payments, and entitlements.',
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
          text: '16 content models and 25 typed components power 11+ products and 200+ pages through one editing and publishing flow.'
        },
        {
          label: 'Payment Hook Chain',
          text: 'Payment callbacks pass a blocking Hook chain — signature, amount, state machine, and idempotency checks — with 99.95% entitlement consistency.'
        },
        {
          label: 'E2E Regression',
          text: '50 E2E cases cover both regional sites, 6 payment channels, and entitlement boundaries with a ≥ 98% Given-When-Then pass rate.'
        }
      ],
      evidence: [
        { label: 'Content Models', value: '16 models · 25 components · 200+ pages' },
        { label: 'Entitlements', value: '99.95% consistency · 100% idempotent' },
        { label: 'Events API', value: 'P95 96ms · duplicate rate 0.08%' },
        { label: 'E2E', value: '50 cases · pass rate ≥ 98%' }
      ],
      stack: 'React · Vite · Django · DRF · Strapi · MySQL · PostgreSQL · Redis · Celery · Docker Compose · Cloudflare',
      cta: 'View project →'
    }
  ]
}

export function projectHref(slug: string, lang: Lang) {
  return `${lang === 'en' ? '/en' : ''}/projects/${slug}`
}
