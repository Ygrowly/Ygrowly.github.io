import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'

export type ImportMessageSeverity = 'info' | 'warning' | 'error'

export interface ImportMessage {
  line?: number
  message: string
  severity: ImportMessageSeverity
}

export interface ImportStats {
  imageCount: number
  localImageCount: number
  mermaidCount: number
  normalizedLinkCount: number
  yuqueImageCount: number
}

export interface ImageReference {
  line: number
  source: string
}

export interface ParsedYuqueDocument {
  body: string
  date?: string
  description?: string
  headings: Array<{ depth: number; line: number; text: string }>
  images: ImageReference[]
  mermaidCount: number
  messages: ImportMessage[]
  normalizedLinkCount: number
  publishDateFromSource?: string
  sourceHash: string
  tags: string[]
  title?: string
}

export interface PlannedAsset {
  key: string
  localSourcePath?: string
  originalSource: string
  remoteUrl?: string
  targetRelative?: string
}

export interface ImportOptions {
  date?: string
  force?: boolean
  fetcher?: typeof fetch
  slug?: string
  sourcePath: string
  workspaceRoot: string
  write?: boolean
}

export type ImportStatus = 'dry-run' | 'error' | 'skipped' | 'written'

export interface ImportReport {
  backupPath?: string
  content?: string
  messages: ImportMessage[]
  outputPath?: string
  sourcePath: string
  stats: ImportStats
  status: ImportStatus
  title?: string
}

interface ImportMarker {
  generatedHash?: string
  sourceHash?: string
  sourcePath?: string
}

interface MarkdownScanEvent {
  fenceClosing: boolean
  fenceLanguage?: string
  fenceOpening: boolean
  inFence: boolean
  index: number
  line: string
}

interface PreparedAsset {
  bytes: Uint8Array
  plan: PlannedAsset
}

const GENERATED_MARKER = '<!-- yuque-import-generated-sha256: __GENERATED_HASH__ -->'
const GENERATED_MARKER_PATTERN =
  /^<!-- yuque-import-generated-sha256: ([a-f0-9]{64}|__GENERATED_HASH__) -->\r?\n?/m
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])

function addMessage(
  messages: ImportMessage[],
  severity: ImportMessageSeverity,
  message: string,
  line?: number
) {
  messages.push({ severity, message, ...(line ? { line } : {}) })
}

function normalizeLineEndings(value: string) {
  return value.replace(/\r\n?/g, '\n').replace(/^\uFEFF/, '')
}

export function sha256(value: string | Uint8Array) {
  return createHash('sha256').update(value).digest('hex')
}

function isBlank(line: string) {
  return line.trim().length === 0
}

function trimBlankLines(value: string) {
  const lines = normalizeLineEndings(value).split('\n')
  let start = 0
  let end = lines.length

  while (start < end && isBlank(lines[start]!)) start += 1
  while (end > start && isBlank(lines[end - 1]!)) end -= 1

  return lines.slice(start, end).join('\n')
}

function parseFence(line: string) {
  return line.match(/^\s*(\x60{3,}|~{3,})(.*)$/)
}

function scanMarkdown(value: string, handler: (event: MarkdownScanEvent) => void) {
  const lines = normalizeLineEndings(value).split('\n')
  let fenceChar = ''
  let fenceLength = 0

  lines.forEach((line, index) => {
    const fence = parseFence(line)

    if (!fenceChar && fence) {
      handler({
        fenceClosing: false,
        fenceLanguage: fence[2].trim().split(/\s+/)[0] || undefined,
        fenceOpening: true,
        inFence: false,
        index,
        line
      })
      fenceChar = fence[1]![0]!
      fenceLength = fence[1]!.length
      return
    }

    if (fenceChar && fence && fence[1]![0] === fenceChar && fence[1]!.length >= fenceLength) {
      handler({
        fenceClosing: true,
        fenceLanguage: undefined,
        fenceOpening: false,
        inFence: true,
        index,
        line
      })
      fenceChar = ''
      fenceLength = 0
      return
    }

    handler({
      fenceClosing: false,
      fenceLanguage: undefined,
      fenceOpening: false,
      inFence: Boolean(fenceChar),
      index,
      line
    })
  })
}

