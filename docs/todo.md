# AI Agent Prompt: Build TurboRepo Backend with OpenAPI Auto-Generation

You are an expert backend architect specializing in TypeScript monorepo setups. Your task is to create a complete TurboRepo backend with automatic OpenAPI specification generation using Kubb and Prisma with SQLite.

## Project Requirements

### Architecture Overview

- **Monorepo Structure**: TurboRepo with clear package separation
- **Database**: Prisma ORM with SQLite for local development
- **API Documentation**: Auto-generated OpenAPI specs using Kubb
- **Backend Framework**: Express.js or Fastify (choose based on performance needs)
- **Type Safety**: Full TypeScript throughout

## Step-by-Step Implementation Guide

### 1. Initialize TurboRepo Structure

Create the following structure:

```
my-project/
├── apps/
│   └── api/              # Main API application
├── packages/
│   ├── database/         # Prisma schema and client
│   ├── api-spec/         # OpenAPI specifications
│   └── shared-types/     # Shared TypeScript types
├── turbo.json
└── package.json
```

### 2. Database Package Setup (packages/database)

**Prisma Schema Design:**

- Create a well-structured schema with:
  - User model (id, email, name, createdAt, updatedAt)
  - Post model (id, title, content, authorId, published, createdAt)
  - Proper relations between models
- Enable SQLite with file-based storage
- Set up Prisma Client generation
- Include seed script for initial data

**Required Scripts:**

- `db:generate` - Generate Prisma Client
- `db:push` - Push schema to database
- `db:seed` - Seed initial data
- `db:studio` - Open Prisma Studio
- `db:reset` - Reset database

### 3. API Application Setup (apps/api)

**Core Components:**

- Express/Fastify server setup with proper middleware
- CORS configuration for frontend integration
- Request validation using Zod schemas
- Error handling middleware with proper error responses
- Route organization by resource (users, posts, etc.)

**API Endpoints to Create:**

**Users:**

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Posts:**

- `GET /api/posts` - List all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/author/:authorId` - Get posts by author

### 4. OpenAPI Spec Generation with Kubb (packages/api-spec)

**Kubb Configuration:**

- Set up kubb.config.ts to:
  - Generate TypeScript types from OpenAPI spec
  - Create React Query hooks (for future frontend integration)
  - Generate Zod schemas for validation
  - Export axios client with typed endpoints

**OpenAPI Specification:**

- Define complete API spec in YAML/JSON
- Include all endpoints with:
  - Path parameters
  - Query parameters
  - Request bodies
  - Response schemas
  - Error responses (400, 404, 500)
- Use proper OpenAPI 3.0+ specification format
- Tag endpoints by resource

**Auto-Generation Pipeline:**

- Watch mode for OpenAPI file changes
- Automatic regeneration of types and clients
- Integration with TurboRepo build pipeline

### 5. Shared Types Package (packages/shared-types)

**Export:**

- Database types from Prisma
- API request/response types
- Common utility types
- Validation schemas (Zod)

### 6. TurboRepo Configuration

**turbo.json Setup:**

- Define build pipeline with proper dependencies
- Cache database generation outputs
- Optimize build order (database → types → api)
- Configure development mode with watch tasks

**Package Dependencies:**

- Database package: standalone, exports Prisma Client
- API-spec package: depends on nothing, generates types
- API app: depends on database and api-spec packages

### 7. Development Workflow Scripts

**Root package.json scripts:**

- `dev` - Start all services in development mode
- `build` - Build all packages
- `db:setup` - Initialize database and seed data
- `generate` - Run all code generation (Prisma + Kubb)
- `type-check` - TypeScript type checking across monorepo

### 8. Integration Requirements

**Environment Variables:**

- DATABASE_URL for SQLite file location
- PORT for API server
- NODE_ENV for environment detection
- CORS_ORIGIN for frontend URL

**Type Safety Guarantees:**

- No `any` types allowed
- Strict TypeScript configuration
- Prisma types flow through to API responses
- OpenAPI spec matches actual implementation

### 9. Documentation to Include

**README files for:**

- Root: Quick start guide and architecture overview
- Database package: Schema explanation and migration guide
- API package: Available endpoints and examples
- API-spec package: How to modify OpenAPI spec

**Code Comments:**

- Explain complex logic
- Document non-obvious design decisions
- Include usage examples in JSDoc

### 10. Quality Checklist

Before considering complete, ensure:

- ✅ All packages build successfully
- ✅ Prisma generates client without errors
- ✅ Kubb generates types from OpenAPI spec
- ✅ API server starts and responds to requests
- ✅ Database seeds with sample data
- ✅ All CRUD operations work for each resource
- ✅ TypeScript compilation has zero errors
- ✅ OpenAPI spec is valid and complete
- ✅ Types are shared properly across packages
- ✅ Development workflow is smooth with hot reload

## Technical Stack Summary

**Core:**

- TurboRepo for monorepo management
- TypeScript 5+ with strict mode
- Node.js 18+ or 20+

**Backend:**

- Express.js or Fastify
- Prisma 5+ with SQLite
- Zod for runtime validation

**Code Generation:**

- Kubb for OpenAPI type generation
- Prisma Client generation
- tsx for TypeScript execution

**Development:**

- Nodemon or tsx watch for hot reload
- Prisma Studio for database inspection
- Proper ESLint and TypeScript configs

## Expected Output

A fully functional backend monorepo where:

1. Running `npm install && npm run db:setup && npm run dev` starts everything
2. API is accessible at `http://localhost:3000` (or configured port)
3. OpenAPI spec is available at `/api/docs` or similar endpoint
4. Types are automatically generated and shared across packages
5. Database operations are type-safe and validated
6. Frontend can consume the generated API client

## Success Criteria

The implementation is complete when a developer can:

- Clone the repo
- Run 3 commands to get started
- Make a Prisma schema change and see types update everywhere
- Modify OpenAPI spec and get new typed endpoints
- Hit all API endpoints with proper request/response typing
- See clear error messages when validation fails

Focus on developer experience, type safety, and maintainability. This should be production-ready boilerplate that can be extended easily.
