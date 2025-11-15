# Prompt: Build an MCP Server for API Integration Automation

## Objective

Create an MCP (Model Context Protocol) server that enables AI assistants to automatically integrate Swagger-generated React Query hooks into existing React/Next.js projects.

## MCP Server Requirements

### 1. Tools to Expose

#### Tool: `analyze_project`

**Purpose**: Understand the project structure
**Inputs**:

- `workspace_path`: Path to the app (e.g., "apps/next-js-todo")

**Returns**:

- Available API modules in `src/api/` (e.g., tasks.ts, users.ts)
- Available hooks per module with their types (query/mutation)
- Routing structure (App Router/Pages Router)
- Existing pages and components

#### Tool: `list_api_hooks`

**Purpose**: Show available generated hooks
**Inputs**:

- `workspace_path`: Target app path
- `module`: Optional filter (e.g., "tasks")

**Returns**:

```json
{
  "tasks": {
    "useGetTasks": { "type": "query", "method": "GET" },
    "useCreateTask": { "type": "mutation", "method": "POST" },
    "useUpdateTask": { "type": "mutation", "method": "PUT" },
    "useDeleteTask": { "type": "mutation", "method": "DELETE" }
  }
}
```

#### Tool: `integrate_api`

**Purpose**: Integrate API hook into target location
**Inputs**:

- `workspace_path`: App path
- `hook_name`: Hook to use (e.g., "useGetTasks")
- `target_type`: "page" | "component" | "new_page"
- `target_path`: Relative path from src/ (e.g., "app/tasks/page.tsx")
- `integration_config`: Optional settings

```json
  {
    "add_loading": true,
    "add_error_handling": true,
    "optimistic_updates": false,
    "invalidate_queries": ["tasks"]
  }
```

**Actions**:

- Read existing file or prepare new file
- Analyze current code structure
- Insert hook integration following existing patterns
- Add necessary imports
- Handle loading/error states based on config
- Write back to file

**Returns**:

- Modified code
- List of changes made
- Warnings if any

#### Tool: `create_page_with_api`

**Purpose**: Generate complete new page with API integration
**Inputs**:

- `workspace_path`: App path
- `page_path`: New page route (e.g., "profile")
- `hooks`: Array of hooks to integrate

```json
  [
    { "name": "useGetUserProfile", "assign_to": "user" },
    { "name": "useUpdateProfile", "assign_to": "updateProfile" }
  ]
```

- `template`: Optional template type ("list", "detail", "form", "dashboard")

**Actions**:

- Create page file in correct routing structure
- Integrate specified hooks
- Generate appropriate UI based on template
- Add TypeScript types from generated schemas
- Include proper error boundaries

**Returns**:

- Created file path
- Generated code
- Suggested next steps

#### Tool: `add_mutation_handler`

**Purpose**: Add mutation hook to existing component/page
**Inputs**:

- `workspace_path`: App path
- `target_path`: Component file path
- `mutation_hook`: Hook name (e.g., "useDeleteTask")
- `trigger_type`: "button" | "form" | "callback"
- `success_actions`: Array of actions after success

```json
  ["invalidate:tasks", "show_toast", "reset_form"]
```

**Actions**:

- Import mutation hook
- Add hook call with options
- Create handler function
- Wire to UI element
- Add loading/error feedback

**Returns**:

- Modified code
- Integration points added

### 2. Resources to Expose

#### Resource: `api_module_schema`

**URI**: `api://[workspace]/[module]`
**Purpose**: Provide schema information for a specific API module

**Returns**:

- Hook signatures with TypeScript types
- Request/response types
- Required parameters
- Optional query options

#### Resource: `project_conventions`

**URI**: `project://[workspace]/conventions`
**Purpose**: Extracted coding patterns from the project

**Returns**:

- Import path aliases
- Component naming patterns
- Error handling approach
- UI library in use
- Formatting preferences

### 3. Prompts to Expose

#### Prompt: `integrate_api_guidance`

**Arguments**:

- `workspace_path`
- `user_intent`: Natural language (e.g., "add delete button to task list")

**Returns**: Step-by-step guidance for integration including:

- Which hooks to use
- Where to integrate
- Code patterns to follow
- Potential issues to avoid

## Implementation Guidelines

### File System Operations

```python
# The MCP server should:
- Read files from workspace_path
- Parse TypeScript/JavaScript to understand structure
- Analyze imports and exports
- Detect React Query usage patterns
- Write modifications atomically
- Preserve formatting and style
```

### Code Analysis

