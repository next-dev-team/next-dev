/**
 * AI Service — abstraction layer for AI-powered design operations
 *
 * Defines the interface for sending natural-language prompts and receiving
 * structured operations that can be applied to the design spec.
 *
 * The MockAIService provides a functional demo using heuristic parsing,
 * while real implementations route through MCP or a backend proxy.
 */

import type { DesignSpec, Element } from '@next-dev/editor-core';
import { catalog, type ComponentType } from '@next-dev/catalog';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AIOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps';
  /** For 'add': parent element ID */
  parentId?: string;
  /** For 'add': component type to create */
  elementType?: string;
  /** For 'add' / 'updateProps': props to set */
  props?: Record<string, unknown>;
  /** For 'add' / 'move': insertion index */
  index?: number;
  /** For 'remove' / 'move' / 'updateProps': target element ID */
  elementId?: string;
  /** For 'move': new parent element ID */
  newParentId?: string;
  /** For 'updateProps': props to merge */
  updatedProps?: Record<string, unknown>;
}

export interface AIResponse {
  operations: AIOperation[];
  /** Human-readable summary shown in chat */
  description: string;
}

export interface AIRequest {
  prompt: string;
  currentSpec: DesignSpec;
  catalog: string;
}

export interface AIService {
  generateOperations(request: AIRequest): Promise<AIResponse>;
}

// ─── Mock AI Service ────────────────────────────────────────────────────────

/**
 * Heuristic-based mock that parses simple natural-language commands
 * into spec operations. Useful for demos and offline development.
 */
export class MockAIService implements AIService {
  async generateOperations(request: AIRequest): Promise<AIResponse> {
    // Simulate a small delay to feel realistic
    await delay(400 + Math.random() * 400);

    const prompt = request.prompt.trim().toLowerCase();
    const spec = request.currentSpec;

    // ── Remove commands ───────────────────────────────────────────────
    if (prompt.startsWith('remove') || prompt.startsWith('delete')) {
      return this.handleRemove(prompt, spec);
    }

    // ── Change / update commands ──────────────────────────────────────
    if (
      prompt.startsWith('change') ||
      prompt.startsWith('update') ||
      prompt.startsWith('set') ||
      prompt.startsWith('make')
    ) {
      return this.handleUpdate(prompt, spec);
    }

    // ── Add commands (default) ────────────────────────────────────────
    return this.handleAdd(prompt, spec);
  }

  // ── Add handler ───────────────────────────────────────────────────────

