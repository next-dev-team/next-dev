import type { DesignSpec, Element } from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeElement(
  element: Pick<Element, 'type'> & Partial<Element>,
): Element {
  const normalized: Element = {
    type: element.type,
    props: isRecord(element.props) ? { ...element.props } : {},
    children: Array.isArray(element.children) ? [...element.children] : [],
  };

  if (element.__editor) {
    normalized.__editor = { ...element.__editor };
  }

  return normalized;
}

export function normalizeDesignSpec(spec: DesignSpec): DesignSpec {
  return {
    version: 1,
    root: spec.root,
    elements: Object.fromEntries(
      Object.entries(spec.elements ?? {}).map(([id, element]) => [id, normalizeElement(element)]),
    ) as Record<string, Element>,
    state: isRecord(spec.state) ? { ...spec.state } : {},
  };
}