function unquote(value: string) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function parseTags(value: string) {
  const raw = unquote(value).replace(/^\[/, '').replace(/\]$/, '')

  return raw
    .split(/[,\uFF0C]/)
    .map((tag) => unquote(tag))
    .filter(Boolean)
}

function validateDate(value: string | undefined) {
  if (!value) return undefined
  const date = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined
  const parsed = new Date(date + 'T00:00:00.000Z')
  if (Number.isNaN(parsed.getTime())) return undefined
  if (parsed.toISOString().slice(0, 10) !== date) return undefined
  return date
}

function extractDateFromFilename(sourcePath: string) {
  const filename = basename(sourcePath)
  const dashed = filename.match(/(?<!\d)(\d{4}-\d{2}-\d{2})(?!\d)/)?.[1]
  if (dashed) return validateDate(dashed)

  const compact = filename.match(/(?<!\d)(\d{8})(?!\d)/)?.[1]
  if (!compact) return undefined
  return validateDate(compact.slice(0, 4) + '-' + compact.slice(4, 6) + '-' + compact.slice(6))
}

function normalizeHeadingText(value: string) {
  return value
    .trim()
    .replace(/\s+#+\s*$/, '')
    .trim()
}

function parseMetadataLine(line: string) {
  const match = line.match(/^\s*(description|tags|publishDate)\s*:\s*(.*?)\s*$/)
  if (!match) return undefined
  return { key: match[1]!, value: match[2]! }
}

function normalizeWrappedLinks(value: string) {
  return value.replace(/\x60((?:!?\[[^\]]*\]\([^)]+\)))\x60/g, '$1')
}

function transformBody(value: string) {
  const lines = normalizeLineEndings(value).split('\n')
  let normalizedLinkCount = 0

  scanMarkdown(value, (event) => {
    if (event.inFence || event.fenceOpening || event.fenceClosing) return
    const transformed = normalizeWrappedLinks(event.line)
    if (transformed !== event.line) {
      normalizedLinkCount += 1
      lines[event.index] = transformed
    }
  })

  return { body: lines.join('\n'), normalizedLinkCount }
}

function parseImageDestination(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (trimmed.startsWith('<')) {
    const end = trimmed.indexOf('>')
    if (end < 0) return undefined
    return { suffix: trimmed.slice(end + 1), url: trimmed.slice(1, end) }
  }

  const match = trimmed.match(/^(\S+)([\s\S]*)$/)
  if (!match) return undefined
  return { suffix: match[2]!, url: match[1]! }
}

function imageKey(value: string) {
  return value.trim().replace(/^<|>$/g, '')
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function isYuqueCdnUrl(value: string) {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return (
      host === 'cdn.nlark.com' ||
      host.endsWith('.nlark.com') ||
      host === 'yuque.com' ||
      host.endsWith('.yuque.com')
    )
  } catch {
    return false
  }
}

function addImageReference(references: Map<string, ImageReference>, source: string, line: number) {
  const key = imageKey(source)
  if (!key || references.has(key)) return
  references.set(key, { line, source: key })
}

function collectImageReferences(body: string) {
  const references = new Map<string, ImageReference>()

  scanMarkdown(body, (event) => {
    if (event.inFence || event.fenceOpening || event.fenceClosing) return

    const markdownImages = /!\[[^\]]*\]\(([^)\n]+)\)/g
    for (const match of event.line.matchAll(markdownImages)) {
      const destination = parseImageDestination(match[1]!)
      if (destination) addImageReference(references, destination.url, event.index + 1)
    }

    const htmlImages = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi
    for (const match of event.line.matchAll(htmlImages)) {
      addImageReference(references, match[1]!, event.index + 1)
    }
  })

  return [...references.values()]
}

