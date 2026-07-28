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
  footer: { copyright: string; note: string; backToTop: string }
}

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
      '专注 Agent Engineering、Python 后端与数据系统。做过园区能耗、企业 AI BI 与智能信息分析平台，持续实践工具调用、评测与可恢复工作流。',
    resume: '查看简历 PDF ↗',
    projects: '浏览精选项目 ↓',
    writing: '阅读最新文章 →',
    status: ['2027 届', 'AI 应用开发 / Python 后端', '广州、深圳优先', 'Open to opportunities'],
    recentLabel: '近期经历',
    recent: ['金山办公', '企业 AI BI', 'AI 资讯平台', 'tRPC Agent 开源实践']
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
        role: '后端开发实习生 · AI 资讯筛选平台',
        contribution: '多源采集、清洗、AI 摘要分类与通知链路',
        focus: '重点：合规采集、内容处理与结果分发的后端链路。'
      }
    ]
  },
  lab: {
    label: 'LAB & OPEN SOURCE',
    items: [
      {
        name: 'PayTrace',
        status: 'Building',
        description: '跨境支付异常归因与诊断 Agent',
        href: '/projects/paytrace'
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
      'Focused on agent engineering, Python backends, and data systems. I build observable, recoverable AI applications across enterprise energy, analytics, and information workflows.',
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
      'AI Intelligence Platform',
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
        role: 'Backend Development Intern · AI Intelligence Platform',
        contribution:
          'Multi-source ingestion, cleaning, AI summarization, classification, and delivery',
        focus: 'Focus: compliant collection, content processing, and result-distribution pipelines.'
      }
    ]
  },
  lab: {
    label: 'LAB & OPEN SOURCE',
    items: [
      {
        name: 'PayTrace',
        status: 'Building',
        description: 'An agent for cross-border payment anomaly attribution and diagnosis',
        href: '/en/projects/paytrace'
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
      slug: 'paytrace',
      eyebrow: 'Building · Independent Lab',
      name: 'PayTrace',
      title: '跨境支付异常归因与诊断 Agent。',
      summary:
        '这是一个仍在构建中的独立系统与评测实验场，当前重点是异常上下文整理、归因链路和可验证诊断。',
      responsibility:
        '状态说明：Building。页面只记录已明确的目标和工程边界，不把规划包装为已完成能力。',
      flow: ['交易上下文', '异常信号', '归因假设', '工具验证', '诊断结论'],
      highlights: [
        { label: 'Attribution', text: '把异常信号组织为可检查的归因路径。' },
        { label: 'Tool Use', text: '通过受控工具补充证据，不直接放大模型猜测。' },
        { label: 'Evaluation', text: '围绕诊断是否可验证设计后续评测。' }
      ],
      evidence: [
        { label: 'Status', value: 'Building' },
        { label: 'Scope', value: 'Attribution · Diagnosis · Eval' }
      ],
      cta: '返回项目列表 →'
    }
  ],
  en: [
    ...en.systems.projects,
    {
      slug: 'paytrace',
      eyebrow: 'Building · Independent Lab',
      name: 'PayTrace',
      title: 'An agent for cross-border payment anomaly attribution and diagnosis.',
      summary:
        'An independent system and evaluation lab still under active construction, focused on anomaly context, attribution paths, and verifiable diagnosis.',
      responsibility:
        'Status: Building. This page documents confirmed goals and engineering boundaries without presenting planned capabilities as finished work.',
      flow: [
        'Transaction context',
        'Anomaly signal',
        'Attribution hypothesis',
        'Tool verification',
        'Diagnosis'
      ],
      highlights: [
        {
          label: 'Attribution',
          text: 'Organize anomaly signals into inspectable attribution paths.'
        },
        {
          label: 'Tool Use',
          text: 'Use controlled tools to gather evidence without amplifying model guesses.'
        },
        {
          label: 'Evaluation',
          text: 'Shape future evaluation around whether a diagnosis can be verified.'
        }
      ],
      evidence: [
        { label: 'Status', value: 'Building' },
        { label: 'Scope', value: 'Attribution · Diagnosis · Eval' }
      ],
      cta: 'Back to projects →'
    }
  ]
}

export function projectHref(slug: string, lang: Lang) {
  return `${lang === 'en' ? '/en' : ''}/projects/${slug}`
}
