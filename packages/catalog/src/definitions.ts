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

  Progress: z.object({
    value: z.number().nullable().default(0),
    indicatorClassName: z.string().nullable().default(null),
    className: z.string().nullable().default(null),
  }),

  Skeleton: z.object({
    className: z.string().nullable().default(null),
  }),

  Alert: z.object({
    variant: z.enum(['default', 'destructive']).default('default'),
    className: z.string().nullable().default(null),
  }),

  AlertTitle: z.object({
    children: z.string().default('Alert Title'),
    className: z.string().nullable().default(null),
  }),

  AlertDescription: z.object({
    children: z.string().default('Alert description text'),
    className: z.string().nullable().default(null),
  }),

  // ─── Layout (new) ───────────────────────────────────────────────────

  Accordion: z.object({
    type: z.enum(['single', 'multiple']).default('single'),
    collapsible: z.boolean().default(true),
    className: z.string().nullable().default(null),
  }),

  AccordionItem: z.object({
    value: z.string().default('item-1'),
    className: z.string().nullable().default(null),
  }),

  AccordionTrigger: z.object({
    className: z.string().nullable().default(null),
  }),

  AccordionContent: z.object({
    className: z.string().nullable().default(null),
  }),

  AspectRatio: z.object({
    ratio: z.number().default(16 / 9),
    className: z.string().nullable().default(null),
  }),

  Collapsible: z.object({
    open: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  CollapsibleTrigger: z.object({
    asChild: z.boolean().default(true),
    className: z.string().nullable().default(null),
  }),

  CollapsibleContent: z.object({
    className: z.string().nullable().default(null),
  }),

  // ─── Display (new) ──────────────────────────────────────────────────

  Avatar: z.object({
    className: z.string().nullable().default(null),
  }),

  AvatarImage: z.object({
    src: z.string().default(''),
    alt: z.string().default('Avatar'),
    className: z.string().nullable().default(null),
  }),

  AvatarFallback: z.object({
    children: z.string().default('AB'),
    className: z.string().nullable().default(null),
  }),

  // ─── Input (new) ────────────────────────────────────────────────────

  RadioGroup: z.object({
    defaultValue: z.string().nullable().default(null),
    className: z.string().nullable().default(null),
  }),

  RadioGroupItem: z.object({
    value: z.string().default('option-1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  Toggle: z.object({
    variant: z.enum(['default', 'outline']).default('default'),
    size: z.enum(['default', 'sm', 'lg']).default('default'),
    pressed: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ToggleGroup: z.object({
    type: z.enum(['single', 'multiple']).default('single'),
    variant: z.enum(['default', 'outline']).default('default'),
    size: z.enum(['default', 'sm', 'lg']).default('default'),
    className: z.string().nullable().default(null),
  }),

  ToggleGroupItem: z.object({
    value: z.string().default('item-1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  // ─── Overlay (new) ──────────────────────────────────────────────────

  AlertDialog: z.object({
    open: z.boolean().default(false),
  }),

  AlertDialogTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  AlertDialogContent: z.object({
    className: z.string().nullable().default(null),
  }),

  AlertDialogHeader: z.object({
    className: z.string().nullable().default(null),
  }),

  AlertDialogTitle: z.object({
    children: z.string().default('Are you sure?'),
    className: z.string().nullable().default(null),
  }),

  AlertDialogDescription: z.object({
    children: z.string().default('This action cannot be undone.'),
    className: z.string().nullable().default(null),
  }),

  AlertDialogFooter: z.object({
    className: z.string().nullable().default(null),
  }),

  AlertDialogAction: z.object({
    children: z.string().default('Continue'),
    className: z.string().nullable().default(null),
  }),

  AlertDialogCancel: z.object({
    children: z.string().default('Cancel'),
    className: z.string().nullable().default(null),
  }),

  ContextMenu: z.object({
    className: z.string().nullable().default(null),
  }),

  ContextMenuTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  ContextMenuContent: z.object({
    className: z.string().nullable().default(null),
  }),

  ContextMenuItem: z.object({
    inset: z.boolean().default(false),
    variant: z.enum(['default', 'destructive']).default('default'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ContextMenuCheckboxItem: z.object({
    checked: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ContextMenuRadioGroup: z.object({
    value: z.string().nullable().default(null),
  }),

  ContextMenuRadioItem: z.object({
    value: z.string().default('option-1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ContextMenuLabel: z.object({
    children: z.string().default('Label'),
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ContextMenuSeparator: z.object({
    className: z.string().nullable().default(null),
  }),

  ContextMenuSub: z.object({
    className: z.string().nullable().default(null),
  }),

  ContextMenuSubTrigger: z.object({
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  ContextMenuSubContent: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenu: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenuTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  DropdownMenuContent: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenuGroup: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenuItem: z.object({
    inset: z.boolean().default(false),
    variant: z.enum(['default', 'destructive']).default('default'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  DropdownMenuCheckboxItem: z.object({
    checked: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  DropdownMenuRadioGroup: z.object({
    value: z.string().nullable().default(null),
  }),

  DropdownMenuRadioItem: z.object({
    value: z.string().default('option-1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  DropdownMenuLabel: z.object({
    children: z.string().default('Label'),
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  DropdownMenuSeparator: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenuSub: z.object({
    className: z.string().nullable().default(null),
  }),

  DropdownMenuSubTrigger: z.object({
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  DropdownMenuSubContent: z.object({
    className: z.string().nullable().default(null),
  }),

  HoverCard: z.object({
    open: z.boolean().default(false),
  }),

  HoverCardTrigger: z.object({
    asChild: z.boolean().default(true),
  }),

  HoverCardContent: z.object({
    align: z.enum(['start', 'center', 'end']).default('center'),
    sideOffset: z.number().default(4),
    className: z.string().nullable().default(null),
  }),

  // ─── Navigation (new) ───────────────────────────────────────────────

  Menubar: z.object({
    className: z.string().nullable().default(null),
  }),

  MenubarMenu: z.object({
    className: z.string().nullable().default(null),
  }),

  MenubarTrigger: z.object({
    className: z.string().nullable().default(null),
  }),

  MenubarContent: z.object({
    align: z.enum(['start', 'center', 'end']).default('start'),
    className: z.string().nullable().default(null),
  }),

  MenubarItem: z.object({
    inset: z.boolean().default(false),
    variant: z.enum(['default', 'destructive']).default('default'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  MenubarCheckboxItem: z.object({
    checked: z.boolean().default(false),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  MenubarRadioGroup: z.object({
    value: z.string().nullable().default(null),
  }),

  MenubarRadioItem: z.object({
    value: z.string().default('option-1'),
    disabled: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  MenubarLabel: z.object({
    children: z.string().default('Label'),
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  MenubarSeparator: z.object({
    className: z.string().nullable().default(null),
  }),

  MenubarSub: z.object({
    className: z.string().nullable().default(null),
  }),

  MenubarSubTrigger: z.object({
    inset: z.boolean().default(false),
    className: z.string().nullable().default(null),
  }),

  MenubarSubContent: z.object({
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

  Progress: {
    schema: componentSchemas.Progress,
    description: 'Progress bar showing completion percentage',
    acceptsChildren: false,
    meta: {
      icon: 'Loader',
      category: 'feedback',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Progress),
      description: 'Progress bar showing completion percentage',
    },
  },

  Skeleton: {
    schema: componentSchemas.Skeleton,
    description: 'Placeholder loading skeleton with pulse animation',
    acceptsChildren: false,
    meta: {
      icon: 'Loader2',
      category: 'feedback',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.Skeleton),
      description: 'Placeholder loading skeleton with pulse animation',
    },
  },

  Alert: {
    schema: componentSchemas.Alert,
    description: 'Alert banner with icon and variant styles',
    acceptsChildren: true,
    meta: {
      icon: 'AlertTriangle',
      category: 'feedback',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Alert),
      description: 'Alert banner with icon and variant styles',
    },
  },

  AlertTitle: {
    schema: componentSchemas.AlertTitle,
    description: 'Alert title text',
    acceptsChildren: false,
    meta: {
      icon: 'Heading',
      category: 'feedback',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertTitle),
      description: 'Alert title text',
    },
  },

  AlertDescription: {
    schema: componentSchemas.AlertDescription,
    description: 'Alert description text',
    acceptsChildren: false,
    meta: {
      icon: 'AlignLeft',
      category: 'feedback',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDescription),
      description: 'Alert description text',
    },
  },

  // ─── Layout (new) ───────────────────────────────────────────────────

  Accordion: {
    schema: componentSchemas.Accordion,
    description: 'Expandable accordion root with single or multiple mode',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronsUpDown',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Accordion),
      description: 'Expandable accordion root',
    },
  },

  AccordionItem: {
    schema: componentSchemas.AccordionItem,
    description: 'Single accordion item container',
    acceptsChildren: true,
    meta: {
      icon: 'ListCollapse',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AccordionItem),
      description: 'Single accordion item container',
    },
  },

  AccordionTrigger: {
    schema: componentSchemas.AccordionTrigger,
    description: 'Clickable header that toggles accordion content',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronDown',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AccordionTrigger),
      description: 'Clickable accordion header',
    },
  },

  AccordionContent: {
    schema: componentSchemas.AccordionContent,
    description: 'Collapsible content inside an accordion item',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AccordionContent),
      description: 'Collapsible accordion content',
    },
  },

  AspectRatio: {
    schema: componentSchemas.AspectRatio,
    description: 'Container that enforces a specific aspect ratio',
    acceptsChildren: true,
    meta: {
      icon: 'RectangleHorizontal',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AspectRatio),
      description: 'Container with fixed aspect ratio',
    },
  },

  Collapsible: {
    schema: componentSchemas.Collapsible,
    description: 'Collapsible content root with open/closed state',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronsUpDown',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Collapsible),
      description: 'Collapsible content root',
    },
  },

  CollapsibleTrigger: {
    schema: componentSchemas.CollapsibleTrigger,
    description: 'Button that toggles collapsible visibility',
    acceptsChildren: true,
    meta: {
      icon: 'MousePointerClick',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.CollapsibleTrigger),
      description: 'Collapsible toggle trigger',
    },
  },

  CollapsibleContent: {
    schema: componentSchemas.CollapsibleContent,
    description: 'Content shown when collapsible is open',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'layout',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.CollapsibleContent),
      description: 'Collapsible content area',
    },
  },

  // ─── Display (new) ──────────────────────────────────────────────────

  Avatar: {
    schema: componentSchemas.Avatar,
    description: 'User avatar with image and fallback',
    acceptsChildren: true,
    meta: {
      icon: 'CircleUser',
      category: 'display',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Avatar),
      description: 'User avatar container',
    },
  },

  AvatarImage: {
    schema: componentSchemas.AvatarImage,
    description: 'Avatar image source',
    acceptsChildren: false,
    meta: {
      icon: 'Image',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AvatarImage),
      description: 'Avatar image',
    },
  },

  AvatarFallback: {
    schema: componentSchemas.AvatarFallback,
    description: 'Fallback content when avatar image fails to load',
    acceptsChildren: false,
    meta: {
      icon: 'User',
      category: 'display',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AvatarFallback),
      description: 'Avatar fallback initials',
    },
  },

  // ─── Input (new) ────────────────────────────────────────────────────

  RadioGroup: {
    schema: componentSchemas.RadioGroup,
    description: 'Radio button group for single selection',
    acceptsChildren: true,
    meta: {
      icon: 'CircleDot',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.RadioGroup),
      description: 'Radio button group',
    },
  },

  RadioGroupItem: {
    schema: componentSchemas.RadioGroupItem,
    description: 'A single radio button option',
    acceptsChildren: false,
    meta: {
      icon: 'Circle',
      category: 'input',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.RadioGroupItem),
      description: 'Radio button option',
    },
  },

  Toggle: {
    schema: componentSchemas.Toggle,
    description: 'Toggle button with pressed state and variant styles',
    acceptsChildren: true,
    meta: {
      icon: 'ToggleRight',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Toggle),
      description: 'Toggle button with pressed state',
    },
  },

  ToggleGroup: {
    schema: componentSchemas.ToggleGroup,
    description: 'Group of toggle buttons for single or multiple selection',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutGrid',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ToggleGroup),
      description: 'Toggle button group',
    },
  },

  ToggleGroupItem: {
    schema: componentSchemas.ToggleGroupItem,
    description: 'A single toggle button within a group',
    acceptsChildren: true,
    meta: {
      icon: 'ToggleRight',
      category: 'input',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ToggleGroupItem),
      description: 'Toggle group item',
    },
  },

  // ─── Overlay (new) ──────────────────────────────────────────────────

  AlertDialog: {
    schema: componentSchemas.AlertDialog,
    description: 'Alert dialog root for confirmations and warnings',
    acceptsChildren: true,
    meta: {
      icon: 'AlertCircle',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialog),
      description: 'Alert dialog for confirmations',
    },
  },

  AlertDialogTrigger: {
    schema: componentSchemas.AlertDialogTrigger,
    description: 'Element that triggers the alert dialog to open',
    acceptsChildren: true,
    meta: {
      icon: 'Pointer',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogTrigger),
      description: 'Alert dialog trigger',
    },
  },

  AlertDialogContent: {
    schema: componentSchemas.AlertDialogContent,
    description: 'Alert dialog content container',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogContent),
      description: 'Alert dialog content container',
    },
  },

  AlertDialogHeader: {
    schema: componentSchemas.AlertDialogHeader,
    description: 'Alert dialog header section',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogHeader),
      description: 'Alert dialog header',
    },
  },

  AlertDialogTitle: {
    schema: componentSchemas.AlertDialogTitle,
    description: 'Alert dialog title text',
    acceptsChildren: false,
    meta: {
      icon: 'Heading',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogTitle),
      description: 'Alert dialog title',
    },
  },

  AlertDialogDescription: {
    schema: componentSchemas.AlertDialogDescription,
    description: 'Alert dialog description text',
    acceptsChildren: false,
    meta: {
      icon: 'AlignLeft',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogDescription),
      description: 'Alert dialog description',
    },
  },

  AlertDialogFooter: {
    schema: componentSchemas.AlertDialogFooter,
    description: 'Alert dialog footer for action buttons',
    acceptsChildren: true,
    meta: {
      icon: 'PanelBottom',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogFooter),
      description: 'Alert dialog footer',
    },
  },

  AlertDialogAction: {
    schema: componentSchemas.AlertDialogAction,
    description: 'Primary action button in the alert dialog',
    acceptsChildren: false,
    meta: {
      icon: 'Check',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogAction),
      description: 'Alert dialog action button',
    },
  },

  AlertDialogCancel: {
    schema: componentSchemas.AlertDialogCancel,
    description: 'Cancel button in the alert dialog',
    acceptsChildren: false,
    meta: {
      icon: 'X',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.AlertDialogCancel),
      description: 'Alert dialog cancel button',
    },
  },

  ContextMenu: {
    schema: componentSchemas.ContextMenu,
    description: 'Context menu root triggered by right-click or long press',
    acceptsChildren: true,
    meta: {
      icon: 'Menu',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenu),
      description: 'Context menu root',
    },
  },

  ContextMenuTrigger: {
    schema: componentSchemas.ContextMenuTrigger,
    description: 'Element that triggers context menu on interaction',
    acceptsChildren: true,
    meta: {
      icon: 'Pointer',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuTrigger),
      description: 'Context menu trigger area',
    },
  },

  ContextMenuContent: {
    schema: componentSchemas.ContextMenuContent,
    description: 'Context menu popup content container',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuContent),
      description: 'Context menu content',
    },
  },

  ContextMenuItem: {
    schema: componentSchemas.ContextMenuItem,
    description: 'A clickable item in a context menu',
    acceptsChildren: true,
    meta: {
      icon: 'List',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuItem),
      description: 'Context menu item',
    },
  },

  ContextMenuCheckboxItem: {
    schema: componentSchemas.ContextMenuCheckboxItem,
    description: 'Checkbox item in a context menu',
    acceptsChildren: true,
    meta: {
      icon: 'CheckSquare',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuCheckboxItem),
      description: 'Context menu checkbox item',
    },
  },

  ContextMenuRadioGroup: {
    schema: componentSchemas.ContextMenuRadioGroup,
    description: 'Radio group within a context menu',
    acceptsChildren: true,
    meta: {
      icon: 'CircleDot',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuRadioGroup),
      description: 'Context menu radio group',
    },
  },

  ContextMenuRadioItem: {
    schema: componentSchemas.ContextMenuRadioItem,
    description: 'Radio item in a context menu radio group',
    acceptsChildren: true,
    meta: {
      icon: 'Circle',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuRadioItem),
      description: 'Context menu radio item',
    },
  },

  ContextMenuLabel: {
    schema: componentSchemas.ContextMenuLabel,
    description: 'Label in a context menu',
    acceptsChildren: false,
    meta: {
      icon: 'Tag',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuLabel),
      description: 'Context menu label',
    },
  },

  ContextMenuSeparator: {
    schema: componentSchemas.ContextMenuSeparator,
    description: 'Separator line in a context menu',
    acceptsChildren: false,
    meta: {
      icon: 'Minus',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuSeparator),
      description: 'Context menu separator',
    },
  },

  ContextMenuSub: {
    schema: componentSchemas.ContextMenuSub,
    description: 'Sub-menu root within a context menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuSub),
      description: 'Context menu sub-menu',
    },
  },

  ContextMenuSubTrigger: {
    schema: componentSchemas.ContextMenuSubTrigger,
    description: 'Item that opens a context menu sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuSubTrigger),
      description: 'Context menu sub-trigger',
    },
  },

  ContextMenuSubContent: {
    schema: componentSchemas.ContextMenuSubContent,
    description: 'Content of a context menu sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.ContextMenuSubContent),
      description: 'Context menu sub-content',
    },
  },

  DropdownMenu: {
    schema: componentSchemas.DropdownMenu,
    description: 'Dropdown menu root',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronDown',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenu),
      description: 'Dropdown menu root',
    },
  },

  DropdownMenuTrigger: {
    schema: componentSchemas.DropdownMenuTrigger,
    description: 'Element that opens the dropdown menu',
    acceptsChildren: true,
    meta: {
      icon: 'Pointer',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuTrigger),
      description: 'Dropdown menu trigger',
    },
  },

  DropdownMenuContent: {
    schema: componentSchemas.DropdownMenuContent,
    description: 'Dropdown menu popup content container',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuContent),
      description: 'Dropdown menu content',
    },
  },

  DropdownMenuGroup: {
    schema: componentSchemas.DropdownMenuGroup,
    description: 'Logical grouping for dropdown menu items',
    acceptsChildren: true,
    meta: {
      icon: 'Group',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuGroup),
      description: 'Dropdown menu group',
    },
  },

  DropdownMenuItem: {
    schema: componentSchemas.DropdownMenuItem,
    description: 'A clickable item in a dropdown menu',
    acceptsChildren: true,
    meta: {
      icon: 'List',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuItem),
      description: 'Dropdown menu item',
    },
  },

  DropdownMenuCheckboxItem: {
    schema: componentSchemas.DropdownMenuCheckboxItem,
    description: 'Checkbox item in a dropdown menu',
    acceptsChildren: true,
    meta: {
      icon: 'CheckSquare',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuCheckboxItem),
      description: 'Dropdown menu checkbox item',
    },
  },

  DropdownMenuRadioGroup: {
    schema: componentSchemas.DropdownMenuRadioGroup,
    description: 'Radio group within a dropdown menu',
    acceptsChildren: true,
    meta: {
      icon: 'CircleDot',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuRadioGroup),
      description: 'Dropdown menu radio group',
    },
  },

  DropdownMenuRadioItem: {
    schema: componentSchemas.DropdownMenuRadioItem,
    description: 'Radio item in a dropdown menu radio group',
    acceptsChildren: true,
    meta: {
      icon: 'Circle',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuRadioItem),
      description: 'Dropdown menu radio item',
    },
  },

  DropdownMenuLabel: {
    schema: componentSchemas.DropdownMenuLabel,
    description: 'Label in a dropdown menu',
    acceptsChildren: false,
    meta: {
      icon: 'Tag',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuLabel),
      description: 'Dropdown menu label',
    },
  },

  DropdownMenuSeparator: {
    schema: componentSchemas.DropdownMenuSeparator,
    description: 'Separator line in a dropdown menu',
    acceptsChildren: false,
    meta: {
      icon: 'Minus',
      category: 'overlay',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuSeparator),
      description: 'Dropdown menu separator',
    },
  },

  DropdownMenuSub: {
    schema: componentSchemas.DropdownMenuSub,
    description: 'Sub-menu root within a dropdown menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuSub),
      description: 'Dropdown menu sub-menu',
    },
  },

  DropdownMenuSubTrigger: {
    schema: componentSchemas.DropdownMenuSubTrigger,
    description: 'Item that opens a dropdown menu sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuSubTrigger),
      description: 'Dropdown menu sub-trigger',
    },
  },

  DropdownMenuSubContent: {
    schema: componentSchemas.DropdownMenuSubContent,
    description: 'Content of a dropdown menu sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.DropdownMenuSubContent),
      description: 'Dropdown menu sub-content',
    },
  },

  HoverCard: {
    schema: componentSchemas.HoverCard,
    description: 'Hover card root that shows content on hover',
    acceptsChildren: true,
    meta: {
      icon: 'PanelTopOpen',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.HoverCard),
      description: 'Hover card root',
    },
  },

  HoverCardTrigger: {
    schema: componentSchemas.HoverCardTrigger,
    description: 'Element that shows hover card on hover',
    acceptsChildren: true,
    meta: {
      icon: 'MousePointerClick',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.HoverCardTrigger),
      description: 'Hover card trigger',
    },
  },

  HoverCardContent: {
    schema: componentSchemas.HoverCardContent,
    description: 'Floating content shown when hovering the trigger',
    acceptsChildren: true,
    meta: {
      icon: 'PanelsTopLeft',
      category: 'overlay',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.HoverCardContent),
      description: 'Hover card content',
    },
  },

  // ─── Navigation (new) ───────────────────────────────────────────────

  Menubar: {
    schema: componentSchemas.Menubar,
    description: 'Horizontal menu bar container',
    acceptsChildren: true,
    meta: {
      icon: 'Menu',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.Menubar),
      description: 'Horizontal menu bar',
    },
  },

  MenubarMenu: {
    schema: componentSchemas.MenubarMenu,
    description: 'A single menu within the menu bar',
    acceptsChildren: true,
    meta: {
      icon: 'Menu',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarMenu),
      description: 'Menubar menu',
    },
  },

  MenubarTrigger: {
    schema: componentSchemas.MenubarTrigger,
    description: 'Button in the menu bar that opens a menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronDown',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarTrigger),
      description: 'Menubar trigger',
    },
  },

  MenubarContent: {
    schema: componentSchemas.MenubarContent,
    description: 'Dropdown content for a menubar menu',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarContent),
      description: 'Menubar content',
    },
  },

  MenubarItem: {
    schema: componentSchemas.MenubarItem,
    description: 'A clickable item in a menubar menu',
    acceptsChildren: true,
    meta: {
      icon: 'List',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarItem),
      description: 'Menubar item',
    },
  },

  MenubarCheckboxItem: {
    schema: componentSchemas.MenubarCheckboxItem,
    description: 'Checkbox item in a menubar',
    acceptsChildren: true,
    meta: {
      icon: 'CheckSquare',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarCheckboxItem),
      description: 'Menubar checkbox item',
    },
  },

  MenubarRadioGroup: {
    schema: componentSchemas.MenubarRadioGroup,
    description: 'Radio group within a menubar',
    acceptsChildren: true,
    meta: {
      icon: 'CircleDot',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarRadioGroup),
      description: 'Menubar radio group',
    },
  },

  MenubarRadioItem: {
    schema: componentSchemas.MenubarRadioItem,
    description: 'Radio item in a menubar radio group',
    acceptsChildren: true,
    meta: {
      icon: 'Circle',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarRadioItem),
      description: 'Menubar radio item',
    },
  },

  MenubarLabel: {
    schema: componentSchemas.MenubarLabel,
    description: 'Label in a menubar',
    acceptsChildren: false,
    meta: {
      icon: 'Tag',
      category: 'navigation',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarLabel),
      description: 'Menubar label',
    },
  },

  MenubarSeparator: {
    schema: componentSchemas.MenubarSeparator,
    description: 'Separator line in a menubar menu',
    acceptsChildren: false,
    meta: {
      icon: 'Minus',
      category: 'navigation',
      acceptsChildren: false,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarSeparator),
      description: 'Menubar separator',
    },
  },

  MenubarSub: {
    schema: componentSchemas.MenubarSub,
    description: 'Sub-menu root within a menubar',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarSub),
      description: 'Menubar sub-menu',
    },
  },

  MenubarSubTrigger: {
    schema: componentSchemas.MenubarSubTrigger,
    description: 'Item that opens a menubar sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'ChevronRight',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarSubTrigger),
      description: 'Menubar sub-trigger',
    },
  },

  MenubarSubContent: {
    schema: componentSchemas.MenubarSubContent,
    description: 'Content of a menubar sub-menu',
    acceptsChildren: true,
    meta: {
      icon: 'LayoutDashboard',
      category: 'navigation',
      acceptsChildren: true,
      defaultProps: defaultsFromSchema(componentSchemas.MenubarSubContent),
      description: 'Menubar sub-content',
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
