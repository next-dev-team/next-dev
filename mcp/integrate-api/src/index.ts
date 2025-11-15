import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'

const server = new McpServer({ name: 'integrate-api', version: '0.4.0' })

const exists = async (p: string) => {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

const readJson = async (p: string) => {
  const t = await fs.readFile(p, 'utf-8')
  return JSON.parse(t)
}

const readText = async (p: string) => fs.readFile(p, 'utf-8')

const writeFileAtomic = async (p: string, c: string) => {
  const dir = path.dirname(p)
  await fs.mkdir(dir, { recursive: true })
  const tmp = path.join(dir, `.tmp-${Date.now()}-${path.basename(p)}`)
  await fs.writeFile(tmp, c, 'utf-8')
  await fs.rename(tmp, p)
}

const listFiles = async (dir: string) => {
  const out: string[] = []
  const stack: string[] = [dir]
  while (stack.length) {
    const d = stack.pop() as string
    const entries = await fs.readdir(d, { withFileTypes: true })
    for (const e of entries) {
      const fp = path.join(d, e.name)
      if (e.isDirectory()) stack.push(fp)
      else out.push(fp)
    }
  }
  return out
}

const detectRoutingStyle = async (workspace: string) => {
  const appDir = path.join(workspace, 'src', 'app')
  const pagesDir = path.join(workspace, 'src', 'pages')
  if (await exists(appDir)) return 'app_router'
  if (await exists(pagesDir)) return 'pages_router'
  return 'unknown'
}

const readConfig = async (workspace: string) => {
  const candidates = [
    path.join(workspace, 'integrate-api.config.json'),
    path.join(workspace, 'mcp.integrate-api.json'),
    path.join(workspace, 'mcp.config.json'),
    path.join(workspace, 'integrate.api.json'),
    path.join(workspace, 'config.json')
  ]
  for (const c of candidates) if (await exists(c)) return await readJson(c)
  return {
    api_hooks_path: 'src/api',
    import_alias: '@',
    routing_style: await detectRoutingStyle(workspace),
    ui_library: 'auto',
    react_query_config: { query_client_path: 'src/lib/query-client', default_stale_time: 60000 }
  }
}

const listCandidateApiBases = async (workspace: string, cfgApiPath?: string) => {
  const out: string[] = []
  const pushUnique = (p: string) => { if (!out.includes(p)) out.push(p) }
  const defaultBase = path.join(workspace, cfgApiPath || 'src/api')
  if (await exists(defaultBase)) pushUnique(defaultBase)
  const appsDir = path.join(workspace, 'apps')
  if (await exists(appsDir)) {
    const apps = await fs.readdir(appsDir, { withFileTypes: true })
    for (const a of apps) {
      if (!a.isDirectory()) continue
      const apiDir = path.join(appsDir, a.name, 'src', 'api')
      if (await exists(apiDir)) pushUnique(apiDir)
    }
  }
  const packagesDir = path.join(workspace, 'packages')
  if (await exists(packagesDir)) {
    const pkgs = await fs.readdir(packagesDir, { withFileTypes: true })
    for (const p of pkgs) {
      if (!p.isDirectory()) continue
      const apiDir = path.join(packagesDir, p.name, 'src', 'api')
      if (await exists(apiDir)) pushUnique(apiDir)
    }
  }
  return out
}

const findHooksInFile = async (file: string) => {
  const text = await readText(file)
  const names = collectMatches(/export\s+function\s+(use[A-Z][A-Za-z0-9_]*)/g, text)
  const names2 = collectMatches(/export\s+const\s+(use[A-Z][A-Za-z0-9_]*)\s*=\s*/g, text)
  const all = Array.from(new Set([...names, ...names2]))
  const type = text.includes('useQuery(') || text.includes('useInfiniteQuery(') ? 'query' : text.includes('useMutation(') ? 'mutation' : 'unknown'
  const methodMatch = text.match(/method:\s*['"](GET|POST|PUT|DELETE|PATCH)['"]/i)
  const method = methodMatch ? methodMatch[1].toUpperCase() : undefined
  return all.map(n => ({ name: n, type, method }))
}

const listApiModules = async (workspace: string, apiPath: string) => {
  const base = path.isAbsolute(apiPath) ? apiPath : path.join(workspace, apiPath)
  if (!(await exists(base))) return []
  const files = await listFiles(base)
  return files.filter(f => /\.(ts|tsx|js|jsx)$/.test(f))
}

const listHooks = async (workspace: string, apiPath: string, module?: string) => {
  const modules = await listApiModules(workspace, apiPath)
  const out: Record<string, { name: string; type: string; method?: string }[]> = {}
  for (const m of modules) {
    const base = path.isAbsolute(apiPath) ? apiPath : path.join(workspace, apiPath)
    const rel = path.relative(base, m).replace(/\\/g, '/')
    if (module && !rel.startsWith(module)) continue
    const hooks = await findHooksInFile(m)
    if (hooks.length) out[rel] = hooks
  }
  return out
}

const findHookExportPath = async (workspace: string, apiPath: string, hook: string) => {
  const bases = await listCandidateApiBases(workspace, apiPath)
  for (const base of bases) {
    const files = await listFiles(base)
    for (const m of files.filter(f => /\.(ts|tsx|js|jsx)$/.test(f))) {
      const text = await readText(m)
      if (new RegExp(`export\\s+(function|const)\\s+${hook}\\b`).test(text)) {
        const rel = path.relative(workspace, m).replace(/\\/g, '/')
        return rel
      }
    }
  }
  return undefined
}

const relativeImport = (fromFile: string, toFile: string) => {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/')
  if (!rel.startsWith('.')) rel = './' + rel
  rel = rel.replace(/\.(ts|tsx|js|jsx)$/, '')
  return rel
}

const insertHookIntoCode = (code: string, hookName: string, importPath: string, config: any, isPage: boolean) => {
  const hasImport = new RegExp(`\\b${hookName}\\b`).test(code) && code.includes('import')
  const importLine = `import { ${hookName} } from '${importPath}'\n`
  const withImport = hasImport ? code : importLine + code
  const usesHook = new RegExp(`\\b${hookName}\\s*\\(`).test(withImport)
  if (usesHook) return withImport
  const loading = config?.add_loading !== false
  const error = config?.add_error_handling !== false
  const hookCall = `const q = ${hookName}()\n`
  const uiLoading = loading ? `{q.isLoading ? <div>Loading...</div> : null}` : ''
  const uiError = error ? `{q.isError ? <div>Error</div> : null}` : ''
  const jsxInsert = `${uiLoading}${uiError}{q.data ? <pre>{JSON.stringify(q.data,null,2)}</pre> : null}`
  const functionMatch = withImport.match(/function\s+([A-Za-z0-9_]+)\s*\(/)
  if (functionMatch) {
    const idx = withImport.indexOf('{', withImport.indexOf(functionMatch[0]))
    const before = withImport.slice(0, idx + 1)
    const after = withImport.slice(idx + 1)
    const withHook = before + '\n' + hookCall + after
    const renderIdx = withHook.lastIndexOf('return')
    if (renderIdx !== -1) {
      const closeIdx = withHook.indexOf('}', renderIdx)
      const pre = withHook.slice(0, renderIdx)
      const post = withHook.slice(renderIdx)
      const injected = pre + `return (<div>${jsxInsert}</div>)` + withHook.slice(closeIdx)
      return injected
    }
    return withHook
  }
  const exportDefaultIdx = withImport.indexOf('export default')
  if (exportDefaultIdx !== -1) {
    const returnIdx = withImport.indexOf('return', exportDefaultIdx)
    if (returnIdx !== -1) {
      const closeIdx = withImport.indexOf('}', returnIdx)
      const pre = withImport.slice(0, returnIdx)
      const injected = pre + `return (<div>${jsxInsert}</div>)` + withImport.slice(closeIdx)
      return injected
    }
  }
  const fallback = withImport + `\n${hookCall}\nexport default function GeneratedPage(){ return (<div>${jsxInsert}</div>) }\n`
  return fallback
}

server.registerTool(
  'analyze_project',
  {
    title: 'Analyze Project',
    description: 'Analyze project structure and conventions',
    inputSchema: { workspace_path: z.string() },
    outputSchema: {
      api_modules: z.array(z.string()),
      hooks: z.record(z.array(z.object({ name: z.string(), type: z.string(), method: z.string().optional() }))),
      routing_style: z.string(),
      pages: z.array(z.string()),
      components: z.array(z.string())
    }
  },
  async ({ workspace_path }) => {
    const cfg = await readConfig(workspace_path)
    const routing = cfg.routing_style || (await detectRoutingStyle(workspace_path))
    const bases = await listCandidateApiBases(workspace_path, cfg.api_hooks_path)
    const apiModules = (await Promise.all(
      bases.map(async b => (await listFiles(b)).filter(f => /\.(ts|tsx|js|jsx)$/.test(f))
      ))
    ).flat()
    const hooksMerged: Record<string, { name: string; type: string; method?: string }[]> = {}
    for (const b of bases) {
      const h = await listHooks(workspace_path, b)
      for (const [mod, arr] of Object.entries(h)) {
        const key = path.relative(workspace_path, path.join(b, mod)).replace(/\\/g, '/')
        hooksMerged[key] = arr
      }
    }
    const pagesDir = routing === 'app_router' ? path.join(workspace_path, 'src', 'app') : path.join(workspace_path, 'src', 'pages')
    const pages = (await exists(pagesDir)) ? (await listFiles(pagesDir)).filter(f => /\.(ts|tsx|js|jsx)$/.test(f)).map(f => path.relative(workspace_path, f).replace(/\\/g, '/')) : []
    const componentsDir = path.join(workspace_path, 'src', 'components')
    const components = (await exists(componentsDir)) ? (await listFiles(componentsDir)).filter(f => /\.(ts|tsx|js|jsx)$/.test(f)).map(f => path.relative(workspace_path, f).replace(/\\/g, '/')) : []
    const output = { api_modules: apiModules.map(f => path.relative(workspace_path, f).replace(/\\/g, '/')), hooks: hooksMerged, routing_style: routing, pages, components }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerTool(
  'list_api_hooks',
  {
    title: 'List API Hooks',
    description: 'List available generated hooks',
    inputSchema: { workspace_path: z.string(), module: z.string().optional() },
    outputSchema: { hooks: z.record(z.record(z.object({ type: z.string(), method: z.string().optional() }))) }
  },
  async ({ workspace_path, module }) => {
    const cfg = await readConfig(workspace_path)
    let bases = await listCandidateApiBases(workspace_path, cfg.api_hooks_path)
    let moduleFilter: string | undefined = undefined
    if (module) {
      const abs = path.isAbsolute(module) ? module : path.join(workspace_path, module)
      if (await exists(abs)) {
        try {
          const st = await fs.lstat(abs)
          if (st.isFile()) {
            const hooks = await findHooksInFile(abs)
            const key = path.relative(workspace_path, abs).replace(/\\/g, '/')
            const fileHooks: Record<string, { type: string; method?: string }> = {}
            for (const h of hooks) fileHooks[h.name] = { type: h.type, method: h.method }
            const output = { hooks: { [key]: fileHooks } }
            return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
          }
        } catch {}
        bases = [abs]
      } else {
        moduleFilter = module.replace(/\\/g, '/')
      }
    }
    const hooksMerged: Record<string, Record<string, { type: string; method?: string }>> = {}
    for (const b of bases) {
      const hooks = await listHooks(workspace_path, b, moduleFilter)
      for (const [mod, arr] of Object.entries(hooks)) {
        const key = path.relative(workspace_path, path.join(b, mod)).replace(/\\/g, '/')
        hooksMerged[key] = hooksMerged[key] || {}
        for (const h of arr) hooksMerged[key][h.name] = { type: h.type, method: h.method }
      }
    }
    const output = { hooks: hooksMerged }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerTool(
  'integrate_api',
  {
    title: 'Integrate API Hook',
    description: 'Integrate a React Query hook into a page or component',
    inputSchema: {
      workspace_path: z.string(),
      hook_name: z.string(),
      target_type: z.enum(['page', 'component', 'new_page']).default('page'),
      target_path: z.string(),
      integration_config: z
        .object({ add_loading: z.boolean().optional(), add_error_handling: z.boolean().optional(), optimistic_updates: z.boolean().optional(), invalidate_queries: z.array(z.string()).optional() })
        .optional()
    },
    outputSchema: {
      modified_code: z.string(),
      changes: z.array(z.string()),
      warnings: z.array(z.string())
    }
  },
  async ({ workspace_path, hook_name, target_type, target_path, integration_config }) => {
    const cfg = await readConfig(workspace_path)
    const exportPath = await findHookExportPath(workspace_path, cfg.api_hooks_path, hook_name)
    if (!exportPath) {
      const output = { modified_code: '', changes: [], warnings: [`Hook not found: ${hook_name}`] }
      return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
    }
    const targetAbs = path.join(workspace_path, 'src', target_path)
    const isNew = !(await exists(targetAbs)) || target_type === 'new_page'
    const baseCode = isNew ? `export default function Page(){ return (<div/>) }\n` : await readText(targetAbs)
    const importPath = relativeImport(targetAbs, path.join(workspace_path, exportPath))
    const updatedCode = insertHookIntoCode(baseCode, hook_name, importPath, integration_config || {}, target_type !== 'component')
    await writeFileAtomic(targetAbs, updatedCode)
    const output = { modified_code: updatedCode, changes: [isNew ? `Created ${targetAbs}` : `Updated ${targetAbs}`, `Imported ${hook_name} from ${importPath}`], warnings: [] }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerTool(
  'create_page_with_api',
  {
    title: 'Create Page With API',
    description: 'Create a page and integrate hooks',
    inputSchema: {
      workspace_path: z.string(),
      page_path: z.string(),
      hooks: z.array(z.object({ name: z.string(), assign_to: z.string().optional() })),
      template: z.enum(['list', 'detail', 'form', 'dashboard']).optional()
    },
    outputSchema: {
      created_file_path: z.string(),
      generated_code: z.string(),
      next_steps: z.array(z.string())
    }
  },
  async ({ workspace_path, page_path, hooks, template }) => {
    const cfg = await readConfig(workspace_path)
    const routing = cfg.routing_style || (await detectRoutingStyle(workspace_path))
    const targetAbs = routing === 'app_router' ? path.join(workspace_path, 'src', 'app', page_path, 'page.tsx') : path.join(workspace_path, 'src', 'pages', `${page_path}.tsx`)
    let code = `export default function Page(){ return (<div/>) }\n`
    const changes: string[] = []
    for (const h of hooks) {
      const exportPath = await findHookExportPath(workspace_path, cfg.api_hooks_path, h.name)
      if (!exportPath) continue
      const importPath = relativeImport(targetAbs, path.join(workspace_path, exportPath))
      code = insertHookIntoCode(code, h.name, importPath, { add_loading: true, add_error_handling: true }, true)
      changes.push(`Imported ${h.name} from ${importPath}`)
    }
    if (template === 'list') code = code.replace('<div/>', '<div><ul></ul></div>')
    if (template === 'detail') code = code.replace('<div/>', '<div><section></section></div>')
    if (template === 'form') code = code.replace('<div/>', '<div><form></form></div>')
    if (template === 'dashboard') code = code.replace('<div/>', '<div><main></main></div>')
    await writeFileAtomic(targetAbs, code)
    const output = { created_file_path: path.relative(workspace_path, targetAbs).replace(/\\/g, '/'), generated_code: code, next_steps: changes }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerTool(
  'add_mutation_handler',
  {
    title: 'Add Mutation Handler',
    description: 'Add a mutation hook to an existing component or page',
    inputSchema: {
      workspace_path: z.string(),
      target_path: z.string(),
      mutation_hook: z.string(),
      trigger_type: z.enum(['button', 'form', 'callback']).default('button'),
      success_actions: z.array(z.string())
    },
    outputSchema: {
      modified_code: z.string(),
      integration_points: z.array(z.string())
    }
  },
  async ({ workspace_path, target_path, mutation_hook, trigger_type, success_actions }) => {
    const cfg = await readConfig(workspace_path)
    const exportPath = await findHookExportPath(workspace_path, cfg.api_hooks_path, mutation_hook)
    if (!exportPath) {
      const output = { modified_code: '', integration_points: [] }
      return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
    }
    const targetAbs = path.join(workspace_path, 'src', target_path)
    const base = await readText(targetAbs)
    const importPath = relativeImport(targetAbs, path.join(workspace_path, exportPath))
    const hasImport = base.includes(mutation_hook)
    const withImport = hasImport ? base : `import { ${mutation_hook} } from '${importPath}'\n` + base
    const call = `const m = ${mutation_hook}({ onSuccess(){ } })\n`
    const withCall = withImport.includes(mutation_hook + '(') ? withImport : withImport.replace(/\{/, '{\n' + call)
    let ui = ''
    if (trigger_type === 'button') ui = `<button onClick={()=>m.mutate(undefined)}>Run</button>`
    if (trigger_type === 'form') ui = `<form onSubmit={(e)=>{e.preventDefault();m.mutate(undefined)}}><button type=\"submit\">Submit</button></form>`
    if (trigger_type === 'callback') ui = `m.mutate(undefined)`
    const withUi = withCall.includes(ui) ? withCall : withCall.replace(/return\s*\(/, `return (<div>${ui}`)
    const updated = withUi
    await writeFileAtomic(targetAbs, updated)
    const output = { modified_code: updated, integration_points: [`Imported ${mutation_hook}`, `Added call`, `Wired ${trigger_type}`] }
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output }
  }
)

server.registerResource(
  'api_module_schema',
  new ResourceTemplate('api://{workspace}/{module}', { list: undefined }),
  { title: 'API Module Schema', description: 'Hook signatures and types' },
  async (uri, { workspace, module }) => {
    const workspace_path = String(workspace)
    const cfg = await readConfig(workspace_path)
    const base = path.join(workspace_path, cfg.api_hooks_path)
    const file = path.join(base, String(module))
    if (!(await exists(file))) return { contents: [{ uri: uri.href, text: JSON.stringify({ hooks: [] }) }] }
    const hooks = await findHooksInFile(file)
    const contents = { hooks: hooks.map(h => ({ name: h.name, type: h.type, method: h.method })) }
    return { contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(contents) }] }
  }
)

server.registerResource(
  'project_conventions',
  new ResourceTemplate('project://{workspace}/conventions', { list: undefined }),
  { title: 'Project Conventions', description: 'Extracted coding patterns' },
  async (uri, { workspace }) => {
    const workspace_path = String(workspace)
    const cfg = await readConfig(workspace_path)
    const tsconfig = path.join(workspace_path, 'tsconfig.json')
    let import_alias = cfg.import_alias
    if (await exists(tsconfig)) {
      try {
        const tc = await readJson(tsconfig)
        const paths = tc.compilerOptions?.paths || {}
        const first = Object.keys(paths)[0]
        if (first) import_alias = first.replace('/*', '')
      } catch { }
    }
    const conventions = { import_alias, routing_style: cfg.routing_style, ui_library: cfg.ui_library, formatting: 'prettier' }
    return { contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(conventions) }] }
  }
)

server.registerPrompt(
  'integrate_api_guidance',
  { title: 'Integrate API Guidance', description: 'Step-by-step integration guidance', argsSchema: { workspace_path: z.string(), user_intent: z.string() } },
  ({ workspace_path, user_intent }) => {
    const text = `Intent: ${user_intent}\n1. Analyze project\n2. List hooks\n3. Choose target\n4. Integrate with loading/error\n5. Validate types\n6. Run and verify`
    return { messages: [{ role: 'user', content: { type: 'text', text } }] }
  }
)

async function start() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

start()
const collectMatches = (re: RegExp, text: string) => {
  const out: string[] = []
  const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  let m: RegExpExecArray | null
  while ((m = globalRe.exec(text)) !== null) {
    if (m[1]) out.push(m[1])
    if (m.index === globalRe.lastIndex) globalRe.lastIndex++
  }
  return out
}