import type { CatalogBlockProviderSelection } from '@next-dev/catalog';
import type { DesignSpec, Element } from '@next-dev/editor-core';

export type EditorChatMode = 'ask' | 'edit' | 'generate';

export interface SelectedElementReference {
  elementId: string;
  shortId: string;
  type: string;
  name: string | null;
  label: string;
  summary: string;
}

export interface ChatRequestContext {
  mode: EditorChatMode;
  selectedElement: SelectedElementReference | null;
  providerSelection?: CatalogBlockProviderSelection | null;
}

export interface ParsedChatPromptContext {
  request: string;
  mode: EditorChatMode | null;
  selectedElementId: string | null;
  providerSelection: Partial<CatalogBlockProviderSelection>;
}

const CONTEXT_START = '[DesignForge chat context]';
const CONTEXT_END = '[/DesignForge chat context]';
const INPUT_LIKE_TYPES = new Set([
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Switch',
  'RadioGroupItem',
  'Toggle',
]);
const PROVIDER_KEYS: Array<keyof CatalogBlockProviderSelection> = ['runtime', 'ui', 'validation'];

export function createSelectedElementReference(
  spec: DesignSpec,
  elementId: string,
): SelectedElementReference | null {
  const element = spec.elements[elementId];
  if (!element) return null;

  const name = typeof element.__editor?.name === 'string' ? element.__editor.name.trim() : '';
  const label = name || element.type;

  return {
    elementId,
    shortId: shortenElementId(elementId),
    type: element.type,
    name: name || null,
    label,
    summary: summarizeElement(spec, elementId),
  };
}

export function buildPromptWithContext(prompt: string, context: ChatRequestContext): string {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) return '';

  const lines = [CONTEXT_START, `mode=${context.mode}`];

  if (context.selectedElement) {
    lines.push(`selected_element_id=${context.selectedElement.elementId}`);
    lines.push(`selected_element_label=${escapeContextValue(context.selectedElement.label)}`);
    lines.push(`selected_element_type=${context.selectedElement.type}`);
    lines.push(`selected_element_summary=${escapeContextValue(context.selectedElement.summary)}`);
  }

  for (const providerKey of PROVIDER_KEYS) {
    const value = context.providerSelection?.[providerKey];
    if (value) {
      lines.push(`provider.${providerKey}=${value}`);
    }
  }

  lines.push(CONTEXT_END, '', trimmedPrompt);
  return lines.join('\n');
}

export function parsePromptWithContext(prompt: string): ParsedChatPromptContext {
  const trimmedPrompt = prompt.trim();
  const startIndex = trimmedPrompt.indexOf(CONTEXT_START);
  const endIndex = trimmedPrompt.indexOf(CONTEXT_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return {
      request: trimmedPrompt,
      mode: null,
      selectedElementId: null,
      providerSelection: {},
    };
  }

  const block = trimmedPrompt
    .slice(startIndex + CONTEXT_START.length, endIndex)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let mode: EditorChatMode | null = null;
  let selectedElementId: string | null = null;
  const providerSelection: Partial<CatalogBlockProviderSelection> = {};

  for (const line of block) {
    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = unescapeContextValue(line.slice(separatorIndex + 1).trim());

    if (key === 'mode' && isChatMode(value)) {
      mode = value;
      continue;
    }

    if (key === 'selected_element_id') {
      selectedElementId = value || null;
      continue;
    }

    if (key.startsWith('provider.')) {
      const providerKey = key.slice('provider.'.length);
      if (isProviderKey(providerKey) && value) {
        providerSelection[providerKey] = value as CatalogBlockProviderSelection[typeof providerKey];
      }
    }
  }

  return {
    request: trimmedPrompt.slice(endIndex + CONTEXT_END.length).trim(),
    mode,
    selectedElementId,
    providerSelection,
  };
}

export function collectSubtreeElementIds(spec: DesignSpec, elementId: string): string[] {
  const root = spec.elements[elementId];
  if (!root) return [];

  const visited = new Set<string>();
  const queue = [elementId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || visited.has(currentId)) continue;
    visited.add(currentId);

    const current = spec.elements[currentId];
    if (!current) continue;
    queue.push(...current.children);
  }

  return [...visited];
}

