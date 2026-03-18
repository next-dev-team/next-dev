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
 * - designforge_export — spec → .dfg payload
 * - designforge_export_code — spec → standalone React project files
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { catalogToPrompt, generateReactViteProject, getComponentTypes } from '@next-dev/catalog';
import { Document, type DesignSpec } from '@next-dev/editor-core';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { mkdir, readFile as readFileAsync, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { z } from 'zod';

// ─── CLI Flags ──────────────────────────────────────────────────────────────
//
// --file <path>   Persist every change to a .dfg file in real time.
//                 The desktop app watches this file for live preview.
//                 Example: npx tsx src/index.ts --file ./live.dfg
// --channel <id> Join a live desktop channel for live context and mutations.
// --channel-dir  Override the directory used for channel context files.

const fileArgIdx = process.argv.indexOf('--file');
const syncFilePath = fileArgIdx !== -1 && process.argv[fileArgIdx + 1]
  ? resolve(process.argv[fileArgIdx + 1])
  : null;
const channelArgIdx = process.argv.indexOf('--channel');
let activeChannelId = channelArgIdx !== -1 && process.argv[channelArgIdx + 1]
  ? process.argv[channelArgIdx + 1]
  : null;
const channelDirArgIdx = process.argv.indexOf('--channel-dir');
const channelRootDir = channelDirArgIdx !== -1 && process.argv[channelDirArgIdx + 1]
  ? resolve(process.argv[channelDirArgIdx + 1])
  : process.env.DESIGNFORGE_CHANNEL_DIR
    ? resolve(process.env.DESIGNFORGE_CHANNEL_DIR)
    : resolve(tmpdir(), 'designforge-mcp', 'channels');

if (syncFilePath) {
  console.error(`[MCP] File sync enabled: ${syncFilePath}`);
}

if (activeChannelId) {
  console.error(`[MCP] Channel mode enabled: ${activeChannelId}`);
}

// ─── State ──────────────────────────────────────────────────────────────────

let currentDocument: Document | null = null;

interface LiveChannelContext {
  channelId: string;
  updatedAt: string;
  filePath: string | null;
  spec: DesignSpec;
  selectedIds: string[];
  hoveredId: string | null;
  zoom: number;
  pan: [number, number];
}

interface LiveContextSnapshot {
  source: 'channel' | 'document';
  liveAvailable: boolean;
  joinedChannelId: string | null;
  updatedAt: string | null;
  filePath: string | null;
  spec: DesignSpec;
  selectedIds: string[];
  hoveredId: string | null;
  zoom: number;
  pan: [number, number];
}

interface LiveMutationOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps' | 'duplicate' | 'group' | 'ungroup';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  index?: number;
  elementId?: string;
  newParentId?: string;
  elementIds?: string[];
}

type LiveMutation =
  | { kind: 'applyOperations'; operations: LiveMutationOperation[] }
  | { kind: 'replaceSpec'; spec: DesignSpec; filePath?: string | null }
  | { kind: 'undo' }
  | { kind: 'redo' }
  | { kind: 'setSelection'; selectedIds: string[] };

interface LiveMutationRequest {
  requestId: string;
  channelId: string;
  mutation: LiveMutation;
}

interface ParentRpcRequest {
  kind: 'request';
  id: number;
  method: 'apply_live_mutation';
  params: LiveMutationRequest;
}

interface ParentRpcResponse {
  kind: 'response';
  id: number;
  result?: unknown;
  error?: string;
}

const pendingParentRpc = new Map<number, {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}>();
let nextParentRpcId = 1;
let nextLiveMutationRequestId = 1;
const LIVE_MUTATION_TIMEOUT_MS = 30000;

function getChannelFilePath(channelId: string): string {
  return resolve(channelRootDir, `${encodeURIComponent(channelId)}.json`);
}

function getChannelRequestsDir(channelId: string): string {
  return resolve(channelRootDir, 'requests', encodeURIComponent(channelId));
}

function getChannelResponsesDir(channelId: string): string {
  return resolve(channelRootDir, 'responses', encodeURIComponent(channelId));
}

function getMutationRequestPath(channelId: string, requestId: string): string {
  return resolve(getChannelRequestsDir(channelId), `${encodeURIComponent(requestId)}.json`);
}

function getMutationResponsePath(channelId: string, requestId: string): string {
  return resolve(getChannelResponsesDir(channelId), `${encodeURIComponent(requestId)}.json`);
}

function readJoinedChannelContext(): LiveChannelContext | null {
  if (!activeChannelId) return null;

  const channelFilePath = getChannelFilePath(activeChannelId);
  if (!existsSync(channelFilePath)) return null;

  try {
    const content = readFileSync(channelFilePath, 'utf-8');
    return JSON.parse(content) as LiveChannelContext;
  } catch (err) {
    console.error('[MCP] Failed to read channel context:', err);
    return null;
  }
}

