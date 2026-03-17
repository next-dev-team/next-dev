import { defineCommand } from 'citty';
import chalk from 'chalk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { Document, generateId, createEmptySpec } from '@next-dev/editor-core';
import type { DesignSpec, Element } from '@next-dev/editor-core';
import { catalog, catalogToPrompt, getCategorizedComponents } from '@next-dev/catalog';
import type { ComponentType } from '@next-dev/catalog';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a DesignSpec from a natural-language description using simple heuristics.
 */
function specFromDescription(description: string): DesignSpec {
  const desc = description.toLowerCase();
  const spec = createEmptySpec();
  const rootId = spec.root;

  function addElement(
    parentId: string,
    type: string,
    props: Record<string, unknown>,
    editorName?: string,
  ): string {
    const id = generateId();
    spec.elements[id] = {
      type,
      props,
      children: [],
      __editor: { name: editorName ?? type },
    };
    spec.elements[parentId].children.push(id);
    return id;
  }

  // ─── Pattern: login / signin form ──────────────────────────────────
  if (desc.includes('login') || desc.includes('sign in') || desc.includes('signin')) {
    spec.elements[rootId].__editor = { name: 'LoginForm' };

    // Email field
    const emailGroup = addElement(rootId, 'Stack', { direction: 'vertical', className: 'gap-1.5' }, 'EmailField');
    addElement(emailGroup, 'Label', { children: 'Email', htmlFor: 'email', className: null }, 'EmailLabel');
    addElement(emailGroup, 'Input', { placeholder: 'Enter your email', type: 'email', disabled: false, className: null }, 'EmailInput');

    // Password field
    const pwGroup = addElement(rootId, 'Stack', { direction: 'vertical', className: 'gap-1.5' }, 'PasswordField');
    addElement(pwGroup, 'Label', { children: 'Password', htmlFor: 'password', className: null }, 'PasswordLabel');
    addElement(pwGroup, 'Input', { placeholder: 'Enter your password', type: 'password', disabled: false, className: null }, 'PasswordInput');

    // Submit button
    addElement(rootId, 'Button', { children: 'Login', variant: 'default', size: 'default', disabled: false, className: null }, 'LoginButton');
  }

  // ─── Pattern: card ─────────────────────────────────────────────────
  else if (desc.includes('card')) {
    spec.elements[rootId].__editor = { name: 'CardLayout' };

    const card = addElement(rootId, 'Card', { className: null }, 'Card');
    const header = addElement(card, 'CardHeader', { className: null }, 'CardHeader');
    addElement(header, 'CardTitle', { children: 'Card Title', className: null }, 'CardTitle');
    addElement(header, 'CardDescription', { children: 'Card description text', className: null }, 'CardDescription');
    addElement(card, 'CardContent', { className: null }, 'CardContent');
  }

  // ─── Pattern: button ───────────────────────────────────────────────
  else if (desc.includes('button')) {
    spec.elements[rootId].__editor = { name: 'ButtonLayout' };
    addElement(rootId, 'Button', { children: 'Button', variant: 'default', size: 'default', disabled: false, className: null }, 'Button');
  }

  // ─── Pattern: dialog / modal ───────────────────────────────────────
  else if (desc.includes('dialog') || desc.includes('modal')) {
    spec.elements[rootId].__editor = { name: 'DialogLayout' };

    const dialog = addElement(rootId, 'Dialog', { open: false }, 'Dialog');
    const trigger = addElement(dialog, 'DialogTrigger', { asChild: true }, 'DialogTrigger');
    addElement(trigger, 'Button', { children: 'Open Dialog', variant: 'outline', size: 'default', disabled: false, className: null }, 'TriggerButton');

    const content = addElement(dialog, 'DialogContent', { className: null }, 'DialogContent');
    const dialogHeader = addElement(content, 'DialogHeader', { className: null }, 'DialogHeader');
    addElement(dialogHeader, 'DialogTitle', { children: 'Dialog Title', className: null }, 'DialogTitle');
    addElement(dialogHeader, 'DialogDescription', { children: 'Dialog description text', className: null }, 'DialogDescription');
    addElement(content, 'DialogFooter', { className: null }, 'DialogFooter');
  }

  // ─── Pattern: form (generic) ───────────────────────────────────────
  else if (desc.includes('form')) {
    spec.elements[rootId].__editor = { name: 'Form' };

    const fieldGroup = addElement(rootId, 'Stack', { direction: 'vertical', className: 'gap-1.5' }, 'Field');
    addElement(fieldGroup, 'Label', { children: 'Field', htmlFor: 'field', className: null }, 'FieldLabel');
    addElement(fieldGroup, 'Input', { placeholder: 'Enter text...', type: 'text', disabled: false, className: null }, 'FieldInput');

    addElement(rootId, 'Button', { children: 'Submit', variant: 'default', size: 'default', disabled: false, className: null }, 'SubmitButton');
  }

  // ─── Fallback: text elements ───────────────────────────────────────
  else {
    spec.elements[rootId].__editor = { name: 'Screen' };
    addElement(rootId, 'Text', { children: description, variant: 'h2', className: null }, 'Heading');
    addElement(rootId, 'Text', { children: 'Add your content here.', variant: 'p', className: null }, 'Body');
  }

  return spec;
}