function collectBodyRisks(body: string, bodyLineOffset: number, messages: ImportMessage[]) {
  let previousHeading: { depth: number; text: string; line: number } | undefined

  scanMarkdown(body, (event) => {
    if (event.fenceOpening && event.fenceLanguage?.toLowerCase() === 'mermaid') return
    if (event.inFence || event.fenceOpening || event.fenceClosing) return

    const lineNumber = bodyLineOffset + event.index + 1
    const heading = event.line.match(/^\s*(#{1,6})\s+(.+?)\s*$/)
    if (heading) {
      const current = {
        depth: heading[1]!.length,
        line: lineNumber,
        text: normalizeHeadingText(heading[2]!)
      }

      if (previousHeading && current.depth > previousHeading.depth + 1) {
        addMessage(
          messages,
          'warning',
          '标题层级跳级：' +
            previousHeading.text +
            ' → ' +
            current.text +
            '，请确认是否缺少父级标题',
          lineNumber
        )
      }

      if (
        previousHeading &&
        isChapterHeading(previousHeading.text) &&
        /^\d+\.\d+\b/.test(current.text) &&
        current.depth <= previousHeading.depth
      ) {
        addMessage(
          messages,
          'warning',
          '小节标题可能与章节同级：' + current.text + ' 应检查是否需要下移一级',
          lineNumber
        )
      }

      previousHeading = current
      return
    }

    if (/\x60(?:!?\[[^\]]*\]\([^)]+\))\x60/.test(event.line)) {
      addMessage(
        messages,
        'warning',
        '发现被代码标记包裹的 Markdown 链接，导入时会尝试修复',
        lineNumber
      )
    }

    if (/<\/?[A-Za-z][^>]*>/.test(event.line)) {
      addMessage(messages, 'warning', '发现 HTML/JSX 标签，请确认 MDX 是否可以安全解析', lineNumber)
    }

    if (/[{}]/.test(event.line)) {
      addMessage(
        messages,
        'warning',
        '发现大括号，MDX 可能将其解析为表达式，请人工确认',
        lineNumber
      )
    }

    if (/javascript:/i.test(event.line)) {
      addMessage(
        messages,
        'warning',
        '发现 javascript: 链接，已保留原文，请人工确认安全性',
        lineNumber
      )
    }
  })
}

function countMermaidBlocks(body: string) {
  let count = 0
  scanMarkdown(body, (event) => {
    if (event.fenceOpening && event.fenceLanguage?.toLowerCase() === 'mermaid') count += 1
  })
  return count
}

function isChapterHeading(value: string) {
  return /^第\s*(?:\d+|[零〇一二三四五六七八九十百千万两]+)\s*章(?:\s|[:：、]|$)/.test(value)
}

function resolveDate(
  sourceDate: string | undefined,
  cliDate: string | undefined,
  sourcePath: string,
  messages: ImportMessage[]
) {
  if (sourceDate !== undefined) {
    const date = validateDate(unquote(sourceDate))
    if (!date) addMessage(messages, 'error', 'publishDate 格式无效，要求 YYYY-MM-DD')
    return date
  }

  if (cliDate !== undefined) {
    const date = validateDate(cliDate)
    if (!date) addMessage(messages, 'error', '--date 格式无效，要求 YYYY-MM-DD')
    return date
  }

  const filenameDate = extractDateFromFilename(sourcePath)
  if (!filenameDate) {
    addMessage(
      messages,
      'error',
      '缺少日期：请填写 publishDate、传入 --date，或在文件名中包含 YYYY-MM-DD'
    )
  }
  return filenameDate
}

