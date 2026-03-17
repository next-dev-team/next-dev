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

// ─── MCP Provider (stdio bridge to packages/mcp-server) ─────────────────────

export class MCPProvider implements AIProvider {
  readonly type: ProviderType = 'mcp';

  /**
   * MCP provider works by invoking the MCP server tools via the Electron
   * main process IPC bridge. The main process spawns the MCP server as a
   * child process and communicates over stdio JSON-RPC.
   */
  async generate(prompt: string, spec: DesignSpec): Promise<AIResponse> {
    // Use the preload bridge to call MCP tools
    const api = (window as any).designforge;
    if (!api?.mcp?.call) {
      throw new Error('MCP bridge not available. Ensure Electron main process is running the MCP server.');
    }

    // First, send the current spec to MCP
    await api.mcp.call('designforge_generate', { spec: JSON.stringify(spec) });

    // Then ask for an edit — but MCP doesn't do NLP parsing by default,
    // so we use the mock parser as a fallback and apply through MCP tools
    const mock = new MockProvider();
    const result = await mock.generate(prompt, spec);

    // Apply operations through MCP for state consistency
    for (const op of result.operations) {
      if (op.type === 'add') {
        await api.mcp.call('designforge_add_element', {
          parentId: op.parentId ?? spec.root,
          type: op.elementType ?? 'Text',
          props: JSON.stringify(op.props ?? {}),
        });
      } else if (op.type === 'remove' && op.elementId) {
        await api.mcp.call('designforge_remove_element', { elementId: op.elementId });
      } else if (op.type === 'updateProps' && op.elementId) {
        await api.mcp.call('designforge_update_props', {
          elementId: op.elementId,
          props: JSON.stringify(op.updatedProps ?? {}),
        });
      }
    }

    return result;
  }

  async stream(
    prompt: string,
    spec: DesignSpec,
    onChunk: (chunk: AIStreamChunk) => void,
  ): Promise<void> {
    onChunk({ type: 'text', content: 'Executing through MCP server...\n' });
    try {
      const result = await this.generate(prompt, spec);
      onChunk({ type: 'text', content: result.description + '\n' });
      onChunk({ type: 'operations', operations: result.operations });
      onChunk({ type: 'done' });
    } catch (err) {
      onChunk({ type: 'error', error: (err as Error).message });
    }
  }
}

// ─── Factory ────────────────────────────────────────────────────────────────

export function createProvider(config: ProviderConfig): AIProvider {
  switch (config.type) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'mcp':
      return new MCPProvider();
    case 'mock':
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
