import type { DesignSpec, EditorMeta } from '@next-dev/editor-core';
import { describe, expect, it } from 'vitest';
import {
  applyJsonRenderPatches,
  compileJsonRenderSpecStream,
  fromJsonRenderSpec,
  toJsonRenderSpec,
  validateDesignSpecAgainstCatalog,
} from './json-render-interop.js';

const editorNodes: Record<string, EditorMeta> = {
  root: { name: 'Root' },
  title: { name: 'Title' },
};

function createDesignSpec(): DesignSpec {
  return {
    version: 1,
    root: 'root',
    elements: {
      root: {
        type: 'Stack',
        props: { direction: 'vertical' },
        children: ['title'],
        __editor: { name: 'Root' },
      },
      title: {
        type: 'Text',
        props: { children: 'Hello' },
        children: [],
        __editor: { name: 'Title' },
      },
    },
    state: {},
  };
}

describe('json-render interop', () => {
  it('strips editor metadata when converting to a json-render spec', () => {
    const spec = toJsonRenderSpec(createDesignSpec());

    expect(spec.root).toBe('root');
    expect(spec.elements.root).not.toHaveProperty('__editor');
    expect(spec.elements.title).not.toHaveProperty('__editor');
  });

  it('can restore a DesignForge spec from a json-render spec', () => {
    const restored = fromJsonRenderSpec(toJsonRenderSpec(createDesignSpec()), editorNodes);

    expect(restored.version).toBe(1);
    expect(restored.elements.root.__editor).toEqual({ name: 'Root' });
    expect(restored.elements.title.__editor).toEqual({ name: 'Title' });
  });

  it('applies json-render patches without dropping existing editor metadata', () => {
    const nextSpec = applyJsonRenderPatches(createDesignSpec(), [
      { op: 'replace', path: '/elements/title/props/children', value: 'Updated' },
      { op: 'add', path: '/state/form', value: { title: 'Updated' } },
    ]);

    expect(nextSpec.version).toBe(1);
    expect(nextSpec.elements.title.props.children).toBe('Updated');
    expect(nextSpec.elements.title.__editor).toEqual({ name: 'Title' });
    expect(nextSpec.state).toEqual({ form: { title: 'Updated' } });
  });

  it('compiles a streamed json-render spec into the DesignForge document shape', () => {
    const compiled = compileJsonRenderSpecStream(
      [
        '{"op":"add","path":"/root","value":"card"}',
        '{"op":"add","path":"/elements/card","value":{"type":"Card","props":{},"children":["text"]}}',
        '{"op":"add","path":"/elements/text","value":{"type":"Text","props":{"children":"Hello"},"children":[]}}',
      ].join('\n'),
    );

    expect(compiled.root).toBe('card');
    expect(compiled.elements.card.children).toEqual(['text']);
    expect(compiled.elements.text.props.children).toBe('Hello');
  });

  it('validates the current document shape against the active json-render catalog', () => {
    const result = validateDesignSpecAgainstCatalog(createDesignSpec());

    expect(result.success).toBe(true);
  });
});
