import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const server = new McpServer({ name: 'fullstack-generator-mcp', version: '1.0.0' });

const AnalyzeInput = z.object({
  componentPath: z.string(),
  routePath: z.string(),
  componentType: z.enum(['page', 'component', 'feature']),
});

const AnalyzeOutput = z.object({
  route: z.string(),
  dataRequirements: z.array(
    z.object({
      entityName: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean().optional(),
          validation: z.string().optional(),
        }),
      ),
      operations: z.array(z.enum(['create', 'read', 'update', 'delete'])),
      relationships: z.array(z.object({ relatedEntity: z.string(), relationType: z.string() })),
    }),
  ),
  existingApiCalls: z.array(
    z.object({ endpoint: z.string(), method: z.string(), purpose: z.string().optional() }),
  ),
  formInputs: z.array(
    z.object({ name: z.string(), type: z.string(), validation: z.string().optional() }),
  ),
  uiPatterns: z.array(z.enum(['list', 'detail', 'form', 'dashboard'])),
});

server.registerTool(
  'analyze_existing_ui',
  {
    title: 'Analyze existing React UI',
    description: 'Scan a React component and extract data requirements',
    inputSchema: AnalyzeInput,
    outputSchema: AnalyzeOutput,
  },
  async ({ componentPath, routePath, componentType }) => {
    const abs = path.isAbsolute(componentPath)
      ? componentPath
      : path.join(process.cwd(), componentPath);
    const content = await fs.readFile(abs, 'utf8');
    const apiCalls: { endpoint: string; method: string; purpose?: string }[] = [];
    const endpointRegex =
      /(fetch\(['"]([^'"\n]+)['"]\)|axios\.(get|post|put|delete)\(['"]([^'"\n]+)['"]\))/g;
    let m: RegExpExecArray | null;
    while ((m = endpointRegex.exec(content))) {
      const isAxios = !!m[3];
      const method = isAxios ? m[3] : 'GET';
      const endpoint = isAxios ? m[4] : m[2];
      apiCalls.push({ endpoint, method: method.toUpperCase() });
    }
    const fields: { name: string; type: string; required?: boolean; validation?: string }[] = [];
    const formInputs: { name: string; type: string; validation?: string }[] = [];
    const inputRegex = /name=['"]([^'"\s]+)['"][^>]*|register\(['"]([^'"\s]+)['"]\)/g;
    while ((m = inputRegex.exec(content))) {
      const name = m[1] || m[2];
      if (name) formInputs.push({ name, type: 'string' });
    }
    const uiPatterns: ('list' | 'detail' | 'form' | 'dashboard')[] = [];
    if (/Table|List|FlatList|map\(/.test(content)) uiPatterns.push('list');
    if (/Detail|Item|Card/.test(content)) uiPatterns.push('detail');
    if (/<form|Form|useForm/.test(content)) uiPatterns.push('form');
    if (/Dashboard|Chart|Stats/.test(content)) uiPatterns.push('dashboard');
    const dataRequirements = [
      {
        entityName: 'Unknown',
        fields,
        operations: ['create', 'read', 'update', 'delete'],
        relationships: [],
      },
    ];
    const output = {
      route: routePath,
      dataRequirements,
      existingApiCalls: apiCalls,
      formInputs,
      uiPatterns,
    };
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output };
  },
);

const GenInput = z.object({
  description: z.string(),
  uiType: z.enum(['existing_ui', 'full_stack']),
  routeInfo: z.object({ path: z.string(), name: z.string(), pageType: z.string() }),
  rulesPath: z.string().optional(),
  mockData: z.any().optional(),
});

const GenOutput = z.object({
  success: z.boolean(),
  tool: z.string(),
  message: z.string(),
  details: z.object({
    filesCreated: z.array(z.string()),
    filesModified: z.array(z.string()),
    commandsToRun: z.array(z.string()),
    warnings: z.array(z.string()),
    nextSteps: z.array(z.string()),
  }),
  artifacts: z.object({
    prismaSchema: z.string().optional(),
    openApiSpec: z.any().optional(),
    generatedCode: z.array(z.object({ path: z.string(), content: z.string() })).optional(),
  }),
});