function hasParentRpc(): boolean {
  return typeof process.send === 'function';
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createLiveMutationRequestId(): string {
  return `live-${process.pid}-${Date.now()}-${nextLiveMutationRequestId++}`;
}

function normalizeLiveMutationContext(context: unknown): LiveContextSnapshot | null {
  if (typeof context !== 'object' || context === null) return null;

  const snapshot = context as Partial<LiveContextSnapshot & LiveChannelContext>;
  if (typeof snapshot.spec !== 'object' || snapshot.spec === null) return null;

  const selectedIds = Array.isArray(snapshot.selectedIds)
    ? snapshot.selectedIds.filter((id): id is string => typeof id === 'string')
    : [];
  const hoveredId = typeof snapshot.hoveredId === 'string' ? snapshot.hoveredId : null;
  const zoom = typeof snapshot.zoom === 'number' ? snapshot.zoom : 1;
  const pan: [number, number] = Array.isArray(snapshot.pan)
    && snapshot.pan.length >= 2
    && typeof snapshot.pan[0] === 'number'
    && typeof snapshot.pan[1] === 'number'
    ? [snapshot.pan[0], snapshot.pan[1]]
    : [0, 0];

  return {
    source: 'channel',
    liveAvailable: true,
    joinedChannelId: activeChannelId,
    updatedAt: typeof snapshot.updatedAt === 'string' ? snapshot.updatedAt : new Date().toISOString(),
    filePath: typeof snapshot.filePath === 'string' ? snapshot.filePath : null,
    spec: cloneSpec(snapshot.spec as DesignSpec),
    selectedIds,
    hoveredId,
    zoom,
    pan,
  };
}

async function persistJoinedChannelContext(liveContext: LiveContextSnapshot): Promise<void> {
  if (!liveContext.joinedChannelId) return;

  const payload: LiveChannelContext = {
    channelId: liveContext.joinedChannelId,
    updatedAt: liveContext.updatedAt ?? new Date().toISOString(),
    filePath: liveContext.filePath,
    spec: cloneSpec(liveContext.spec),
    selectedIds: [...liveContext.selectedIds],
    hoveredId: liveContext.hoveredId,
    zoom: liveContext.zoom,
    pan: [...liveContext.pan] as [number, number],
  };

  await mkdir(channelRootDir, { recursive: true });
  await writeFile(
    getChannelFilePath(liveContext.joinedChannelId),
    JSON.stringify(payload, null, 2),
    'utf-8',
  );
}

function handleParentRpcResponse(message: unknown): void {
  if (typeof message !== 'object' || message === null) return;
  const response = message as Partial<ParentRpcResponse>;
  if (response.kind !== 'response' || typeof response.id !== 'number') return;

  const pending = pendingParentRpc.get(response.id);
  if (!pending) return;

  pendingParentRpc.delete(response.id);
  clearTimeout(pending.timer);

  if (typeof response.error === 'string' && response.error.length > 0) {
    pending.reject(new Error(response.error));
    return;
  }

  pending.resolve(response.result);
}

if (hasParentRpc()) {
  process.on('message', handleParentRpcResponse);
}

function callParentRpc(
  method: ParentRpcRequest['method'],
  params: LiveMutationRequest,
): Promise<unknown> {
  if (!hasParentRpc()) {
    return Promise.reject(new Error('Parent RPC is not available in this MCP session.'));
  }

  return new Promise((resolve, reject) => {
    const id = nextParentRpcId++;
    const timer = setTimeout(() => {
      pendingParentRpc.delete(id);
      reject(new Error(`Parent RPC '${method}' timed out (30s)`));
    }, 30000);

    pendingParentRpc.set(id, { resolve, reject, timer });
    process.send?.({
      kind: 'request',
      id,
      method,
      params,
    } satisfies ParentRpcRequest);
  });
}

async function callFileMutationBridge(
  params: LiveMutationRequest,
): Promise<unknown> {
  const requestsDir = getChannelRequestsDir(params.channelId);
  const responsesDir = getChannelResponsesDir(params.channelId);
  const requestPath = getMutationRequestPath(params.channelId, params.requestId);
  const responsePath = getMutationResponsePath(params.channelId, params.requestId);

  await mkdir(requestsDir, { recursive: true });
  await mkdir(responsesDir, { recursive: true });
  await unlink(responsePath).catch(() => {});
  await writeFile(requestPath, JSON.stringify(params, null, 2), 'utf-8');

  const deadline = Date.now() + LIVE_MUTATION_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (!existsSync(responsePath)) {
      await wait(100);
      continue;
    }

    try {
      const content = await readFileAsync(responsePath, 'utf-8');
      if (!content.trim()) {
        await wait(50);
        continue;
      }

      const response = JSON.parse(content) as unknown;
      await unlink(responsePath).catch(() => {});
      return response;
    } catch {
      await wait(50);
    }
  }

  await unlink(requestPath).catch(() => {});
  await unlink(responsePath).catch(() => {});
  throw new Error(`External live mutation timed out (${LIVE_MUTATION_TIMEOUT_MS / 1000}s)`);
}

/** Persist the current document to the sync file (if configured). */
function syncToFile(): void {
  if (!syncFilePath || !currentDocument) return;
  try {
    const json = currentDocument.toJSON();
    writeFileSync(syncFilePath, json, 'utf-8');
  } catch (err) {
    console.error('[MCP] File sync write error:', err);
  }
}