```python
# Must be able to:
- Parse AST of TypeScript/React files
- Identify hook usage patterns
- Find component boundaries
- Detect existing state management
- Understand routing structure (App/Pages Router)
```

### Code Generation

```python
# Should generate code that:
- Matches existing project style
- Uses project's import paths
- Follows detected patterns
- Includes proper TypeScript types
- Handles edge cases (loading/error)
- Is production-ready, not placeholder
```

### Context Awareness

```python
# MCP must maintain context about:
- Available API hooks (from src/api/)
- Project structure (monorepo layout)
- Routing patterns (Next.js version/style)
- UI library (for loading/error components)
- Coding conventions (formatting, naming)
```

## Example Usage Flow

**User to AI**: "Integrate getTasks API into tasks page"

**AI uses MCP**:

1. Call `analyze_project(workspace_path="apps/next-js-todo")`
2. Call `list_api_hooks(workspace_path="apps/next-js-todo", module="tasks")`
3. Call `integrate_api(
     workspace_path="apps/next-js-todo",
     hook_name="useGetTasks",
     target_type="page",
     target_path="app/tasks/page.tsx"
   )`
4. Present changes to user

**User to AI**: "Create new profile page"

**AI uses MCP**:

1. Call `analyze_project()` to find user-related hooks
2. Call `create_page_with_api(
     page_path="profile",
     hooks=[{"name": "useGetUserProfile"}],
     template="detail"
   )`
3. Show generated page to user

## Configuration Schema

The MCP server should read a config file in the workspace:

```json
{
  "api_hooks_path": "src/api",
  "import_alias": "@",
  "routing_style": "app_router",
  "ui_library": "shadcn",
  "react_query_config": {
    "query_client_path": "src/lib/query-client",
    "default_stale_time": 60000
  }
}
```

## Key Design Principles

1. **No Hardcoded Examples**: Generate code based on actual project analysis
2. **Pattern Detection**: Learn from existing code, don't impose patterns
3. **Flexible**: Work with any Swagger-generated React Query setup
4. **Safe**: Always preserve existing code, make surgical changes
5. **Informative**: Return clear descriptions of what was changed
6. **Idempotent**: Running same integration twice should be safe

## Error Handling

The MCP should handle:

- Hook not found in `src/api/`
- Target file doesn't exist
- Conflicting imports
- TypeScript type errors
- Invalid configuration
- Unsupported project structure

Return helpful error messages with suggestions.

## Success Criteria

The MCP server enables AI assistants to:

- ✅ Discover available API hooks in any project
- ✅ Integrate APIs without hardcoded templates
- ✅ Follow project-specific conventions
- ✅ Handle both queries and mutations
- ✅ Work with any Next.js/React structure
- ✅ Generate production-ready code
- ✅ Adapt to different coding styles
This prompt will guide an AI to build the MCP server itself, which will then be a general-purpose tool that can work with ANY project structure, not just hardcoded examples.

## Development Flow

- Prerequisites
  - Node `>=20.11.0` and `pnpm`
  - Workspace installs with `pnpm install` at repository root
- Run in development
  - `pnpm -C mcp/integrate-api run dev`
  - Starts the server with `StdioServerTransport` using `tsx` for TypeScript
- Build for production
  - `pnpm -C mcp/integrate-api run build`
  - Outputs compiled files to `mcp/integrate-api/dist`
- Start compiled server
  - `pnpm -C mcp/integrate-api run start`

## MCP Client Usage (mcp.json)

- The folder includes `mcp/integrate-api/mcp.json` exposing two entries:
  - `integrate-api-dev`: runs the dev server via `pnpm -C mcp/integrate-api run dev`
  - `integrate-api`: runs the compiled server via `pnpm -C mcp/integrate-api run start`
- Copy or merge this `mcp.json` into your MCP client configuration
  - On Windows Claude Desktop: `%APPDATA%/Claude/mcp.json`
- Example client flow
  - List tools and call `analyze_project` with `workspace_path`
  - Call `list_api_hooks` to view hooks by module
  - Use `integrate_api` to insert a hook into an existing file or `create_page_with_api` to scaffold a new page
  - Read resources `api_module_schema` and `project_conventions`
  - Use prompt `integrate_api_guidance` for step-by-step instructions

## Quick Commands

- Install: `pnpm install`
- Dev: `pnpm -C mcp/integrate-api run dev`
- Build: `pnpm -C mcp/integrate-api run build`
- Start: `pnpm -C mcp/integrate-api run start`