export function parseYuqueDocument(
  source: string,
  sourcePath: string,
  options: { cliDate?: string; sourceHash?: string } = {}
): ParsedYuqueDocument {
  const normalized = normalizeLineEndings(source)
  const lines = normalized.split('\n')
  const messages: ImportMessage[] = []
  const headings: Array<{ depth: number; line: number; text: string }> = []

  scanMarkdown(normalized, (event) => {
    if (event.inFence || event.fenceOpening || event.fenceClosing) return
    const heading = event.line.match(/^\s*(#{1,6})\s+(.+?)\s*$/)
    if (!heading) return
    headings.push({
      depth: heading[1]!.length,
      line: event.index + 1,
      text: normalizeHeadingText(heading[2]!)
    })
  })

  const titleHeading = headings.find((heading) => heading.depth === 1)
  if (!titleHeading) addMessage(messages, 'error', '缺少第一个一级标题，无法提取 title')

  const title = titleHeading?.text
  if (title && title.length > 60) {
    addMessage(
      messages,
      'error',
      'title 超过当前 Content Schema 的 60 字符限制',
      titleHeading?.line
    )
  }

  let cursor = titleHeading ? titleHeading.line : 0
  while (cursor < lines.length && isBlank(lines[cursor]!)) cursor += 1

  const metadata: { description?: string; publishDate?: string; tags?: string[] } = {}
  const metadataKeys = new Set<string>()

  while (cursor < lines.length) {
    if (isBlank(lines[cursor]!)) {
      cursor += 1
      continue
    }
    const field = parseMetadataLine(lines[cursor]!)
    if (!field) break
    if (metadataKeys.has(field.key)) {
      addMessage(messages, 'error', '重复的元信息字段：' + field.key, cursor + 1)
    }
    metadataKeys.add(field.key)
    if (field.key === 'description') metadata.description = unquote(field.value)
    if (field.key === 'tags') metadata.tags = parseTags(field.value)
    if (field.key === 'publishDate') metadata.publishDate = unquote(field.value)
    cursor += 1
  }

  if (!metadata.description) {
    addMessage(messages, 'error', '缺少紧跟标题的 description')
  } else if (metadata.description.length > 160) {
    addMessage(messages, 'error', 'description 超过当前 Content Schema 的 160 字符限制')
  }
  if (!metadata.tags?.length) {
    addMessage(messages, 'error', '缺少紧跟标题的 tags，至少填写一个标签')
  }

  const date = resolveDate(metadata.publishDate, options.cliDate, sourcePath, messages)
  const bodyStart = cursor
  const rawBody = trimBlankLines(lines.slice(bodyStart).join('\n'))
  const transformed = transformBody(rawBody)
  const trimmedBody = trimBlankLines(transformed.body)
  const body = trimmedBody ? trimmedBody + '\n' : ''
  collectBodyRisks(body, bodyStart, messages)

  return {
    body,
    date,
    description: metadata.description,
    headings: headings.filter((heading) => heading.line > bodyStart),
    images: collectImageReferences(body),
    mermaidCount: countMermaidBlocks(body),
    messages,
    normalizedLinkCount: transformed.normalizedLinkCount,
    publishDateFromSource: metadata.publishDate,
    sourceHash: options.sourceHash ?? sha256(normalized),
    tags: metadata.tags ?? [],
    title
  }
}

function isWithin(parent: string, child: string) {
  const parentPath = resolve(parent)
  const childPath = resolve(child)
  const childRelative = relative(parentPath, childPath)
  return childRelative === '' || (!childRelative.startsWith('..' + sep) && childRelative !== '..')
}

function toPosix(value: string) {
  return value.replace(/\\/g, '/')
}

function extensionFromContentType(contentType: string | null) {
  const type = contentType?.split(';')[0]?.trim().toLowerCase()
  if (type === 'image/avif') return '.avif'
  if (type === 'image/gif') return '.gif'
  if (type === 'image/jpeg') return '.jpg'
  if (type === 'image/png') return '.png'
  if (type === 'image/svg+xml') return '.svg'
  if (type === 'image/webp') return '.webp'
  return undefined
}

function extensionFromReference(value: string, fallback = '.png') {
  let pathValue = value
  if (isHttpUrl(value)) {
    try {
      pathValue = new URL(value).pathname
    } catch {
      pathValue = value
    }
  } else {
    pathValue = value.split(/[?#]/)[0]!
  }
  const extension = extname(pathValue).toLowerCase()
  return IMAGE_EXTENSIONS.has(extension) ? extension : fallback
}

function assetStem(value: string) {
  let pathValue = value
  try {
    if (isHttpUrl(value)) pathValue = new URL(value).pathname
  } catch {
    // Keep the original value when URL parsing fails.
  }
  const stem = basename(pathValue.split(/[?#]/)[0]!, extname(pathValue))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return stem || 'image'
}

function normalizedLocalReference(value: string) {
  return decodeURIComponent(value.split(/[?#]/)[0]!)
}

function createAssetPlans(
  references: ImageReference[],
  sourcePath: string,
  workspaceRoot: string,
  messages: ImportMessage[]
) {
  const sourceAbsolute = resolve(workspaceRoot, sourcePath)
  const sourceRoot = resolve(workspaceRoot, 'md')
  const plans: PlannedAsset[] = []
  const map = new Map<string, PlannedAsset>()

  references.forEach((reference, index) => {
    const key = imageKey(reference.source)
    if (map.has(key)) return

    const extension = extensionFromReference(reference.source)
    const targetRelative =
      './assets/' +
      String(index + 1).padStart(2, '0') +
      '-' +
      assetStem(reference.source) +
      extension
    const plan: PlannedAsset = {
      key,
      originalSource: reference.source,
      targetRelative
    }

    if (isHttpUrl(reference.source)) {
      if (isYuqueCdnUrl(reference.source)) {
        plan.remoteUrl = reference.source
      } else {
        addMessage(
          messages,
          'warning',
          '非语雀 CDN 图片将保留远程地址：' + reference.source,
          reference.line
        )
        plan.targetRelative = undefined
      }
    } else if (reference.source.startsWith('data:')) {
      addMessage(messages, 'warning', 'data: 图片将保留原文，未尝试转换', reference.line)
      plan.targetRelative = undefined
    } else {
      const localPath = resolve(dirname(sourceAbsolute), normalizedLocalReference(reference.source))
      if (!isWithin(sourceRoot, localPath)) {
        addMessage(
          messages,
          'warning',
          '本地图片路径超出 md 目录，保留原文：' + reference.source,
          reference.line
        )
        plan.targetRelative = undefined
      } else if (!existsSync(localPath) || !statSync(localPath).isFile()) {
        addMessage(
          messages,
          'warning',
          '本地图片不存在，保留原文：' + reference.source,
          reference.line
        )
        plan.targetRelative = undefined
      } else {
        plan.localSourcePath = localPath
        plan.targetRelative =
          './assets/' +
          String(index + 1).padStart(2, '0') +
          '-' +
          assetStem(localPath) +
          extensionFromReference(localPath, extname(localPath).toLowerCase() || '.png')
      }
    }

    map.set(key, plan)
    plans.push(plan)
  })

  return plans
}

function replaceImageDestination(line: string, plans: Map<string, PlannedAsset>) {
  const replace = (full: string, destinationValue: string, prefix: string, suffix: string) => {
    const destination = parseImageDestination(destinationValue)
    if (!destination) return full
    const plan = plans.get(imageKey(destination.url))
    if (!plan?.targetRelative) return full
    return prefix + plan.targetRelative + destination.suffix + suffix
  }

  let result = line.replace(
    /(!\[[^\]]*\]\()([^)\n]+)(\))/g,
    (full, prefix: string, destination: string, suffix: string) =>
      replace(full, destination, prefix, suffix)
  )
  result = result.replace(
    /(<img\b[^>]*\bsrc\s*=\s*["'])([^"']+)(["'][^>]*>)/gi,
    (full, prefix: string, destination: string, suffix: string) =>
      replace(full, destination, prefix, suffix)
  )
  return result
}

function rewriteImages(body: string, plans: PlannedAsset[]) {
  const planMap = new Map(plans.map((plan) => [plan.key, plan]))
  const lines = normalizeLineEndings(body).split('\n')
  scanMarkdown(body, (event) => {
    if (event.inFence || event.fenceOpening || event.fenceClosing) return
    lines[event.index] = replaceImageDestination(lines[event.index]!, planMap)
  })
  return lines.join('\n')
}

function plannedAssetCount(plans: PlannedAsset[], predicate: (plan: PlannedAsset) => boolean) {
  return plans.filter(predicate).length
}

async function prepareAssets(
  plans: PlannedAsset[],
  messages: ImportMessage[],
  fetcher: typeof fetch
) {
  const prepared: PreparedAsset[] = []

  for (const plan of plans) {
    if (plan.localSourcePath) {
      try {
        prepared.push({ bytes: readFileSync(plan.localSourcePath), plan })
      } catch (error) {
        plan.targetRelative = undefined
        addMessage(messages, 'warning', '读取本地图片失败，保留原文：' + String(error))
      }
      continue
    }
    if (!plan.remoteUrl) continue

    try {
      const response = await fetcher(plan.remoteUrl)
      if (!response.ok) throw new Error('HTTP ' + response.status)
      const bytes = new Uint8Array(await response.arrayBuffer())
      const extension =
        extensionFromContentType(response.headers.get('content-type')) ??
        extensionFromReference(plan.remoteUrl)
      plan.targetRelative = plan.targetRelative?.replace(/\.[a-z0-9]+$/i, extension)
      prepared.push({ bytes, plan })
    } catch (error) {
      plan.targetRelative = undefined
      addMessage(
        messages,
        'warning',
        '下载语雀 CDN 图片失败，保留远程地址：' + plan.remoteUrl + '（' + String(error) + '）'
      )
    }
  }
  return prepared
}

function writePreparedAssets(prepared: PreparedAsset[], targetDirectory: string) {
  for (const asset of prepared) {
    if (!asset.plan.targetRelative) continue
    const targetPath = resolve(targetDirectory, asset.plan.targetRelative)
    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(targetPath, asset.bytes)
  }
}

function yamlString(value: string) {
  return JSON.stringify(value)
}

function buildFrontmatter(document: ParsedYuqueDocument) {
  return [
    '---',
    'title: ' + yamlString(document.title!),
    'description: ' + yamlString(document.description!),
    'publishDate: ' + document.date,
    'tags: [' + document.tags.map(yamlString).join(', ') + ']',
    'draft: true',
    '---'
  ].join('\n')
}

export function withoutGeneratedMarker(content: string) {
  return content.replace(GENERATED_MARKER_PATTERN, '')
}

export function readImportMarker(content: string): ImportMarker {
  return {
    generatedHash: content.match(GENERATED_MARKER_PATTERN)?.[1],
    sourceHash: content.match(/^<!-- yuque-import-source-sha256: ([a-f0-9]{64}) -->$/m)?.[1],
    sourcePath: content.match(/^<!-- yuque-import-source: (.+) -->$/m)?.[1]
  }
}

export function buildPostContent(
  document: ParsedYuqueDocument,
  sourceRelativePath: string,
  body = document.body
) {
  const normalizedBody = trimBlankLines(body)
  const base = [
    buildFrontmatter(document),
    '',
    '<!-- yuque-import-source: ' + toPosix(sourceRelativePath) + ' -->',
    '<!-- yuque-import-source-sha256: ' + document.sourceHash + ' -->',
    GENERATED_MARKER,
    '',
    normalizedBody
  ]
    .join('\n')
    .replace(/\n+$/, '')
    .concat('\n')

  const generatedHash = sha256(withoutGeneratedMarker(base))
  return base.replace('__GENERATED_HASH__', generatedHash)
}

function deriveSlug(title: string, sourceHash: string) {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug) return { slug }
  return {
    slug: 'article-' + sourceHash.slice(0, 8),
    warning: 'title 不包含可生成 ASCII slug 的字符，已使用 hash slug；建议传入 --slug'
  }
}

function resolveSlug(
  explicitSlug: string | undefined,
  title: string,
  sourceHash: string,
  messages: ImportMessage[]
) {
  if (!explicitSlug) {
    const derived = deriveSlug(title, sourceHash)
    if (derived.warning) addMessage(messages, 'warning', derived.warning)
    return derived.slug
  }

  const slug = explicitSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug) {
    addMessage(messages, 'error', '--slug 必须包含至少一个 ASCII 字母或数字')
    return undefined
  }
  if (slug !== explicitSlug.trim().toLowerCase()) {
    addMessage(messages, 'warning', '--slug 已规范化为：' + slug)
  }
  return slug
}

function sourceRelativePath(workspaceRoot: string, sourceAbsolute: string) {
  return toPosix(relative(resolve(workspaceRoot), sourceAbsolute))
}

function findImportedTargets(blogRoot: string) {
  const targets: Array<{ marker: ImportMarker; path: string }> = []
  if (!existsSync(blogRoot)) return targets

  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.includes('.backup-')) continue
        visit(path)
        continue
      }
      if (entry.name !== 'post.mdx' && entry.name !== 'post.md') continue
      try {
        targets.push({ marker: readImportMarker(readFileSync(path, 'utf8')), path })
      } catch {
        // Ignore unreadable files; the target itself is handled separately.
      }
    }
  }
  visit(blogRoot)
  return targets
}

function createBackup(targetPath: string) {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14)
  let backupPath = targetPath + '.backup-' + stamp
  let suffix = 2
  while (existsSync(backupPath)) {
    backupPath = targetPath + '.backup-' + stamp + '-' + suffix
    suffix += 1
  }
  cpSync(targetPath, backupPath, { recursive: true })
  return backupPath
}

function emptyStats(): ImportStats {
  return {
    imageCount: 0,
    localImageCount: 0,
    mermaidCount: 0,
    normalizedLinkCount: 0,
    yuqueImageCount: 0
  }
}

export async function executeImport(options: ImportOptions): Promise<ImportReport> {
  const workspaceRoot = resolve(options.workspaceRoot)
  const sourceAbsolute = resolve(workspaceRoot, options.sourcePath)
  const sourceDisplayPath = sourceRelativePath(workspaceRoot, sourceAbsolute)
  const baseReport = (messages: ImportMessage[] = []): ImportReport => ({
    messages,
    sourcePath: sourceDisplayPath,
    stats: emptyStats(),
    status: 'error'
  })

  if (!isWithin(resolve(workspaceRoot, 'md'), sourceAbsolute)) {
    const report = baseReport()
    addMessage(report.messages, 'error', '源文件必须位于 md 目录下')
    return report
  }
  if (!existsSync(sourceAbsolute) || !statSync(sourceAbsolute).isFile()) {
    const report = baseReport()
    addMessage(report.messages, 'error', '源文件不存在：' + sourceDisplayPath)
    return report
  }
  if (extname(sourceAbsolute).toLowerCase() !== '.md') {
    const report = baseReport()
    addMessage(report.messages, 'error', '只支持 .md 语雀导出文件')
    return report
  }

  let sourceBytes: Uint8Array
  try {
    sourceBytes = readFileSync(sourceAbsolute)
  } catch (error) {
    const report = baseReport()
    addMessage(report.messages, 'error', '读取源文件失败：' + String(error))
    return report
  }

  const document = parseYuqueDocument(new TextDecoder().decode(sourceBytes), sourceDisplayPath, {
    cliDate: options.date,
    sourceHash: sha256(sourceBytes)
  })
  const report: ImportReport = {
    messages: [...document.messages],
    sourcePath: sourceDisplayPath,
    stats: {
      imageCount: document.images.length,
      localImageCount: 0,
      mermaidCount: document.mermaidCount,
      normalizedLinkCount: document.normalizedLinkCount,
      yuqueImageCount: document.images.filter((image) => isYuqueCdnUrl(image.source)).length
    },
    status: 'error',
    title: document.title
  }

  if (!document.title || !document.description || !document.date || !document.tags.length)
    return report
  if (report.messages.some((message) => message.severity === 'error')) return report

  const slug = resolveSlug(options.slug, document.title, document.sourceHash, report.messages)
  if (!slug || report.messages.some((message) => message.severity === 'error')) return report

  const outputRelativePath = toPosix(
    join('src', 'content', 'blog', document.date.replace(/-/g, '') + ' - ' + slug)
  )
  const outputDirectory = resolve(workspaceRoot, outputRelativePath)
  const outputFile = join(outputDirectory, 'post.mdx')
  const reportStats = report.stats
  report.outputPath = outputRelativePath

  const existingTargets = findImportedTargets(resolve(workspaceRoot, 'src/content/blog'))
  const duplicate = existingTargets.find(
    (target) =>
      (target.marker.sourcePath === sourceDisplayPath ||
        target.marker.sourceHash === document.sourceHash) &&
      resolve(target.path) !== resolve(outputFile)
  )
  if (duplicate) {
    addMessage(report.messages, 'error', '该源文件已经导入到其他文章：' + duplicate.path)
    return report
  }

  let existingContent: string | undefined
  if (existsSync(outputDirectory) && !existsSync(outputFile)) {
    addMessage(
      report.messages,
      'error',
      '目标目录已存在但缺少 post.mdx，拒绝覆盖：' + outputRelativePath
    )
    return report
  }
  if (existsSync(outputFile)) {
    existingContent = readFileSync(outputFile, 'utf8')
    const marker = readImportMarker(existingContent)
    const generatedMatches =
      Boolean(marker.generatedHash) &&
      sha256(withoutGeneratedMarker(existingContent)) === marker.generatedHash

    if (
      marker.sourcePath === sourceDisplayPath &&
      marker.sourceHash === document.sourceHash &&
      !options.force
    ) {
      report.status = 'skipped'
      addMessage(report.messages, 'info', '源文件 SHA-256 未变化，跳过导入')
      return report
    }

    const manuallyModified =
      marker.sourcePath !== sourceDisplayPath || !marker.generatedHash || !generatedMatches
    if (manuallyModified && !options.force) {
      addMessage(
        report.messages,
        'error',
        '目标文章可能已被人工修改，拒绝覆盖；如确认请使用 --force'
      )
      return report
    }
    if (options.force) addMessage(report.messages, 'warning', '--force 将先备份现有目标文章')
  }

  const plans = createAssetPlans(document.images, sourceDisplayPath, workspaceRoot, report.messages)
  const fetcher = options.fetcher ?? fetch
  let prepared: PreparedAsset[] = []
  if (options.write) prepared = await prepareAssets(plans, report.messages, fetcher)

  const content = buildPostContent(document, sourceDisplayPath, rewriteImages(document.body, plans))
  report.content = content
  reportStats.localImageCount = plannedAssetCount(plans, (plan) => Boolean(plan.localSourcePath))

  if (!options.write) {
    report.status = 'dry-run'
    return report
  }

  if (existingContent !== undefined && options.force) {
    report.backupPath = createBackup(outputDirectory)
  }
  mkdirSync(outputDirectory, { recursive: true })
  writePreparedAssets(prepared, outputDirectory)
  writeFileSync(outputFile, content, 'utf8')
  report.status = 'written'
  return report
}

export function discoverMarkdownFiles(directory: string) {
  const files: string[] = []
  const visit = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) visit(path)
      else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') files.push(path)
    }
  }
  visit(directory)
  return files.sort()
}

export function resolveInputPath(workspaceRoot: string, input: string) {
  return resolve(workspaceRoot, input)
}