  private handleAdd(prompt: string, spec: DesignSpec): AIResponse {
    const operations: AIOperation[] = [];
    const rootId = spec.root;

    // Try to find a matching component type from the prompt
    const componentTypes = Object.keys(catalog) as ComponentType[];

    // Special compound patterns first
    if (prompt.includes('login form') || prompt.includes('sign in form')) {
      return this.buildLoginForm(rootId);
    }

    if (prompt.includes('card') && prompt.includes('title')) {
      return this.buildCardWithTitle(prompt, rootId);
    }

    // Single component matching
    const matchedType = componentTypes.find((type) =>
      prompt.includes(type.toLowerCase()),
    );

    if (matchedType) {
      const entry = catalog[matchedType];
      const defaultProps = extractDefaults(entry.schema);

      // Try to extract text content from quotes
      const quotedText = extractQuotedText(prompt);
      if (quotedText && 'children' in defaultProps) {
        defaultProps.children = quotedText;
      }

      // Try to extract variant
      if ('variant' in defaultProps) {
        const variantMatch = prompt.match(/variant\s+["']?(\w+)["']?/);
        if (variantMatch) {
          defaultProps.variant = variantMatch[1];
        }
        // Common adjective-to-variant mappings
        if (prompt.includes('destructive') || prompt.includes('danger')) {
          defaultProps.variant = 'destructive';
        }
        if (prompt.includes('outline')) {
          defaultProps.variant = 'outline';
        }
        if (prompt.includes('secondary')) {
          defaultProps.variant = 'secondary';
        }
        if (prompt.includes('ghost')) {
          defaultProps.variant = 'ghost';
        }
      }

      operations.push({
        type: 'add',
        parentId: rootId,
        elementType: matchedType,
        props: defaultProps,
      });

      return {
        operations,
        description: `Added a ${matchedType} element${quotedText ? ` with text "${quotedText}"` : ''}.`,
      };
    }

    // Fallback: try to add a Text element with the described content
    if (prompt.includes('text') || prompt.includes('heading') || prompt.includes('paragraph')) {
      const quotedText = extractQuotedText(prompt) ?? 'Sample text';
      let variant = 'default';
      if (prompt.includes('heading') || prompt.includes('h1')) variant = 'h1';
      else if (prompt.includes('h2')) variant = 'h2';
      else if (prompt.includes('h3')) variant = 'h3';
      else if (prompt.includes('paragraph')) variant = 'p';

      operations.push({
        type: 'add',
        parentId: rootId,
        elementType: 'Text',
        props: { children: quotedText, variant, className: null },
      });

      return {
        operations,
        description: `Added a ${variant === 'default' ? 'Text' : variant} element with text "${quotedText}".`,
      };
    }

    return {
      operations: [],
      description: `I couldn't understand what to add. Try something like "Add a Button with text 'Submit'" or "Add a Card with title 'Settings'".`,
    };
  }

  // ── Remove handler ────────────────────────────────────────────────────

  private handleRemove(prompt: string, spec: DesignSpec): AIResponse {
    const operations: AIOperation[] = [];
    const componentTypes = Object.keys(catalog) as ComponentType[];

    const matchedType = componentTypes.find((type) =>
      prompt.includes(type.toLowerCase()),
    );

    if (!matchedType) {
      return {
        operations: [],
        description: `I couldn't determine which element to remove. Try "Remove all buttons" or "Delete the card".`,
      };
    }

    const removeAll = prompt.includes('all');
    const matches = findElementsByType(spec, matchedType);

    if (matches.length === 0) {
      return {
        operations: [],
        description: `No ${matchedType} elements found in the current design.`,
      };
    }

    const toRemove = removeAll ? matches : [matches[0]];
    for (const [id] of toRemove) {
      operations.push({ type: 'remove', elementId: id });
    }

    return {
      operations,
      description: `Removed ${toRemove.length} ${matchedType} element${toRemove.length > 1 ? 's' : ''}.`,
    };
  }

  // ── Update handler ────────────────────────────────────────────────────

  private handleUpdate(prompt: string, spec: DesignSpec): AIResponse {
    const operations: AIOperation[] = [];
    const componentTypes = Object.keys(catalog) as ComponentType[];

    // Find which component type to update
    const matchedType = componentTypes.find((type) =>
      prompt.includes(type.toLowerCase()),
    );

    // Find elements to update
    let targets: [string, Element][];
    if (matchedType) {
      targets = findElementsByType(spec, matchedType);
    } else {
      // Try all non-root elements
      targets = Object.entries(spec.elements).filter(
        ([id]) => id !== spec.root,
      );
    }

    if (targets.length === 0) {
      return {
        operations: [],
        description: `No matching elements found to update.`,
      };
    }

    const target = targets[0];
    const [targetId] = target;
    const updatedProps: Record<string, unknown> = {};

    // Extract text changes
    const textMatch = prompt.match(/text\s+to\s+["']([^"']+)["']/);
    if (textMatch) {
      updatedProps.children = textMatch[1];
    } else {
      const quotedText = extractQuotedText(prompt);
      if (quotedText) {
        updatedProps.children = quotedText;
      }
    }

    // Extract variant changes
    const variantMatch = prompt.match(/variant\s+(?:to\s+)?["']?(\w+)["']?/);
    if (variantMatch) {
      updatedProps.variant = variantMatch[1];
    }
    if (prompt.includes('destructive') || prompt.includes('danger')) {
      updatedProps.variant = 'destructive';
    }
    if (prompt.includes('outline')) {
      updatedProps.variant = 'outline';
    }
    if (prompt.includes('disabled')) {
      updatedProps.disabled = true;
    }
    if (prompt.includes('enabled')) {
      updatedProps.disabled = false;
    }

    if (Object.keys(updatedProps).length === 0) {
      return {
        operations: [],
        description: `I couldn't determine what to change. Try "Change the button text to 'Submit'" or "Set the button variant to outline".`,
      };
    }

    operations.push({
      type: 'updateProps',
      elementId: targetId,
      updatedProps,
    });

    return {
      operations,
      description: `Updated ${matchedType ?? 'element'}: ${Object.entries(updatedProps)
        .map(([k, v]) => `${k} = "${v}"`)
        .join(', ')}.`,
    };
  }

  // ── Compound builders ─────────────────────────────────────────────────

  private buildLoginForm(rootId: string): AIResponse {
    // We return nested operations — the UI will apply them sequentially.
    // Since addElement auto-generates IDs, we use a placeholder approach:
    // add a Stack, then add children. The caller must handle the nesting.
    //
    // For the mock, we flatten into sequential adds to the root. The first
    // add creates a Card, and subsequent adds use a special '__last' parent
    // convention — but since our store doesn't support that, we'll add
    // everything to root in a flat structure and describe what we did.

    return {
      operations: [
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Card',
          props: { className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardHeader',
          props: { className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardTitle',
          props: { children: 'Login', className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardDescription',
          props: { children: 'Enter your credentials to sign in.', className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardContent',
          props: { className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Label',
          props: { children: 'Email', htmlFor: null, className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Input',
          props: { placeholder: 'you@example.com', type: 'email', disabled: false, className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Label',
          props: { children: 'Password', htmlFor: null, className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Input',
          props: { placeholder: 'Password', type: 'password', disabled: false, className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Button',
          props: { children: 'Sign In', variant: 'default', size: 'default', disabled: false, className: null },
        },
      ],
      description:
        'Added a login form with email and password fields, labels, and a "Sign In" button.',
    };
  }

  private buildCardWithTitle(prompt: string, rootId: string): AIResponse {
    const title = extractQuotedText(prompt) ?? 'Card Title';

    return {
      operations: [
        {
          type: 'add',
          parentId: rootId,
          elementType: 'Card',
          props: { className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardHeader',
          props: { className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardTitle',
          props: { children: title, className: null },
        },
        {
          type: 'add',
          parentId: rootId,
          elementType: 'CardContent',
          props: { className: null },
        },
      ],
      description: `Added a Card with title "${title}", header, and content areas.`,
    };
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

function extractDefaults(
  schema: { shape: Record<string, unknown> },
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const shape = schema.shape as Record<string, {
    _def?: { defaultValue?: unknown };
    def?: { defaultValue?: unknown };
  }>;
  for (const [key, field] of Object.entries(shape)) {
    const defaultValue = field?.def?.defaultValue ?? field?._def?.defaultValue;
    if (typeof defaultValue === 'function') {
      defaults[key] = defaultValue();
    } else if (defaultValue !== undefined) {
      defaults[key] = defaultValue;
    }
  }
  return defaults;
}

function findElementsByType(
  spec: DesignSpec,
  type: string,
): [string, Element][] {
  return Object.entries(spec.elements).filter(
    ([, el]) => el.type === type,
  );
}

// ─── Singleton ──────────────────────────────────────────────────────────────

let _aiService: AIService = new MockAIService();

export function getAIService(): AIService {
  return _aiService;
}

export function setAIService(service: AIService): void {
  _aiService = service;
}
