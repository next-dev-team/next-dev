import { describe, it, expect, beforeEach } from 'vitest';
import { Document } from './document.js';
import {
  createEmptySpec,
  addElement,
  removeElement,
  moveElement,
  updateProps,
  groupElements,
  ungroupElement,
  duplicateElement,
  findParent,
  stripEditorMeta,
} from './operations.js';
import { History } from './history.js';
import { Selection } from './selection.js';
import { applyPatch } from 'fast-json-patch';

// ─── Operations Tests ───────────────────────────────────────────────────────

describe('createEmptySpec', () => {
  it('creates a spec with a root Stack element', () => {
    const spec = createEmptySpec();
    expect(spec.version).toBe(1);
    expect(spec.root).toBeTruthy();
    expect(spec.elements[spec.root]).toBeDefined();
    expect(spec.elements[spec.root].type).toBe('Stack');
    expect(spec.elements[spec.root].children).toEqual([]);
  });
});

describe('addElement', () => {
  it('adds an element to a parent', () => {
    const spec = createEmptySpec();
    const [forward, reverse] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'Click me' },
    });

    expect(forward.length).toBeGreaterThan(0);
    expect(reverse.length).toBeGreaterThan(0);

    // Apply forward patches
    const result = applyPatch(spec, forward, false, true);
    const newSpec = result.newDocument;

    // Should have 2 elements now
    expect(Object.keys(newSpec.elements).length).toBe(2);

    // Root should have 1 child
    expect(newSpec.elements[spec.root].children.length).toBe(1);
  });

  it('adds at a specific index', () => {
    let spec = createEmptySpec();

    // Add first element
    const [f1] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'First' },
    });
    spec = applyPatch(spec, f1, false, true).newDocument;

    // Add second element at index 0
    const [f2] = addElement(spec, spec.root, {
      type: 'Text',
      props: { children: 'Second' },
    }, 0);
    spec = applyPatch(spec, f2, false, true).newDocument;

    // The Text should be first
    const firstChildId = spec.elements[spec.root].children[0];
    expect(spec.elements[firstChildId].type).toBe('Text');
  });

  it('throws on invalid parent', () => {
    const spec = createEmptySpec();
    expect(() =>
      addElement(spec, 'nonexistent', {
        type: 'Button',
        props: {},
      }),
    ).toThrow('not found');
  });
});

describe('removeElement', () => {
  it('removes an element and updates parent', () => {
    let spec = createEmptySpec();

    // Add an element
    const [f1] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'Delete me' },
    });
    spec = applyPatch(spec, f1, false, true).newDocument;

    const childId = spec.elements[spec.root].children[0];
    const [forward] = removeElement(spec, childId);
    spec = applyPatch(spec, forward, false, true).newDocument;

    // Should be back to just the root
    expect(Object.keys(spec.elements).length).toBe(1);
    expect(spec.elements[spec.root].children.length).toBe(0);
  });

  it('removes descendants recursively', () => {
    let spec = createEmptySpec();

    // Add a parent element
    const [f1] = addElement(spec, spec.root, {
      type: 'Card',
      props: {},
      children: [],
    });
    spec = applyPatch(spec, f1, false, true).newDocument;
    const cardId = spec.elements[spec.root].children[0];

    // Add a child to the card
    const [f2] = addElement(spec, cardId, {
      type: 'Button',
      props: { children: 'Nested' },
    });
    spec = applyPatch(spec, f2, false, true).newDocument;

    // Remove the card — should also remove the button
    const [forward] = removeElement(spec, cardId);
    spec = applyPatch(spec, forward, false, true).newDocument;

    expect(Object.keys(spec.elements).length).toBe(1);
  });

  it('throws when trying to remove root', () => {
    const spec = createEmptySpec();
    expect(() => removeElement(spec, spec.root)).toThrow('root');
  });
});