function getOrCreateDocument(): Document {
  if (!currentDocument) {
    // Try loading from sync file if it exists
    if (syncFilePath && existsSync(syncFilePath)) {
      try {
        const content = readFileSync(syncFilePath, 'utf-8');
        currentDocument = Document.fromJSON(content);
        console.error(`[MCP] Loaded existing design from ${syncFilePath}`);
        return currentDocument;
      } catch {
        console.error('[MCP] Could not parse sync file, starting fresh');
      }
    }
    currentDocument = new Document();
  }
  return currentDocument;
}

function getLiveContext(): LiveContextSnapshot {
  const channelContext = readJoinedChannelContext();
  if (channelContext) {
    return {
      source: 'channel',
      liveAvailable: true,
      joinedChannelId: activeChannelId,
      updatedAt: channelContext.updatedAt,
      filePath: channelContext.filePath,
      spec: channelContext.spec,
      selectedIds: channelContext.selectedIds,
      hoveredId: channelContext.hoveredId,
      zoom: channelContext.zoom,
      pan: channelContext.pan,
    };
  }

  const doc = getOrCreateDocument();
  return {
    source: 'document',
    liveAvailable: false,
    joinedChannelId: activeChannelId,
    updatedAt: null,
    filePath: syncFilePath,
    spec: doc.spec,
    selectedIds: doc.selection.selectedIds,
    hoveredId: null,
    zoom: 1,
    pan: [0, 0],
  };
}

async function applyLiveMutation(
  mutation: LiveMutation,
): Promise<LiveContextSnapshot | null> {
  if (!activeChannelId) return null;

  const joinedChannelContext = readJoinedChannelContext();
  if (!hasParentRpc() && !joinedChannelContext) return null;

  const request: LiveMutationRequest = {
    requestId: createLiveMutationRequestId(),
    channelId: activeChannelId,
    mutation,
  };

  const response = await (hasParentRpc()
    ? callParentRpc('apply_live_mutation', request)
    : callFileMutationBridge(request)) as {
    success?: boolean;
    error?: string;
    context?: unknown;
  };

  if (!response?.success) {
    throw new Error(response?.error ?? 'The live desktop mutation failed.');
  }

  const liveContext = normalizeLiveMutationContext(response.context)
    ?? (joinedChannelContext
      ? {
          source: 'channel',
          liveAvailable: true,
          joinedChannelId: activeChannelId,
          updatedAt: joinedChannelContext.updatedAt,
          filePath: joinedChannelContext.filePath,
          spec: cloneSpec(joinedChannelContext.spec),
          selectedIds: [...joinedChannelContext.selectedIds],
          hoveredId: joinedChannelContext.hoveredId,
          zoom: joinedChannelContext.zoom,
          pan: [...joinedChannelContext.pan] as [number, number],
        }
      : null);

  if (liveContext) {
    await persistJoinedChannelContext(liveContext);
  }

  return liveContext;
}

function specResult(text: string) {
  return {
    content: [
      {
        type: 'text' as const,
        text,
      },
    ],
  };
}

function errorResult(message: string) {
  return {
    content: [
      {
        type: 'text' as const,
        text: message,
      },
    ],
    isError: true,
  };
}

function cloneSpec(spec: DesignSpec): DesignSpec {
  return JSON.parse(JSON.stringify(spec)) as DesignSpec;
}

function resolveNodeId(spec: DesignSpec, nodeId: string): string {
  return nodeId === '_root' ? spec.root : nodeId;
}

function normalizeOperationForSpec(
  spec: DesignSpec,
  operation: LiveMutationOperation,
): LiveMutationOperation {
  return {
    ...operation,
    parentId: operation.parentId ? resolveNodeId(spec, operation.parentId) : operation.parentId,
    elementId: operation.elementId ? resolveNodeId(spec, operation.elementId) : operation.elementId,
    newParentId: operation.newParentId ? resolveNodeId(spec, operation.newParentId) : operation.newParentId,
    elementIds: operation.elementIds?.map((id) => resolveNodeId(spec, id)),
  };
}

function findParentId(spec: DesignSpec, nodeId: string): string | null {
  const resolvedNodeId = resolveNodeId(spec, nodeId);
  for (const [candidateId, candidate] of Object.entries(spec.elements)) {
    if (candidate.children.includes(resolvedNodeId)) {
      return candidateId;
    }
  }
  return null;
}

function buildNodeSnapshot(
  liveContext: LiveContextSnapshot,
  nodeId: string,
) {
  const resolvedNodeId = resolveNodeId(liveContext.spec, nodeId);
  const element = liveContext.spec.elements[resolvedNodeId];
  if (!element) {
    throw new Error(`Element not found: ${resolvedNodeId}`);
  }

  const parentId = findParentId(liveContext.spec, resolvedNodeId);
  const index = parentId
    ? liveContext.spec.elements[parentId]?.children.indexOf(resolvedNodeId) ?? -1
    : 0;

  return {
    source: liveContext.source,
    liveAvailable: liveContext.liveAvailable,
    joinedChannelId: liveContext.joinedChannelId,
    updatedAt: liveContext.updatedAt,
    filePath: liveContext.filePath,
    nodeId,
    resolvedNodeId,
    parentId,
    index,
    isRoot: resolvedNodeId === liveContext.spec.root,
    isSelected: liveContext.selectedIds.includes(resolvedNodeId),
    isHovered: liveContext.hoveredId === resolvedNodeId,
    childCount: element.children.length,
    children: element.children,
    element,
  };
}

