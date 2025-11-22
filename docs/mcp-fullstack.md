# AI Agent Prompt: MCP Toolkit for Automated Frontend-Backend Integration

You are an expert in building Model Context Protocol (MCP) servers that automate development workflows. Your task is to create an MCP toolkit that bridges frontend developers and backend code generation, allowing them to describe UI requirements and automatically generate the necessary API integrations.

## Mission Overview

Build an MCP server that acts as an intelligent intermediary between frontend developers and your TurboRepo backend infrastructure. The system should accept natural language descriptions and structured information about UI components, then automatically generate:

- OpenAPI specifications
- Database schema updates
- API endpoints
- React Query hooks via Kubb
- Type-safe integration code

## MCP Server Architecture

### Core MCP Tools to Implement

#### 1. **analyze_existing_ui**

**Purpose**: Scan and understand existing React components to extract data requirements

**Input Parameters**:

- `componentPath`: Path to React component file
- `routePath`: Frontend route (e.g., "/todos", "/dashboard")
- `componentType`: "page" | "component" | "feature"

**Expected Behavior**:

- Parse React component file (JSX/TSX)
- Identify state management patterns (useState, useContext, etc.)
- Extract data structures from props and state
- Detect existing API calls or data fetching logic
- Identify form inputs and their validation requirements
- Map UI elements to potential database fields
- Return structured analysis of data needs

**Output Schema**:

```typescript
{
  route: string,
  dataRequirements: Array<{
    entityName: string,
    fields: Array<{ name, type, required, validation }>,
    operations: ['create', 'read', 'update', 'delete'],
    relationships: Array<{ relatedEntity, relationType }>
  }>,
  existingApiCalls: Array<{ endpoint, method, purpose }>,
  formInputs: Array<{ name, type, validation }>,
  uiPatterns: Array<'list', 'detail', 'form', 'dashboard'>
}
```

#### 2. **generate_from_ui_description**

**Purpose**: Generate complete backend + integration from natural language description

**Input Parameters**:

- `description`: Natural language description of the feature
- `uiType`: "existing_ui" | "full_stack"
- `routeInfo`: { path, name, pageType }
- `rulesPath`: Optional path to rules.md file with business logic
- `mockData`: Optional sample data structure

**Expected Behavior**:

- Parse natural language to extract entities and relationships
- If `rulesPath` provided, read and interpret business rules
- Generate appropriate database schema (Prisma models)
- Create OpenAPI specification for required endpoints
- Determine CRUD operations needed based on UI type
- Apply validation rules from description or rules.md
- Generate proper authentication/authorization if mentioned
- Consider pagination, filtering, sorting requirements

**Output Actions**:

- Update Prisma schema with new models
- Generate OpenAPI spec in packages/api-spec
- Trigger Kubb generation for React Query hooks
- Create API endpoint stubs in apps/api
- Return integration instructions for frontend

#### 3. **enhance_openapi_spec**

**Purpose**: Intelligently update OpenAPI spec based on requirements

**Input Parameters**:

- `entity`: Entity name (e.g., "Todo", "User")
- `operations`: Array of operations needed
- `schema`: Data structure definition
- `relationships`: Related entities
- `businessRules`: Validation and business logic rules

**Expected Behavior**:

- Read existing OpenAPI specification
- Add or update paths for entity endpoints
- Generate proper request/response schemas
- Include pagination parameters for list endpoints
- Add filter and sort query parameters where logical
- Define error responses (400, 401, 404, 500)
- Ensure consistent naming conventions
- Validate OpenAPI spec format
- Maintain backward compatibility with existing specs

#### 4. **update_database_schema**

**Purpose**: Update Prisma schema based on data requirements

**Input Parameters**:

- `models`: Array of model definitions
- `relationships`: Inter-model relationships
- `indexes`: Performance optimization indexes
- `constraints`: Unique constraints and validations

**Expected Behavior**:

- Parse existing Prisma schema
- Add new models or update existing ones
- Define proper field types mapped from TypeScript/JSON types
- Set up relationships (one-to-many, many-to-many)
- Add indexes for commonly queried fields
- Include timestamps (createdAt, updatedAt)
- Apply database-level constraints
- Validate schema syntax
- Generate migration-ready schema

#### 5. **generate_react_query_integration**

**Purpose**: Create frontend integration code using generated hooks

**Input Parameters**:

- `componentPath`: Where to create/update integration
- `entityName`: Entity being integrated
- `operations`: Which CRUD operations to implement
- `uiPattern`: Type of UI pattern (list, form, detail, etc.)

**Expected Behavior**:

- Generate React Query hook imports from gen/ folder
- Create custom hooks wrapping generated queries/mutations
- Include loading, error, and success states
- Add optimistic updates for mutations
- Implement proper cache invalidation
- Generate TypeScript interfaces from OpenAPI types
- Create example usage code
- Add error handling patterns

#### 6. **validate_integration**

**Purpose**: Verify complete frontend-backend integration

