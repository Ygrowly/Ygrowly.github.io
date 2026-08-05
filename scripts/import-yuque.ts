import { existsSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  discoverMarkdownFiles,
  executeImport,
  resolveInputPath,
  type ImportMessage
} from '../src/lib/yuque-import'

interface CliOptions {
  all: boolean
  date?: string
  force: boolean
  input: string
  slug?: string
  write: boolean
}

function printHelp() {
  console.log(
    [
      '语雀 Markdown 导入博客',
      '',
      '用法：',
      '  bun run blog:import -- "md/文章.md"',
      '  bun run blog:import -- "md/文章.md" --write',
      '  bun run blog:import -- md --all',
      '  bun run blog:import -- md --all --write',
      '',
      '选项：',
      '  --date YYYY-MM-DD  当源文件没有 publishDate 时使用',
      '  --slug slug        指定文章目录 slug',
      '  --force            允许覆盖，但会先创建备份',
      '  --write            实际写入；默认仅 dry-run',
      '  --help             显示帮助'
    ].join('\n')
  )
}

function parseArgs(argv: string[]): CliOptions | undefined {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp()
    return undefined
  }

  const positional: string[] = []
  const options: Omit<CliOptions, 'input'> = {
    all: false,
    force: false,
    write: false
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    if (!argument.startsWith('--')) {
      positional.push(argument)
      continue
    }
    if (argument === '--all') {
      options.all = true
      continue
    }
    if (argument === '--write') {
      options.write = true
      continue
    }
    if (argument === '--force') {
      options.force = true
      continue
    }
    if (argument === '--date' || argument === '--slug') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(argument + ' 需要一个值')
      options[argument.slice(2) as 'date' | 'slug'] = value
      index += 1
      continue
    }
    throw new Error('未知选项：' + argument)
  }

  if (positional.length !== 1) throw new Error('请提供一个源文件或目录路径')
  if (options.all && options.slug) throw new Error('--all 不能与单个 --slug 一起使用')
  return { ...options, input: positional[0]! }
}

function printMessage(message: ImportMessage) {
  const prefix = message.severity === 'error' ? '✗' : message.severity === 'warning' ? '⚠' : '✓'
  const location = message.line ? '（第 ' + message.line + ' 行）' : ''
  console.log(prefix + ' ' + message.message + location)
}

function printReport(report: Awaited<ReturnType<typeof executeImport>>) {
  console.log('\n' + report.sourcePath)
  if (report.title) console.log('✓ 标题：' + report.title)
  if (report.content) {
    const description = report.content.match(/^description: (.+)$/m)?.[1]
    const tags = report.content.match(/^tags: (.+)$/m)?.[1]
    const date = report.content.match(/^publishDate: (.+)$/m)?.[1]
    if (description) console.log('✓ 简介：' + description)
    if (tags) console.log('✓ 标签：' + tags)
    if (date) console.log('✓ 日期：' + date)
  }
  if (report.outputPath) console.log('✓ 预计输出：' + report.outputPath)
  console.log('✓ 图片数量：' + report.stats.imageCount)
  console.log('✓ Mermaid 数量：' + report.stats.mermaidCount)
  if (report.stats.normalizedLinkCount) {
    console.log('✓ 修复语雀链接：' + report.stats.normalizedLinkCount)
  }
  for (const message of report.messages) printMessage(message)
  if (report.backupPath) console.log('✓ 备份：' + report.backupPath)
  if (report.status === 'dry-run') console.log('DRY-RUN：未写入文件')
  if (report.status === 'skipped') console.log('已跳过：源 hash 未变化')
  if (report.status === 'written') console.log('已写入：' + report.outputPath)
}

async function main() {
  let cli: CliOptions | undefined
  try {
    cli = parseArgs(process.argv.slice(2))
  } catch (error) {
    console.error('✗ ' + String(error))
    process.exitCode = 1
    return
  }
  if (!cli) return

  const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const inputPath = resolveInputPath(workspaceRoot, cli.input)
  if (!existsSync(inputPath)) {
    console.error('✗ 输入路径不存在：' + cli.input)
    process.exitCode = 1
    return
  }

  const isDirectory = statSync(inputPath).isDirectory()
  if (cli.all && !isDirectory) {
    console.error('✗ --all 需要传入目录路径')
    process.exitCode = 1
    return
  }
  if (!cli.all && isDirectory) {
    console.error('✗ 输入是目录，请追加 --all')
    process.exitCode = 1
    return
  }

  const sourceFiles = cli.all ? discoverMarkdownFiles(inputPath) : [inputPath]
  if (!sourceFiles.length) {
    console.error('✗ 目录下没有 .md 文件')
    process.exitCode = 1
    return
  }

  let failed = 0
  for (const sourceFile of sourceFiles) {
    try {
      const report = await executeImport({
        date: cli.date,
        force: cli.force,
        slug: cli.slug,
        sourcePath: relative(workspaceRoot, sourceFile),
        workspaceRoot,
        write: cli.write
      })
      printReport(report)
      if (report.status === 'error') failed += 1
    } catch (error) {
      failed += 1
      console.error('\n' + relative(workspaceRoot, sourceFile))
      console.error('✗ 导入异常：' + String(error))
      console.error('继续处理下一篇文章')
    }
  }

  if (failed) {
    console.error('\n✗ ' + failed + ' 篇导入失败；其他文章已独立处理')
    process.exitCode = 1
  }
}

void main().catch((error) => {
  console.error('✗ 导入器异常：' + String(error))
  process.exitCode = 1
})
