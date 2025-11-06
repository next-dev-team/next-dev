import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

export function BashCommand({ command }: { command: string }) {
  return (
    <div className="dark">
      <CodeBlock>
        <Pre>
          <code>{command}</code>
        </Pre>
      </CodeBlock>
    </div>
  );
}
