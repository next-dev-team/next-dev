/**
 * AI Provider Abstraction
 *
 * Supports multiple backends for the chat-driven design workflow:
 *
 * 1. Mock    — heuristic parsing, no network (offline dev)
 * 2. MCP     — Model Context Protocol stdio bridge → mcp-server
 * 3. OpenAI  — OpenAI-compatible HTTP endpoint (works with local LLMs like Ollama, LM Studio, etc.)
 *
 * All providers return the same AIResponse contract:
 *   { operations, description }
 */

import type { DesignSpec, Element } from '@next-dev/editor-core';
import { catalog, catalogToPrompt, type ComponentType } from '@next-dev/catalog';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AIOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  index?: number;
  elementId?: string;
  newParentId?: string;
  updatedProps?: Record<string, unknown>;
}

export interface AIResponse {
  operations: AIOperation[];
  description: string;
}

export interface AIStreamChunk {
  type: 'text' | 'operations' | 'done' | 'error';
  content?: string;
  operations?: AIOperation[];
  error?: string;
}

export type ProviderType = 'mock' | 'mcp' | 'openai';

export interface ProviderConfig {
  type: ProviderType;
  /** For openai: base URL (e.g. http://localhost:11434/v1, https://api.openai.com/v1) */
  baseUrl?: string;
  /** For openai: API key */
  apiKey?: string;
  /** For openai: model name */
  model?: string;
  /** For mcp: path to MCP server binary / script */
  mcpCommand?: string;
  mcpArgs?: string[];
}

export interface AIProvider {
  readonly type: ProviderType;
  /**
   * Send a prompt and get a full response (non-streaming).
   */
  generate(prompt: string, spec: DesignSpec): Promise<AIResponse>;
  /**
   * Send a prompt and stream back chunks. Yields text deltas and
   * then a final operations object.
   */
  stream(
    prompt: string,
    spec: DesignSpec,
    onChunk: (chunk: AIStreamChunk) => void,
    signal?: AbortSignal,
  ): Promise<void>;
}

// ─── System Prompt ──────────────────────────────────────────────────────────

function buildSystemPrompt(spec: DesignSpec): string {
  const catalogText = catalogToPrompt();
  return `You are DesignForge AI — a design assistant that generates structured UI operations.

## Component Catalog
${catalogText}

## Current Design Spec
\`\`\`json
${JSON.stringify(spec, null, 2)}
\`\`\`

## Rules
1. Return ONLY valid JSON matching this shape:
   {
     "description": "Human-readable summary of changes",
     "operations": [
       { "type": "add|remove|updateProps|move", ... }
     ]
   }
2. For "add" operations include: parentId, elementType, props
   - Use the root element ID "${spec.root}" as parentId to add top-level elements
3. For "remove" operations include: elementId
4. For "updateProps" operations include: elementId, updatedProps
5. For "move" operations include: elementId, newParentId, index
6. Use ONLY component types from the catalog above.
7. Do NOT wrap your response in markdown code fences.
8. Do NOT include any text outside the JSON object.`;
}

// ─── Mock Provider ──────────────────────────────────────────────────────────

export class MockProvider implements AIProvider {
  readonly type: ProviderType = 'mock';

  async generate(prompt: string, spec: DesignSpec): Promise<AIResponse> {
    await delay(300 + Math.random() * 500);
    return this.parse(prompt, spec);
  }

  async stream(
    prompt: string,
    spec: DesignSpec,
    onChunk: (chunk: AIStreamChunk) => void,
  ): Promise<void> {
    onChunk({ type: 'text', content: 'Analyzing your request...\n' });
    await delay(200);

    const result = await this.generate(prompt, spec);

    onChunk({ type: 'text', content: result.description + '\n' });
    await delay(150);

    onChunk({ type: 'operations', operations: result.operations });
    onChunk({ type: 'done' });
  }