function collectChildren(
  spec: DesignSpec,
  nodeId: string,
  maxDepth = 1,
) {
  const resolvedNodeId = resolveNodeId(spec, nodeId);
  const root = spec.elements[resolvedNodeId];
  if (!root) {
    throw new Error(`Element not found: ${resolvedNodeId}`);
  }

  const results: Array<{
    id: string;
    parentId: string;
    depth: number;
    childCount: number;
    element: DesignSpec['elements'][string];
  }> = [];

  const visit = (parentId: string, depth: number) => {
    const parent = spec.elements[parentId];
    if (!parent) return;

    for (const childId of parent.children) {
      const child = spec.elements[childId];
      if (!child) continue;

      results.push({
        id: childId,
        parentId,
        depth,
        childCount: child.children.length,
        element: child,
      });

      if (depth < maxDepth) {
        visit(childId, depth + 1);
      }
    }
  };

  if (maxDepth > 0) {
    visit(resolvedNodeId, 1);
  }

  return results;
}

function applyOperationToDocument(
  document: Document,
  operation: LiveMutationOperation,
): void {
  const normalizedOperation = normalizeOperationForSpec(document.spec, operation);

  switch (normalizedOperation.type) {
    case 'add': {
      const parentId = normalizedOperation.parentId ?? document.rootId;
      const elementType = normalizedOperation.elementType ?? 'Text';
      document.add(parentId, { type: elementType, props: normalizedOperation.props ?? {} }, normalizedOperation.index);
      return;
    }
    case 'remove':
      if (!normalizedOperation.elementId) throw new Error('remove requires elementId');
      document.remove(normalizedOperation.elementId);
      return;
    case 'move':
      if (!normalizedOperation.elementId || !normalizedOperation.newParentId) {
        throw new Error('move requires elementId and newParentId');
      }
      document.move(
        normalizedOperation.elementId,
        normalizedOperation.newParentId,
        normalizedOperation.index ?? 0,
      );
      return;
    case 'updateProps':
      if (!normalizedOperation.elementId || !normalizedOperation.props) {
        throw new Error('updateProps requires elementId and props');
      }
      document.setProps(normalizedOperation.elementId, normalizedOperation.props);
      return;
    case 'duplicate':
      if (!normalizedOperation.elementId) throw new Error('duplicate requires elementId');
      document.duplicate(normalizedOperation.elementId);
      return;
    case 'group':
      if (!normalizedOperation.elementIds || normalizedOperation.elementIds.length < 2) {
        throw new Error('group requires at least two elementIds');
      }
      document.group(normalizedOperation.elementIds);
      return;
    case 'ungroup':
      if (!normalizedOperation.elementId) throw new Error('ungroup requires elementId');
      document.ungroup(normalizedOperation.elementId);
      return;
  }
}

function applyOperationsToDocument(
  document: Document,
  operations: LiveMutationOperation[],
): void {
  for (const operation of operations) {
    applyOperationToDocument(document, operation);
  }
}

const liveMutationOperationSchema = z.object({
  type: z.enum(['add', 'remove', 'move', 'updateProps', 'duplicate', 'group', 'ungroup']),
  parentId: z.string().optional(),
  elementType: z.string().optional(),
  props: z.record(z.string(), z.unknown()).optional(),
  index: z.number().optional(),
  elementId: z.string().optional(),
  newParentId: z.string().optional(),
  elementIds: z.array(z.string()).optional(),
});

const batchPropsUpdateSchema = z.object({
  elementId: z.string(),
  props: z.record(z.string(), z.unknown()),
});

// ─── Server ─────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'designforge',
  version: '0.0.1',
});

// ─── Resources ──────────────────────────────────────────────────────────
//
// Resources let agents read project state without calling tools.
// IDEs like Cursor, Claude Desktop, and VS Code can subscribe to these.

server.resource(
  'design-spec',
  'designforge://spec',
  {
    description: 'The current DesignForge design spec (live). Contains all elements, tree structure, and props.',
    mimeType: 'application/json',
  },
  async () => {
    const liveContext = getLiveContext();
    return {
      contents: [
        {
          uri: 'designforge://spec',
          mimeType: 'application/json',
          text: JSON.stringify(liveContext.spec, null, 2),
        },
      ],
    };
  },
);

server.resource(
  'component-catalog',
  'designforge://catalog',
  {
    description: 'The full component catalog with types, props, and descriptions. Use this to know what you can build.',
    mimeType: 'text/plain',
  },
  async () => {
    return {
      contents: [
        {
          uri: 'designforge://catalog',
          mimeType: 'text/plain',
          text: catalogToPrompt(),
        },
      ],
    };
  },
);

server.resource(
  'component-types',
  'designforge://component-types',
  {
    description: 'List of all available component type names.',
    mimeType: 'application/json',
  },
  async () => {
    return {
      contents: [
        {
          uri: 'designforge://component-types',
          mimeType: 'application/json',
          text: JSON.stringify(getComponentTypes(), null, 2),
        },
      ],
    };
  },
);

// ─── Prompts ────────────────────────────────────────────────────────────
//
// Pre-built design workflows that agents can invoke.
// These give the LLM structured context + instructions for common tasks.