server.registerTool(
  'generate_from_ui_description',
  {
    title: 'Generate backend and integration from description',
    description: 'Create Prisma models, OpenAPI spec, and integration instructions',
    inputSchema: GenInput,
    outputSchema: GenOutput,
  },
  async ({ description, uiType, routeInfo, rulesPath, mockData }) => {
    const entity = inferEntity(description) || 'Item';
    const fields = inferFields(description);
    const prismaModel = buildPrismaModel(entity, fields);
    const openApi = buildOpenApi(entity, fields);
    const filesCreated: string[] = [];
    const filesModified: string[] = [];
    const commandsToRun = [
      'pnpm --filter @rnr/database db:generate',
      'pnpm --filter @rnr/api-spec gen:api',
    ];
    const warnings: string[] = [];
    const nextSteps = [
      `Add UI for ${entity} at ${routeInfo.path}`,
      'Run database migrations and seed if needed',
      'Run API server and validate endpoints',
      'Regenerate hooks via Kubb',
    ];
    const output = {
      success: true,
      tool: 'generate_from_ui_description',
      message: `Generated artifacts for ${entity}`,
      details: { filesCreated, filesModified, commandsToRun, warnings, nextSteps },
      artifacts: { prismaSchema: prismaModel, openApiSpec: openApi, generatedCode: [] },
    };
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output };
  },
);

const EnhanceInput = z.object({
  entity: z.string(),
  operations: z.array(z.string()),
  schema: z.record(z.any()),
  relationships: z.array(z.object({ relatedEntity: z.string(), relationType: z.string() })),
  businessRules: z.array(z.string()).optional(),
});

const EnhanceOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  modifiedPath: z.string().optional(),
});

server.registerTool(
  'enhance_openapi_spec',
  {
    title: 'Enhance OpenAPI spec',
    description: 'Update OpenAPI with entity endpoints and schemas',
    inputSchema: EnhanceInput,
    outputSchema: EnhanceOutput,
  },
  async ({ entity, operations, schema, relationships }) => {
    const specPath = path.join(process.cwd(), 'packages', 'api-spec', 'openapi.yaml');
    let modifiedPath: string | undefined;
    try {
      const raw = await fs.readFile(specPath, 'utf8');
      const doc = YAML.parse(raw);
      const entityLower = entity.toLowerCase();
      const basePath = `/api/${entityLower}s`;
      doc.paths ||= {};
      doc.components ||= {};
      doc.components.schemas ||= {};
      doc.components.schemas[entity] = schema;
      doc.paths[basePath] ||= {};
      if (operations.includes('read'))
        doc.paths[basePath].get = {
          tags: [entity],
          summary: `List ${entityLower}s`,
          responses: { '200': { description: `${entity} list` } },
        };
      if (operations.includes('create'))
        doc.paths[basePath].post = {
          tags: [entity],
          summary: `Create ${entityLower}`,
          responses: { '200': { description: `Created ${entityLower}` } },
        };
      const idPath = `${basePath}/{id}`;
      doc.paths[idPath] ||= {};
      if (operations.includes('read'))
        doc.paths[idPath].get = {
          tags: [entity],
          summary: `Get ${entityLower} by ID`,
          responses: { '200': { description: entity } },
        };
      if (operations.includes('update'))
        doc.paths[idPath].put = {
          tags: [entity],
          summary: `Update ${entityLower}`,
          responses: { '200': { description: `Updated ${entityLower}` } },
        };
      if (operations.includes('delete'))
        doc.paths[idPath].delete = {
          tags: [entity],
          summary: `Delete ${entityLower}`,
          responses: { '200': { description: 'Deleted' } },
        };
      const updated = YAML.stringify(doc);
      await fs.writeFile(specPath, updated, 'utf8');
      modifiedPath = specPath;
      const output = { success: true, message: 'OpenAPI spec updated', modifiedPath };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch {
      const output = { success: false, message: 'Failed to update OpenAPI spec' };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  },
);

const DbInput = z.object({
  models: z.array(
    z.object({
      name: z.string(),
      fields: z.array(
        z.object({ name: z.string(), type: z.string(), optional: z.boolean().optional() }),
      ),
    }),
  ),
  relationships: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(['one-to-many', 'many-to-many', 'one-to-one']),
    }),
  ),
  indexes: z.array(z.object({ model: z.string(), fields: z.array(z.string()) })).optional(),
  constraints: z
    .array(z.object({ model: z.string(), field: z.string(), type: z.string() }))
    .optional(),
});

const DbOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  modifiedPath: z.string().optional(),
});

server.registerTool(
  'update_database_schema',
  {
    title: 'Update Prisma schema',
    description: 'Add or modify Prisma models and relations',
    inputSchema: DbInput,
    outputSchema: DbOutput,
  },
  async ({ models }) => {
    const prismaPath = path.join(process.cwd(), 'packages', 'database', 'prisma', 'schema.prisma');
    try {
      const raw = await fs.readFile(prismaPath, 'utf8');
      const additions = models
        .map((m) =>
          buildPrismaModel(
            m.name,
            m.fields.map((f) => ({ name: f.name, type: f.type })),
          ),
        )
        .join('\n\n');
      const updated = `${raw}\n\n${additions}`;
      await fs.writeFile(prismaPath, updated, 'utf8');
      const output = { success: true, message: 'Prisma schema updated', modifiedPath: prismaPath };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch {
      const output = { success: false, message: 'Failed to update Prisma schema' };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  },
);

const ReactQueryInput = z.object({
  componentPath: z.string(),
  entityName: z.string(),
  operations: z.array(z.enum(['create', 'read', 'update', 'delete'])),
  uiPattern: z.enum(['list', 'form', 'detail']),
});

const ReactQueryOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  codeSample: z.string().optional(),
});

