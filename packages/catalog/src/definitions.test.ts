import { describe, expect, it } from 'vitest';
import { catalog, catalogToPrompt, getCategorizedComponents } from './definitions.js';
import {
  getCatalogBlockProviderFamilies,
  getBlockCategories,
  getCatalogBlocks,
  getCatalogBlocksByCategory,
  getDefaultBlockProviderSelection,
  getDefaultCatalogProviderSelection,
  resolveCatalogProviderSelection,
  resolveBlockProviderSelection,
} from './blocks.js';

describe('catalog component coverage', () => {
  it('categorizes the newly exposed input, overlay, and navigation components', () => {
    const categories = getCategorizedComponents();

    expect(categories.input.map(([type]) => type)).toEqual(
      expect.arrayContaining([
        'Checkbox',
        'Switch',
        'Textarea',
        'Select',
        'SelectTrigger',
        'SelectValue',
        'SelectContent',
        'SelectGroup',
        'SelectLabel',
        'SelectItem',
        'SelectSeparator',
      ]),
    );

    expect(categories.overlay.map(([type]) => type)).toEqual(
      expect.arrayContaining([
        'Popover',
        'PopoverTrigger',
        'PopoverContent',
        'Tooltip',
        'TooltipTrigger',
        'TooltipContent',
      ]),
    );

    expect(categories.navigation.map(([type]) => type)).toEqual(
      expect.arrayContaining(['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent']),
    );
  });

  it('derives default props for the newly exposed primitives', () => {
    expect(catalog.SelectItem.meta.defaultProps).toMatchObject({
      value: 'option-1',
      label: 'Option',
      disabled: false,
      className: null,
    });

    expect(catalog.TooltipContent.meta.defaultProps).toMatchObject({
      side: 'top',
      children: 'Helpful hint',
      className: null,
    });

    expect(catalog.TabsTrigger.meta.defaultProps).toMatchObject({
      value: 'tab-1',
      children: 'Tab 1',
      disabled: false,
      className: null,
    });
  });

  it('includes the new components in the AI prompt catalog', () => {
    const prompt = catalogToPrompt();

    expect(prompt).toContain('### Checkbox');
    expect(prompt).toContain('### SelectItem');
    expect(prompt).toContain('### PopoverContent');
    expect(prompt).toContain('### TooltipContent');
    expect(prompt).toContain('### TabsTrigger');
  });
});

describe('catalog blocks', () => {
  it('exposes an auth login block with a shared global provider stack', () => {
    const [authCategory] = getBlockCategories();
    const [loginBlock] = getCatalogBlocks();
    const stack = [loginBlock.tree];
    const types = new Set<string>();
    const globalProviders = getCatalogBlockProviderFamilies();
    const defaultGlobalProviders = getDefaultCatalogProviderSelection();
    const defaultProviders = getDefaultBlockProviderSelection(loginBlock);
    const rhfTree = loginBlock.buildTree({ validation: 'react-hook-form' });

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node) continue;
      types.add(node.type);
      stack.push(...(node.children ?? []));
    }

    expect(authCategory.name).toBe('Auth');
    expect(loginBlock.name).toBe('Login');
    expect(loginBlock.category).toBe('auth');
    expect(loginBlock.tags).toEqual(
      expect.arrayContaining(['Form', 'Inputs', 'Fields', 'Validation']),
    );
    expect(getCatalogBlocksByCategory('auth')).toHaveLength(1);
    expect(globalProviders.map((provider) => provider.id)).toEqual(['runtime', 'ui', 'validation']);
    expect(defaultGlobalProviders).toEqual({
      runtime: 'react-native-web',
      ui: 'rn-uniwind',
      validation: 'tanstack-form',
    });
    expect(resolveCatalogProviderSelection({ validation: 'react-hook-form' })).toEqual({
      runtime: 'react-native-web',
      ui: 'rn-uniwind',
      validation: 'react-hook-form',
    });
    expect(defaultProviders.validation).toBe('tanstack-form');
    expect(resolveBlockProviderSelection(loginBlock, { validation: 'react-hook-form' })).toEqual({
      runtime: 'react-native-web',
      ui: 'rn-uniwind',
      validation: 'react-hook-form',
    });
    expect(loginBlock.providers.map((provider) => provider.id)).toEqual([
      'runtime',
      'ui',
      'validation',
    ]);
    expect([...types]).toEqual(
      expect.arrayContaining([
        'Stack',
        'Card',
        'Input',
        'Label',
        'Checkbox',
        'Button',
        'Badge',
        'Alert',
        'AlertTitle',
        'AlertDescription',
        'Separator',
      ]),
    );
    expect(JSON.stringify(rhfTree)).toContain('React Hook Form');

    for (const type of types) {
      expect(catalog).toHaveProperty(type);
    }
  });
});