server.prompt(
  'create-screen',
  'Generate a complete screen/page design from a description',
  {
    description: z.string().describe('What screen to create (e.g., "login page", "settings dashboard", "profile page")'),
  },
  async ({ description }) => {
    const componentTypes = getComponentTypes();
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a complete DesignForge screen for: "${description}"

Available components: ${componentTypes.join(', ')}

Steps:
1. First call designforge_list_components to see the full prop definitions
2. Then call designforge_generate with a complete DesignSpec JSON containing all the elements needed
3. The spec must have: version (1), root (ID of root Stack), elements (object mapping IDs to elements), state ({})
4. Use meaningful element IDs (e.g., "login-card", "email-input")
5. The root element should be a Stack with direction: "column"

Make the design realistic and complete with proper props, labels, and hierarchy.`,
          },
        },
      ],
    };
  },
);

server.prompt(
  'edit-design',
  'Make changes to the current design based on natural language instructions',
  {
    instruction: z.string().describe('What to change (e.g., "make the button red", "add a footer", "remove the header")'),
  },
  async ({ instruction }) => {
    const liveContext = getLiveContext();
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Edit the current DesignForge design: "${instruction}"

Current design spec:
${JSON.stringify(liveContext.spec, null, 2)}

Use the appropriate tools:
- designforge_add_element to add new elements
- designforge_update_props to change existing element props
- designforge_remove_element to delete elements
- designforge_move_element to reorder or reparent elements
- designforge_duplicate_element to copy elements

Make only the changes requested. Preserve everything else.`,
          },
        },
      ],
    };
  },
);