describe('moveElement', () => {
  it('moves an element to a new parent', () => {
    let spec = createEmptySpec();

    // Add two containers
    const [f1] = addElement(spec, spec.root, { type: 'Stack', props: {} });
    spec = applyPatch(spec, f1, false, true).newDocument;
    const [f2] = addElement(spec, spec.root, { type: 'Stack', props: {} });
    spec = applyPatch(spec, f2, false, true).newDocument;

    const stack1 = spec.elements[spec.root].children[0];
    const stack2 = spec.elements[spec.root].children[1];

    // Add a button to stack1
    const [f3] = addElement(spec, stack1, {
      type: 'Button',
      props: { children: 'Move me' },
    });
    spec = applyPatch(spec, f3, false, true).newDocument;

    const buttonId = spec.elements[stack1].children[0];

    // Move button from stack1 to stack2
    const [forward] = moveElement(spec, buttonId, stack2, 0);
    spec = applyPatch(spec, forward, false, true).newDocument;

    expect(spec.elements[stack1].children.length).toBe(0);
    expect(spec.elements[stack2].children.length).toBe(1);
    expect(spec.elements[stack2].children[0]).toBe(buttonId);
  });

  it('prevents moving into own descendant', () => {
    let spec = createEmptySpec();

    const [f1] = addElement(spec, spec.root, { type: 'Stack', props: {} });
    spec = applyPatch(spec, f1, false, true).newDocument;
    const parentId = spec.elements[spec.root].children[0];

    const [f2] = addElement(spec, parentId, { type: 'Stack', props: {} });
    spec = applyPatch(spec, f2, false, true).newDocument;
    const childId = spec.elements[parentId].children[0];

    expect(() => moveElement(spec, parentId, childId, 0)).toThrow('descendant');
  });
});

describe('updateProps', () => {
  it('merges props shallowly', () => {
    let spec = createEmptySpec();

    const [f1] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'Hello', variant: 'default' },
    });
    spec = applyPatch(spec, f1, false, true).newDocument;

    const buttonId = spec.elements[spec.root].children[0];
    const [forward] = updateProps(spec, buttonId, { variant: 'destructive' });
    spec = applyPatch(spec, forward, false, true).newDocument;

    expect(spec.elements[buttonId].props.variant).toBe('destructive');
    expect(spec.elements[buttonId].props.children).toBe('Hello'); // Unchanged
  });
});

describe('groupElements', () => {
  it('wraps elements in a Stack', () => {
    let spec = createEmptySpec();

    // Add two elements
    const [f1] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'A' },
    });
    spec = applyPatch(spec, f1, false, true).newDocument;

    const [f2] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'B' },
    });
    spec = applyPatch(spec, f2, false, true).newDocument;

    const [id1, id2] = spec.elements[spec.root].children;

    const [forward] = groupElements(spec, [id1, id2]);
    spec = applyPatch(spec, forward, false, true).newDocument;

    // Root should now have 1 child (the group)
    expect(spec.elements[spec.root].children.length).toBe(1);

    const groupId = spec.elements[spec.root].children[0];
    expect(spec.elements[groupId].type).toBe('Stack');
    expect(spec.elements[groupId].children).toContain(id1);
    expect(spec.elements[groupId].children).toContain(id2);
  });
});

describe('ungroupElement', () => {
  it('promotes children to parent', () => {
    let spec = createEmptySpec();

    // Add two elements, then group them
    const [f1] = addElement(spec, spec.root, { type: 'Button', props: { children: 'A' } });
    spec = applyPatch(spec, f1, false, true).newDocument;
    const [f2] = addElement(spec, spec.root, { type: 'Button', props: { children: 'B' } });
    spec = applyPatch(spec, f2, false, true).newDocument;

    const [id1, id2] = spec.elements[spec.root].children;
    const [gf] = groupElements(spec, [id1, id2]);
    spec = applyPatch(spec, gf, false, true).newDocument;

    const groupId = spec.elements[spec.root].children[0];

    // Ungroup
    const [forward] = ungroupElement(spec, groupId);
    spec = applyPatch(spec, forward, false, true).newDocument;

    // Group should be gone, children should be in root
    expect(spec.elements[groupId]).toBeUndefined();
    expect(spec.elements[spec.root].children).toContain(id1);
    expect(spec.elements[spec.root].children).toContain(id2);
  });
});

