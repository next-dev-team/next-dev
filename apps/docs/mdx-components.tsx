import { BashCommand } from '@docs/components/bash-command';
import { BlocksGrid } from '@docs/components/blocks-grid';
import { CommandTabs } from '@docs/components/command-tabs';
import { ExternalLinks } from '@docs/components/external-links';
import { BlockPreviewCard, PreviewCard } from '@docs/components/preview-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/components/ui/tabs';
import { cn } from '@docs/lib/utils';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

const mdxComponents: MDXComponents = {
  ...defaultComponents,
  h2: ({ className, ...props }) => (
    <defaultComponents.h2 className={cn(className, 'font-medium')} {...props} />
  ),
  //  HTML `ref` attribute conflicts with `forwardRef`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pre: ({ ref: _ref, className, ...props }) => (
    <CodeBlock
      {...props}
      className={cn(
        className,
        'bg-fd-foreground/95 dark:bg-fd-secondary/50 text-background dark:text-foreground *:dark relative'
      )}>
      <Pre className={lineNumberClassNames}>{props.children}</Pre>
    </CodeBlock>
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn(className, 'mb-6 mt-10 scroll-mt-20 font-medium')} {...props} />
  ),
  BlocksGrid,
  BlockPreviewCard,
  CommandTabs,
  ExternalLinks,
  BashCommand,
  Step,
  Steps,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  PreviewCard,
};

const lineNumberClassNames = cn(
  '[&_code]:[counter-reset:line]',
  '[&_code]:[counter-increment:line_0]',
  '[&_.line]:before:content-[counter(line)]',
  '[&_.line]:before:inline-block',
  '[&_.line]:before:[counter-increment:line]',
  '[&_.line]:before:w-3',
  '[&_.line]:before:mr-4',
  '[&_.line]:before:text-[11px]',
  '[&_.line]:before:text-right',
  '[&_.line]:before:text-muted-foreground/50',
  '[&_.line]:before:font-mono',
  '[&_.line]:before:select-none'
);

export default mdxComponents;