  private parse(prompt: string, spec: DesignSpec): AIResponse {
    const p = prompt.trim().toLowerCase();
    const rootId = spec.root;

    // Remove commands
    if (p.startsWith('remove') || p.startsWith('delete')) {
      return this.handleRemove(p, spec);
    }

    // Update commands
    if (p.startsWith('change') || p.startsWith('update') || p.startsWith('set') || p.startsWith('make')) {
      return this.handleUpdate(p, spec);
    }

    // Login form
    if (p.includes('login') || p.includes('sign in')) {
      return {
        operations: [
          { type: 'add', parentId: rootId, elementType: 'Card', props: { className: null } },
          { type: 'add', parentId: rootId, elementType: 'CardHeader', props: { className: null } },
          { type: 'add', parentId: rootId, elementType: 'CardTitle', props: { children: 'Login', className: null } },
          { type: 'add', parentId: rootId, elementType: 'CardDescription', props: { children: 'Enter your credentials to sign in.', className: null } },
          { type: 'add', parentId: rootId, elementType: 'Label', props: { children: 'Email', className: null } },
          { type: 'add', parentId: rootId, elementType: 'Input', props: { placeholder: 'you@example.com', type: 'email', className: null } },
          { type: 'add', parentId: rootId, elementType: 'Label', props: { children: 'Password', className: null } },
          { type: 'add', parentId: rootId, elementType: 'Input', props: { placeholder: 'Password', type: 'password', className: null } },
          { type: 'add', parentId: rootId, elementType: 'Button', props: { children: 'Sign In', variant: 'default', className: null } },
        ],
        description: 'Generated a login form with email/password fields, labels, and a Sign In button.',
      };
    }

    // Single component match
    const componentTypes = Object.keys(catalog) as ComponentType[];
    const matchedType = componentTypes.find((t) => p.includes(t.toLowerCase()));
    if (matchedType) {
      const entry = catalog[matchedType];
      const defaultProps = extractDefaults(entry.schema);
      const quoted = extractQuotedText(prompt);
      if (quoted && 'children' in defaultProps) defaultProps.children = quoted;

      // Variant extraction
      if ('variant' in defaultProps) {
        if (p.includes('destructive') || p.includes('danger')) defaultProps.variant = 'destructive';
        else if (p.includes('outline')) defaultProps.variant = 'outline';
        else if (p.includes('secondary')) defaultProps.variant = 'secondary';
        else if (p.includes('ghost')) defaultProps.variant = 'ghost';
      }

      return {
        operations: [{ type: 'add', parentId: rootId, elementType: matchedType, props: defaultProps }],
        description: `Added a ${matchedType} element${quoted ? ` with text "${quoted}"` : ''}.`,
      };
    }

    // Text fallback
    if (p.includes('text') || p.includes('heading') || p.includes('paragraph')) {
      const text = extractQuotedText(prompt) ?? 'Sample text';
      let variant = 'default';
      if (p.includes('heading') || p.includes('h1')) variant = 'h1';
      else if (p.includes('h2')) variant = 'h2';
      else if (p.includes('h3')) variant = 'h3';
      else if (p.includes('paragraph')) variant = 'p';

      return {
        operations: [{ type: 'add', parentId: rootId, elementType: 'Text', props: { children: text, variant, className: null } }],
        description: `Added a ${variant === 'default' ? 'Text' : variant} element.`,
      };
    }

    return {
      operations: [],
      description: "I couldn't understand that. Try: \"Add a Button with text 'Submit'\" or \"Create a login form\"",
    };
  }

  private handleRemove(prompt: string, spec: DesignSpec): AIResponse {
    const componentTypes = Object.keys(catalog) as ComponentType[];
    const matched = componentTypes.find((t) => prompt.includes(t.toLowerCase()));
    if (!matched) return { operations: [], description: 'Could not determine which element to remove.' };

    const all = prompt.includes('all');
    const matches = findByType(spec, matched);
    if (matches.length === 0) return { operations: [], description: `No ${matched} elements found.` };

    const targets = all ? matches : [matches[0]];
    return {
      operations: targets.map(([id]) => ({ type: 'remove' as const, elementId: id })),
      description: `Removed ${targets.length} ${matched} element(s).`,
    };
  }