/**
 * Count all elements in a spec (excluding root).
 */
function countElements(spec: DesignSpec): number {
  return Object.keys(spec.elements).length;
}

// ─── JSX Code Generation ────────────────────────────────────────────────────

/**
 * Map a component type to its import name from @next-dev/rn-uniwind.
 */
function collectImports(spec: DesignSpec): string[] {
  const types = new Set<string>();
  for (const el of Object.values(spec.elements)) {
    types.add(el.type);
  }
  return [...types].sort();
}

/**
 * Render a single element to JSX.
 */
function elementToJsx(spec: DesignSpec, elementId: string, indent: number): string {
  const el = spec.elements[elementId];
  if (!el) return '';

  const pad = '  '.repeat(indent);
  const type = el.type;

  // Build prop string
  const propParts: string[] = [];
  for (const [key, value] of Object.entries(el.props)) {
    if (key === 'children' || value === null || value === undefined) continue;
    if (typeof value === 'string') {
      propParts.push(`${key}="${value}"`);
    } else if (typeof value === 'boolean') {
      if (value) propParts.push(key);
      // skip false booleans that are default
    } else {
      propParts.push(`${key}={${JSON.stringify(value)}}`);
    }
  }

  const propsStr = propParts.length > 0 ? ` ${propParts.join(' ')}` : '';

  // Text-like children (rendered inline)
  const textContent =
    typeof el.props.children === 'string' ? el.props.children : null;

  // Element children
  const hasElementChildren = el.children.length > 0;

  if (hasElementChildren) {
    const childrenJsx = el.children
      .map((childId) => elementToJsx(spec, childId, indent + 1))
      .join('\n');
    return `${pad}<${type}${propsStr}>\n${childrenJsx}\n${pad}</${type}>`;
  } else if (textContent) {
    return `${pad}<${type}${propsStr}>${textContent}</${type}>`;
  } else {
    return `${pad}<${type}${propsStr} />`;
  }
}

/**
 * Generate a full TSX file from a DesignSpec.
 */
function specToTsx(spec: DesignSpec, componentName: string): string {
  const imports = collectImports(spec);
  const rootId = spec.root;
  const rootEl = spec.elements[rootId];

  // Render root children (skip the root Stack wrapper — we'll create our own View)
  const body = rootEl.children
    .map((childId) => elementToJsx(spec, childId, 2))
    .join('\n');

  const rootClassName = typeof rootEl.props.className === 'string' ? rootEl.props.className : 'flex-1 p-4 gap-4';

  const lines = [
    `import { View } from 'react-native';`,
    `import { ${imports.join(', ')} } from '@next-dev/rn-uniwind';`,
    '',
    `export function ${componentName}() {`,
    `  return (`,
    `    <View className="${rootClassName}">`,
    body,
    `    </View>`,
    `  );`,
    `}`,
    '',
  ];

  return lines.join('\n');
}

// ─── Tree Preview ───────────────────────────────────────────────────────────

function renderTree(
  spec: DesignSpec,
  elementId: string,
  prefix: string,
  isLast: boolean,
): string[] {
  const el = spec.elements[elementId];
  if (!el) return [];

  const connector = isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ';
  const name = el.__editor?.name ?? el.type;
  const childCount = el.children.length;

  // Summarize key props
  const keyProps: string[] = [];
  if (typeof el.props.children === 'string') keyProps.push(`"${el.props.children}"`);
  if (el.props.variant && el.props.variant !== 'default') keyProps.push(`variant=${el.props.variant}`);
  if (el.props.type && el.props.type !== 'text') keyProps.push(`type=${el.props.type}`);
  if (el.props.direction && el.props.direction !== 'vertical') keyProps.push(`direction=${el.props.direction}`);
  if (el.props.placeholder) keyProps.push(`placeholder="${el.props.placeholder}"`);

  const propsStr = keyProps.length > 0 ? chalk.dim(` (${keyProps.join(', ')})`) : '';
  const childStr = childCount > 0 ? chalk.dim(` [${childCount} children]`) : '';
  const typeBadge = chalk.cyan(el.type);

  const line = `${prefix}${connector}${chalk.bold(name)} ${typeBadge}${propsStr}${childStr}`;
  const lines: string[] = [line];

  const childPrefix = prefix + (isLast ? '    ' : '\u2502   ');
  for (let i = 0; i < el.children.length; i++) {
    const childLines = renderTree(spec, el.children[i], childPrefix, i === el.children.length - 1);
    lines.push(...childLines);
  }

  return lines;
}

// ─── Subcommands ────────────────────────────────────────────────────────────