server.registerTool(
  'generate_react_query_integration',
  {
    title: 'Generate React Query integration',
    description: 'Create example integration code using generated hooks',
    inputSchema: ReactQueryInput,
    outputSchema: ReactQueryOutput,
  },
  async ({ componentPath, entityName, operations, uiPattern }) => {
    const lower = entityName.toLowerCase();
    const hookBase = `packages/api-spec/src/gen/hooks`;
    const sample = buildReactQuerySample(lower, operations, uiPattern);
    const output = { success: true, message: 'Integration sample generated', codeSample: sample };
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output };
  },
);

const ValidateInput = z.object({
  route: z.string(),
  checkDatabase: z.boolean().optional(),
  checkOpenApi: z.boolean().optional(),
  checkHooks: z.boolean().optional(),
});

const ValidateOutput = z.object({
  success: z.boolean(),
  report: z.object({
    warnings: z.array(z.string()),
    errors: z.array(z.string()),
    checks: z.array(z.string()),
  }),
});

server.registerTool(
  'validate_integration',
  {
    title: 'Validate integration',
    description: 'Verify Prisma, OpenAPI, and hooks',
    inputSchema: ValidateInput,
    outputSchema: ValidateOutput,
  },
  async ({ route, checkDatabase = true, checkOpenApi = true, checkHooks = true }) => {
    const warnings: string[] = [];
    const errors: string[] = [];
    const checks: string[] = [];
    if (checkDatabase) {
      const prismaPath = path.join(
        process.cwd(),
        'packages',
        'database',
        'prisma',
        'schema.prisma',
      );
      try {
        const raw = await fs.readFile(prismaPath, 'utf8');
        checks.push('Prisma schema present');
        if (!/model\s+User/.test(raw) || !/model\s+Post/.test(raw))
          warnings.push('Core models missing');
      } catch {
        errors.push('Prisma schema not found');
      }
    }
    if (checkOpenApi) {
      const specPath = path.join(process.cwd(), 'packages', 'api-spec', 'openapi.yaml');
      try {
        const raw = await fs.readFile(specPath, 'utf8');
        const doc = YAML.parse(raw);
        checks.push('OpenAPI spec present');
        if (!doc.paths || Object.keys(doc.paths).length === 0) warnings.push('No paths defined');
      } catch {
        errors.push('OpenAPI spec not found');
      }
    }
    if (checkHooks) {
      const hooksDir = path.join(process.cwd(), 'packages', 'api-spec', 'src', 'gen', 'hooks');
      try {
        const entries = await fs.readdir(hooksDir);
        checks.push('Generated hooks present');
        if (entries.length === 0) warnings.push('No hooks generated');
      } catch {
        errors.push('Hooks directory not found');
      }
    }
    const output = { success: errors.length === 0, report: { warnings, errors, checks } };
    return { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output };
  },
);

const RulesInput = z.object({ rulesPath: z.string(), context: z.record(z.any()) });
const RulesOutput = z.object({
  success: z.boolean(),
  rules: z.object({
    validation: z.array(z.string()),
    business: z.array(z.string()),
    relationships: z.array(z.string()),
    api: z.array(z.string()),
  }),
});