export function resolveSelectedElementTarget(
  spec: DesignSpec,
  selectedElementId: string | null,
): string | null {
  if (!selectedElementId) return null;

  const element = spec.elements[selectedElementId];
  if (!element) return null;
  if (INPUT_LIKE_TYPES.has(element.type)) return selectedElementId;

  const subtreeIds = collectSubtreeElementIds(spec, selectedElementId);
  for (const candidateId of subtreeIds) {
    if (candidateId === selectedElementId) continue;
    const candidate = spec.elements[candidateId];
    if (candidate && INPUT_LIKE_TYPES.has(candidate.type)) {
      return candidateId;
    }
  }

  return selectedElementId;
}

export function resolveValidationHintTarget(
  spec: DesignSpec,
  selectedElementId: string | null,
): string | null {
  if (!selectedElementId) return null;

  const subtreeIds = collectSubtreeElementIds(spec, selectedElementId);
  for (const candidateId of subtreeIds) {
    if (candidateId === selectedElementId) continue;
    const candidate = spec.elements[candidateId];
    if (!candidate || candidate.type !== 'Text') continue;

    const candidateName = typeof candidate.__editor?.name === 'string' ? candidate.__editor.name : '';
    const content = typeof candidate.props.children === 'string' ? candidate.props.children : '';
    const haystack = `${candidateName} ${content}`.toLowerCase();
    if (haystack.includes('validation') || haystack.includes('required')) {
      return candidateId;
    }
  }

  return null;
}

function summarizeElement(spec: DesignSpec, elementId: string): string {
  const element = spec.elements[elementId];
  if (!element) return 'Element no longer exists.';

  const label = element.__editor?.name ? `${element.type} "${element.__editor.name}"` : element.type;
  const propSummary = summarizeElementProps(element);
  const childSummary = summarizeChildElements(spec, element);

  return [label, propSummary, childSummary].filter(Boolean).join('; ');
}

function summarizeElementProps(element: Element): string {
  const parts: string[] = [];
  const children = asNonEmptyString(element.props.children);
  if (children) parts.push(`text="${truncate(children, 48)}"`);

  const placeholder = asNonEmptyString(element.props.placeholder);
  if (placeholder) parts.push(`placeholder="${truncate(placeholder, 48)}"`);

  const inputType = asNonEmptyString(element.props.type);
  if (inputType) parts.push(`inputType=${inputType}`);

  const variant = asNonEmptyString(element.props.variant);
  if (variant) parts.push(`variant=${variant}`);

  const htmlFor = asNonEmptyString(element.props.htmlFor);
  if (htmlFor) parts.push(`htmlFor=${htmlFor}`);

  if (element.props.required === true) parts.push('required=true');
  if (element.props.disabled === true) parts.push('disabled=true');
  if (element.props.checked === true) parts.push('checked=true');

  return parts.length > 0 ? `props: ${parts.join(', ')}` : '';
}

function summarizeChildElements(spec: DesignSpec, element: Element): string {
  if (element.children.length === 0) return '';

  const childSummary = element.children
    .slice(0, 3)
    .map((childId) => {
      const child = spec.elements[childId];
      if (!child) return null;

      const childName = asNonEmptyString(child.__editor?.name);
      const childText = asNonEmptyString(child.props.children);
      const childPlaceholder = asNonEmptyString(child.props.placeholder);

      if (childName) return `${child.type} "${truncate(childName, 32)}"`;
      if (childText) return `${child.type} "${truncate(childText, 32)}"`;
      if (childPlaceholder) return `${child.type} placeholder="${truncate(childPlaceholder, 32)}"`;
      return child.type;
    })
    .filter((value): value is string => Boolean(value));

  if (childSummary.length === 0) return '';
  const suffix = element.children.length > 3 ? ', …' : '';
  return `children: ${childSummary.join(', ')}${suffix}`;
}

function shortenElementId(elementId: string): string {
  return elementId.length <= 8 ? elementId : elementId.slice(0, 8);
}

function truncate(value: string, length: number): string {
  return value.length <= length ? value : `${value.slice(0, length - 1)}…`;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function escapeContextValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}

function unescapeContextValue(value: string): string {
  return value.replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
}

function isChatMode(value: string): value is EditorChatMode {
  return value === 'ask' || value === 'edit' || value === 'generate';
}

function isProviderKey(value: string): value is keyof CatalogBlockProviderSelection {
  return value === 'runtime' || value === 'ui' || value === 'validation';
}
