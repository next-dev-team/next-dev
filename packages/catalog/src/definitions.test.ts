import { describe, expect, it } from 'vitest';
import { catalog, catalogToPrompt, getCategorizedComponents } from './definitions.js';

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