describe('duplicateElement', () => {
  it('creates a copy with new IDs', () => {
    let spec = createEmptySpec();

    const [f1] = addElement(spec, spec.root, {
      type: 'Button',
      props: { children: 'Original' },
    });
    spec = applyPatch(spec, f1, false, true).newDocument;

    const originalId = spec.elements[spec.root].children[0];
    const [forward] = duplicateElement(spec, originalId);
    spec = applyPatch(spec, forward, false, true).newDocument;

    // Should have original + duplicate
    expect(spec.elements[spec.root].children.length).toBe(2);

    const dupeId = spec.elements[spec.root].children[1];
    expect(dupeId).not.toBe(originalId);
    expect(spec.elements[dupeId].type).toBe('Button');
    expect(spec.elements[dupeId].props.children).toBe('Original');
  });
});

describe('findParent', () => {
  it('finds the parent of an element', () => {
    let spec = createEmptySpec();

    const [f1] = addElement(spec, spec.root, { type: 'Button', props: {} });
    spec = applyPatch(spec, f1, false, true).newDocument;

    const childId = spec.elements[spec.root].children[0];
    const parent = findParent(spec, childId);
    expect(parent?.parentId).toBe(spec.root);
    expect(parent?.index).toBe(0);
  });
});

describe('stripEditorMeta', () => {
  it('removes __editor from all elements', () => {
    let spec = createEmptySpec();
    const stripped = stripEditorMeta(spec);

    for (const element of Object.values(stripped.elements)) {
      expect(element.__editor).toBeUndefined();
    }
  });
});

// ─── History Tests ──────────────────────────────────────────────────────────

describe('History', () => {
  let history: History;

  beforeEach(() => {
    history = new History();
  });

  it('starts empty', () => {
    expect(history.canUndo).toBe(false);
    expect(history.canRedo).toBe(false);
  });

  it('push enables undo', () => {
    history.push(
      [{ op: 'add', path: '/x', value: 1 }],
      [{ op: 'remove', path: '/x' }],
      'Add x',
    );
    expect(history.canUndo).toBe(true);
    expect(history.undoLabel).toBe('Add x');
  });

  it('undo returns reverse patches', () => {
    const reverse = [{ op: 'remove' as const, path: '/x' }];
    history.push(
      [{ op: 'add', path: '/x', value: 1 }],
      reverse,
      'Add x',
    );

    const patches = history.undo();
    expect(patches).toEqual(reverse);
    expect(history.canUndo).toBe(false);
    expect(history.canRedo).toBe(true);
  });

  it('redo returns forward patches', () => {
    const forward = [{ op: 'add' as const, path: '/x', value: 1 }];
    history.push(forward, [{ op: 'remove', path: '/x' }], 'Add x');
    history.undo();

    const patches = history.redo();
    expect(patches).toEqual(forward);
  });

  it('push clears redo stack', () => {
    history.push([{ op: 'add', path: '/x', value: 1 }], [{ op: 'remove', path: '/x' }], 'A');
    history.undo();
    expect(history.canRedo).toBe(true);

    history.push([{ op: 'add', path: '/y', value: 2 }], [{ op: 'remove', path: '/y' }], 'B');
    expect(history.canRedo).toBe(false);
  });

  it('respects max size', () => {
    const h = new History({ maxSize: 3 });
    for (let i = 0; i < 5; i++) {
      h.push([{ op: 'add', path: `/${i}`, value: i }], [{ op: 'remove', path: `/${i}` }], `Step ${i}`);
    }
    expect(h.undoCount).toBe(3);
  });

  it('skips empty patches', () => {
    history.push([], [], 'Noop');
    expect(history.canUndo).toBe(false);
  });
});

// ─── Selection Tests ────────────────────────────────────────────────────────

