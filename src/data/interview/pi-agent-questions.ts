import type { InterviewQuestion } from '@/components/blog/interview-question-types'

const commit = 'aa0ec808b970db31822e07835a46647cb51d9d66'
const repository = 'https://github.com/earendil-works/pi'

const source = (path: string) => `${repository}/blob/${commit}/${path}`
const sourceTree = (path: string) => `${repository}/tree/${commit}/${path}`

export const piAgentInterviewQuestions = [
  {
    id: 'q01',
    category: '架构分层',
    question: 'Pi 的三层主干分别解决什么问题，`pi-tui` 为什么不属于主链路？',
    keyPoints: ['pi-ai / Agent Core / Coding Harness', '复用深度', 'UI 与 Loop 解耦'],
    answer:
      'Pi 把 Coding Agent 分成三个复用深度。`pi-ai` 统一 Model、Provider、认证和流式模型协议；`pi-agent-core` 在其上实现消息状态、Agent Loop、工具执行、事件和运行中队列；`pi-coding-agent` 再加入编码场景的 System Prompt、项目上下文、Skills、文件与 Shell 工具、Extensions、Session 和 Compaction。`pi-tui` 是正交交互层，负责消费事件和收集输入，不参与 Loop 的控制决策。\n\n这使同一套底层能力既能单独作为模型 SDK，也能作为通用 Agent Runtime，最后才形成完整 Coding Harness。代价是消息、工具和状态在层间有多次类型扩展与转换，第一次读源码时比单体实现更难追踪。',
    answerStructure: ['一句话结论', '三层职责', 'TUI 的正交位置', '复用收益与转换代价'],
    evidence: [
      { label: '三个 package.json 的依赖关系', href: sourceTree('packages') },
      { label: 'packages/ai/src/models.ts', href: source('packages/ai/src/models.ts') },
      { label: 'packages/agent/src/agent-loop.ts', href: source('packages/agent/src/agent-loop.ts') },
      {
        label: 'packages/coding-agent/src/core/agent-session.ts',
        href: source('packages/coding-agent/src/core/agent-session.ts')
      }
    ],
    followUps: [
      '上层直接使用底层类型是否破坏分层？',
      '消息、工具和状态为什么需要在层间做类型扩展与转换？'
    ],
    relatedSection: {
      label: '回到第 2 章：三层架构与一次请求的总路线',
      href: '#第-2-章三层架构与一次请求的总路线'
    }
  },
  {
    id: 'q02',
    category: '依赖方向',
    question: '为什么依赖方向是 Coding Agent → Agent Core → AI？',
    keyPoints: ['下层知道得更少', '单向依赖', '替换 Provider / UI 的边界'],
    answer:
      '因为越靠下的层知道得越少。`pi-ai` 只处理模型调用，不应该知道 Session、文件工具或 TUI；Agent Core 只依赖统一模型协议，不关心工具究竟读取本地文件还是调用远程服务；Coding Agent 位于最上层，负责把这些能力按编码场景组装起来。\n\n具体收益是替换界面不会触碰 Loop，替换 Provider 不会修改 Session，单独使用模型 SDK 也不必引入 CLI。代价是上层需要显式完成适配，例如把 Coding Agent 的 ToolDefinition 包装成 AgentTool，把自定义 AgentMessage 转成模型 Message。',
    answerStructure: ['解释知识量方向', '逐层划定职责', '说明替换带来的收益', '指出显式适配成本'],
    evidence: [
      {
        label: 'packages/coding-agent/package.json：依赖 pi-agent-core、pi-ai、pi-tui',
        href: source('packages/coding-agent/package.json')
      },
      {
        label: 'packages/agent/package.json：只依赖 pi-ai 等基础库',
        href: source('packages/agent/package.json')
      },
      { label: 'packages/ai/package.json：不依赖上层包', href: source('packages/ai/package.json') }
    ],
    followUps: [
      '为什么 Coding Agent 还会直接依赖 `pi-ai`，不全部通过 Agent Core？',
      '替换界面或 Provider 时，哪些适配仍然必须由上层显式完成？'
    ],
    relatedSection: {
      label: '回到第 2 章：三层架构与一次请求的总路线',
      href: '#第-2-章三层架构与一次请求的总路线'
    }
  },
  {
    id: 'q03',
    category: '模型适配',
    question: '`pi-ai` 如何把不同 Provider 和 API 组织成统一模型能力？',
    keyPoints: ['Provider / Model 分工', '认证与模型发现', '协议事件归一化'],
    answer:
      'Pi 没把 Provider 简化成一个 URL。Provider 是具体运行单元，拥有 ID、认证、模型列表和 stream 行为；Model 描述某个模型属于哪个 Provider、使用哪种 API、上下文窗口和能力；API 实现再负责把统一 Context 翻译成厂商协议，并把厂商事件归一化。\n\n一次调用中，`Models.streamSimple()` 先按 `model.provider` 找到 Provider，动态解析认证，再由 Provider 按 `model.api` 分派到具体协议实现。这样模型发现、认证与协议翻译分开，同时允许一个 Provider 提供多种 API。代价是 Provider-specific options 和兼容性差异仍需显式保留，统一接口并不能消除真实能力差异。',
    answerStructure: ['定义 Provider 与 Model', '说明 API 翻译边界', '沿一次调用追踪分派', '说明统一抽象的残余差异'],
    evidence: [
      {
        label: 'packages/ai/src/models.ts：Provider、Models、createProvider()',
        href: source('packages/ai/src/models.ts')
      },
      { label: 'packages/ai/src/types.ts：公共模型协议', href: source('packages/ai/src/types.ts') }
    ],
    followUps: [
      'Provider 和 API 是一一对应吗？',
      '统一接口为什么仍要保留 Provider-specific options？'
    ],
    relatedSection: {
      label: '回到第 3 章：pi-ai 如何完成一次真实模型调用',
      href: '#第-3-章pi-ai-如何完成一次真实模型调用'
    }
  },
  {
    id: 'q04',
    category: '流式协议',
    question: '为什么一次模型调用不是“请求进去，字符串出来”？',
    keyPoints: ['流式事件', 'AssistantMessage 终态', 'Tool Call / Error / Abort'],
    answer:
      '因为模型响应同时包含过程数据和最终状态。Pi 的统一流先发 `start`，中间可能交错输出 text、thinking 和 tool call 增量，最后以 `done` 或 `error` 结束。这些事件不断聚合为 `AssistantMessage`，其中不仅有内容，还包含 Provider、Model、usage、cost、`stopReason` 和错误信息。\n\nAgent Runtime 一边异步迭代事件给 UI，一边通过 `result()` 得到最终消息。如果结果包含 Tool Call，Generation 已结束，但 Agent Run 仍要执行工具并再次调用模型。Error 和 Abort 也被编码为最终消息，使 UI、Session 与 Runtime 看到一致的结束语义。代价是调用方必须正确处理 partial、终态和不同内容块，不能只拼接文本。',
    answerStructure: ['区分过程数据与最终状态', '说明事件如何聚合', '连接 Generation 与 Agent Run', '补充错误语义和消费代价'],
    evidence: [
      {
        label: 'packages/ai/src/types.ts：AssistantMessageEvent、AssistantMessage',
        href: source('packages/ai/src/types.ts')
      },
      {
        label: 'packages/ai/src/utils/event-stream.ts：AssistantMessageEventStream',
        href: source('packages/ai/src/utils/event-stream.ts')
      }
    ],
    followUps: [
      '`pending` 会写入 Session 吗？',
      '为什么 Tool Call 出现后 Generation 已结束而 Agent Run 还没有结束？'
    ],
    relatedSection: {
      label: '回到第 3 章：pi-ai 如何完成一次真实模型调用',
      href: '#第-3-章pi-ai-如何完成一次真实模型调用'
    }
  },
  {
    id: 'q05',
    category: '上下文迁移',
    question: '会话中途切换模型或 Provider，原有上下文怎样继续使用？',
    keyPoints: ['目标模型前转换', 'Thinking / Tool ID / Image', '有损边界'],
    answer:
      'Pi 会在目标模型调用前转换历史，而不是假设所有协议兼容。跨模型时，可读 thinking 会降级成普通文本，只对原模型有效的 redacted thinking 或签名会被丢弃；不支持图像的目标模型会看到占位文本；Provider 不兼容的 Tool Call ID 会归一化，Tool Result 关联同步更新；孤立 Tool Call 会补错误结果；失败或中止的 AssistantMessage 不会重放。\n\n因此，会话能继续，但不是无损迁移。普通文本、工具语义通常可以保留，Provider 私有的推理状态、缓存与签名可能丢失。设计收益是避免新 Provider 因旧协议对象报错，代价是模型切换后的上下文语义可能弱化，需要接受并测试这一边界。',
    answerStructure: ['先说明转换发生的时机', '列出协议差异的处理', '区分可保留与会丢失的语义', '说明兼容收益与有损代价'],
    evidence: [
      {
        label: 'packages/ai/src/api/transform-messages.ts：transformMessages()',
        href: source('packages/ai/src/api/transform-messages.ts')
      }
    ],
    followUps: [
      '为什么不在消息生成时就转成最通用格式？',
      '模型切换时，哪些普通文本和工具语义可以保留，哪些 Provider 私有语义可能丢失？'
    ],
    relatedSection: {
      label: '回到第 3 章：pi-ai 如何完成一次真实模型调用',
      href: '#第-3-章pi-ai-如何完成一次真实模型调用'
    }
  },
  {
    id: 'q06',
    category: 'Agent Loop',
    question: 'Agent Loop 如何启动、继续和停止？',
    keyPoints: ['prompt / continue', 'Generation / Turn / Run', '队列与停止条件'],
    answer:
      '`prompt()` 会新增 UserMessage 并启动一个 Agent Run；`continue()` 不新增消息，只从最后一条 user 或 tool result 继续，常用于重试与恢复。Run 中每次 Provider 请求是一代 Generation，一个 AssistantMessage 加其工具批次构成一个 Turn。\n\n模型产生 Tool Call 时，当前 Generation 结束，Runtime 执行工具并把 Tool Results 写入上下文，随后开始下一 Turn。没有 Tool Call 后，Loop 先检查 steering，再在原本要停止时检查 follow-up；都没有才发 `agent_end`。`error` 或 `aborted` 会直接结束；`shouldStopAfterTurn` 可优雅停止；`prepareNextTurn` 可调整下一轮 Context 或 Model。\n\n收益是控制流由真实运行信号驱动，不依赖固定轮数。代价是结束条件分散在模型终态、工具结果、队列和 Hook 中，调试时必须区分 Generation、Turn 与 Run。',
    answerStructure: ['区分 prompt 与 continue', '定义 Generation、Turn、Run', '追踪 Tool Result 驱动的下一轮', '说明队列、错误和停止 Hook'],
    evidence: [
      {
        label: 'packages/agent/src/agent.ts：prompt()、continue()',
        href: source('packages/agent/src/agent.ts')
      },
      { label: 'packages/agent/src/agent-loop.ts：runLoop()', href: source('packages/agent/src/agent-loop.ts') }
    ],
    followUps: [
      '为什么不能从 assistant 末尾直接 `continue()`？',
      '没有 Tool Call 时，steering、follow-up 和 `agent_end` 的检查顺序是什么？'
    ],
    relatedSection: {
      label: '回到第 4 章：Agent Loop 如何组织多次模型生成',
      href: '#第-4-章agent-loop-如何组织多次模型生成'
    }
  },
  {
    id: 'q07',
    category: 'Context 投影',
    question: 'Agent 内部消息为什么不能直接作为模型 Context？',
    keyPoints: ['AgentMessage 运行语义', 'transformContext / convertToLlm', 'Session 与模型视图'],
    answer:
      '因为 Agent 内部要保存比模型协议更丰富的运行语义。Coding Agent 除了 user、assistant、tool result，还保存直接 Bash 执行、Extension 自定义消息、Compaction Summary 和 Branch Summary。这些消息可能用于 UI、恢复或扩展状态，不能原类型发送给 Provider。\n\n每次调用前，`transformContext()` 先在 AgentMessage 层做动态过滤或注入，`convertToLlm()` 再把可用内容转成 `pi-ai.Message[]`。例如 Bash 记录转成 user text，Summary 用带标签的 user message 表达，明确排除的 Bash 记录被过滤。这样 Session 保留完整事实，模型只获得当前需要的视图。代价是 Context 不再等于 transcript，排查“模型为什么没看到某条信息”需要沿投影链检查。',
    answerStructure: ['先说明内部状态更丰富', '追踪两阶段投影', '举例不同消息的转换', '说明完整历史与模型视图的代价'],
    evidence: [
      {
        label: 'packages/agent/src/agent-loop.ts：streamAssistantResponse()',
        href: source('packages/agent/src/agent-loop.ts')
      },
      {
        label: 'packages/coding-agent/src/core/messages.ts：Coding Agent 转换',
        href: source('packages/coding-agent/src/core/messages.ts')
      }
    ],
    followUps: [
      'Compaction 应放在 `convertToLlm()` 里吗？',
      '排查模型为什么没看到某条信息时，为什么必须沿投影链检查？'
    ],
    relatedSection: {
      label: '回到第 4 章：Agent Loop 如何组织多次模型生成',
      href: '#第-4-章agent-loop-如何组织多次模型生成'
    }
  },
  {
    id: 'q08',
    category: '工具执行',
    question: '一次 Tool Call 从模型输出到结果回填，要经过哪些阶段？',
    keyPoints: ['参数预处理与校验', 'Hook 与 Abort', 'Tool Result 回填'],
    answer:
      'Tool Call 只是模型提出的结构化执行请求。Runtime 先按名称查找工具，调用 `prepareArguments` 做兼容预处理，再按 Schema 校验参数；之后 `beforeToolCall` 可以阻断。通过准入后，Runtime 把 `toolCallId`、验证后的参数、AbortSignal 和进度回调交给 `execute()`。\n\n工具成功返回 AgentToolResult；异常、未知工具、非法参数和 Hook 阻断则被转换为错误结果。`afterToolCall` 还能修改最终 content、details、usage 和 error 语义。最后 Runtime 用原始 ID 构造 ToolResultMessage，发出消息事件并回填 transcript，下一次 Generation 才能使用真实结果。\n\n收益是模型意图与外部副作用之间存在明确治理点，失败也能继续推理。代价是工具实现必须同时处理 Schema、Abort、输出形态和错误语义，不能只是一个随意函数。',
    answerStructure: ['从模型意图进入 Runtime', '预处理、校验与准入', '执行并处理成功/失败', '按原始 ID 回填上下文'],
    evidence: [
      {
        label: 'packages/agent/src/agent-loop.ts：prepareToolCall()',
        href: source('packages/agent/src/agent-loop.ts')
      },
      {
        label: 'executePreparedToolCall()、finalizeExecutedToolCall()、createToolResultMessage()',
        href: source('packages/agent/src/agent-loop.ts')
      }
    ],
    followUps: [
      '为什么工具异常要转成消息？',
      'Schema、Abort、输出形态和错误语义为什么都属于工具契约？'
    ],
    relatedSection: {
      label: '回到第 5 章：一次 Tool Call 如何真正变成工具结果',
      href: '#第-5-章一次-tool-call-如何真正变成工具结果'
    }
  },
  {
    id: 'q09',
    category: '工具调度',
    question: '多个工具如何调度，失败和 Abort 分别意味着什么？',
    keyPoints: ['顺序与并行', '完成顺序与回填顺序', 'Abort 的已启动/未启动边界'],
    answer:
      'Pi 默认并行执行同一 AssistantMessage 中的 Tool Calls，但准备阶段仍按声明顺序进行；若全局或任一工具要求 sequential，整批顺序执行。并行时，`tool_execution_end` 按实际完成顺序发出，Tool Result 消息则在全部结束后按模型原始调用顺序回填，兼顾 UI 实时性与上下文稳定性。\n\nAbortSignal 会传入 Hook 和工具。顺序模式不会再启动后续调用；并行模式中已经启动的任务需要工具自己响应 Signal，尚未准备的任务停止启动；已经完成的结果不会自动撤销。工具错误通常只形成 `isError` 结果，不自动终止整批。只有整批所有结果都声明 `terminate: true`，本批工具才不会自行驱动下一次模型调用；已排队消息仍可能让 Run 继续。',
    answerStructure: ['先区分顺序和并行', '说明准备/完成/回填顺序', '按 Abort 状态划分任务', '解释错误与 terminate 语义'],
    evidence: [
      {
        label: 'executeToolCallsSequential()、executeToolCallsParallel()',
        href: source('packages/agent/src/agent-loop.ts')
      },
      {
        label: 'shouldTerminateToolBatch()',
        href: source('packages/agent/src/agent-loop.ts')
      }
    ],
    followUps: [
      '完成顺序和回填顺序必须一致吗？',
      'Abort 发生时，已经完成、正在执行和尚未开始的工具分别怎样处理？'
    ],
    relatedSection: {
      label: '回到第 5 章：一次 Tool Call 如何真正变成工具结果',
      href: '#第-5-章一次-tool-call-如何真正变成工具结果'
    }
  },
  {
    id: 'q10',
    category: '事件与队列',
    question: '为什么 Pi 同时需要事件流、steering 和 follow-up？',
    keyPoints: ['四层生命周期事件', '运行中控制', '两类队列的消费时机'],
    answer:
      '事件流解决可观察性，队列解决运行中控制。Agent Core 发出 Agent、Turn、Message、Tool 四层生命周期事件，TUI、JSON、RPC 和 SDK 可以消费同一过程，不需要 Runtime 直接调用某个 UI。\n\nsteering 是“当前任务下一轮要考虑的新指令”，在当前 Assistant Turn 和工具批次完成后、下一次模型调用前注入；follow-up 是“当前任务结束后再做的事”，只在 Loop 原本要停止时消费。当前实现中 steering 不会取消本批 Tool Calls。两类队列都支持一次取全部或逐条取出。\n\n这样用户既能实时看见过程，也能在稳定边界干预。代价是监听器和队列成为控制时序的一部分：监听器 Promise 会被等待，错误或阻塞的事件消费者可能拖慢 Run。',
    answerStructure: ['事件流负责观察', 'steering / follow-up 负责时机', '比较两类队列的边界', '说明监听器带来的时序成本'],
    evidence: [
      { label: 'packages/agent/src/types.ts：事件类型', href: source('packages/agent/src/types.ts') },
      { label: 'Agent.processEvents()：监听器顺序', href: source('packages/agent/src/agent.ts') },
      { label: 'runLoop()：队列消费', href: source('packages/agent/src/agent-loop.ts') }
    ],
    followUps: [
      '为什么 steering 不立即终止当前工具？',
      '为什么监听器 Promise 或阻塞的事件消费者可能拖慢 Run？'
    ],
    relatedSection: {
      label: '回到第 6 章：事件流如何让运行过程可观察、可干预',
      href: '#第-6-章事件流如何让运行过程可观察可干预'
    }
  },
  {
    id: 'q11',
    category: 'Harness 组装',
    question: '`pi-coding-agent` 如何把通用 Runtime 组装成可用的 Coding Agent？',
    keyPoints: ['createAgentSession()', '资源、模型与工具', 'AgentSession 协调职责'],
    answer:
      '关键入口是 `createAgentSession()`。它先构造 ModelRuntime、SettingsManager、SessionManager 和 ResourceLoader，恢复或选择 Model 与 Thinking Level；再创建 Agent，注入 Coding Agent 的消息转换、模型流函数、动态认证、Provider Hook、Context Hook 和队列配置；最后创建 AgentSession，加载资源、包装工具、连接 ExtensionRunner 和 Session 持久化。\n\n因此 AgentSession 不是单纯聊天记录，它是 Runtime、资源、模型、工具、扩展和会话的协调枢纽。底层 Agent 不知道 cwd、`AGENTS.md` 或文件工具，上层在这里把它们组合成可工作的 Coding Agent。收益是通用 Loop 不受编码场景污染，代价是 AgentSession 职责较多，理解完整初始化需要跨多个管理器。',
    answerStructure: ['定位 createAgentSession()', '构造管理器与运行配置', '注入转换、Hook 和队列', '连接资源、工具、扩展与持久化'],
    evidence: [
      {
        label: 'packages/coding-agent/src/core/sdk.ts：createAgentSession()',
        href: source('packages/coding-agent/src/core/sdk.ts')
      },
      {
        label: 'packages/coding-agent/src/core/agent-session.ts：会话协调',
        href: source('packages/coding-agent/src/core/agent-session.ts')
      }
    ],
    followUps: [
      '为什么不是 CLI 直接创建所有对象？',
      '底层 Agent 为什么不应该知道 cwd、`AGENTS.md` 或文件工具？'
    ],
    relatedSection: {
      label: '回到第 7 章：Coding Agent 如何组装一次运行',
      href: '#第-7-章coding-agent-如何组装一次运行'
    }
  },
  {
    id: 'q12',
    category: 'Context 管理',
    question: 'Pi 如何决定哪些信息进入模型 Context？',
    keyPoints: ['稳定规则与按需资源', '工具输出截断', '扩展、转换与压缩'],
    answer:
      'Pi 使用多道边界共同控制 Context。启动时，System Prompt 提供身份、工具摘要和规则；项目上下文文件补充 `AGENTS.md` 等约束；Skills 只注入名称、描述和位置，全文按需读取；工具自身限制输出，例如 `read` 默认最多 2000 行或 50 KB；长会话由 Compaction 用摘要替换旧上下文投影。\n\n每轮调用前，Extension 还能通过 context 事件修改 Agent Messages，`convertToLlm()` 再过滤 UI-only 或排除项，最后 Provider 适配层处理图像、Thinking 和 Tool ID 的模型差异。模型看到的是这些步骤共同产生的视图，而不是完整 Session 文件。\n\n收益是信息按稳定性与需要分层加载，避免 Context 无限制增长。代价是输入来源多，必须提供诊断和源码追踪，才能解释某条信息在哪一层被加入、截断或删除。',
    answerStructure: ['从 System Prompt 到项目资源', '按需加载与工具截断', '扩展和模型适配再投影', '说明可诊断性与 Context 预算收益'],
    evidence: [
      { label: 'core/system-prompt.ts：System Prompt', href: source('packages/coding-agent/src/core/system-prompt.ts') },
      { label: 'core/resource-loader.ts：资源加载', href: source('packages/coding-agent/src/core/resource-loader.ts') },
      { label: 'core/messages.ts：消息转换', href: source('packages/coding-agent/src/core/messages.ts') },
      { label: 'core/tools/truncate.ts：工具输出截断', href: source('packages/coding-agent/src/core/tools/truncate.ts') },
      { label: 'core/compaction/：上下文压缩', href: sourceTree('packages/coding-agent/src/core/compaction') }
    ],
    followUps: [
      'Skills 为什么不直接全部写进 System Prompt？',
      '如何解释某条信息在哪一层被加入、截断或删除？'
    ],
    relatedSection: {
      label: '回到第 7 章：Coding Agent 如何组装一次运行',
      href: '#第-7-章coding-agent-如何组装一次运行'
    }
  },
  {
    id: 'q13',
    category: 'Session',
    question: '为什么 Session 使用 append-only JSONL 树，而不是普通聊天数组？',
    keyPoints: ['id / parentId / Leaf', '分支与恢复', '历史事实与当前路径'],
    answer:
      '因为 Coding Agent 的历史不是只能向前的聊天数组。Pi 需要恢复、切换模型、修改早期意图、保留替代路径和记录 Extension 状态。每个 Entry 通过 `id/parentId` 指向父节点，当前 Leaf 决定活跃分支；切换分支只移动 Leaf，下一次追加形成新孩子，旧路径不删除。\n\nJSONL 适合逐行追加与人工检查，树结构让一个文件保留多条探索路径。模型调用时只从 Leaf 回溯到根，构造当前路径并应用 Compaction。收益是历史可追溯、分支不覆盖；代价是 Context 构造必须做树遍历，设置变化也要沿路径恢复，并需要处理迁移、孤儿节点和文件损坏。',
    answerStructure: ['说明聊天数组的不足', '定义 Entry、Leaf 与分支', '连接 JSONL 追加和路径投影', '说明可追溯收益与遍历成本'],
    evidence: [
      {
        label: 'packages/coding-agent/src/core/session-manager.ts：Entry、SessionManager、getBranch()、branch()、buildSessionContext()',
        href: source('packages/coding-agent/src/core/session-manager.ts')
      }
    ],
    followUps: [
      '模型能看到同一文件里的其他分支吗？',
      '为什么切换分支只移动 Leaf，而不删除旧路径？'
    ],
    relatedSection: {
      label: '回到第 8 章：一次请求如何写入 Session Tree',
      href: '#第-8-章一次请求如何写入-session-tree'
    }
  },
  {
    id: 'q14',
    category: 'Compaction',
    question: 'Compaction 压缩了什么，又没有改变什么？',
    keyPoints: ['Context 窗口与切割点', '摘要与近期消息', '原始历史与 Branch Summary'],
    answer:
      'Compaction 压缩的是模型看到的旧上下文投影，不会删除原始 Session History。当估算 Context 超过 `contextWindow - reserveTokens` 时，Pi 向后寻找切割点，保留约 `keepRecentTokens` 的近期消息，把更早部分生成结构化摘要，并追加 CompactionEntry。\n\n下一次 `buildSessionContext()` 使用最新 Compaction Summary，加上从 `firstKeptEntryId` 开始的近期 Entry 和压缩后新增内容。Tool Result 不能作为切点，避免与 Tool Call 分离；巨大单 Turn 可以拆分并单独总结前缀；多次压缩会把 previous summary 合并进新摘要。\n\n收益是会话可继续超过单次 Context 窗口，原始 JSONL 仍可审计。代价是摘要有信息损失和漂移风险。Branch Summary 则总结被离开的另一分支，目的不是释放同一路径的 Token，两者不能混淆。',
    answerStructure: ['区分 Context 投影与原始历史', '说明阈值、切点和摘要', '重建近期 Context', '比较收益、损失与 Branch Summary'],
    evidence: [
      {
        label: 'core/compaction/compaction.ts：阈值、切点与摘要',
        href: source('packages/coding-agent/src/core/compaction/compaction.ts')
      },
      {
        label: 'session-manager.ts 的 buildContextEntries()：投影逻辑',
        href: source('packages/coding-agent/src/core/session-manager.ts')
      }
    ],
    followUps: [
      '当前版本是否把近期消息复制进 CompactionEntry？',
      'Compaction 与 Branch Summary 为什么不能混淆？'
    ],
    relatedSection: {
      label: '回到第 9 章：Compaction 如何改变模型看到的历史',
      href: '#第-9-章compaction-如何改变模型看到的历史'
    }
  },
  {
    id: 'q15',
    category: '扩展边界',
    question: '为什么 Pi 把很多能力留给扩展，而不直接内置？',
    keyPoints: ['Extension / Skill / Package', '可重组 Harness', '权限与安全边界'],
    answer:
      'Pi 的目标是提供可重组的 Harness，而不是规定唯一工作流。Extension 用来改变 Runtime、工具、事件、Provider 和 UI；Skill 提供模型按需读取的能力说明；Prompt Template 复用输入；Pi Package 负责组合与分发。MCP、子 Agent、Plan Mode、权限弹窗、Todo 和后台 Bash 都可以按需求在这些层上构建，但不作为默认内核政策。\n\n收益是核心更小，不会把所有用户锁进同一种编排与审批方式，也能按 `pi-ai → pi-agent-core → pi-coding-agent` 选择复用深度。代价是使用者需要自行组合企业能力，并承担 Package 兼容和维护。\n\n安全上，Extension 和 Package 可能拥有完整进程权限，Skill 也可能指导模型运行脚本；Project Trust 只控制项目资源是否加载，不是 Sandbox。高风险任务仍需操作系统级隔离。极简不是自动安全，而是把边界和责任说清楚。',
    answerStructure: ['定义 Pi 的 Harness 目标', '区分四类扩展资源', '说明核心变小与组合成本', '正视权限、Trust 与 Sandbox 边界'],
    evidence: [
      {
        label: 'packages/coding-agent/src/core/resource-loader.ts：资源加载',
        href: source('packages/coding-agent/src/core/resource-loader.ts')
      },
      {
        label: 'packages/coding-agent/src/core/extensions/：扩展协议',
        href: sourceTree('packages/coding-agent/src/core/extensions')
      },
      {
        label: 'packages/coding-agent/README.md：官方能力边界',
        href: source('packages/coding-agent/README.md')
      },
      { label: 'docs/security.md：安全边界', href: source('docs/security.md') }
    ],
    followUps: [
      '没有默认 Permission Popups 是否意味着没有准入点？',
      'Project Trust 为什么不等于 Sandbox？'
    ],
    relatedSection: {
      label: '回到第 10 章：Pi 为什么把更多能力留在内核之外',
      href: '#第-10-章pi-为什么把更多能力留在内核之外'
    }
  }
] satisfies InterviewQuestion[]