server.registerTool(
  'apply_rules_file',
  {
    title: 'Apply rules from rules.md',
    description: 'Parse rules.md and return structured rules',
    inputSchema: RulesInput,
    outputSchema: RulesOutput,
  },
  async ({ rulesPath }) => {
    const abs = path.isAbsolute(rulesPath) ? rulesPath : path.join(process.cwd(), rulesPath);
    try {
      const raw = await fs.readFile(abs, 'utf8');
      const sections = parseRulesMarkdown(raw);
      const output = { success: true, rules: sections };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch {
      const output = {
        success: false,
        rules: { validation: [], business: [], relationships: [], api: [] },
      };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  },
);

function inferEntity(text: string): string | undefined {
  const m = text.match(/\b([A-Za-z]+)\s+app\b|\bentity\s*:\s*([A-Za-z]+)/i);
  return m && (m[1] || m[2]) ? capitalize(m[1] || m[2]) : undefined;
}

function inferFields(text: string): { name: string; type: string }[] {
  const defaults = ['title', 'description', 'status'];
  const fields: { name: string; type: string }[] = [];
  for (const f of defaults)
    if (new RegExp(`\\b${f}\\b`, 'i').test(text))
      fields.push({ name: f, type: f === 'status' ? 'String' : 'String' });
  if (/due\s*date/i.test(text)) fields.push({ name: 'dueDate', type: 'DateTime' });
  return fields.length ? fields : [{ name: 'name', type: 'String' }];
}

function buildPrismaModel(entity: string, fields: { name: string; type: string }[]): string {
  const header = `model ${entity} {`;
  const base = [
    `  id        Int      @id @default(autoincrement())`,
    `  createdAt DateTime @default(now())`,
    `  updatedAt DateTime @updatedAt`,
  ];
  const body = fields.map((f) => `  ${f.name} ${mapPrismaType(f.type)}`);
  const lines = [header, ...base, ...body, `}`];
  return lines.join('\n');
}

function mapPrismaType(type: string): string {
  switch (type) {
    case 'String':
      return 'String';
    case 'Boolean':
      return 'Boolean';
    case 'Int':
      return 'Int';
    case 'DateTime':
      return 'DateTime';
    default:
      return 'String';
  }
}

function buildOpenApi(entity: string, fields: { name: string; type: string }[]) {
  const lower = entity.toLowerCase();
  const schemaProps: Record<string, any> = {};
  for (const f of fields) schemaProps[f.name] = mapOpenApiType(f.type);
  return {
    openapi: '3.0.3',
    info: { title: `${entity} API`, version: '0.1.0' },
    paths: {
      [`/api/${lower}s`]: {
        get: { summary: `List ${lower}s` },
        post: { summary: `Create ${lower}` },
      },
      [`/api/${lower}s/{id}`]: {
        get: { summary: `Get ${lower} by ID` },
        put: { summary: `Update ${lower}` },
        delete: { summary: `Delete ${lower}` },
      },
    },
    components: { schemas: { [entity]: { type: 'object', properties: schemaProps } } },
  };
}

function mapOpenApiType(type: string) {
  switch (type) {
    case 'String':
      return { type: 'string' };
    case 'Boolean':
      return { type: 'boolean' };
    case 'Int':
      return { type: 'integer' };
    case 'DateTime':
      return { type: 'string', format: 'date-time' };
    default:
      return { type: 'string' };
  }
}

function buildReactQuerySample(
  lower: string,
  operations: ('create' | 'read' | 'update' | 'delete')[],
  ui: 'list' | 'form' | 'detail',
) {
  const lines: string[] = [];
  if (ui === 'list' && operations.includes('read')) {
    lines.push(`import { useQuery } from '@tanstack/react-query'`);
    lines.push(`import { getApi${capitalize(lower)}s } from '@/api'`);
    lines.push(`export function ${capitalize(lower)}List() {`);
    lines.push(
      `  const { data, isLoading, error } = useQuery({ queryKey: ['${lower}s'], queryFn: () => getApi${capitalize(lower)}s() })`,
    );
    lines.push(`  return null`);
    lines.push(`}`);
  }
  if (ui === 'form' && operations.includes('create')) {
    lines.push(`import { useMutation } from '@tanstack/react-query'`);
    lines.push(`import { postApi${capitalize(lower)}s } from '@/api'`);
    lines.push(`export function ${capitalize(lower)}Form() {`);
    lines.push(`  const m = useMutation({ mutationFn: postApi${capitalize(lower)}s })`);
    lines.push(`  return null`);
    lines.push(`}`);
  }
  if (ui === 'detail' && operations.includes('read')) {
    lines.push(`import { useQuery } from '@tanstack/react-query'`);
    lines.push(`import { getApi${capitalize(lower)}sId } from '@/api'`);
    lines.push(`export function ${capitalize(lower)}Detail({ id }: { id: number }) {`);
    lines.push(
      `  const { data } = useQuery({ queryKey: ['${lower}', id], queryFn: () => getApi${capitalize(lower)}sId(id) })`,
    );
    lines.push(`  return null`);
    lines.push(`}`);
  }
  return lines.join('\n');
}

function parseRulesMarkdown(md: string) {
  const section = (title: string) => {
    const r = new RegExp(`##\\s+${title}[\n\r]+([\s\S]*?)(?:\n##|$)`, 'i');
    const m = md.match(r);
    const body = m ? m[1] : '';
    return body
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^\-\s*/, '').trim());
  };
  return {
    validation: section('Validation Rules'),
    business: section('Business Logic'),
    relationships: section('Data Relationships'),
    api: section('API Requirements'),
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const transport = new StdioServerTransport();
await server.connect(transport);
