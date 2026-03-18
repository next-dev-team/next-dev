import { describe, expect, it } from 'vitest';
import { Document } from './document.js';
import {
  inflateLegacyDesignFile,
  isDesignFileV2,
  migrateLegacyDesignFile,
} from './design-file.js';

describe('design file v2 migration', () => {
  it('migrates a legacy DesignFile into the v2 wrapper', () => {
    const doc = new Document();
    const legacy = doc.toFile();

    const migrated = migrateLegacyDesignFile(legacy);

    expect(isDesignFileV2(migrated)).toBe(true);
    expect(migrated.version).toBe(2);
    expect(migrated.catalogId).toBe('rnr-uniwind');
    expect(migrated.runtimeId).toBe('react-native');
    expect(migrated.document.spec.root).toBe(legacy.spec.root);
    expect(migrated.document.spec.state).toEqual(legacy.spec.state);
    expect(migrated.document.spec.elements[legacy.spec.root]).not.toHaveProperty('__editor');
    expect(migrated.editor.nodes[legacy.spec.root]).toMatchObject({
      name: 'Page',
    });
  });

  it('inflates a v2 file back into the current legacy document model', () => {
    const doc = new Document();
    const migrated = doc.toFileV2();

    const inflated = inflateLegacyDesignFile(migrated);

    expect(inflated.version).toBe(1);
    expect(inflated.catalog).toBe('rnr-uniwind-v1');
    expect(inflated.spec.version).toBe(1);
    expect(inflated.spec.elements[inflated.spec.root].__editor).toMatchObject({
      name: 'Page',
    });
  });

  it('parses both legacy and v2 JSON through Document.fromJSON', () => {
    const doc = new Document();
    const v1 = doc.toJSON();
    const v2 = doc.toJSONV2();

    const restoredV1 = Document.fromJSON(v1);
    const restoredV2 = Document.fromJSON(v2);

    expect(restoredV1.spec.root).toBe(doc.spec.root);
    expect(restoredV2.spec.root).toBe(doc.spec.root);
  });

  it('normalizes missing children arrays when loading legacy JSON', () => {
    const doc = Document.fromJSON(JSON.stringify({
      version: 1,
      catalog: 'rnr-uniwind-v1',
      target: ['web', 'ios', 'android'],
      spec: {
        version: 1,
        root: 'root',
        elements: {
          root: {
            type: 'Stack',
            props: {},
            children: ['leaf'],
          },
          leaf: {
            type: 'Text',
            props: { children: 'Hello' },
          },
        },
        state: {},
      },
      editor: {
        zoom: 1,
        pan: [0, 0],
        selection: [],
        expandedLayers: [],
      },
    }));

    expect(doc.spec.elements.leaf.children).toEqual([]);
  });

  it('inflates v2 files even when leaf nodes omit children', () => {
    const inflated = inflateLegacyDesignFile({
      version: 2,
      catalogId: 'rnr-uniwind',
      runtimeId: 'react-native',
      platforms: ['web', 'ios', 'android'],
      document: {
        spec: {
          root: 'root',
          elements: {
            root: {
              type: 'Stack',
              props: {},
              children: ['leaf'],
            },
            leaf: {
              type: 'Text',
              props: { children: 'Hello' },
            } as never,
          },
          state: {},
        },
      },
      editor: {
        zoom: 1,
        pan: [0, 0],
        selection: [],
        expandedLayers: [],
        nodes: {},
      },
    });

    expect(inflated.spec.elements.leaf.children).toEqual([]);
  });
});
