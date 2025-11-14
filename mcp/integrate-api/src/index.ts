import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'

const server = new McpServer({ name: 'integrate-api', version: '0.4.0' })

server.registerTool(
  'integrate-api',
  {
    title: 'Integrate API with frontend',
    description: 'Finds generated React Query hooks for an endpoint and produces integration snippets or writes them',
    inputSchema: {
      app: z.string(),
      endpoint: z.string(),
      method: z.enum(['POST', 'PUT', 'DELETE', 'GET']).default('POST'),
      targetFile: z.string().optional(),
      marker: z.string().optional(),
      exportVar: z.string().optional()
    },
    outputSchema: { updatedFiles: z.array(z.string()), snippet: z.string(), importPath: z.string() }
  },
  async ({ app, endpoint, method, targetFile, marker, exportVar }) => {
    const root = process.cwd()
    const appDir = path.join(root, app)
    const updated: string[] = []


    return { content: [] }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)