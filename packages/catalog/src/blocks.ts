import type { ElementBlueprint } from '@next-dev/editor-core';
import type { ComponentType } from './definitions.js';

export type CatalogBlockCategoryId = 'auth';
export type CatalogBlockId = 'auth-login';
export type CatalogBlockProviderFamilyId = 'runtime' | 'ui' | 'validation';
export type CatalogBlockProviderId =
  | 'react-native-web'
  | 'rn-uniwind'
  | 'tanstack-form'
  | 'react-hook-form';

export interface CatalogBlockCategory {
  id: CatalogBlockCategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface CatalogBlockProviderOption {
  id: CatalogBlockProviderId;
  name: string;
  description: string;
}

export interface CatalogBlockProviderFamily {
  id: CatalogBlockProviderFamilyId;
  name: string;
  description: string;
  mutable: boolean;
  defaultProviderId: CatalogBlockProviderId;
  options: CatalogBlockProviderOption[];
}

export type CatalogBlockProviderSelection = Record<
  CatalogBlockProviderFamilyId,
  CatalogBlockProviderId
>;

export interface CatalogBlock {
  id: CatalogBlockId;
  name: string;
  category: CatalogBlockCategoryId;
  description: string;
  icon: string;
  accent: string;
  tags: string[];
  providers: CatalogBlockProviderFamily[];
  tree: ElementBlueprint;
  buildTree: (selection?: Partial<CatalogBlockProviderSelection>) => ElementBlueprint;
}

function node(
  type: ComponentType,
  props: Record<string, unknown> = {},
  options?: {
    children?: ElementBlueprint[];
    name?: string;
  },
): ElementBlueprint {
  return {
    type,
    props,
    children: options?.children,
    __editor: options?.name ? { name: options.name } : undefined,
  };
}

function resolveProviders(
  providers: CatalogBlockProviderFamily[],
  selection?: Partial<CatalogBlockProviderSelection>,
): CatalogBlockProviderSelection {
  return {
    runtime:
      selection?.runtime ??
      providers.find((provider) => provider.id === 'runtime')?.defaultProviderId ??
      'react-native-web',
    ui:
      selection?.ui ??
      providers.find((provider) => provider.id === 'ui')?.defaultProviderId ??
      'rn-uniwind',
    validation:
      selection?.validation ??
      providers.find((provider) => provider.id === 'validation')?.defaultProviderId ??
      'tanstack-form',
  };
}

export const catalogBlockProviders: CatalogBlockProviderFamily[] = [
  {
    id: 'runtime',
    name: 'Runtime',
    description: 'Base rendering layer for this UI block.',
    mutable: false,
    defaultProviderId: 'react-native-web',
    options: [
      {
        id: 'react-native-web',
        name: 'react-native-web',
        description: 'Default runtime layer for rendering rn-uniwind components on the web.',
      },
    ],
  },
  {
    id: 'ui',
    name: 'UI Kit',
    description: 'Component provider used by the exported block.',
    mutable: false,
    defaultProviderId: 'rn-uniwind',
    options: [
      {
        id: 'rn-uniwind',
        name: 'rn-uniwind',
        description: 'Current catalog-backed component provider for this project.',
      },
    ],
  },
  {
    id: 'validation',
    name: 'Validation',
    description: 'Form state and validation adapter for the generated login flow.',
    mutable: true,
    defaultProviderId: 'tanstack-form',
    options: [
      {
        id: 'tanstack-form',
        name: 'TanStack Form',
        description: 'Default validation provider for this block.',
      },
      {
        id: 'react-hook-form',
        name: 'React Hook Form',
        description: 'Alternative provider option with the same field structure.',
      },
    ],
  },
];

function buildAuthLoginTree(selection?: Partial<CatalogBlockProviderSelection>): ElementBlueprint {
  const providers = resolveProviders(catalogBlockProviders, selection);
  const validationProviderLabel =
    providers.validation === 'react-hook-form' ? 'React Hook Form' : 'TanStack Form';
  const validationDescription =
    providers.validation === 'react-hook-form'
      ? 'Alternative validation provider selected. Keep the same fields and wire register, errors, and submit handling when you export this block later.'
      : 'Default validation provider selected. This layout is ready for TanStack Form field state, validation rules, and submit orchestration when provider wiring lands.';

  return node(
    'Stack',
    {
      direction: 'vertical',
      className: 'min-h-screen w-full items-center justify-center bg-slate-950 px-6 py-10',
    },
    {
      name: 'Login Block',
      children: [
        node(
          'Stack',
          {
            direction: 'vertical',
            className: 'w-full max-w-md gap-5',
          },
          {
            name: 'Login Shell',
            children: [
              node(
                'Stack',
                {
                  direction: 'vertical',
                  className: 'gap-3',
                },
                {
                  name: 'Intro',
                  children: [
                    node(
                      'Stack',
                      {
                        direction: 'horizontal',
                        className: 'items-center gap-2',
                      },
                      {
                        name: 'Intro Meta',
                        children: [
                          node(
                            'Badge',
                            { children: 'Auth', variant: 'outline' },
                            { name: 'Category Badge' },
                          ),
                          node(
                            'Badge',
                            { children: validationProviderLabel, variant: 'secondary' },
                            { name: 'Validation Badge' },
                          ),
                        ],
                      },
                    ),
                    node(
                      'Text',
                      {
                        children: 'Welcome back',
                        variant: 'h1',
                        className: 'text-white',
                      },
                      { name: 'Headline' },
                    ),
                    node(
                      'Text',
                      {
                        children:
                          'Start from a validated login shell, then swap the validation provider later without rebuilding the form layout.',
                        variant: 'muted',
                        className: 'text-slate-400',
                      },
                      { name: 'Subheadline' },
                    ),
                  ],
                },
              ),
              node(
                'Card',
                {
                  className:
                    'w-full rounded-3xl border border-slate-800 bg-slate-900 px-1 py-1 shadow-2xl',
                },
                {
                  name: 'Login Card',
                  children: [
                    node(
                      'CardHeader',
                      {
                        className: 'gap-2 pb-2',
                      },
                      {
                        name: 'Card Header',
                        children: [
                          node(
                            'CardTitle',
                            { children: 'Sign in to your account' },
                            { name: 'Card Title' },
                          ),
                          node(
                            'CardDescription',
                            {
                              children:
                                'Built on react-native-web + rn-uniwind, with a swappable validation layer.',
                            },
                            { name: 'Card Description' },
                          ),
                        ],
                      },
                    ),
                    node(
                      'CardContent',
                      {
                        className: 'gap-4',
                      },
                      {
                        name: 'Card Content',
                        children: [
                          node(
                            'Stack',
                            {
                              direction: 'vertical',
                              className: 'gap-4',
                            },
                            {
                              name: 'Login Form',
                              children: [
                                node(
                                  'Stack',
                                  {
                                    direction: 'vertical',
                                    className: 'gap-2',
                                  },
                                  {
                                    name: 'Email Field',
                                    children: [
                                      node(
                                        'Label',
                                        {
                                          children: 'Email',
                                          htmlFor: 'login-email',
                                        },
                                        { name: 'Email Label' },
                                      ),
                                      node(
                                        'Input',
                                        {
                                          placeholder: 'you@company.com',
                                          type: 'email',
                                          className: 'w-full',
                                        },
                                        { name: 'Email Input' },
                                      ),
                                      node(
                                        'Text',
                                        {
                                          children:
                                            'Required. Validate a real email format before submit.',
                                          variant: 'small',
                                          className: 'text-slate-400',
                                        },
                                        { name: 'Email Validation Hint' },
                                      ),
                                    ],
                                  },
                                ),
                                node(
                                  'Stack',
                                  {
                                    direction: 'vertical',
                                    className: 'gap-2',
                                  },
                                  {
                                    name: 'Password Field',
                                    children: [
                                      node(
                                        'Label',
                                        {
                                          children: 'Password',
                                          htmlFor: 'login-password',
                                        },
                                        { name: 'Password Label' },
                                      ),
                                      node(
                                        'Input',
                                        {
                                          placeholder: 'Enter your password',
                                          type: 'password',
                                          className: 'w-full',
                                        },
                                        { name: 'Password Input' },
                                      ),
                                      node(
                                        'Text',
                                        {
                                          children:
                                            'Required. Add length, strength, or server-side checks through the selected provider.',
                                          variant: 'small',
                                          className: 'text-slate-400',
                                        },
                                        { name: 'Password Validation Hint' },
                                      ),
                                    ],
                                  },
                                ),
                                node(
                                  'Stack',
                                  {
                                    direction: 'horizontal',
                                    className: 'items-center justify-between gap-3',
                                  },
                                  {
                                    name: 'Utility Row',
                                    children: [
                                      node(
                                        'Stack',
                                        {
                                          direction: 'horizontal',
                                          className: 'items-center gap-2',
                                        },
                                        {
                                          name: 'Remember Row',
                                          children: [
                                            node(
                                              'Checkbox',
                                              { checked: true },
                                              { name: 'Remember Checkbox' },
                                            ),
                                            node(
                                              'Text',
                                              {
                                                children: 'Remember me',
                                                variant: 'small',
                                              },
                                              { name: 'Remember Copy' },
                                            ),
                                          ],
                                        },
                                      ),
                                      node(
                                        'Button',
                                        {
                                          children: 'Forgot password?',
                                          variant: 'link',
                                          size: 'sm',
                                          className: 'px-0',
                                        },
                                        { name: 'Forgot Button' },
                                      ),
                                    ],
                                  },
                                ),
                                node(
                                  'Button',
                                  {
                                    children: 'Continue',
                                    className: 'w-full',
                                  },
                                  { name: 'Primary CTA' },
                                ),
                                node(
                                  'Alert',
                                  { variant: 'default' },
                                  {
                                    name: 'Validation Alert',
                                    children: [
                                      node(
                                        'AlertTitle',
                                        { children: `${validationProviderLabel} validation` },
                                        { name: 'Validation Title' },
                                      ),
                                      node(
                                        'AlertDescription',
                                        {
                                          children: validationDescription,
                                        },
                                        { name: 'Validation Description' },
                                      ),
                                    ],
                                  },
                                ),
                                node(
                                  'Separator',
                                  {
                                    orientation: 'horizontal',
                                    className: 'my-1',
                                  },
                                  { name: 'Provider Divider' },
                                ),
                                node(
                                  'Stack',
                                  {
                                    direction: 'horizontal',
                                    className: 'gap-2',
                                  },
                                  {
                                    name: 'Provider Actions',
                                    children: [
                                      node(
                                        'Button',
                                        {
                                          children: 'Google',
                                          variant: 'outline',
                                          className: 'flex-1',
                                        },
                                        { name: 'Google CTA' },
                                      ),
                                      node(
                                        'Button',
                                        {
                                          children: 'GitHub',
                                          variant: 'secondary',
                                          className: 'flex-1',
                                        },
                                        { name: 'GitHub CTA' },
                                      ),
                                    ],
                                  },
                                ),
                              ],
                            },
                          ),
                        ],
                      },
                    ),
                    node(
                      'CardFooter',
                      {
                        className: 'flex-col items-start gap-3 pt-2',
                      },
                      {
                        name: 'Card Footer',
                        children: [
                          node(
                            'Text',
                            {
                              children: `Validation provider: ${validationProviderLabel}. You can swap adapters later without rebuilding the field layout.`,
                              variant: 'small',
                              className: 'text-slate-400',
                            },
                            { name: 'Footer Copy' },
                          ),
                          node(
                            'Button',
                            {
                              children: 'Create account',
                              variant: 'link',
                              size: 'sm',
                              className: 'px-0',
                            },
                            { name: 'Create Account CTA' },
                          ),
                        ],
                      },
                    ),
                  ],
                },
              ),
            ],
          },
        ),
      ],
    },
  );
}

export const blockCategories: CatalogBlockCategory[] = [
  {
    id: 'auth',
    name: 'Auth',
    description: 'Sign-in, sign-up, recovery, and access-control surfaces.',
    icon: 'Lock',
  },
];

export const catalogBlocks: CatalogBlock[] = [
  {
    id: 'auth-login',
    name: 'Login',
    category: 'auth',
    description:
      'A validation-ready sign-in screen with swappable provider metadata, field guidance, and primary auth actions.',
    icon: 'Lock',
    accent: 'Validation-ready login',
    tags: ['Form', 'Inputs', 'Fields', 'Validation'],
    providers: catalogBlockProviders,
    tree: buildAuthLoginTree(),
    buildTree: buildAuthLoginTree,
  },
];

export function getBlockCategories(): CatalogBlockCategory[] {
  return blockCategories;
}

export function getCatalogBlocks(): CatalogBlock[] {
  return catalogBlocks;
}

export function getCatalogBlocksByCategory(categoryId: CatalogBlockCategoryId): CatalogBlock[] {
  return catalogBlocks.filter((block) => block.category === categoryId);
}

export function getCatalogBlock(blockId: CatalogBlockId): CatalogBlock | undefined {
  return catalogBlocks.find((block) => block.id === blockId);
}

export function getCatalogBlockProviderFamilies(): CatalogBlockProviderFamily[] {
  return catalogBlockProviders;
}

export function getDefaultCatalogProviderSelection(): CatalogBlockProviderSelection {
  return resolveProviders(catalogBlockProviders);
}

export function resolveCatalogProviderSelection(
  selection?: Partial<CatalogBlockProviderSelection>,
): CatalogBlockProviderSelection {
  return resolveProviders(catalogBlockProviders, selection);
}

export function getDefaultBlockProviderSelection(
  block: CatalogBlock,
): CatalogBlockProviderSelection {
  return resolveProviders(block.providers);
}

export function resolveBlockProviderSelection(
  block: CatalogBlock,
  selection?: Partial<CatalogBlockProviderSelection>,
): CatalogBlockProviderSelection {
  return resolveProviders(block.providers, selection);
}