describe('Selection', () => {
  let selection: Selection;

  beforeEach(() => {
    selection = new Selection();
  });

  it('starts empty', () => {
    expect(selection.count).toBe(0);
    expect(selection.hoveredId).toBeNull();
  });

  it('select replaces selection', () => {
    selection.select('a');
    selection.select('b');
    expect(selection.count).toBe(1);
    expect(selection.isSelected('b')).toBe(true);
    expect(selection.isSelected('a')).toBe(false);
  });

  it('multi-select toggles', () => {
    selection.select('a');
    selection.select('b', true);
    expect(selection.count).toBe(2);

    selection.select('a', true); // Deselect a
    expect(selection.count).toBe(1);
    expect(selection.isSelected('b')).toBe(true);
  });

  it('selectAll replaces all', () => {
    selection.select('a');
    selection.selectAll(['x', 'y', 'z']);
    expect(selection.count).toBe(3);
    expect(selection.isSelected('a')).toBe(false);
  });

  it('clear empties selection', () => {
    selection.select('a');
    selection.clear();
    expect(selection.count).toBe(0);
  });

  it('hover tracks hovered id', () => {
    selection.hover('a');
    expect(selection.hoveredId).toBe('a');
    selection.hover(null);
    expect(selection.hoveredId).toBeNull();
  });

  it('prune removes non-existent ids', () => {
    selection.select('a');
    selection.select('b', true);
    selection.hover('c');

    selection.prune(new Set(['a']));
    expect(selection.isSelected('b')).toBe(false);
    expect(selection.hoveredId).toBeNull();
  });

  it('onChange notifies listeners', () => {
    let callCount = 0;
    selection.onChange(() => { callCount++; });
    selection.select('a');
    expect(callCount).toBe(1);
  });
});

// ─── Document Tests ─────────────────────────────────────────────────────────

describe('Document', () => {
  let doc: Document;

  beforeEach(() => {
    doc = new Document();
  });

  it('creates with empty spec', () => {
    expect(doc.spec.root).toBeTruthy();
    expect(Object.keys(doc.spec.elements).length).toBe(1);
  });

  it('add creates an element', () => {
    doc.add(doc.rootId, { type: 'Button', props: { children: 'Hi' } });
    expect(Object.keys(doc.spec.elements).length).toBe(2);
  });

  it('undo reverses add', () => {
    doc.add(doc.rootId, { type: 'Button', props: { children: 'Hi' } });
    doc.undo();
    expect(Object.keys(doc.spec.elements).length).toBe(1);
  });

  it('redo reapplies add', () => {
    doc.add(doc.rootId, { type: 'Button', props: { children: 'Hi' } });
    doc.undo();
    doc.redo();
    expect(Object.keys(doc.spec.elements).length).toBe(2);
  });

  it('remove deletes element', () => {
    doc.add(doc.rootId, { type: 'Button', props: { children: 'Hi' } });
    const childId = doc.spec.elements[doc.rootId].children[0];
    doc.remove(childId);
    expect(Object.keys(doc.spec.elements).length).toBe(1);
  });

  it('setProps updates element props', () => {
    doc.add(doc.rootId, {
      type: 'Button',
      props: { children: 'Hello', variant: 'default' },
    });
    const childId = doc.spec.elements[doc.rootId].children[0];
    doc.setProps(childId, { variant: 'destructive' });
    expect(doc.spec.elements[childId].props.variant).toBe('destructive');
  });

  it('toFile creates a valid .dfg structure', () => {
    const file = doc.toFile();
    expect(file.version).toBe(1);
    expect(file.catalog).toBe('rnr-uniwind-v1');
    expect(file.spec).toBeDefined();
    expect(file.editor).toBeDefined();
  });

  it('fromJSON roundtrips', () => {
    doc.add(doc.rootId, { type: 'Button', props: { children: 'Hi' } });
    const json = doc.toJSON();
    const restored = Document.fromJSON(json);
    expect(Object.keys(restored.spec.elements).length).toBe(2);
  });

  it('onChange notifies on mutations', () => {
    let callCount = 0;
    doc.onChange(() => { callCount++; });
    doc.add(doc.rootId, { type: 'Button', props: {} });
    expect(callCount).toBeGreaterThan(0);
  });

  it('toExportSpec strips editor metadata', () => {
    doc.add(doc.rootId, {
      type: 'Button',
      props: { children: 'Hi' },
      __editor: { name: 'My Button' },
    } as never);
    const exported = doc.toExportSpec();
    for (const element of Object.values(exported.elements)) {
      expect(element.__editor).toBeUndefined();
    }
  });
});
