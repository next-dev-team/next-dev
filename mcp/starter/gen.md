# AI Prompt: Create MCP Server Using Turborepo Generators

## Context

I have a Turborepo monorepo and want to create an MCP server called `starter-mcp` that wraps and enhances Turborepo's built-in `turbo gen` functionality. This MCP will make it easy for AI agents in my IDE to generate new packages using Turborepo generators with intelligent suggestions for internal package dependencies.

## Turborepo Generators Overview

Turborepo uses `turbo/generators` with Plop.js under the hood:

- Config location: `turbo/generators/config.ts`
- Templates location: `turbo/generators/templates/`
- Run with: `pnpm turbo gen` or `npx turbo gen`

## Requirements

### 1. MCP Server Structure

```
starter-mcp/
├── src/
│   ├── index.ts                    # Main MCP server
│   ├── tools/
│   │   ├── run-generator.ts        # Execute turbo gen
│   │   ├── list-generators.ts      # List available generators
│   │   ├── list-packages.ts        # List internal packages
│   │   └── analyze-generator.ts    # Show generator prompts/options
│   └── utils/
│       ├── turbo-runner.ts         # Execute turbo commands
│       ├── package-scanner.ts      # Scan monorepo packages
│       └── prompt-builder.ts       # Build generator arguments
├── package.json
├── tsconfig.json
└── README.md
```

### 2. Turborepo Generator Setup

The monorepo should have this structure:

```
my-monorepo/
├── turbo/
│   └── generators/
│       ├── config.ts              # Generator definitions
│       └── templates/
│           ├── nextjs-app/        # Next.js app template
│           │   ├── package.json.hbs
│           │   ├── app/
│           │   │   └── page.tsx.hbs
│           │   ├── next.config.js.hbs
│           │   └── tsconfig.json.hbs
│           ├── react-lib/         # React library template
│           └── utils-lib/         # Utils library template
├── packages/
│   ├── ui/                        # Existing packages
│   ├── utils/
│   └── hooks/
├── apps/
│   └── web/
├── turbo.json
└── package.json
```

### 3. Example Turborepo Generator Config

**File: `turbo/generators/config.ts`**

```typescript
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Next.js App Generator
  plop.setGenerator("nextjs-app", {
    description: "Generate a new Next.js app",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new app?",
      },
      {
        type: "input",
        name: "description",
        message: "App description?",
        default: "A new Next.js application",
      },
      {
        type: "checkbox",
        name: "internalPackages",
        message: "Select internal packages to use:",
        choices: [
          { name: "@monorepo/ui", value: "@monorepo/ui" },
          { name: "@monorepo/utils", value: "@monorepo/utils" },
          { name: "@monorepo/hooks", value: "@monorepo/hooks" },
          { name: "@monorepo/types", value: "@monorepo/types" },
        ],
      },
      {
        type: "confirm",
        name: "useTailwind",
        message: "Use Tailwind CSS?",
        default: true,
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "apps/{{dashCase name}}",
        templateFiles: "templates/nextjs-app/**/*",
        base: "templates/nextjs-app",
      },
    ],
  });

  // React Library Generator
  plop.setGenerator("react-lib", {
    description: "Generate a new React library",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Library name?",
      },
      {
        type: "checkbox",
        name: "internalPackages",
        message: "Select internal dependencies:",
        choices: [
          { name: "@monorepo/ui", value: "@monorepo/ui" },
          { name: "@monorepo/utils", value: "@monorepo/utils" },
          { name: "@monorepo/types", value: "@monorepo/types" },
        ],
      },
      {
        type: "confirm",
        name: "includeStorybook",
        message: "Include Storybook?",
        default: false,
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "packages/{{dashCase name}}",
        templateFiles: "templates/react-lib/**/*",
        base: "templates/react-lib",
      },
    ],
  });

  // Utils Library Generator
  plop.setGenerator("utils-lib", {
    description: "Generate a utilities library",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name?",
      },
      {
        type: "confirm",
        name: "includeTests",
        message: "Include Vitest setup?",
        default: true,
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "packages/{{dashCase name}}",
        templateFiles: "templates/utils-lib/**/*",
        base: "templates/utils-lib",
      },
    ],
  });
}
```

