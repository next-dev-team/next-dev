import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'

const server = new McpServer({ name: 'local-docs-server', version: '0.1.0' })

server.registerTool(
  'search-docs',
  {
    title: 'Search local docs',
    description: 'Search files in the docs directory',
    inputSchema: { query: z.string() },
    outputSchema: { matches: z.array(z.string()) }
  },
  async ({ query }) => {
    const docsDir = path.join(process.cwd(), 'docs')
    const entries = await fs.readdir(docsDir, { withFileTypes: true })
    const files = entries.filter(e => e.isFile()).map(e => path.join(docsDir, e.name))
    const matched: string[] = []
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8')
      if (content.toLowerCase().includes(query.toLowerCase())) matched.push(file)
    }
    const output = { matches: matched }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerTool(
  'update-docs',
  {
    title: 'Scan codebase and update docs',
    description: 'Generates repository overview and writes to docs/readme.md',
    inputSchema: { targetDir: z.string().optional() },
    outputSchema: { updatedFiles: z.array(z.string()), summary: z.string() }
  },
  async ({ targetDir }) => {
    const repoRoot = process.cwd()
    const docsDir = targetDir ? targetDir : path.join(repoRoot, 'docs')
    await fs.mkdir(docsDir, { recursive: true })
    const overview = await buildOverview(repoRoot)
    const targetFile = path.join(docsDir, 'readme.md')
    await fs.writeFile(targetFile, overview, 'utf8')
    const output = { updatedFiles: [targetFile], summary: 'Docs updated' }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

async function buildOverview(root: string): Promise<string> {
  const top = await fs.readdir(root, { withFileTypes: true })
  const dirs = top.filter(e => e.isDirectory()).map(e => e.name)
  const appsDir = path.join(root, 'apps')
  const packagesDir = path.join(root, 'packages')
  const apps = await listSubdirs(appsDir)
  const packages = await listSubdirs(packagesDir)
  const appDetails = await Promise.all(apps.map(a => readPackage(path.join(appsDir, a))))
  const packageDetails = await Promise.all(packages.map(p => readPackage(path.join(packagesDir, p))))
  const date = new Date().toISOString()
  let md = ''
  md += '# Repository Overview\n'
  md += `Generated: ${date}\n\n`
  md += '## Top-level directories\n'
  for (const d of dirs) md += `- ${d}\n`
  md += '\n## Apps\n'
  for (const d of appDetails) md += `- ${d.name ?? d.dir} (${d.dir})\n`
  md += '\n## Packages\n'
  for (const d of packageDetails) md += `- ${d.name ?? d.dir} (${d.dir})\n`
  md += '\n## Scripts\n'
  for (const d of [...appDetails, ...packageDetails]) {
    const entries = Object.entries(d.scripts)
    if (entries.length === 0) continue
    md += `- ${d.name ?? d.dir}\n`
    for (const [k, v] of entries) md += `  - ${k}: ${v}\n`
  }
  return md
}

async function listSubdirs(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries.filter(e => e.isDirectory()).map(e => e.name)
  } catch {
    return []
  }
}

async function readPackage(dir: string): Promise<{ dir: string; name?: string; scripts: Record<string, string> }> {
  const pkgPath = path.join(dir, 'package.json')
  try {
    const raw = await fs.readFile(pkgPath, 'utf8')
    const pkg = JSON.parse(raw)
    return { dir, name: pkg.name, scripts: pkg.scripts ?? {} }
  } catch {
    return { dir, scripts: {} }
  }
}

const transport = new StdioServerTransport()
await server.connect(transport)
