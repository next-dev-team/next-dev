# Fullstack Turborepo JavaScript

# MCP

MCP is very useful and important for documentation checks unsure get the right version of and latest documentation.

## WHEN TO USE IT

1. Uncertain or unclear about APIs, props, or TypeScript types
2. Checking version compatibility or mismatches
3. Need up-to-date documentation for any library
4. Compare versions between knowledge and the actual tech stack in package.json

## Context7 MCP usage (strict requirement)

MCP Context7 is available for documentation checks.
Always use Context7 when:
Uncertain or unclear about APIs, props, or TypeScript types
Checking version compatibility or mismatches
Need up-to-date documentation for any library
Compare versions between knowledge and the actual tech stack in package.json
Workflow: Check package.json → Compare versions → If unclear/mismatch → Use Context7 (resolve-library-id → get-library-docs)
eg. Your are using NextJs 16 so don't write code nextJs 14 or bellow 16 for our project as it is not supported yet it will not working or deprecated API. so you can specify the version in package.json as "next": "^16.xx" if your are unsure about the version. Context7 will trigger now.

## TECH STACK

### Tools & Language

- Turborepo: sharing is the key
- Node.js: JavaScript runtime for server-side development
- Package Manager: only pnpm for managing dependencies

### Project Structure

- UI (packages/rnr-ui): React Native reusable - port ShadCn for react native web for universal support Web, Android, iOS
- API (packages/rnr-api): Node.js API server with Express.js
-

## Workflow Steps

- Checking user prompt chat
- if need Mcp let refer to MCP Section
- Start the development server: `pnpm dev`