**Input Parameters**:

- `route`: Frontend route to validate
- `checkDatabase`: Verify Prisma schema
- `checkOpenApi`: Verify OpenAPI spec
- `checkHooks`: Verify generated React Query hooks

**Expected Behavior**:

- Check if Prisma model exists for entity
- Verify OpenAPI endpoints are defined
- Confirm Kubb has generated corresponding hooks
- Validate type consistency across layers
- Check for common integration issues
- Return health report with warnings/errors

#### 7. **apply_rules_file**

**Purpose**: Parse and apply rules from rules.md file

**Input Parameters**:

- `rulesPath`: Path to rules.md file
- `context`: Current generation context

**Expected Behavior**:

- Read rules.md file
- Parse business logic rules (markdown format)
- Extract validation requirements
- Identify authorization rules
- Find data transformation requirements
- Apply rules to OpenAPI spec (validation schemas)
- Apply rules to Prisma schema (constraints)
- Generate middleware/validation code if needed

## Workflow Patterns

### Pattern 1: Existing UI + New Backend

**Developer Provides**:

- Path to existing React component
- Route information
- Optional rules.md for business logic

**MCP Server Executes**:

1. `analyze_existing_ui` - Understand data needs
2. `update_database_schema` - Create Prisma models
3. `enhance_openapi_spec` - Generate API specification
4. Trigger Kubb generation (external process)
5. `generate_react_query_integration` - Create hook integration
6. `validate_integration` - Verify everything works

**Result**: Existing UI now has fully typed, working API integration

### Pattern 2: Full Stack Generation

**Developer Provides**:

- Natural language description: "I need a todo app with tasks that have title, description, status, and due date. Users should be able to filter by status and sort by due date."
- Route: "/todos"
- Optional rules.md with validation rules

**MCP Server Executes**:

1. `generate_from_ui_description` - Parse requirements
2. `update_database_schema` - Create Todo model
3. `enhance_openapi_spec` - Generate CRUD endpoints with filters
4. Generate API implementation stubs
5. Trigger Kubb for React Query hooks
6. Generate complete React component with hooks
7. `validate_integration` - Final check

**Result**: Complete feature from description to working code

### Pattern 3: Iterative Enhancement

**Developer Provides**:

- "Add comments to todos, each comment has text and timestamp"
- Reference to existing todo feature

**MCP Server Executes**:

1. Analyze existing implementation
2. Update Prisma schema with Comment model + relation
3. Update OpenAPI spec with comment endpoints
4. Regenerate hooks via Kubb
5. Provide integration code for UI
6. Validate consistency

**Result**: Feature extended with minimal developer intervention

## Rules.md Format Specification

The MCP server should understand and parse rules.md files in this format:

```markdown
# Entity: Todo

## Validation Rules

- Title: required, min 3 chars, max 100 chars
- Status: enum [pending, in_progress, completed]
- DueDate: optional, must be future date

## Business Logic

- Users can only edit their own todos
- Completed todos cannot be deleted
- Status must progress: pending → in_progress → completed

## Data Relationships

- Todo belongs to User (author)
- Todo has many Comments
- Comments cannot be edited after 5 minutes

## API Requirements

- List endpoint must support filtering by status
- List endpoint must support sorting by dueDate and createdAt
- Pagination: 20 items per page default
```

The MCP server should parse this and apply rules to:

- OpenAPI validation schemas (min/max length, enums)
- Prisma schema (relations, constraints)
- Generated API middleware (authorization checks)
- Frontend validation (form schemas)

## Integration with Development Workflow

### File Watching and Auto-Regeneration

**MCP Resources to Monitor**:

- `/prisma/schema.prisma` - Database schema changes
- `/packages/api-spec/*.yaml` - OpenAPI specification changes
- `/apps/frontend/src/**/*.tsx` - Component changes
- `/rules.md` - Business rules updates

**Auto-Trigger Behavior**:

- When Prisma schema changes → run `prisma generate`
- When OpenAPI changes → run Kubb generation
- Notify developer of type changes
- Suggest affected components that need updates

### MCP Prompts (Conversational Interface)

The MCP server should support natural language prompts like:

**Example 1**: "Add user authentication to the todo app"

- Server analyzes current implementation
- Adds User model to Prisma if missing
- Updates OpenAPI with auth endpoints
- Adds authentication middleware specs
- Generates login/register endpoints
- Creates auth-aware React Query hooks

**Example 2**: "The todo list should support tags"

- Adds Tag model with many-to-many relation
- Updates Todo OpenAPI schema to include tags array
- Generates tag CRUD endpoints
- Regenerates hooks with tag support
- Provides integration code for UI

**Example 3**: "Analyze the dashboard component and generate its backend"

- Scans dashboard component file
- Identifies data widgets (stats, charts, lists)
- Creates aggregate endpoints in OpenAPI
- Adds database queries for analytics
- Generates typed hooks for dashboard data

## Type Safety Flow

The MCP server must ensure end-to-end type safety:

