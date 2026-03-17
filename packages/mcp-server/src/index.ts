#!/usr/bin/env node

/**
 * DesignForge MCP Server
 *
 * Exposes design operations via Model Context Protocol for AI-driven design.
 * Works with ANY MCP client: Claude Desktop, Claude Code, Cursor, etc.
 *
 * Transport:
 * - stdio (default) — for CLI, Desktop, IDE extensions
 * - SSE (future) — for remote/web clients
 *
 * Tools:
 * - designforge_list_components — returns catalog for AI context
 * - designforge_generate — prompt → new design spec
 * - designforge_read_spec — read current .dfg file
 * - designforge_edit — natural language edit → patches
 * - designforge_export — spec → code files
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { catalogToPrompt, getComponentTypes, catalog } from '@next-dev/catalog';
import { Document, createEmptySpec, type DesignSpec } from '@next-dev/editor-core';
import { z } from 'zod';

// ─── State ──────────────────────────────────────────────────────────────────

let currentDocument: Document | null = null;

function getOrCreateDocument(): Document {
  if (!currentDocument) {
    currentDocument = new Document();
  }
  return currentDocument;
}

// ─── Server ─────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'designforge',
  version: '0.0.1',
});

// ─── Tool: List Components ──────────────────────────────────────────────────

server.tool(
  'designforge_list_components',
  'Returns the complete component catalog with types, props, and descriptions. Use this to understand what components are available before generating or editing a design.',
  {},
  async () => {
    const prompt = catalogToPrompt();
    return {
      content: [
        {
          type: 'text' as const,
          text: prompt,
        },
      ],
    };
  },
);

// ─── Tool: Read Spec ────────────────────────────────────────────────────────

server.tool(
  'designforge_read_spec',
  'Read the current design spec. Returns the full DesignSpec JSON with all elements, their types, props, and tree structure.',
  {},
  async () => {
    const doc = getOrCreateDocument();
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(doc.spec, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: Generate ─────────────────────────────────────────────────────────

server.tool(
  'designforge_generate',
  'Generate a new design from a JSON spec. Provide a complete DesignSpec object with elements. Use designforge_list_components first to see available component types and their props.',
  {
    spec: z.string().describe(
      'A JSON string representing the DesignSpec to load. Must have version, root, elements, and state fields.'
    ),
  },
  async ({ spec }) => {
    try {
      const parsedSpec = JSON.parse(spec) as DesignSpec;

      // Validate structure
      if (!parsedSpec.version || !parsedSpec.root || !parsedSpec.elements) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Invalid spec structure. Must have version, root, elements, and state fields.',
            },
          ],
          isError: true,
        };
      }

      // Validate component types against catalog
      const validTypes = new Set(getComponentTypes());
      const unknownTypes: string[] = [];
      for (const element of Object.values(parsedSpec.elements)) {
        // Stack is a built-in layout type
        if (!validTypes.has(element.type as never) && element.type !== 'Stack') {
          unknownTypes.push(element.type);
        }
      }

      if (unknownTypes.length > 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Warning: Unknown component types: ${unknownTypes.join(', ')}. These will render as empty placeholders. Valid types: ${[...validTypes].join(', ')}`,
            },
          ],
        };
      }

      // Load the spec
      currentDocument = new Document({ spec: parsedSpec });

      return {
        content: [
          {
            type: 'text' as const,
            text: `Design generated successfully with ${Object.keys(parsedSpec.elements).length} elements.\n\n${JSON.stringify(parsedSpec, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error parsing spec: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─── Tool: Add Element ──────────────────────────────────────────────────────

server.tool(
  'designforge_add_element',
  'Add a new element to the current design. Specify the parent element ID, component type, and props.',
  {
    parentId: z.string().describe('ID of the parent element to add the new element to. Use "_root" to add to the root element.'),
    type: z.string().describe('Component type from the catalog (e.g., "Button", "Card", "Text")'),
    props: z.string().describe('JSON string of props to set on the element'),
    index: z.number().optional().describe('Optional index position within the parent children'),
  },
  async ({ parentId, type, props, index }) => {
    try {
      const doc = getOrCreateDocument();
      const resolvedParentId = parentId === '_root' ? doc.rootId : parentId;
      const parsedProps = JSON.parse(props);

      doc.add(resolvedParentId, { type, props: parsedProps }, index);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Added ${type} element to parent ${resolvedParentId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─── Tool: Update Props ─────────────────────────────────────────────────────

server.tool(
  'designforge_update_props',
  'Update props on an existing element in the design.',
  {
    elementId: z.string().describe('ID of the element to update'),
    props: z.string().describe('JSON string of props to merge into the element'),
  },
  async ({ elementId, props }) => {
    try {
      const doc = getOrCreateDocument();
      const parsedProps = JSON.parse(props);

      doc.setProps(elementId, parsedProps);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Updated props on element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─── Tool: Remove Element ───────────────────────────────────────────────────

server.tool(
  'designforge_remove_element',
  'Remove an element and all its descendants from the design.',
  {
    elementId: z.string().describe('ID of the element to remove'),
  },
  async ({ elementId }) => {
    try {
      const doc = getOrCreateDocument();
      doc.remove(elementId);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Removed element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─── Tool: Export ───────────────────────────────────────────────────────────

server.tool(
  'designforge_export',
  'Export the current design as a .dfg JSON file content. This includes the full spec and editor state.',
  {},
  async () => {
    const doc = getOrCreateDocument();
    const file = doc.toFile();

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(file, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: Undo ─────────────────────────────────────────────────────────────

server.tool(
  'designforge_undo',
  'Undo the last design operation.',
  {},
  async () => {
    const doc = getOrCreateDocument();
    const success = doc.undo();

    return {
      content: [
        {
          type: 'text' as const,
          text: success
            ? `Undone. Current spec:\n${JSON.stringify(doc.spec, null, 2)}`
            : 'Nothing to undo.',
        },
      ],
    };
  },
);

// ─── Tool: Redo ─────────────────────────────────────────────────────────────

server.tool(
  'designforge_redo',
  'Redo the last undone design operation.',
  {},
  async () => {
    const doc = getOrCreateDocument();
    const success = doc.redo();

    return {
      content: [
        {
          type: 'text' as const,
          text: success
            ? `Redone. Current spec:\n${JSON.stringify(doc.spec, null, 2)}`
            : 'Nothing to redo.',
        },
      ],
    };
  },
);

// ─── Start ──────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DesignForge MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