server.prompt(
  'review-design',
  'Review the current design and suggest improvements',
  {},
  async () => {
    const liveContext = getLiveContext();
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review this DesignForge design and suggest improvements:

${JSON.stringify(liveContext.spec, null, 2)}

Consider:
- Component hierarchy and structure
- Missing UI elements (labels, spacing, accessibility)
- Props that could be improved
- Layout and visual balance

List your suggestions, then ask if I'd like you to apply any of them.`,
          },
        },
      ],
    };
  },
);

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
  'designforge_join_channel',
  'Join a live desktop channel so you can inspect and edit the active design and selection. Use the context, node inspection, selection, and mutation tools after joining.',
  {
    channelId: z.string().describe('The desktop channel ID to join (for example, "designforge-desktop-main")'),
  },
  async ({ channelId }) => {
    activeChannelId = channelId;
    const channelFilePath = getChannelFilePath(channelId);
    const channelContext = readJoinedChannelContext();

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            joinedChannelId: activeChannelId,
            channelFilePath,
            liveAvailable: !!channelContext,
            updatedAt: channelContext?.updatedAt ?? null,
            filePath: channelContext?.filePath ?? null,
          }, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'designforge_get_context',
  'Read the current live design context for the joined desktop channel. Falls back to the MCP server session document when no live channel context is available.',
  {},
  async () => {
    const liveContext = getLiveContext();
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(liveContext, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'designforge_get_selection',
  'Read the current selection for the joined desktop channel. Returns selected IDs plus the selected element snapshots. Falls back to the MCP server session document when no live channel context is available.',
  {},
  async () => {
    const liveContext = getLiveContext();
    const selectedElements = liveContext.selectedIds.map((id) => ({
      id,
      element: liveContext.spec.elements[id] ?? null,
    }));
    const hoveredElement = liveContext.hoveredId
      ? {
          id: liveContext.hoveredId,
          element: liveContext.spec.elements[liveContext.hoveredId] ?? null,
        }
      : null;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            source: liveContext.source,
            liveAvailable: liveContext.liveAvailable,
            joinedChannelId: liveContext.joinedChannelId,
            updatedAt: liveContext.updatedAt,
            filePath: liveContext.filePath,
            selectedIds: liveContext.selectedIds,
            selectedElements,
            hoveredId: liveContext.hoveredId,
            hoveredElement,
          }, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'designforge_select_nodes',
  'Set the current selection for the joined desktop channel. Falls back to the MCP server session document when no live channel context is available.',
  {
    nodeIds: z.array(z.string()).describe('The element IDs that should become the current selection'),
  },
  async ({ nodeIds }) => {
    const liveContext = await applyLiveMutation({
      kind: 'setSelection',
      selectedIds: nodeIds,
    });
    if (liveContext) {
      return specResult(JSON.stringify({
        source: liveContext.source,
        liveAvailable: liveContext.liveAvailable,
        joinedChannelId: liveContext.joinedChannelId,
        selectedIds: liveContext.selectedIds,
        hoveredId: liveContext.hoveredId,
      }, null, 2));
    }

    const doc = getOrCreateDocument();
    const selectedIds = nodeIds.filter((id) => doc.hasElement(id));
    doc.selection.selectAll(selectedIds);

    return specResult(JSON.stringify({
      source: 'document',
      liveAvailable: false,
      joinedChannelId: activeChannelId,
      selectedIds: doc.selection.selectedIds,
      hoveredId: doc.selection.hoveredId,
    }, null, 2));
  },
);

server.tool(
  'designforge_get_node',
  'Inspect a single node in the current design by ID. Supports "_root" as an alias for the root element.',
  {
    nodeId: z.string().describe('Element ID to inspect. Use "_root" to inspect the root element.'),
  },
  async ({ nodeId }) => {
    try {
      const liveContext = getLiveContext();
      return specResult(JSON.stringify(buildNodeSnapshot(liveContext, nodeId), null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_get_parent',
  'Inspect the parent of a node in the current design. Returns null when the requested node is the root element.',
  {
    nodeId: z.string().describe('Element ID whose parent should be returned. Use "_root" for the root element.'),
  },
  async ({ nodeId }) => {
    try {
      const liveContext = getLiveContext();
      const node = buildNodeSnapshot(liveContext, nodeId);

      if (!node.parentId) {
        return specResult(JSON.stringify({
          source: liveContext.source,
          liveAvailable: liveContext.liveAvailable,
          joinedChannelId: liveContext.joinedChannelId,
          updatedAt: liveContext.updatedAt,
          filePath: liveContext.filePath,
          nodeId: node.nodeId,
          resolvedNodeId: node.resolvedNodeId,
          parentId: null,
          childIndex: null,
          parent: null,
        }, null, 2));
      }

      return specResult(JSON.stringify({
        source: liveContext.source,
        liveAvailable: liveContext.liveAvailable,
        joinedChannelId: liveContext.joinedChannelId,
        updatedAt: liveContext.updatedAt,
        filePath: liveContext.filePath,
        nodeId: node.nodeId,
        resolvedNodeId: node.resolvedNodeId,
        parentId: node.parentId,
        childIndex: node.index,
        parent: buildNodeSnapshot(liveContext, node.parentId),
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_get_children',
  'Inspect the children or descendants of a node in the current design. Supports "_root" as an alias for the root element.',
  {
    nodeId: z.string().describe('Element ID whose children should be returned. Use "_root" for the root element.'),
    maxDepth: z.number().int().min(0).optional().describe(
      'How many descendant levels to include. 1 returns direct children, 2 includes grandchildren, and 0 returns no descendants.',
    ),
  },
  async ({ nodeId, maxDepth }) => {
    try {
      const liveContext = getLiveContext();
      const node = buildNodeSnapshot(liveContext, nodeId);
      const depth = maxDepth ?? 1;

      return specResult(JSON.stringify({
        source: liveContext.source,
        liveAvailable: liveContext.liveAvailable,
        joinedChannelId: liveContext.joinedChannelId,
        updatedAt: liveContext.updatedAt,
        filePath: liveContext.filePath,
        nodeId: node.nodeId,
        resolvedNodeId: node.resolvedNodeId,
        childCount: node.childCount,
        maxDepth: depth,
        children: collectChildren(liveContext.spec, nodeId, depth),
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_group_elements',
  'Group multiple sibling elements into a Stack. When elementIds are omitted, the current selection is used.',
  {
    elementIds: z.array(z.string()).optional().describe(
      'Optional element IDs to group. If omitted, the current selection is grouped.',
    ),
  },
  async ({ elementIds }) => {
    try {
      const liveContext = getLiveContext();
      const targetElementIds = (elementIds ?? liveContext.selectedIds).map((id) => resolveNodeId(liveContext.spec, id));
      if (targetElementIds.length < 2) {
        return errorResult('Error: grouping requires at least two element IDs or a multi-node selection.');
      }

      const nextLiveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'group',
            elementIds: targetElementIds,
          },
        ],
      });
      if (nextLiveContext) {
        return specResult(JSON.stringify({
          source: nextLiveContext.source,
          liveAvailable: nextLiveContext.liveAvailable,
          joinedChannelId: nextLiveContext.joinedChannelId,
          groupedElementIds: targetElementIds,
          spec: nextLiveContext.spec,
        }, null, 2));
      }

      const doc = getOrCreateDocument();
      doc.group(targetElementIds);
      syncToFile();

      return specResult(JSON.stringify({
        source: 'document',
        liveAvailable: false,
        joinedChannelId: activeChannelId,
        groupedElementIds: targetElementIds,
        spec: doc.spec,
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_ungroup_element',
  'Ungroup a Stack element, promoting its children to the parent. When elementId is omitted, a single selected node is used.',
  {
    elementId: z.string().optional().describe(
      'Optional group element ID to ungroup. If omitted, the current selection must contain exactly one element.',
    ),
  },
  async ({ elementId }) => {
    try {
      const liveContext = getLiveContext();
      const targetElementId = elementId
        ? resolveNodeId(liveContext.spec, elementId)
        : liveContext.selectedIds.length === 1
          ? resolveNodeId(liveContext.spec, liveContext.selectedIds[0]!)
          : null;

      if (!targetElementId) {
        return errorResult('Error: ungrouping requires an elementId or exactly one selected node.');
      }

      const nextLiveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'ungroup',
            elementId: targetElementId,
          },
        ],
      });
      if (nextLiveContext) {
        return specResult(JSON.stringify({
          source: nextLiveContext.source,
          liveAvailable: nextLiveContext.liveAvailable,
          joinedChannelId: nextLiveContext.joinedChannelId,
          ungroupedElementId: targetElementId,
          spec: nextLiveContext.spec,
        }, null, 2));
      }

      const doc = getOrCreateDocument();
      doc.ungroup(targetElementId);
      syncToFile();

      return specResult(JSON.stringify({
        source: 'document',
        liveAvailable: false,
        joinedChannelId: activeChannelId,
        ungroupedElementId: targetElementId,
        spec: doc.spec,
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_set_props_batch',
  'Update props on multiple elements in order. Each update merges its props into the target element.',
  {
    updates: z.array(batchPropsUpdateSchema).min(1).describe('A list of element prop updates to apply in order.'),
  },
  async ({ updates }) => {
    try {
      const operations: LiveMutationOperation[] = updates.map((update) => ({
        type: 'updateProps',
        elementId: update.elementId,
        props: update.props,
      }));

      const nextLiveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations,
      });
      if (nextLiveContext) {
        return specResult(JSON.stringify({
          source: nextLiveContext.source,
          liveAvailable: nextLiveContext.liveAvailable,
          joinedChannelId: nextLiveContext.joinedChannelId,
          updatedElementIds: updates.map((update) => update.elementId),
          spec: nextLiveContext.spec,
        }, null, 2));
      }

      const doc = getOrCreateDocument();
      applyOperationsToDocument(doc, operations);
      syncToFile();

      return specResult(JSON.stringify({
        source: 'document',
        liveAvailable: false,
        joinedChannelId: activeChannelId,
        updatedElementIds: updates.map((update) => update.elementId),
        spec: doc.spec,
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_apply_operations',
  'Apply multiple design operations in order. Supports add, remove, move, updateProps, duplicate, group, and ungroup. Add operations generate new IDs that are only available in the returned spec.',
  {
    operations: z.array(liveMutationOperationSchema).min(1).describe(
      'The ordered list of operations to apply to the current design.',
    ),
  },
  async ({ operations }) => {
    try {
      const nextLiveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations,
      });
      if (nextLiveContext) {
        return specResult(JSON.stringify({
          source: nextLiveContext.source,
          liveAvailable: nextLiveContext.liveAvailable,
          joinedChannelId: nextLiveContext.joinedChannelId,
          operationCount: operations.length,
          spec: nextLiveContext.spec,
        }, null, 2));
      }

      const doc = getOrCreateDocument();
      applyOperationsToDocument(doc, operations);
      syncToFile();

      return specResult(JSON.stringify({
        source: 'document',
        liveAvailable: false,
        joinedChannelId: activeChannelId,
        operationCount: operations.length,
        spec: doc.spec,
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_read_spec',
  'Read the current design spec. When a live desktop channel is joined, this returns the live channel spec; otherwise it returns the MCP session document.',
  {},
  async () => {
    const liveContext = getLiveContext();
    return specResult(JSON.stringify(liveContext.spec, null, 2));
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
        return errorResult('Error: Invalid spec structure. Must have version, root, elements, and state fields.');
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
        return specResult(`Warning: Unknown component types: ${unknownTypes.join(', ')}. These will render as empty placeholders. Valid types: ${[...validTypes].join(', ')}`);
      }

      const liveContext = await applyLiveMutation({
        kind: 'replaceSpec',
        spec: parsedSpec,
      });
      if (liveContext) {
        return specResult(`Design generated successfully with ${Object.keys(liveContext.spec.elements).length} elements.\n\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      // Load the spec locally when no live desktop channel is available.
      currentDocument = new Document({ spec: parsedSpec });
      syncToFile();

      return specResult(`Design generated successfully with ${Object.keys(parsedSpec.elements).length} elements.\n\n${JSON.stringify(parsedSpec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error parsing spec: ${error instanceof Error ? error.message : String(error)}`);
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
      const resolvedParentId = parentId === '_root' ? getLiveContext().spec.root : parentId;
      const parsedProps = JSON.parse(props);

      const liveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'add',
            parentId: resolvedParentId,
            elementType: type,
            props: parsedProps,
            index,
          },
        ],
      });
      if (liveContext) {
        return specResult(`Added ${type} element to parent ${resolvedParentId}.\n\nUpdated spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      doc.add(resolvedParentId, { type, props: parsedProps }, index);
      syncToFile();

      return specResult(`Added ${type} element to parent ${resolvedParentId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
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
      const parsedProps = JSON.parse(props);

      const liveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'updateProps',
            elementId,
            props: parsedProps,
          },
        ],
      });
      if (liveContext) {
        return specResult(`Updated props on element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      const doc = getOrCreateDocument();

      doc.setProps(elementId, parsedProps);
      syncToFile();

      return specResult(`Updated props on element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
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
      const liveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'remove',
            elementId,
          },
        ],
      });
      if (liveContext) {
        return specResult(`Removed element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      const doc = getOrCreateDocument();
      doc.remove(elementId);
      syncToFile();

      return specResult(`Removed element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

// ─── Tool: Move Element ──────────────────────────────────────────────────

server.tool(
  'designforge_move_element',
  'Move an element to a new parent at a specific index position.',
  {
    elementId: z.string().describe('ID of the element to move'),
    newParentId: z.string().describe('ID of the new parent element. Use "_root" for root.'),
    index: z.number().describe('Index position within the new parent\'s children'),
  },
  async ({ elementId, newParentId, index }) => {
    try {
      const doc = getOrCreateDocument();
      const resolvedParentId = newParentId === '_root' ? getLiveContext().spec.root : newParentId;

      const liveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'move',
            elementId,
            newParentId: resolvedParentId,
            index,
          },
        ],
      });
      if (liveContext) {
        return specResult(`Moved element ${elementId} to parent ${resolvedParentId} at index ${index}.\n\nUpdated spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      doc.move(elementId, resolvedParentId, index);
      syncToFile();

      return specResult(`Moved element ${elementId} to parent ${resolvedParentId} at index ${index}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

// ─── Tool: Duplicate Element ─────────────────────────────────────────────

server.tool(
  'designforge_duplicate_element',
  'Duplicate an element and all its descendants. The copy is placed as a sibling after the original.',
  {
    elementId: z.string().describe('ID of the element to duplicate'),
  },
  async ({ elementId }) => {
    try {
      const liveContext = await applyLiveMutation({
        kind: 'applyOperations',
        operations: [
          {
            type: 'duplicate',
            elementId,
          },
        ],
      });
      if (liveContext) {
        return specResult(`Duplicated element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      const doc = getOrCreateDocument();
      doc.duplicate(elementId);
      syncToFile();

      return specResult(`Duplicated element ${elementId}.\n\nUpdated spec:\n${JSON.stringify(doc.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

// ─── Tool: Export ───────────────────────────────────────────────────────────

server.tool(
  'designforge_export',
  'Export the current design as a .dfg JSON file content. This includes the full spec and editor state.',
  {},
  async () => {
    const liveContext = getLiveContext();
    if (liveContext.liveAvailable) {
      return specResult(JSON.stringify({
        version: 1,
        catalog: 'rnr-uniwind-v1',
        target: ['web', 'ios', 'android'],
        spec: liveContext.spec,
        editor: {
          zoom: liveContext.zoom,
          pan: liveContext.pan,
          selection: liveContext.selectedIds,
          expandedLayers: [],
        },
      }, null, 2));
    }

    const doc = getOrCreateDocument();
    const file = doc.toFile();
    return specResult(JSON.stringify(file, null, 2));
  },
);

// ─── Tool: Load File ─────────────────────────────────────────────────────────

server.tool(
  'designforge_export_code',
  'Export the current design as a standalone React + Vite project. Returns the generated file map and export metadata.',
  {
    projectName: z.string().optional().describe('Optional project name to use for the generated package and folder.'),
  },
  async ({ projectName }) => {
    try {
      const liveContext = getLiveContext();
      const project = generateReactViteProject(liveContext.spec, { projectName });

      return specResult(JSON.stringify({
        framework: project.framework,
        displayName: project.displayName,
        packageName: project.packageName,
        entryFile: project.entryFile,
        componentTypes: project.componentTypes,
        unsupportedComponents: project.unsupportedComponents,
        statePaths: project.statePaths,
        actions: project.actions,
        files: project.files,
      }, null, 2));
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

server.tool(
  'designforge_load_file',
  'Load a .dfg design file from disk into the current session. The design becomes the active document.',
  {
    filePath: z.string().describe('Absolute or relative path to a .dfg file'),
  },
  async ({ filePath }) => {
    try {
      const resolvedPath = resolve(filePath);
      if (!existsSync(resolvedPath)) {
        return errorResult(`Error: File not found: ${resolvedPath}`);
      }
      const content = readFileSync(resolvedPath, 'utf-8');
      const parsedDocument = Document.fromJSON(content);

      const liveContext = await applyLiveMutation({
        kind: 'replaceSpec',
        spec: parsedDocument.spec,
        filePath: resolvedPath,
      });
      if (liveContext) {
        return specResult(`Loaded design from ${resolvedPath} (${Object.keys(liveContext.spec.elements).length} elements).\n\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      currentDocument = parsedDocument;

      return specResult(`Loaded design from ${resolvedPath} (${Object.keys(currentDocument.spec.elements).length} elements).\n\n${JSON.stringify(currentDocument.spec, null, 2)}`);
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

// ─── Tool: Undo ─────────────────────────────────────────────────────────────

server.tool(
  'designforge_undo',
  'Undo the last design operation.',
  {},
  async () => {
    try {
      const liveContext = await applyLiveMutation({ kind: 'undo' });
      if (liveContext) {
        return specResult(`Undone. Current spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      const doc = getOrCreateDocument();
      const success = doc.undo();
      if (success) syncToFile();

      return specResult(success
        ? `Undone. Current spec:\n${JSON.stringify(doc.spec, null, 2)}`
        : 'Nothing to undo.');
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
);

// ─── Tool: Redo ─────────────────────────────────────────────────────────────

server.tool(
  'designforge_redo',
  'Redo the last undone design operation.',
  {},
  async () => {
    try {
      const liveContext = await applyLiveMutation({ kind: 'redo' });
      if (liveContext) {
        return specResult(`Redone. Current spec:\n${JSON.stringify(liveContext.spec, null, 2)}`);
      }

      const doc = getOrCreateDocument();
      const success = doc.redo();
      if (success) syncToFile();

      return specResult(success
        ? `Redone. Current spec:\n${JSON.stringify(doc.spec, null, 2)}`
        : 'Nothing to redo.');
    } catch (error) {
      return errorResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
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
