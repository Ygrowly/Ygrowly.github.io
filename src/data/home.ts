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
  /** `detailOnly` rows are withheld from the homepage theater and shown only on the project page. */
  evidence: { label: string; value: string; detailOnly?: boolean }[]
  /** Decision → why → what it costs. The part interviewers actually probe. */
  tradeoffs: { decision: string; why: string; cost: string }[]
  /** Deliberate non-goals. Knowing the boundary is a stronger signal than claiming reach. */
  outOfScope: string[]
  /** Known gaps and unresolved questions — an honest invitation to dig in. */
  openQuestions: string[]
  /**
   * Where to actually go look: a public repository or a live site. A tech
   * interviewer's first instinct is to open the code, so this sits next to the
   * summary rather than at the bottom of the page.
   */
  links?: { label: string; href: string; kind: 'repo' | 'site' }[]
  /**
   * Shown in the same slot as {@link links} when there is no repository to link
   * to. Company systems get this instead of an empty gap.
   */
  sourceNote?: { title: string; body: string; instead: string[] }
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
        tradeoffs: [
          {
            decision: '把安全边界交给 Hook 链，而不是写进 Prompt',
            why: '对模型来说「查询」和「发布」只是两个不同的工具名，它不理解操作的真实代价。用 Prompt 划边界等于把安全交给概率。',
            cost: '每个写工具都要显式定义参数 Schema、风险等级、幂等键与审计字段，R2 级还要设计二次确认态——新增一个写工具的成本远高于加一句 Prompt。'
          },
          {
            decision: '异常候选与业务告警拆成三层，不直接等价',
            why: '把「数据偏离」直接等同于「发送告警」，结果是大量低价值通知淹没真正需要处理的问题。',
            cost: '自适应基线、候选评分、静默窗口变成三套要维护的配置，运营侧多了一层需要理解的模型；冷启动阶段样本不足，只能如实标记「不可判定」。'
          },
          {
            decision: '只让可信区间进入聚合，质量存疑的读数不做估算',
            why: '估算出来的数据看起来更完整，但一旦进入结算就无法追溯。宁可在覆盖率上开天窗，也不让来源不明的数字进账。',
            cost: '覆盖率指标会低于「什么都算上」的方案，需要向业务解释缺口；补数依赖人工流程，短期无法自动化。'
          },
          {
            decision: '大结果外置为 Artifact，不进入模型上下文',
            why: '读数明细动辄数万行，塞进上下文只会挤掉真正需要推理的信息，还会推高成本。',
            cost: '模型手里只剩聚合摘要和引用，需要细节时必须二次取用——多一次工具往返，换上下文可控。'
          }
        ],
        outOfScope: [
          '不替代既有采集平台完成物理设备采集与底层协议接入',
          '不直接控制空调、照明、冷站等设施',
          '不负责设备维修的派工、排班与 SLA 计时——工单只覆盖「通知—指南—反馈—关单」的信息闭环',
          '不替代财务系统完成记账、付款、开票或总账管理',
          '不开展正式碳核算、ESG 披露或 ISO 50001 认证',
          '不把异常候选自动等同于正式业务事故',
          '不允许模型直接修改原始读数、决定费用或绕过业务规则',
          '不扩展为门禁、消防、资产与物业的完整智慧园区平台'
        ],
        openQuestions: [
          '自适应基线在季节切换期会同时抬高误报和漏报，目前靠人工确认兜底；按业态分别建模是方向，但样本量还不够',
          '异常候选的评分权重仍来自人工经验，缺少「候选→真实事故」的标注数据来校准',
          '工单只覆盖信息闭环，没有和维修系统的排班、SLA 数据打通，处置效果无法量化回流',
          'R2 级写操作目前要求逐次人工确认，批量与高频场景下的确认体验还没有好答案'
        ],
        sourceNote: {
          title: '为什么没有代码仓库',
          body: 'EnergyOps Agent 是我在金山实习期间参与的企业内部系统，代码、数据与部署环境都属于公司资产，不在公开范围内。上面写的是我能独立讲清楚的部分。',
          instead: [
            '架构与链路可以当面展开：质量状态判定、多层聚合、调度自愈与 Hook 链治理的具体设计',
            '评测口径可以讲清楚：回放评测怎么构造、固定查询集怎么选、为什么用任务完成率而不是单次成功率',
            '幂等窗口、越权拦截这类机制可以讲实现思路，内部代码与数据不带走'
          ]
        },
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
        tradeoffs: [
          {
            decision: 'Workflow 管主流程，Agent 只处理局部决策',
            why: '完全固定的 Pipeline 应付不了自然语言的变化；完全自主的 Agent Loop 又让权限、成本和业务前置条件变得不可控。',
            cost: '状态与转移必须显式设计，改一条主流程比改一句 Prompt 慢得多；跨域前置条件要写死在代码里，灵活性换可控性。'
          },
          {
            decision: '指标口径沉淀在语义层，而不是让模型每次现推',
            why: 'SQL 能执行不等于业务答案正确——「销售额」到底是下单金额还是支付金额，必须由业务定义一次，而不是由模型每次猜。',
            cost: '领域包、指标、维度、术语别名都要持续维护；新接入一个数据源得先做语义资产，起步比直连数据库慢。'
          },
          {
            decision: '图表必须绑定证据，绑定失败降级而不是阻断',
            why: '合法 JSON 只能保证字段存在，不能保证数值来自真实查询、没有被模型补写。但因为一张图就中断整条回答，代价又过高。',
            cost: '要在 Tool Call 与渲染之间维护 call_id、query_fingerprint、result_hash 三者的传递，任何一环改动都要同步；降级意味着用户偶尔会看到「不可信」的图表。'
          },
          {
            decision: '数据过期时 fail closed，而不是展示旧结果',
            why: '无法证明数据是当前的，就不该生成「当前」结论。静默展示旧数据比明确报错危险得多。',
            cost: '可用性下降——数据源抖动时用户拿到的是失败原因而非答案，需要额外的缓存与重试策略来把这种情况压到最低。'
          }
        ],
        outOfScope: [
          '不替代 ERP、CRM、电商平台与财务系统承担业务交易',
          '不替代企业建设完整的离线数仓、实时数仓或大型数据治理平台',
          '不自动修复源系统中缺失、错误或长期未更新的数据',
          '不允许大模型绕过权限访问全部数据库、系统表或敏感字段',
          '不向模型提供生产数据库的任意写入能力',
          '不由 AI 单方面决定销售额、有效用户、利润等正式业务定义',
          '不把模型生成的解释自动视为经过证明的因果结论',
          '不在数据质量差、语义缺失或权限不足时强行生成确定答案'
        ],
        openQuestions: [
          '语义资产的维护成本随数据源数量线性增长，还没有好办法让它自动跟上源系统的结构变更',
          '指标口径冲突时系统能检测并澄清，但「谁有权最终裁定」是组织问题——技术只能把冲突暴露出来',
          '结果合理性检查依赖结构特征（粒度、JOIN 膨胀、单位一致性），对物理上合法但业务上无意义的查询仍会放行',
          '跨多个数据源的关联查询，在只读、限时、限量的约束下如何兼顾性能与安全，目前没有定论'
        ],
        sourceNote: {
          title: '为什么没有代码仓库',
          body: '数驭穹图是我在深圳市慧泽致远参与的产品，代码与客户数据不在公开范围内。这里保留的是方法论层面的内容。',
          instead: [
            '语义层与领域路由可以展开：指标口径怎么沉淀、两级意图契约怎么切分职责',
            '查询安全可以讲：权限上下文、SQL AST 审查与输出脱敏各拦什么、为什么分层',
            '证据绑定的三个标识可以讲传递路径，以及失败时为什么选择降级而不是阻断'
          ]
        },
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
          { label: 'Eval Set', value: '设计 · 24 Case 双评测集，16 开发 + 8 隔离' },
          { label: 'Mechanism', value: '实测 · 正常场景误报 0 · Ground Truth 泄漏 0 · 同版本重放 3/3' },
          { label: 'Discovery', value: '实测 · 发现率 0–20%，设计门禁 ≥75% 未达标', detailOnly: true },
          { label: 'Gate', value: '反例 → pytest 回归 → 发布门禁' }
        ],
        tradeoffs: [
          {
            decision: '用确定性 Oracle 裁决，不用 LLM Judge',
            why: '资金守恒与生命周期不变量可以稳定计算；LLM Judge 适合评价表达质量，不适合裁决钱对不对。',
            cost: '每条规则的不变量都得显式建模成可执行断言，覆盖不到的语义只能如实声明为未知，没有兜底判断的余地。'
          },
          {
            decision: '参考模拟器快速探索 + 独立 Sandbox 真实 HTTP 重放',
            why: '只在模拟器里跑等于自证——模拟器说有问题，不代表真实系统有问题；全部走真实 HTTP 又太慢，搜索根本展不开。',
            cost: '要维护两层世界并保证语义一致，「晋升」这条路径本身变成需要被测试的对象。'
          },
          {
            decision: '显式 Workflow / FSM 控制主流程，Agent 只负责搜索未知路径',
            why: '这个系统的生命周期是有限的，状态和失败语义都能写清楚；把主流程交给编排框架会把关键机制藏起来。',
            cost: '放弃框架带来的搭建速度——重试、恢复、状态转移全部自己实现并测试，前期投入明显更高。'
          },
          {
            decision: '先编译成 RuleSpec 并人工确认，不让 Agent 直接读自然语言规则',
            why: '自然语言规则里的歧义必须被人确认并冻结版本，否则后面所有裁决都建立在一套会漂移的语义上。',
            cost: '规则接入多了一道人工环节，吞吐受限于确认人力；RuleSpec 的表达能力同时也框住了可验证规则的范围。'
          },
          {
            decision: '隔离 Ground Truth，让 Agent 全程无法触达',
            why: '如果 Agent 能读到标准答案，它找到的「漏洞」就可能只是复述考纲——虚假的高分比低分更危险。',
            cost: '隐藏集只能由评测侧维护，调试时看不到失败细节，定位问题要靠 Trace 反推而不是直接对答案。'
          }
        ],
        outOfScope: [
          '不执行真实支付、库存、物流与商家结算',
          '不直接访问生产电商系统',
          '不证明复杂真实并发与分布式事务',
          '不支持任意行业自由建模——只有「有限动作、明确状态、可执行环境、确定性不变量」四个条件同时成立才适合迁移',
          '不让 Agent 自动修改和发布业务代码',
          '不做形式化证明，不声明规则绝对安全',
          '不自动海量生成规则和用例',
          '不用 LLM Judge 替代确定性业务裁决'
        ],
        openQuestions: [
          'LLM 策略发现率实测 0–20%，还没跑赢确定性 BFS 基线（20–22%）；Single Agent 在 300s 预算内仍未提交候选——这是当前主攻方向',
          '90s → 300s 是依据实测 p95 延迟校准的单一变量调整，更优的预算曲线还没有答案',
          '24-Case 平台基准证明的是搜索与裁决机制的可信度，不能外推到任意新规则；单条规则的放行结论仍需按规则组合证据',
          '换更真实的靶场解决不了搜索层短板——接入外部电商系统因此被降级为搜索层达标之后的事'
        ],
        links: [{ label: '代码仓库', href: 'https://github.com/Ygrowly/RuleArena', kind: 'repo' }],
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
        tradeoffs: [
          {
            decision: 'Put the safety boundary in a hook chain, not in the prompt',
            why: 'To the model, “query” and “publish” are just two different tool names — it has no sense of what an operation actually costs. Drawing the boundary in a prompt means handing safety to probability.',
            cost: 'Every write tool needs an explicit parameter schema, risk tier, idempotency key, and audit fields, and R2 additionally needs a confirmation state — far more expensive than adding a sentence to a prompt.'
          },
          {
            decision: 'Split anomaly candidates from business alerts into three layers',
            why: 'Treating “data deviates” as equivalent to “send an alert” buries the handful of incidents that matter under a flood of low-value notifications.',
            cost: 'Adaptive baselines, candidate scoring, and quiet windows become three separate configurations to maintain, and operations inherits one more model to understand; during cold start there is not enough history, so the honest output is “undetermined”.'
          },
          {
            decision: 'Only trusted intervals enter aggregation — no estimating questionable readings',
            why: 'Estimated values look more complete, but once they reach settlement they cannot be traced back. Better to leave a visible gap in coverage than to book a number of unknown provenance.',
            cost: 'Coverage reads lower than a “count everything” approach and the gap has to be explained to the business; backfilling stays a manual process and cannot be automated in the short term.'
          },
          {
            decision: 'Offload large results to artifacts instead of putting them in context',
            why: 'Reading detail runs to tens of thousands of rows; putting that in context only crowds out the information that actually needs reasoning, and inflates cost.',
            cost: 'The model keeps only an aggregate summary and a reference, so detail requires a second fetch — one extra tool round-trip in exchange for a bounded context.'
          }
        ],
        outOfScope: [
          'Does not replace the existing acquisition platform for physical metering or protocol integration',
          'Does not directly control HVAC, lighting, or chiller plant',
          'Does not handle maintenance dispatch, shift scheduling, or SLA timing — work orders stop at the notify → guide → feedback → close loop',
          'Does not replace the finance system for bookkeeping, payment, invoicing, or the general ledger',
          'Does not perform formal carbon accounting, ESG disclosure, or ISO 50001 certification',
          'Does not treat an anomaly candidate as automatically equivalent to a confirmed incident',
          'Does not let the model modify raw readings, decide charges, or bypass business rules',
          'Does not expand into access control, fire safety, asset, or property management'
        ],
        openQuestions: [
          'The adaptive baseline raises both false positives and false negatives during seasonal changeovers; human confirmation covers it today, and per-usage-type modeling needs more samples than we have',
          'Anomaly scoring weights still come from human judgment — there is no labeled candidate-to-incident data to calibrate against',
          'Work orders stop at the information loop; without maintenance-system scheduling and SLA data, disposition outcomes cannot be quantified back',
          'R2 write operations require per-action human confirmation, and there is no good answer yet for confirmation UX under batch or high-frequency load'
        ],
        sourceNote: {
          title: 'Why there is no repository',
          body: 'EnergyOps Agent is an internal enterprise system I worked on during my internship at Kingsoft. The code, data and deployment environment are company assets and are not public. What is written above is the part I can explain on my own.',
          instead: [
            'The architecture is fair game to walk through: quality-state decisions, layered aggregation, recoverable scheduling and hook-chain governance',
            'The evaluation methodology is explainable: how replay evals are built, how the fixed query set is chosen, and why task completion beats a single-run success rate',
            'Mechanisms like idempotency windows and privilege blocking can be described — the internal code and data stay inside'
          ]
        },
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
        tradeoffs: [
          {
            decision: 'Workflow drives the main flow; the agent handles only local decisions',
            why: 'A fully fixed pipeline cannot absorb the variation in natural language, while a fully autonomous agent loop makes permissions, cost, and business preconditions uncontrollable.',
            cost: 'States and transitions must be designed explicitly, so changing the main flow is much slower than editing a prompt; cross-domain preconditions get written into code — flexibility traded for control.'
          },
          {
            decision: 'Settle metric definitions in a semantic layer instead of re-deriving them per query',
            why: 'A SQL query executing is not the same as the business answer being right — whether “revenue” means order value or paid value has to be defined once by the business, not guessed by the model every time.',
            cost: 'Domain packs, metrics, dimensions, and term aliases all need ongoing maintenance; onboarding a new source starts with semantic assets, which is slower than pointing the model straight at a database.'
          },
          {
            decision: 'Charts must bind evidence; a failed binding degrades rather than blocks',
            why: 'Valid JSON only guarantees the fields exist, not that the numbers came from a real query or that the model did not fill them in. But killing an entire answer over one chart costs too much.',
            cost: 'call_id, query_fingerprint, and result_hash all have to be threaded from tool call to render, and any change to one has to be mirrored; degradation also means users occasionally see a chart marked untrusted.'
          },
          {
            decision: 'Fail closed on stale data instead of showing old results',
            why: 'If you cannot prove the data is current, you should not produce a “current” conclusion. Silently showing stale numbers is far more dangerous than an explicit error.',
            cost: 'Availability drops — when a source wobbles the user gets a failure reason instead of an answer, and extra caching and retry strategy is needed to keep that rare.'
          }
        ],
        outOfScope: [
          'Does not replace ERP, CRM, e-commerce, or finance systems for business transactions',
          'Does not replace building a full offline warehouse, real-time warehouse, or large-scale governance platform',
          'Does not automatically repair missing, wrong, or long-stale data in source systems',
          'Does not let the model bypass permissions to reach every database, system table, or sensitive field',
          'Does not give the model arbitrary write access to production databases',
          'Does not let AI unilaterally define revenue, active users, profit, or other official business definitions',
          'Does not treat model-generated explanation as a proven causal conclusion',
          'Does not force a confident answer when data quality, semantics, or permissions are insufficient'
        ],
        openQuestions: [
          'Semantic asset maintenance grows linearly with the number of sources, and there is no good way yet to keep it in step with upstream schema changes automatically',
          'The system can detect and clarify conflicting metric definitions, but who has the authority to rule is an organizational question — technology can only surface the conflict',
          'Result sanity checks rely on structural signals (grain, join fan-out, unit consistency), so a query that is physically valid but business-nonsensical still passes',
          'For cross-source joins under read-only, time-limited, row-limited constraints, the balance between performance and safety is still unsettled'
        ],
        sourceNote: {
          title: 'Why there is no repository',
          body: 'DataSphere is a product I worked on at Shenzhen Huize Zhiyuan. The code and customer data are not public. What remains here is the methodology.',
          instead: [
            'The semantic layer and domain routing can be opened up: how metric definitions settle, and how the two-level intent contract splits responsibility',
            'Query safety is explainable: what the permission context, SQL AST review and output masking each stop, and why they are layered',
            'The three evidence-binding identifiers can be traced end to end, along with why a failed binding degrades instead of blocking'
          ]
        },
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
          { label: 'Eval Set', value: 'design · 24 cases, 16 dev + 8 hidden (isolated)' },
          {
            label: 'Mechanism',
            value: 'measured · 0 false positives · 0 ground-truth leaks · 3/3 same-version replays'
          },
          {
            label: 'Discovery',
            value: 'measured · 0–20%, below the ≥75% design gate',
            detailOnly: true
          },
          { label: 'Gate', value: 'counterexample → pytest regression → release gate' }
        ],
        tradeoffs: [
          {
            decision: 'Adjudicate with a deterministic oracle, not an LLM judge',
            why: 'Fund conservation and lifecycle invariants can be computed reliably; an LLM judge is fine for judging prose quality and wrong for deciding whether money is correct.',
            cost: 'Every rule’s invariants must be modeled as executable assertions, and semantics outside that coverage can only be declared unknown — there is no fallback judgment.'
          },
          {
            decision: 'Fast exploration in a reference simulator, real HTTP replay in an isolated sandbox',
            why: 'Running only in a simulator is self-proof — the simulator saying something is broken does not mean the real system is broken. Routing everything through real HTTP is far too slow for search to unfold.',
            cost: 'Two worlds have to be maintained with matching semantics, and the promotion path between them becomes an object that itself needs testing.'
          },
          {
            decision: 'An explicit workflow/FSM drives the main flow; the agent only searches unknown paths',
            why: 'The lifecycle here is finite and its states and failure semantics can be written down; handing the main flow to an orchestration framework hides the mechanisms that matter.',
            cost: 'Gives up the setup speed a framework provides — retries, recovery, and state transitions are all implemented and tested by hand, at a clearly higher upfront cost.'
          },
          {
            decision: 'Compile to RuleSpec with human confirmation instead of letting the agent read natural-language rules',
            why: 'Ambiguity in a natural-language rule has to be confirmed by a person and frozen into a version, otherwise every downstream verdict rests on semantics that drift.',
            cost: 'Rule onboarding gains a human step and throughput is bounded by confirmation capacity; RuleSpec’s expressiveness also bounds which rules can be verified at all.'
          },
          {
            decision: 'Isolate ground truth so the agent can never reach it',
            why: 'If the agent can read the answer key, a “bug” it finds may just be reciting the syllabus — a fake high score is more dangerous than a low one.',
            cost: 'The hidden set can only be maintained on the evaluation side, so debugging cannot inspect failure details and problems have to be reconstructed from traces.'
          }
        ],
        outOfScope: [
          'Does not execute real payments, inventory, logistics, or merchant settlement',
          'Does not access production e-commerce systems',
          'Does not prove complex real-world concurrency or distributed transactions',
          'Does not model arbitrary domains freely — portability requires all four of finite actions, explicit state, an executable environment, and deterministic invariants',
          'Does not let the agent modify or ship business code',
          'Does not do formal verification and never claims a rule is absolutely safe',
          'Does not mass-generate rules and cases automatically',
          'Does not substitute an LLM judge for deterministic business adjudication'
        ],
        openQuestions: [
          'Measured LLM strategy discovery rate is 0–20%, still below the deterministic BFS baseline (20–22%), and the single agent submitted no candidate within a 300s budget — this is the current focus',
          'The 90s → 300s change was a single-variable adjustment calibrated against measured p95 latency; a better budget curve is still open',
          'The 24-case platform benchmark proves the search and adjudication mechanism is trustworthy, and does not extrapolate to an arbitrary new rule — a single rule’s release verdict still needs rule-specific evidence',
          'A more realistic target system would not fix the search-layer gap, which is why external e-commerce integration was deferred until the search layer clears its bar'
        ],
        links: [{ label: 'Repository', href: 'https://github.com/Ygrowly/RuleArena', kind: 'repo' }],
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
      tradeoffs: [
        {
          decision: '把政策做成结构化内容模型，而不是富文本长文',
          why: '一篇富文本很难知道哪项材料已经过期、当前评估依据的是哪个版本，也无法稳定控制会员可见章节。',
          cost: 'Strapi/PostgreSQL 与 Django/MySQL 之间形成跨系统边界，内容模型每扩展一次都要同步改两侧。'
        },
        {
          decision: '国内版与国际版共享核心业务代码，差异收敛到构建期配置',
          why: '两套代码会立刻分叉，而订单、支付、权益恰恰是最需要保持一致的部分——一旦分叉就再也收敛不回来。',
          cost: '区域差异被压进配置与适配器，运行时的分支判断变多；区域特有的产品需求要先评估是否值得进主干。'
        },
        {
          decision: '支付回调走阻断型 Hook 链：验签、金额、状态机、幂等逐层校验',
          why: '支付回调天然会重复、乱序、延迟到达，任何一步校验缺失都会直接变成多发或少发权益。',
          cost: '回调链路变长，异常路径要单独设计降级与人工介入；对账从此是一项必须长期运行的独立能力。'
        },
        {
          decision: '权限以服务端校验为准，前端展示状态不作为依据',
          why: '前端隐藏一个入口不等于用户没有权限——把展示当授权，等于把权限边界交给浏览器。',
          cost: '每个需要展示态的功能都要服务端再查一次权限，接口数量和往返次数增加。'
        }
      ],
      outOfScope: [
        '不代替政府部门受理或审批申请',
        '不保证签证、移民、永久居民或开户结果',
        '不在缺乏依据时自动作出专业法律判断',
        '不替代顾问完成必须由人工判断和把关的工作',
        '不自动从非权威来源生成并直接发布政策内容',
        '不让 AI 直接修改内容、资格规则、价格、套餐和权益配置',
        '不把运营数据的相关性自动解释为确定因果关系',
        '不通过前端展示状态代替服务端的真实权限校验',
        '不自行处理支付清算——资金仍由合规支付渠道完成'
      ],
      openQuestions: [
        '内容模型的覆盖度取决于编辑对政策的拆解粒度，跨区域复用时「最小公共模型」还没有稳定答案',
        '支付回调已按幂等键压到千次级回放零重复，但渠道侧对账文件的延迟到达仍需人工兜底',
        '如何在「政策结论必须人工确认」这条线之内提高内容生产效率，目前只在运营侧做聚合解释，还谈不上自动化',
        '区域化适配器把差异收敛进了配置，但新区域接入时本地支付渠道与合规要求仍需逐个评估'
      ],
      links: [{ label: '线上站点', href: 'https://www.ovanta.cn/', kind: 'site' }],
      stack: 'React · Vite · Django · DRF · Strapi · MySQL · PostgreSQL · Redis · Celery · Docker Compose · Cloudflare',
      cta: '查看项目详情 →'
    },
    {
      slug: 'paytrace',
      eyebrow: 'Personal Project · Open Source',
      name: 'PayTrace',
      title: '把支付转化异常归因，从「可能是渠道问题」变成可复核的证据链。',
      summary:
        '证据驱动的支付转化异常归因与诊断 Agent：确定性损失拆解定位「哪里损失、损失多少」，受 Hook 链治理的诊断 Agent 在证据契约约束下回答「为什么」。全程模拟数据与可配置故障注入，不接入真实支付渠道，不使用真实用户隐私数据。',
      responsibility:
        '业务问题：支付完成率下降时，看板只能说明「下降了」，日志只能解释单次请求，而错误码、优惠变更和配置发布可能同时出现——相关不等于因果。我独立完成从事件模型、确定性损失账本到诊断 Agent 与评测体系的设计和实现。',
      flow: [
        '支付事件',
        '统一漏斗',
        '损失拆解',
        'Incident 冻结',
        '只读调查',
        '证据登记',
        '多根因诊断',
        '人工处置'
      ],
      highlights: [
        {
          label: 'Deterministic Core',
          text: '九阶段漏斗与购买意图关联由确定性代码计算，损失数值可精确复算——模型不参与事实计算。'
        },
        {
          label: 'Governed Investigation',
          text: '工具调用走 Before/After Hook 链：参数与 Incident 范围校验失败即阻断，大结果外置为 Artifact，上下文只留摘要与引用。'
        },
        {
          label: 'Evidence Contract',
          text: '每条结论必须绑定证据 ID，结论分 SUPPORTED / PARTIAL / UNKNOWN 三级——UNKNOWN 是防止模型硬凑答案的合法输出，不是失败。'
        }
      ],
      evidence: [
        { label: 'Data', value: '全量模拟数据 + 故障注入 · 无真实渠道与隐私数据' },
        { label: 'Eval', value: '双轨评测 · 结果评测 + 轨迹评测' },
        { label: 'Stability', value: '按 pass^k 连续可靠性口径，而非 pass@k' },
        { label: 'GT Leak', value: 'Ground Truth 隔离 · 评测器主动检查泄漏' }
      ],
      tradeoffs: [
        {
          decision: '确定性代码算事实，模型只负责组织调查',
          why: '损失数值必须精确可复算，而根因假设需要在不确定信息中逐步收敛——这两件事的最优解不一样。',
          cost: '每个指标、每次拆解都要显式建模并测试，没法靠模型「顺便」算出来；数据契约一变，改动全落在代码侧。'
        },
        {
          decision: '诊断过程受 Hook 链治理，而不是让 Agent 自由探索',
          why: '越权调用、上下文膨胀、过程失忆是 Agent 的固有问题，靠 Prompt 提醒解决不了。',
          cost: '读侧降级、写侧阻断的语义要为每个工具单独定义，工具接入成本明显高于直接暴露一个查询接口。'
        },
        {
          decision: '把 UNKNOWN 作为合法结论输出',
          why: '证据不足时生成一个看起来完整的答案，比承认不知道危险得多。',
          cost: '报告里会明确出现「没有结论」的情况，必须有人工复核接管；评测也要专门检查 UNKNOWN 是否正确触发，而不是被模型跳过。'
        },
        {
          decision: '全量模拟数据 + 可配置故障注入，不接入真实支付渠道',
          why: '真实支付数据涉及隐私与合规风险；而带 Ground Truth 的故障注入才能做稳定演示、自动评测和版本回归。',
          cost: '无法证明真实商户环境下的业务收益，模拟分布也不等同于任何一家真实支付平台——这条边界必须在项目里显式声明，不能含糊过去。'
        }
      ],
      outOfScope: [
        '不执行支付、不保存卡信息与支付凭据',
        '不自动修改渠道、路由、风控或优惠配置——高风险动作留给人工',
        '不接入真实支付渠道，不使用真实用户隐私数据',
        '不把「预算内未发现」说成「没有问题」',
        '不输出未绑定证据的归因结论',
        '不把相关性解释为因果关系'
      ],
      openQuestions: [
        '故障注入的分布由人工设计，覆盖不到真实生产中尚未被记录过的失败形态',
        '结果评测与轨迹评测的权重如何组合，还没有稳定的校准方法',
        '从生产 Trace 回流真实 Bad Case 是规划中的方向，当前评测集仍以注入场景为主',
        '模拟数据能证明诊断能力与版本间的相对改进，不能证明线上收益——这条结论本身就是项目的诚实边界'
      ],
      links: [{ label: '代码仓库', href: 'https://github.com/Ygrowly/PayTrace', kind: 'repo' }],
      stack: 'Python · FastAPI · PostgreSQL · Redis · MCP · 显式 FSM · 故障注入 · pytest',
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
      tradeoffs: [
        {
          decision: 'Model policy as structured content instead of long-form rich text',
          why: 'In a rich-text article it is hard to tell which requirement has gone stale, which version an assessment was based on, and there is no reliable way to gate chapters by membership.',
          cost: 'A cross-system boundary forms between Strapi/PostgreSQL and Django/MySQL, and every content-model extension has to change both sides.'
        },
        {
          decision: 'Domestic and international sites share core business code, with differences pushed into build-time config',
          why: 'Two codebases diverge immediately, and orders, payments, and entitlements are exactly the parts that most need to stay consistent — once split, they never converge again.',
          cost: 'Regional differences get compressed into config and adapters, so runtime branching increases; region-specific product asks have to be assessed before they reach the trunk.'
        },
        {
          decision: 'Payment callbacks pass a blocking hook chain: signature, amount, state machine, idempotency',
          why: 'Payment callbacks durably duplicate, arrive out of order, and arrive late — any missing check turns directly into granted entitlements that should not exist, or missing ones that should.',
          cost: 'The callback path gets longer and failure modes need their own degradation and manual-intervention design; reconciliation becomes a permanent independent capability.'
        },
        {
          decision: 'Server-side checks are the authority for permissions; frontend display state is never the basis',
          why: 'Hiding an entry point in the frontend does not mean the user lacks access — treating display as authorization hands the permission boundary to the browser.',
          cost: 'Every feature with a display state re-checks permissions on the server, increasing endpoint count and round-trips.'
        }
      ],
      outOfScope: [
        'Does not accept or approve applications on behalf of government agencies',
        'Does not guarantee visa, immigration, permanent-residency, or account-opening outcomes',
        'Does not make professional legal judgments automatically without a factual basis',
        'Does not replace consultants for work that requires human judgment and sign-off',
        'Does not auto-generate and publish policy content from non-authoritative sources',
        'Does not let AI directly modify content, eligibility rules, prices, plans, or entitlements',
        'Does not read correlation in operations data as established causation',
        'Does not let frontend display state stand in for real server-side permission checks',
        'Does not clear payments itself — funds still settle through compliant payment channels'
      ],
      openQuestions: [
        'Content-model coverage depends on how finely editors decompose a policy, and there is no settled “minimal common model” for cross-region reuse',
        'Payment callbacks are down to zero duplicate grants across 1k+ replays by idempotency key, but late-arriving channel reconciliation files still need manual cover',
        'How to raise content-production efficiency without crossing the line that policy conclusions require human confirmation — today AI only aggregates on the operations side, which is not automation',
        'The regionalization adapter folds differences into config, but each new region still needs its payment channels and compliance requirements assessed individually'
      ],
      links: [{ label: 'Live site', href: 'https://www.ovanta.cn/', kind: 'site' }],
      stack: 'React · Vite · Django · DRF · Strapi · MySQL · PostgreSQL · Redis · Celery · Docker Compose · Cloudflare',
      cta: 'View project →'
    },
    {
      slug: 'paytrace',
      eyebrow: 'Personal Project · Open Source',
      name: 'PayTrace',
      title: 'Turning payment conversion anomalies from “probably the channel” into a reviewable chain of evidence.',
      summary:
        'An evidence-driven diagnostic agent for payment conversion anomalies: deterministic loss decomposition establishes where and how much was lost, while a hook-governed diagnostic agent answers why under an evidence contract. Fully simulated data with configurable fault injection — no real payment channels and no real user data.',
      responsibility:
        'Business problem: when payment completion drops, dashboards only say it dropped and logs only explain a single request — while error codes, promotion changes, and config releases may all land at once. Correlation is not causation. I independently designed and built everything from the event model and deterministic loss ledger to the diagnostic agent and its evaluation system.',
      flow: [
        'Payment events',
        'Unified funnel',
        'Loss decomposition',
        'Incident freeze',
        'Read-only investigation',
        'Evidence registry',
        'Multi-root-cause diagnosis',
        'Human disposition'
      ],
      highlights: [
        {
          label: 'Deterministic Core',
          text: 'A nine-stage funnel and purchase-intent correlation are computed by deterministic code, so loss figures are exactly reproducible — the model never computes facts.'
        },
        {
          label: 'Governed Investigation',
          text: 'Tool calls pass a Before/After hook chain: failed parameter or incident-scope validation blocks execution outright, and large results are offloaded to artifacts so context keeps only summaries and references.'
        },
        {
          label: 'Evidence Contract',
          text: 'Every conclusion must bind evidence IDs, and conclusions are graded SUPPORTED / PARTIAL / UNKNOWN — UNKNOWN is a legitimate output that stops the model from inventing a complete-looking answer.'
        }
      ],
      evidence: [
        { label: 'Data', value: 'fully simulated data + fault injection · no real channels or personal data' },
        { label: 'Eval', value: 'two-track eval · response evaluation + trajectory evaluation' },
        { label: 'Stability', value: 'scored on pass^k continuous reliability, not pass@k' },
        { label: 'GT Leak', value: 'ground truth isolated · evaluator actively checks for leaks' }
      ],
      tradeoffs: [
        {
          decision: 'Deterministic code computes facts; the model only organizes the investigation',
          why: 'Loss figures must be exactly reproducible, while root-cause hypotheses have to converge gradually out of uncertain information — the two have different optimal solutions.',
          cost: 'Every metric and every decomposition has to be modeled and tested explicitly instead of falling out of the model; any change to the data contract lands entirely in code.'
        },
        {
          decision: 'Govern the diagnosis through a hook chain instead of letting the agent explore freely',
          why: 'Unauthorized calls, context bloat, and process amnesia are inherent agent problems that a prompt reminder does not solve.',
          cost: 'Degrade-on-read and block-on-write semantics have to be defined per tool, making tool onboarding clearly more expensive than exposing a query endpoint directly.'
        },
        {
          decision: 'Treat UNKNOWN as a legitimate conclusion',
          why: 'Producing a complete-looking answer on thin evidence is far more dangerous than admitting you do not know.',
          cost: 'Reports will visibly say “no conclusion”, which requires human review to take over, and evaluation has to check specifically that UNKNOWN fires correctly rather than being skipped.'
        },
        {
          decision: 'Fully simulated data with configurable fault injection — no real payment channels',
          why: 'Real payment data carries privacy and compliance risk, and only fault injection with ground truth enables stable demos, automatic evaluation, and version regression.',
          cost: 'It cannot prove business results in a real merchant environment, and the simulated distribution does not equal any actual payment platform — a boundary that has to be declared explicitly rather than glossed over.'
        }
      ],
      outOfScope: [
        'Does not execute payments and does not store card details or payment credentials',
        'Does not automatically change channel, routing, risk, or promotion configuration — high-risk actions stay with humans',
        'Does not connect to real payment channels or use real user data',
        'Does not present “not found within budget” as “no problem exists”',
        'Does not emit a root-cause conclusion that is not bound to evidence',
        'Does not read correlation as causation'
      ],
      openQuestions: [
        'The fault-injection distribution is designed by hand, so it cannot cover failure shapes that have not yet been recorded in real production',
        'How to weight response evaluation against trajectory evaluation has no settled calibration method yet',
        'Feeding real bad cases back from production traces is a planned direction; today’s eval set is still mostly injected scenarios',
        'Simulated data can demonstrate diagnostic capability and relative improvement between versions, but not online business results — that limit is itself the project’s honest boundary'
      ],
      links: [{ label: 'Repository', href: 'https://github.com/Ygrowly/PayTrace', kind: 'repo' }],
      stack: 'Python · FastAPI · PostgreSQL · Redis · MCP · explicit FSM · fault injection · pytest',
      cta: 'View project →'
    }
  ]
}

export function projectHref(slug: string, lang: Lang) {
  return `${lang === 'en' ? '/en' : ''}/projects/${slug}`
}
