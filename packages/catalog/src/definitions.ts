/**
 * Component Definitions — Zod schemas + editor metadata for each component
 *
 * These schemas serve double duty:
 * 1. The props panel auto-generates form fields from them
 * 2. AI agents use them to know what props are valid
 *
 * One source of truth for both visual editing and AI generation.
 */

import type { ComponentCategory, ComponentMeta } from '@next-dev/editor-core';
import { z } from 'zod';

// ─── Component Schemas ──────────────────────────────────────────────────────

/**
 * Zod schemas for each component's props.
 * These are used for:
 * - Prop panel form generation
 * - AI input validation
 * - Catalog documentation
 */
export const componentSchemas = {
  // ─── Layout ─────────────────────────────────────────────────────────

  Stack: z.object({
    direction: z.enum(['horizontal', 'vertical']).default('vertical'),
    className: z.string().nullable().default(null),
  }),

  // ─── Input ──────────────────────────────────────────────────────────

  Button: z.object({
    variant: z
      .enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'])
      .default('default'),
    size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
    children: z.string().default('Button'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  // ─── Display ────────────────────────────────────────────────────────

  Text: z.object({
    children: z.string().default('Text'),
    variant: z
      .enum(['default', 'h1', 'h2', 'h3', 'h4', 'p', 'blockquote', 'code', 'lead', 'large', 'small', 'muted'])
      .default('default'),
    className: z.string().nullable().default(null),
  }),

  Card: z.object({
    className: z.string().nullable().default(null),
  }),

  CardHeader: z.object({
    className: z.string().nullable().default(null),
  }),

  CardTitle: z.object({
    children: z.string().default('Card Title'),
    className: z.string().nullable().default(null),
  }),

  CardDescription: z.object({
    children: z.string().default('Card description text'),
    className: z.string().nullable().default(null),
  }),

  CardContent: z.object({
    className: z.string().nullable().default(null),
  }),

  CardFooter: z.object({
    className: z.string().nullable().default(null),
  }),

  Badge: z.object({
    variant: z.enum(['default', 'secondary', 'destructive', 'outline']).default('default'),
    children: z.string().default('Badge'),
    className: z.string().nullable().default(null),
  }),

  // ─── Overlay ────────────────────────────────────────────────────────

  Dialog: z.object({
    open: z.boolean().default(false),
  }),

  DialogTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  DialogContent: z.object({
    className: z.string().nullable().default(null),
  }),

  DialogHeader: z.object({
    className: z.string().nullable().default(null),
  }),

  DialogTitle: z.object({
    children: z.string().default('Dialog Title'),
    className: z.string().nullable().default(null),
  }),

  DialogDescription: z.object({
    children: z.string().default('Dialog description text'),
    className: z.string().nullable().default(null),
  }),

  DialogFooter: z.object({
    className: z.string().nullable().default(null),
  }),

  Popover: z.object({
    open: z.boolean().default(false),
  }),

  PopoverTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  PopoverContent: z.object({
    side: z.enum(['top', 'right', 'bottom', 'left']).default('bottom'),
    align: z.enum(['start', 'center', 'end']).default('center'),
    className: z.string().nullable().default(null),
  }),

  Tooltip: z.object({
    open: z.boolean().default(false),
  }),

  TooltipTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  TooltipContent: z.object({
    side: z.enum(['top', 'right', 'bottom', 'left']).default('top'),
    children: z.string().default('Helpful hint'),
    className: z.string().nullable().default(null),
  }),

  // ─── Input ──────────────────────────────────────────────────────────

  Input: z.object({
    placeholder: z.string().default('Enter text...'),
    type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).default('text'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  Label: z.object({
    children: z.string().default('Label'),
    htmlFor: z.string().nullable().default(null),
    className: z.string().nullable().default(null),
  }),

  Checkbox: z.object({
    checked: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  Switch: z.object({
    checked: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  Textarea: z.object({
    placeholder: z.string().default('Write here...'),
    disabled: z.boolean().default(false),
    numberOfLines: z.number().default(4),
    className: z.string().nullable().default(null),
  }),

  Select: z.object({
    value: z.string().nullable().default(null),
    className: z.string().nullable().default(null),
  }),

  SelectTrigger: z.object({
    size: z.enum(['default', 'sm']).default('default'),
    className: z.string().nullable().default(null),
  }),

  SelectValue: z.object({
    placeholder: z.string().default('Select an option'),
    className: z.string().nullable().default(null),
  }),

  SelectContent: z.object({
    className: z.string().nullable().default(null),
  }),

  SelectGroup: z.object({
    className: z.string().nullable().default(null),
  }),

  SelectLabel: z.object({
    children: z.string().default('Options'),
    className: z.string().nullable().default(null),
  }),

  SelectItem: z.object({
    value: z.string().default('option-1'),
    label: z.string().default('Option'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  SelectSeparator: z.object({
    className: z.string().nullable().default(null),
  }),

  // ─── Navigation ─────────────────────────────────────────────────────

  Tabs: z.object({
    defaultValue: z.string().default('tab-1'),
    className: z.string().nullable().default(null),
  }),

  TabsList: z.object({
    className: z.string().nullable().default(null),
  }),

  TabsTrigger: z.object({
    value: z.string().default('tab-1'),
    children: z.string().default('Tab 1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  TabsContent: z.object({
    value: z.string().default('tab-1'),
    className: z.string().nullable().default(null),
  }),

  // ─── Feedback ───────────────────────────────────────────────────────

  Separator: z.object({
    orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
    className: z.string().nullable().default(null),
  }),
} as const;

/** Type-safe component name union */
export type ComponentType = keyof typeof componentSchemas;

// ─── Editor Metadata ────────────────────────────────────────────────────────

/** Full catalog entry: schema + editor metadata */
export interface CatalogEntry {
  /** Zod schema for the component's props */
  schema: z.ZodObject<z.ZodRawShape>;
  /** Editor metadata (icon, category, defaults) */
  meta: ComponentMeta;
  /** Whether this component can contain children */
  acceptsChildren: boolean;
  /** Human-readable description for AI context */
  description: string;
}

/**
 * Build the default props from a Zod schema.
 * Extracts .default() values from each field.
 */
function defaultsFromSchema(schema: z.ZodObject<z.ZodRawShape>): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const shape = schema.shape;
  for (const [key, field] of Object.entries(shape)) {
    if (field instanceof z.ZodDefault) {
      defaults[key] = field._def.defaultValue();
    }
  }
  return defaults;
}

/** The complete component catalog with schemas and editor metadata */
export const catalog: Record<ComponentType, CatalogEntry> = {
  // ─── Layout ─────────────────────────────────────────────────────────

  Stack: {
    schema: componentSchemas.Stack,
    description: 'Flex container — vertical or horizontal stack of children',
    acceptsChildren: true,
    meta: {
      icon: 'Layers',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Stack),
      description: 'Flex container — vertical or horizontal stack of children',
    },
  },

  // ─── Input ──────────────────────────────────────────────────────────

  Button: {
    schema: componentSchemas.Button,
    description: 'Pressable button with variant and size options',
    acceptsChildren: false,
    meta: {
      icon: 'MousePointerClick',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Button),
      description: 'Pressable button with variant and size options',
    },
  },

  Input: {
    schema: componentSchemas.Input,
    description: 'Text input field with type and placeholder',
    acceptsChildren: false,
    meta: {
      icon: 'TextCursorInput',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Input),
      description: 'Text input field with type and placeholder',
    },
  },

  Label: {
    schema: componentSchemas.Label,
    description: 'Form label for inputs',
    acceptsChildren: false,
    meta: {
      icon: 'Tag',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Label),
      description: 'Form label for inputs',
    },
  },

  Checkbox: {
    schema: componentSchemas.Checkbox,
    description: 'Checkbox input with checked and disabled states',
    acceptsChildren: false,
    meta: {
      icon: 'CheckSquare',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Checkbox),
      description: 'Checkbox input with checked and disabled states',
    },
  },

  Switch: {
    schema: componentSchemas.Switch,
    description: 'Toggle switch control',
    acceptsChildren: false,
    meta: {
      icon: 'ToggleLeft',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Switch),
      description: 'Toggle switch control',
    },
  },

  Textarea: {
    schema: componentSchemas.Textarea,
    description: 'Multi-line text input area',
    acceptsChildren: false,
    meta: {
      icon: 'FileText',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Textarea),
      description: 'Multi-line text input area',
    },
  },

  Select: {
    schema: componentSchemas.Select,
    description: 'Select root that groups the trigger, value, and menu content',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronsUpDown',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Select),
      description: 'Select root that groups the trigger, value, and menu content',
    },
  },

  SelectTrigger: {
    schema: componentSchemas.SelectTrigger,
    description: 'Button that opens the select menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronDown',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.SelectTrigger),
      description: 'Button that opens the select menu',
    },
  },

  SelectValue: {
    schema: componentSchemas.SelectValue,
    description: 'Placeholder or selected value shown inside the trigger',
    acceptsChildren: false,
    meta: {
      icon: 'TextCursorInput',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.SelectValue),
      description: 'Placeholder or selected value shown inside the trigger',
    },
  },

  SelectContent: {
    schema: componentSchemas.SelectContent,
    description: 'Popover body that contains the selectable items',
    acceptsChildren: true,
    meta: {
      icon: 'ListTree',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.SelectContent),
      description: 'Popover body that contains the selectable items',
    },
  },

  SelectGroup: {
    schema: componentSchemas.SelectGroup,
    description: 'Logical grouping for select items',
    acceptsChildren: true,
    meta: {
      icon: 'Group',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.SelectGroup),
      description: 'Logical grouping for select items',
    },
  },

  SelectLabel: {
    schema: componentSchemas.SelectLabel,
    description: 'Muted label above a select item group',
    acceptsChildren: false,
    meta: {
      icon: 'Tag',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.SelectLabel),
      description: 'Muted label above a select item group',
    },
  },

  SelectItem: {
    schema: componentSchemas.SelectItem,
    description: 'A selectable option row',
    acceptsChildren: false,
    meta: {
      icon: 'List',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.SelectItem),
      description: 'A selectable option row',
    },
  },

  SelectSeparator: {
    schema: componentSchemas.SelectSeparator,
    description: 'Divider between select item groups',
    acceptsChildren: false,
    meta: {
      icon: 'Minus',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.SelectSeparator),
      description: 'Divider between select item groups',
    },
  },

  // ─── Display ────────────────────────────────────────────────────────

  Text: {
    schema: componentSchemas.Text,
    description: 'Text element with typography variants (h1-h4, p, code, etc.)',
    acceptsChildren: false,
    meta: {
      icon: 'Type',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Text),
      description: 'Text element with typography variants',
    },
  },

  Card: {
    schema: componentSchemas.Card,
    description: 'Container card with shadow and border',
    acceptsChildren: true,
    meta: {
      icon: 'Square',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Card),
      description: 'Container card with shadow and border',
    },
  },

  CardHeader: {
    schema: componentSchemas.CardHeader,
    description: 'Card header section',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.CardHeader),
      description: 'Card header section',
    },
  },

  CardTitle: {
    schema: componentSchemas.CardTitle,
    description: 'Card title text',
    acceptsChildren: false,
    meta: {
      icon: 'Heading',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.CardTitle),
      description: 'Card title text',
    },
  },

  CardDescription: {
    schema: componentSchemas.CardDescription,
    description: 'Card description text',
    acceptsChildren: false,
    meta: {
      icon: 'AlignLeft',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.CardDescription),
      description: 'Card description text',
    },
  },

  CardContent: {
    schema: componentSchemas.CardContent,
    description: 'Card body content area',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.CardContent),
      description: 'Card body content area',
    },
  },

  CardFooter: {
    schema: componentSchemas.CardFooter,
    description: 'Card footer section',
    acceptsChildren: true,
    meta: {
      icon: 'PanelBottom',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.CardFooter),
      description: 'Card footer section',
    },
  },

  Badge: {
    schema: componentSchemas.Badge,
    description: 'Small badge/tag with variant colors',
    acceptsChildren: false,
    meta: {
      icon: 'BadgeCheck',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Badge),
      description: 'Small badge/tag with variant colors',
    },
  },

  // ─── Overlay ────────────────────────────────────────────────────────

  Dialog: {
    schema: componentSchemas.Dialog,
    description: 'Modal dialog root',
    acceptsChildren: true,
    meta: {
      icon: 'MessageSquare',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Dialog),
      description: 'Modal dialog root',
    },
  },

  DialogTrigger: {
    schema: componentSchemas.DialogTrigger,
    description: 'Element that triggers the dialog to open',
    acceptsChildren: true,
    meta: {
      icon: 'Pointer',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DialogTrigger),
      description: 'Element that triggers the dialog to open',
    },
  },

  DialogContent: {
    schema: componentSchemas.DialogContent,
    description: 'Dialog content container',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DialogContent),
      description: 'Dialog content container',
    },
  },

  DialogHeader: {
    schema: componentSchemas.DialogHeader,
    description: 'Dialog header section',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DialogHeader),
      description: 'Dialog header section',
    },
  },

  DialogTitle: {
    schema: componentSchemas.DialogTitle,
    description: 'Dialog title text',
    acceptsChildren: false,
    meta: {
      icon: 'Heading',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.DialogTitle),
      description: 'Dialog title text',
    },
  },

  DialogDescription: {
    schema: componentSchemas.DialogDescription,
    description: 'Dialog description text',
    acceptsChildren: false,
    meta: {
      icon: 'AlignLeft',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.DialogDescription),
      description: 'Dialog description text',
    },
  },

  DialogFooter: {
    schema: componentSchemas.DialogFooter,
    description: 'Dialog footer section',
    acceptsChildren: true,
    meta: {
      icon: 'PanelBottom',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DialogFooter),
      description: 'Dialog footer section',
    },
  },

  Popover: {
    schema: componentSchemas.Popover,
    description: 'Popover root that manages trigger and content',
    acceptsChildren: true,
    meta: {
      icon: 'PanelTopOpen',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Popover),
      description: 'Popover root that manages trigger and content',
    },
  },

  PopoverTrigger: {
    schema: componentSchemas.PopoverTrigger,
    description: 'Element that opens a popover',
    acceptsChildren: true,
    meta: {
      icon: 'MousePointerClick',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.PopoverTrigger),
      description: 'Element that opens a popover',
    },
  },

  PopoverContent: {
    schema: componentSchemas.PopoverContent,
    description: 'Floating popover surface for contextual content',
    acceptsChildren: true,
    meta: {
      icon: 'PanelsTopLeft',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.PopoverContent),
      description: 'Floating popover surface for contextual content',
    },
  },

  Tooltip: {
    schema: componentSchemas.Tooltip,
    description: 'Tooltip root that manages trigger and content',
    acceptsChildren: true,
    meta: {
      icon: 'MessageSquareMore',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Tooltip),
      description: 'Tooltip root that manages trigger and content',
    },
  },

  TooltipTrigger: {
    schema: componentSchemas.TooltipTrigger,
    description: 'Element that shows a tooltip on hover or focus',
    acceptsChildren: true,
    meta: {
      icon: 'MousePointerClick',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.TooltipTrigger),
      description: 'Element that shows a tooltip on hover or focus',
    },
  },

  TooltipContent: {
    schema: componentSchemas.TooltipContent,
    description: 'Compact overlay with short helper text',
    acceptsChildren: false,
    meta: {
      icon: 'BadgeHelp',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.TooltipContent),
      description: 'Compact overlay with short helper text',
    },
  },

  // ─── Navigation ─────────────────────────────────────────────────────

  Tabs: {
    schema: componentSchemas.Tabs,
    description: 'Tabs root that groups triggers and tab content',
    acceptsChildren: true,
    meta: {
      icon: 'PanelsTopLeft',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Tabs),
      description: 'Tabs root that groups triggers and tab content',
    },
  },

  TabsList: {
    schema: componentSchemas.TabsList,
    description: 'Tabs trigger row',
    acceptsChildren: true,
    meta: {
      icon: 'List',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.TabsList),
      description: 'Tabs trigger row',
    },
  },

  TabsTrigger: {
    schema: componentSchemas.TabsTrigger,
    description: 'A single tab trigger button',
    acceptsChildren: false,
    meta: {
      icon: 'PanelTop',
      category: 'navigation',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.TabsTrigger),
      description: 'A single tab trigger button',
    },
  },

  TabsContent: {
    schema: componentSchemas.TabsContent,
    description: 'Panel body for a tab value',
    acceptsChildren: true,
    meta: {
      icon: 'PanelBottom',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.TabsContent),
      description: 'Panel body for a tab value',
    },
  },

  // ─── Feedback ───────────────────────────────────────────────────────

  Separator: {
    schema: componentSchemas.Separator,
    description: 'Visual separator line (horizontal or vertical)',
    acceptsChildren: false,
    meta: {
      icon: 'Minus',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Separator),
      description: 'Visual separator line',
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Get all component types */
export function getComponentTypes(): ComponentType[] {
  return Object.keys(catalog) as ComponentType[];
}

/** Get components by category */
export function getComponentsByCategory(
  category: ComponentCategory,
): Array<[ComponentType, CatalogEntry]> {
  return Object.entries(catalog).filter(
    ([, entry]) => entry.meta.category === category,
  ) as Array<[ComponentType, CatalogEntry]>;
}

/** Get all categories with their components */
export function getCategorizedComponents(): Record<
  ComponentCategory,
  Array<[ComponentType, CatalogEntry]>
> {
  const result: Record<ComponentCategory, Array<[ComponentType, CatalogEntry]>> = {
    layout: [],
    input: [],
    display: [],
    feedback: [],
    navigation: [],
    overlay: [],
  };

  for (const [type, entry] of Object.entries(catalog) as Array<[ComponentType, CatalogEntry]>) {
    result[entry.meta.category].push([type, entry]);
  }

  return result;
}

/**
 * Generate a prompt-friendly catalog description for AI agents.
 * Used by the MCP server's designforge_list_components tool.
 */
export function catalogToPrompt(): string {
  const lines: string[] = [
    '# DesignForge Component Catalog',
    '',
    'Available components for building UIs:',
    '',
  ];

  const categories = getCategorizedComponents();
  for (const [category, components] of Object.entries(categories)) {
    if (components.length === 0) continue;
    lines.push(`## ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    lines.push('');
    for (const [type, entry] of components) {
      const schema = entry.schema;
      const shape = schema.shape;
      const propDescriptions = Object.entries(shape)
        .map(([key, field]) => {
          if (field instanceof z.ZodDefault) {
            const inner = field._def.innerType;
            if (inner instanceof z.ZodEnum) {
              return `  - ${key}: ${inner.options.map((o: string) => `"${o}"`).join(' | ')} (default: "${field._def.defaultValue()}")`;
            }
            return `  - ${key}: ${inner.constructor.name.replace('Zod', '').toLowerCase()} (default: ${JSON.stringify(field._def.defaultValue())})`;
          }
          return `  - ${key}: ${(field as z.ZodType).constructor.name.replace('Zod', '').toLowerCase()}`;
        })
        .join('\n');
      lines.push(`### ${type}`);
      lines.push(`${entry.description}`);
      lines.push(`Children: ${entry.acceptsChildren ? 'yes' : 'no'}`);
      lines.push(`Props:`);
      lines.push(propDescriptions);
      lines.push('');
    }
  }

  return lines.join('\n');
}