```
Developer Input → Prisma Schema → Database Types
                      ↓
                 OpenAPI Spec → Kubb Generation → React Query Hooks
                                                          ↓
                                                   Frontend Types
```

**Validation Checkpoints**:

1. Prisma schema is valid and generates without errors
2. OpenAPI spec matches Prisma types
3. Kubb successfully generates TypeScript types
4. Generated hooks match OpenAPI responses
5. Frontend components use generated types correctly

## Error Handling and Developer Feedback

### Intelligent Error Messages

When issues occur, the MCP server should provide:

**Example**: "Type mismatch detected"

```
⚠️ The 'todos' endpoint returns { status: number } but your
   Prisma schema defines status as enum TodoStatus.

Suggested fix:
1. Update OpenAPI spec status to use enum
2. Or change Prisma schema to use Int

Would you like me to fix this automatically?
```

### Conflict Resolution

When the MCP server detects conflicts:

- Existing database data vs. schema changes
- OpenAPI changes breaking existing API consumers
- Type changes affecting existing components

Provide clear options and migration paths.

## MCP Server Configuration

### Initialization Settings

```typescript
{
  workspaceRoot: string,           // TurboRepo root
  prismaSchemaPath: string,        // Path to schema.prisma
  openApiSpecPath: string,         // Path to OpenAPI specs
  kubbConfigPath: string,          // Path to kubb.config.ts
  frontendSrcPath: string,         // Frontend source directory
  generatedHooksPath: string,      // Where Kubb outputs hooks
  rulesDirectory: string,          // Location of rules.md files
  autoRegenerate: boolean,         // Auto-run Kubb on changes
  typeCheckOnGenerate: boolean     // Run TypeScript check after gen
}
```

### MCP Server Metadata

```typescript
{
  name: "fullstack-generator-mcp",
  version: "1.0.0",
  description: "Automated frontend-backend integration with OpenAPI and Prisma",
  capabilities: [
    "ui-analysis",
    "schema-generation",
    "openapi-management",
    "type-safe-integration",
    "business-rules-application"
  ]
}
```

## Implementation Priorities

### Phase 1: Core Analysis

1. Implement `analyze_existing_ui` tool
2. Build parser for React/TypeScript components
3. Create data structure extractor
4. Implement rules.md parser

### Phase 2: Generation Engine

1. Implement `update_database_schema` tool
2. Build `enhance_openapi_spec` tool
3. Create Prisma schema manipulation utilities
4. Build OpenAPI spec updater with validation

### Phase 3: Integration Layer

1. Implement `generate_react_query_integration` tool
2. Build Kubb trigger and monitoring
3. Create type consistency validator
4. Implement `validate_integration` tool

### Phase 4: Intelligence Layer

1. Implement `generate_from_ui_description` with NLP
2. Build business rules interpreter
3. Create conflict detection and resolution
4. Add learning from developer feedback

## Success Metrics

The MCP toolkit is successful when:

1. **Speed**: Developer can go from "I need a feature" to working code in under 5 minutes
2. **Accuracy**: Generated code matches requirements 95%+ of the time
3. **Type Safety**: Zero type errors in generated integration code
4. **Developer Experience**: Requires minimal manual intervention
5. **Maintainability**: Generated code is clean, documented, and follows best practices
6. **Consistency**: All generated endpoints follow same patterns and conventions

## Advanced Features (Future Enhancements)

### Smart Suggestions

- Analyze UI patterns and suggest backend optimizations
- Recommend caching strategies based on data access patterns
- Suggest database indexes for performance

### Testing Generation

- Generate API integration tests
- Create React Testing Library tests for hooks
- Generate E2E test scenarios

### Documentation Generation

- Auto-generate API documentation from OpenAPI
- Create usage examples for generated hooks
- Build interactive API playground

### Migration Management

- Generate database migration scripts
- Handle breaking changes gracefully
- Version API specifications

## Security Considerations

The MCP server must:

- Never expose database credentials
- Validate all file paths to prevent directory traversal
- Sanitize user input before code generation
- Warn about potential security issues in rules
- Flag sensitive data in schemas (PII, passwords)
- Suggest authentication/authorization where needed

## Output Format

When tools execute, return structured responses:

```typescript
{
  success: boolean,
  tool: string,
  message: string,
  details: {
    filesCreated: string[],
    filesModified: string[],
    commandsToRun: string[],
    warnings: string[],
    nextSteps: string[]
  },
  artifacts: {
    prismaSchema?: string,
    openApiSpec?: object,
    generatedCode?: { path: string, content: string }[]
  }
}
```

## Final Goal

Create an MCP server that feels like having a senior full-stack developer on your team who:

- Understands your UI needs instantly
- Generates perfect backend integration
- Maintains type safety across the stack
- Follows best practices automatically
- Communicates clearly about what it's doing
- Handles edge cases gracefully

The frontend developer should be able to focus on UI/UX while the MCP toolkit handles all the backend integration complexity automatically.