### 4. Example Template Files

**File: `turbo/generators/templates/nextjs-app/package.json.hbs`**

```json
{
  "name": "@monorepo/{{dashCase name}}",
  "version": "0.1.0",
  "private": true,
  "description": "{{description}}",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"{{#each internalPackages}},
    "{{this}}": "workspace:*"{{/each}}{{#if useTailwind}},
    "tailwindcss": "^3.4.0"{{/if}}
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

**File: `turbo/generators/templates/nextjs-app/app/page.tsx.hbs`**

```tsx
{{#if (lookup internalPackages '@monorepo/ui')}}
import { Button, Card } from '@monorepo/ui'
{{/if}}
{{#if (lookup internalPackages '@monorepo/hooks')}}
import { useCounter } from '@monorepo/hooks'
{{/if}}

export default function Home() {
  {{#if (lookup internalPackages '@monorepo/hooks')}}
  const { count, increment } = useCounter(0)
  {{/if}}

  return (
    <main className="min-h-screen p-8">
      {{#if (lookup internalPackages '@monorepo/ui')}}
      <Card>
        <h1 className="text-4xl font-bold">{{name}}</h1>
        <p>{{description}}</p>
        {{#if (lookup internalPackages '@monorepo/hooks')}}
        <p>Count: {count}</p>
        <Button onClick={increment}>Increment</Button>
        {{/if}}
      </Card>
      {{else}}
      <div>
        <h1>{{name}}</h1>
        <p>{{description}}</p>
      </div>
      {{/if}}
    </main>
  )
}
```

### 5. MCP Tools

#### Tool 1: `list_generators`

**Description**: List all available Turborepo generators
**Parameters**: None
**Output**:

```json
[
  {
    "name": "nextjs-app",
    "description": "Generate a new Next.js app"
  },
  {
    "name": "react-lib",
    "description": "Generate a new React library"
  },
  {
    "name": "utils-lib",
    "description": "Generate a utilities library"
  }
]
```

**Implementation**: Parse `turbo/generators/config.ts` or run `turbo gen --list`

#### Tool 2: `analyze_generator`

**Description**: Show what prompts/options a generator has
**Parameters**:

```json
{
  "generatorName": "nextjs-app"
}
```

**Output**:

```json
{
  "name": "nextjs-app",
  "description": "Generate a new Next.js app",
  "prompts": [
    {
      "name": "name",
      "type": "input",
      "message": "What is the name of the new app?"
    },
    {
      "name": "internalPackages",
      "type": "checkbox",
      "message": "Select internal packages to use:",
      "choices": ["@monorepo/ui", "@monorepo/utils", "@monorepo/hooks"]
    }
  ]
}
```

#### Tool 3: `list_internal_packages`

**Description**: List all packages in the monorepo
**Parameters**: None
**Output**:

```json
[
  {
    "name": "@monorepo/ui",
    "path": "packages/ui",
    "version": "1.0.0",
    "exports": ["Button", "Card", "Input"]
  },
  {
    "name": "@monorepo/utils",
    "path": "packages/utils",
    "version": "1.0.0",
    "exports": ["cn", "formatDate", "debounce"]
  }
]
```

**Implementation**: Scan `packages/` and `apps/` directories, read package.json files

#### Tool 4: `run_generator`

**Description**: Execute a Turborepo generator with provided answers
**Parameters**:

```json
{
  "generatorName": "nextjs-app",
  "answers": {
    "name": "my-dashboard",
    "description": "Admin dashboard app",
    "internalPackages": ["@monorepo/ui", "@monorepo/hooks"],
    "useTailwind": true
  }
}
```

**Output**:

```json
{
  "success": true,
  "location": "apps/my-dashboard",
  "filesCreated": [
    "apps/my-dashboard/package.json",
    "apps/my-dashboard/app/page.tsx",
    "apps/my-dashboard/next.config.js",
    "apps/my-dashboard/tsconfig.json"
  ],
  "nextSteps": [
    "cd apps/my-dashboard",
    "pnpm install",
    "pnpm dev"
  ]
}
```

**Implementation**:

```typescript
// Run turbo gen programmatically
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Build command with answers
const answersJson = JSON.stringify(answers);
const command = `echo '${answersJson}' | turbo gen ${generatorName}`;

await execAsync(command, { cwd: monorepoRoot });
```

### 6. Agent Interaction Flow

```
ME: "Create a new Next.js dashboard app"

AGENT: Let me check available generators.
[calls list_generators]

AGENT: I found a "nextjs-app" generator. Let me see what it needs.
[calls analyze_generator with nextjs-app]

AGENT: This generator can create a Next.js app and use your internal packages.
Available internal packages:
[calls list_internal_packages]

- @monorepo/ui (Button, Card, Input components)
- @monorepo/utils (formatDate, cn, debounce)
- @monorepo/hooks (useCounter, useLocalStorage)
- @monorepo/types (User, Product types)

Which packages would you like to use?

ME: "Use ui and hooks"

AGENT: Great! What should I name this app?

ME: "admin-dashboard"

AGENT: Should I include Tailwind CSS? (yes/no)

ME: "yes"

AGENT: [calls run_generator with all the answers]

✅ Created apps/admin-dashboard with:
- @monorepo/ui for components
- @monorepo/hooks for state management
- Tailwind CSS configured
- TypeScript setup

Next steps:
1. cd apps/admin-dashboard
2. pnpm install
3. pnpm dev
```

### 7. MCP Server Implementation

**Key Features**:

1. **Scan turbo/generators/config.ts** to discover generators
2. **Parse generator prompts** to understand what inputs are needed
3. **Scan monorepo** to list available internal packages
4. **Execute turbo gen** with provided answers (non-interactive mode)
5. **Return results** with file locations and next steps

**Technologies**:

- Use Node.js `child_process` to run `turbo gen`
- Parse TypeScript config files to read generator definitions
- Use `@turbo/gen` types if needed
- Scan filesystem for package.json files

### 8. Package.json for MCP Server

```json
{
  "name": "starter-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "starter-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc && chmod +x build/index.js",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "@turbo/gen": "^2.0.0",
    "fs-extra": "^11.2.0",
    "glob": "^10.3.10",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 9. Enhanced Features

1. **Smart Package Suggestions**:
   - Analyze generator templates to suggest relevant internal packages
   - Show what exports each package provides

2. **Validation**:
   - Check if app/package name already exists
   - Validate package naming conventions

3. **Post-Generation**:
   - Auto-run `pnpm install` in new package
   - Update root package.json if needed
   - Create initial git commit

4. **Generator Management**:
   - Tool to create new generators
   - Tool to update existing generators
   - Validate generator templates

### 10. Usage Example

```typescript
// In AI agent/IDE:

// 1. List available generators
const generators = await use_mcp_tool("starter-mcp", "list_generators", {})
// Returns: ["nextjs-app", "react-lib", "utils-lib"]

// 2. Analyze specific generator
const details = await use_mcp_tool("starter-mcp", "analyze_generator", {
  generatorName: "nextjs-app"
})
// Returns prompts and options

// 3. See available internal packages
const packages = await use_mcp_tool("starter-mcp", "list_internal_packages", {})
// Returns all @monorepo/* packages with exports

// 4. Run generator
const result = await use_mcp_tool("starter-mcp", "run_generator", {
  generatorName: "nextjs-app",
  answers: {
    name: "my-dashboard",
    description: "Admin dashboard",
    internalPackages: ["@monorepo/ui", "@monorepo/hooks"],
    useTailwind: true
  }
})
// Creates the new app
```

### 11. Expected Output

Generate:

1. **Complete MCP server** that wraps `turbo gen`
2. **Example Turborepo generator config** with 3+ generators
3. **Example template files** using Handlebars (.hbs)
4. **Package scanner** to list internal packages and their exports
5. **Generator executor** that runs turbo gen non-interactively
6. **Full documentation** on setup and usage

The MCP should work seamlessly with existing Turborepo generators and make it easy for AI agents to:

- Discover what generators exist
- Understand what inputs they need
- Suggest internal packages to use
- Execute generators with all answers provided

---

**Generate a production-ready MCP server that leverages Turborepo generators now.**