const generateCmd = defineCommand({
  meta: {
    name: 'generate',
    description: 'Generate a .dfg design spec from a text description',
  },
  args: {
    description: {
      type: 'positional',
      description: 'Design description (e.g. "login form with email and password")',
      required: true,
    },
    output: {
      type: 'string',
      alias: 'o',
      description: 'Output file path',
      default: 'design.dfg',
    },
  },
  async run({ args }) {
    const description = String(args.description);
    const output = String(args.output);

    console.log(chalk.bold('\nDesignForge Generate'));
    console.log(chalk.dim(`  Description: "${description}"`));
    console.log(chalk.dim(`  Output:      ${output}\n`));

    const spec = specFromDescription(description);
    const doc = new Document({ spec });
    const json = doc.toJSON();

    // Ensure output directory exists
    const dir = path.dirname(path.resolve(output));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(path.resolve(output), json, 'utf-8');

    const elCount = countElements(spec);
    console.log(chalk.green(`  Created ${output} with ${elCount} elements.`));
    console.log(chalk.dim(`  Preview with: agent-cli design preview ${output}\n`));
  },
});

const exportCmd = defineCommand({
  meta: {
    name: 'export',
    description: 'Export a .dfg file to TSX component code',
  },
  args: {
    file: {
      type: 'positional',
      description: 'Path to .dfg file',
      required: true,
    },
    output: {
      type: 'string',
      alias: 'o',
      description: 'Output directory',
      default: './export',
    },
  },
  async run({ args }) {
    const filePath = path.resolve(String(args.file));
    const outputDir = path.resolve(String(args.output));

    console.log(chalk.bold('\nDesignForge Export'));
    console.log(chalk.dim(`  Input:  ${filePath}`));
    console.log(chalk.dim(`  Output: ${outputDir}\n`));

    if (!existsSync(filePath)) {
      console.error(chalk.red(`  Error: File not found: ${filePath}\n`));
      process.exit(1);
    }

    const json = readFileSync(filePath, 'utf-8');
    const doc = Document.fromJSON(json);
    const cleanSpec = doc.toExportSpec();

    // Derive component name from filename
    const baseName = path.basename(filePath, path.extname(filePath));
    const componentName =
      baseName
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('') || 'Screen';

    // Generate TSX
    const tsx = specToTsx(cleanSpec, componentName);

    // Write files
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const componentFile = path.join(outputDir, `${componentName}.tsx`);
    writeFileSync(componentFile, tsx, 'utf-8');

    const indexFile = path.join(outputDir, 'index.ts');
    writeFileSync(indexFile, `export { ${componentName} } from './${componentName}';\n`, 'utf-8');

    console.log(chalk.green(`  Exported ${componentName}.tsx`));
    console.log(chalk.green(`  Exported index.ts`));
    console.log(chalk.dim(`\n  Output directory: ${outputDir}\n`));
  },
});

const listCmd = defineCommand({
  meta: {
    name: 'list',
    description: 'List all available components from the catalog',
  },
  args: {
    verbose: {
      type: 'boolean',
      alias: 'v',
      description: 'Show detailed component info with props',
      default: false,
    },
  },
  async run({ args }) {
    const verbose = Boolean(args.verbose);

    if (verbose) {
      console.log('\n' + catalogToPrompt());
      return;
    }

    console.log(chalk.bold('\nDesignForge Component Catalog\n'));

    const categorized = getCategorizedComponents();

    for (const [category, components] of Object.entries(categorized)) {
      if (components.length === 0) continue;

      const title = category.charAt(0).toUpperCase() + category.slice(1);
      console.log(chalk.bold.underline(title));

      for (const [type, entry] of components) {
        const children = entry.acceptsChildren ? chalk.dim(' (container)') : '';
        console.log(`  ${chalk.cyan(type)}${children} — ${chalk.dim(entry.description)}`);
      }
      console.log();
    }
  },
});

const previewCmd = defineCommand({
  meta: {
    name: 'preview',
    description: 'Preview a .dfg file as a formatted tree in the terminal',
  },
  args: {
    file: {
      type: 'positional',
      description: 'Path to .dfg file',
      required: true,
    },
  },
  async run({ args }) {
    const filePath = path.resolve(String(args.file));

    if (!existsSync(filePath)) {
      console.error(chalk.red(`\n  Error: File not found: ${filePath}\n`));
      process.exit(1);
    }

    const json = readFileSync(filePath, 'utf-8');
    const doc = Document.fromJSON(json);
    const spec = doc.spec;
    const elCount = countElements(spec);

    console.log(chalk.bold(`\nDesignForge Preview — ${path.basename(filePath)}`));
    console.log(chalk.dim(`  ${elCount} elements\n`));

    const treeLines = renderTree(spec, spec.root, '', true);
    for (const line of treeLines) {
      console.log(line);
    }
    console.log();
  },
});

// ─── Parent Command ─────────────────────────────────────────────────────────

export default defineCommand({
  meta: {
    name: 'design',
    description: 'Design operations — generate, export, list, preview',
  },
  subCommands: {
    generate: () => generateCmd,
    export: () => exportCmd,
    list: () => listCmd,
    preview: () => previewCmd,
  },
});