  private handleUpdate(prompt: string, spec: DesignSpec): AIResponse {
    const componentTypes = Object.keys(catalog) as ComponentType[];
    const matched = componentTypes.find((t) => prompt.includes(t.toLowerCase()));
    const targets = matched ? findByType(spec, matched) : Object.entries(spec.elements).filter(([id]) => id !== spec.root);
    if (targets.length === 0) return { operations: [], description: 'No matching elements found.' };

    const [targetId] = targets[0];
    const updatedProps: Record<string, unknown> = {};
    const quoted = extractQuotedText(prompt);
    if (quoted) updatedProps.children = quoted;
    if (prompt.includes('destructive')) updatedProps.variant = 'destructive';
    if (prompt.includes('outline')) updatedProps.variant = 'outline';
    if (prompt.includes('disabled')) updatedProps.disabled = true;

    if (Object.keys(updatedProps).length === 0) {
      return { operations: [], description: 'Could not determine what to change.' };
    }

    return {
      operations: [{ type: 'updateProps', elementId: targetId, updatedProps }],
      description: `Updated ${matched ?? 'element'}: ${Object.entries(updatedProps).map(([k, v]) => `${k}="${v}"`).join(', ')}.`,
    };
  }
}

// ─── OpenAI-Compatible Provider (works with Ollama, LM Studio, etc.) ────────

export class OpenAIProvider implements AIProvider {
  readonly type: ProviderType = 'openai';
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(config: ProviderConfig) {
    this.baseUrl = (config.baseUrl ?? 'http://localhost:11434/v1').replace(/\/$/, '');
    this.apiKey = config.apiKey ?? '';
    this.model = config.model ?? 'llama3';
  }

  async generate(prompt: string, spec: DesignSpec): Promise<AIResponse> {
    const systemPrompt = buildSystemPrompt(spec);
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    return parseAIJSON(text);
  }

  async stream(
    prompt: string,
    spec: DesignSpec,
    onChunk: (chunk: AIStreamChunk) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const systemPrompt = buildSystemPrompt(spec);

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      onChunk({ type: 'error', error: `API error ${res.status}` });
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onChunk({ type: 'error', error: 'No response body' });
      return;
    }

    const decoder = new TextDecoder();
    let accumulated = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            if (delta) {
              accumulated += delta;
              onChunk({ type: 'text', content: delta });
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }

      // Parse the final accumulated text as JSON operations
      const result = parseAIJSON(accumulated);
      onChunk({ type: 'operations', operations: result.operations });
      onChunk({ type: 'done' });
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        onChunk({ type: 'done' });
      } else {
        onChunk({ type: 'error', error: (err as Error).message });
      }
    }
  }
}

// ─── MCP Provider (LLM understands + MCP tools execute) ─────────────────────
//
// Architecture:
//   User prompt → LLM (OpenAI/Ollama) → tool_calls → MCP server → design ops
//
// The LLM receives the MCP tool catalog as context, then:
//   1. Decides which MCP tools to call
//   2. Generates the arguments
//   3. We execute them via the Electron IPC bridge
//
// External agents (Claude Code, Cursor) can also connect to the same
// MCP server directly — they don't need the LLM layer.

interface MCPBridge {
  connect(): Promise<{ success: boolean; error?: string; tools?: MCPToolDef[] }>;
  disconnect(): Promise<{ success: boolean }>;
  status(): Promise<{ connected: boolean; serverPath: string; tools: MCPToolDef[] }>;
  listTools(): Promise<MCPToolDef[]>;
  call(toolName: string, args: Record<string, unknown>): Promise<{ success: boolean; result?: unknown; error?: string }>;
}

interface MCPToolDef {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
}

