import { describe, expect, it } from 'vitest';
import type { DesignSpec } from '@next-dev/editor-core';
import { generateReactViteProject } from './code-export.js';

describe('generateReactViteProject', () => {
  it('exports a standalone React project and prunes hidden nodes', () => {
    const spec: DesignSpec = {
      version: 1,
      root: 'root',
      state: {
        todos: [{ title: 'Ship export code' }],
      },
      elements: {
        root: {
          type: 'Stack',
          props: { direction: 'vertical' },
          children: ['card', 'unsupported', 'hidden'],
        },
        card: {
          type: 'Card',
          props: {},
          children: ['title', 'button'],
        },
        title: {
          type: 'Text',
          props: { variant: 'h2', children: 'Todo Flow' },
          children: [],
        },
        button: {
          type: 'Button',
          props: { variant: 'default', children: 'Add task' },
          children: [],
        },
        unsupported: {
          type: 'Accordion',
          props: {},
          children: [],
        },
        hidden: {
          type: 'Text',
          props: { children: 'Do not export me' },
          children: [],
          __editor: { hidden: true },
        },
      },
    };

    const project = generateReactViteProject(spec, { projectName: 'Todo Flow' });

    expect(project.framework).toBe('react-vite');
    expect(project.packageName).toBe('todo-flow');
    expect(project.componentTypes).toEqual(expect.arrayContaining(['Accordion', 'Button', 'Card', 'Stack', 'Text']));
    expect(project.unsupportedComponents).toEqual(['Accordion']);

    const appFile = project.files.find((file) => file.path === 'src/App.tsx');
    const specFile = project.files.find((file) => file.path === 'src/design-spec.ts');
    const readmeFile = project.files.find((file) => file.path === 'README.md');

    expect(appFile?.content).toContain("case 'Button'");
    expect(appFile?.content).toContain('Component exported as a placeholder.');
    expect(specFile?.content).not.toContain('Do not export me');
    expect(specFile?.content).not.toContain('"hidden"');
    expect(readmeFile?.content).toContain('Unsupported Components');
    expect(readmeFile?.content).toContain('`Accordion`');
    expect(readmeFile?.content).toContain('Root JSX preview');
  });
});