function getMCPBridge(): MCPBridge | null {
  const w = window as unknown as { designforge?: { mcp?: MCPBridge } };
  return w.designforge?.mcp ?? null;
}

export class MCPProvider implements AIProvider {
  readonly type: ProviderType = 'mcp';
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(config?: ProviderConfig) {
    this.baseUrl = (config?.baseUrl ?? 'http://localhost:11434/v1').replace(/\/$/, '');
    this.apiKey = config?.apiKey ?? '';
    this.model = config?.model ?? 'llama3';
  }

  /** Get MCP connection status */
  async getStatus(): Promise<{ connected: boolean; tools: MCPToolDef[]; serverPath: string }> {
    const mcp = getMCPBridge();
    if (!mcp) return { connected: false, tools: [], serverPath: '' };
    return mcp.status();
  }

  /** Connect to the DesignForge MCP server */
  async connect(): Promise<{ success: boolean; error?: string }> {
    const mcp = getMCPBridge();
    if (!mcp) return { success: false, error: 'Electron bridge not available' };
    return mcp.connect();
  }

  /** Disconnect from the MCP server */
  async disconnect(): Promise<void> {
    const mcp = getMCPBridge();
    if (mcp) await mcp.disconnect();
  }

  /** Build the system prompt that includes MCP tool definitions */
  private async buildToolAwarePrompt(spec: DesignSpec): Promise<{
    systemPrompt: string;
    tools: MCPToolDef[];
    openaiTools: Array<{
      type: 'function';
      function: { name: string; description: string; parameters: Record<string, unknown> };
    }>;
  }> {
    const mcp = getMCPBridge();
    const tools = mcp ? await mcp.listTools() : [];

    // Build OpenAI function-calling tools from MCP tool definitions
    const openaiTools = tools.map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema ?? { type: 'object', properties: {} },
      },
    }));

    const systemPrompt = `You are DesignForge AI, a UI design assistant. You help users create and modify UI designs by calling design tools.

Current design spec:
${JSON.stringify(spec, null, 2)}

Available component types:
${catalogToPrompt()}

You have access to design tools. When the user asks to create or modify a design, call the appropriate tools.
Key tools:
- designforge_add_element: Add a component to the design
- designforge_update_props: Update props on an existing element
- designforge_remove_element: Remove an element
- designforge_generate: Load a complete design spec
- designforge_read_spec: Read the current design
- designforge_list_components: Get the full component catalog

Always call tools to make changes. Do NOT just describe what you would do — actually call the tools.
For text responses (explanations, questions), respond normally without tool calls.`;

    return { systemPrompt, tools, openaiTools };
  }

  async generate(prompt: string, spec: DesignSpec): Promise<AIResponse> {
    const mcp = getMCPBridge();
    const { systemPrompt, openaiTools } = await this.buildToolAwarePrompt(spec);

    // If no LLM configured, fall back to mock + MCP
    if (!this.baseUrl || this.baseUrl.includes('localhost:11434') && !this.model) {
      // Use mock parser, then sync through MCP
      const mock = new MockProvider();
      const result = await mock.generate(prompt, spec);
      if (mcp) {
        for (const op of result.operations) {
          if (op.type === 'add') {
            await mcp.call('designforge_add_element', {
              parentId: op.parentId ?? spec.root,
              type: op.elementType ?? 'Text',
              props: JSON.stringify(op.props ?? {}),
            });
          }
        }
      }
      return result;
    }

    // Call LLM with tool definitions
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        tools: openaiTools.length > 0 ? openaiTools : undefined,
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`LLM API error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message;
    const operations: AIOperation[] = [];
    let description = message?.content ?? '';

    // Execute tool calls if the LLM made any
    if (message?.tool_calls && mcp) {
      for (const tc of message.tool_calls) {
        const toolName = tc.function.name;
        const toolArgs = JSON.parse(tc.function.arguments ?? '{}');

        const result = await mcp.call(toolName, toolArgs);
        if (result.success) {
          // Parse MCP result into operations
          const parsed = parseMCPResult(result.result);
          operations.push(...parsed.operations);
          if (parsed.description) {
            description += `\n${parsed.description}`;
          }
        } else {
          description += `\n⚠️ Tool ${toolName} failed: ${result.error}`;
        }
      }
    }

    // If no tool calls but LLM returned JSON operations, parse them
    if (operations.length === 0 && description) {
      try {
        const parsed = parseAIJSON(description);
        return parsed;
      } catch {
        // Not JSON — that's fine, it's a text response
      }
    }

    return { operations, description: description.trim() || 'Done.' };
  }

  async stream(
    prompt: string,
    spec: DesignSpec,
    onChunk: (chunk: AIStreamChunk) => void,
  ): Promise<void> {
    const mcp = getMCPBridge();

    // Show MCP status
    if (mcp) {
      const status = await mcp.status();
      if (status.connected) {
        onChunk({
          type: 'text',
          content: `🔌 MCP connected (${status.tools.length} tools)\n`,
        });
      } else {
        onChunk({ type: 'text', content: '⚠️ MCP server not connected. Connecting...\n' });
        const connectResult = await mcp.connect();
        if (connectResult.success) {
          onChunk({ type: 'text', content: '✅ MCP connected!\n' });
        } else {
          onChunk({ type: 'text', content: `❌ MCP failed: ${connectResult.error}\n` });
        }
      }
    } else {
      onChunk({ type: 'text', content: '⚠️ Electron bridge not available\n' });
    }

    onChunk({ type: 'text', content: '\n' });

    try {
      const result = await this.generate(prompt, spec);
      if (result.description) {
        onChunk({ type: 'text', content: `${result.description}\n` });
      }
      if (result.operations.length > 0) {
        onChunk({ type: 'operations', operations: result.operations });
      }
      onChunk({ type: 'done' });
    } catch (err) {
      onChunk({ type: 'error', error: (err as Error).message });
    }
  }
}

/** Parse an MCP tool result into operations */
function parseMCPResult(result: unknown): AIResponse {
  if (typeof result === 'object' && result !== null) {
    const obj = result as Record<string, unknown>;

    // Standard MCP response: { content: [{ type: 'text', text: '...' }] }
    if (Array.isArray(obj.content)) {
      const textContent = (obj.content as Array<{ type: string; text?: string }>)
        .filter((c) => c.type === 'text')
        .map((c) => c.text ?? '')
        .join('\n');
      try {
        return parseAIJSON(textContent);
      } catch {
        return { operations: [], description: textContent };
      }
    }

    if (Array.isArray(obj.operations)) {
      return {
        operations: obj.operations as AIOperation[],
        description: (obj.description as string) ?? '',
      };
    }
  }
  return { operations: [], description: '' };
}


// ─── Factory ────────────────────────────────────────────────────────────────

export function createProvider(config: ProviderConfig): AIProvider {
  switch (config.type) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'mcp':
      return new MCPProvider(config);
    default:
      return new MockProvider();
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractQuotedText(input: string): string | null {
  const match = input.match(/["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractDefaults(schema: { shape: Record<string, unknown> }): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const shape = schema.shape as Record<string, { _def?: { defaultValue?: () => unknown } }>;
  for (const [key, field] of Object.entries(shape)) {
    if (field?._def?.defaultValue) {
      defaults[key] = field._def.defaultValue();
    }
  }
  return defaults;
}

function findByType(spec: DesignSpec, type: string): [string, Element][] {
  return Object.entries(spec.elements).filter(([, el]) => el.type === type);
}

function parseAIJSON(text: string): AIResponse {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(cleaned);
    return {
      operations: Array.isArray(parsed.operations) ? parsed.operations : [],
      description: parsed.description ?? parsed.summary ?? 'Applied changes.',
    };
  } catch {
    return {
      operations: [],
      description: cleaned || 'Could not parse AI response as JSON.',
    };
  }
}
