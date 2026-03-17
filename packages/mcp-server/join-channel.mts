import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const DEFAULT_CHANNEL_ID = 'designforge-desktop-main';

function getTextContent(result: unknown): string {
  if (typeof result !== 'object' || result === null) return '';
  const content = (result as { content?: Array<{ type?: string; text?: string }> }).content ?? [];
  return content
    .filter((entry) => entry.type === 'text' && typeof entry.text === 'string')
    .map((entry) => entry.text ?? '')
    .join('\n')
    .trim();
}

async function callTextTool(
  client: Client,
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const result = await client.callTool({ name, arguments: args });
  return getTextContent(result);
}

async function main() {
  const channelId = process.argv[2] ?? process.env.DESIGNFORGE_CHANNEL_ID ?? DEFAULT_CHANNEL_ID;

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['--import', 'tsx/esm', 'src/index.ts'],
    cwd: '.',
  });

  const client = new Client({ name: 'designforge-channel-starter', version: '1.0' });
  await client.connect(transport);

  try {
    const joined = await callTextTool(client, 'designforge_join_channel', { channelId });
    const contextText = await callTextTool(client, 'designforge_get_context', {});
    const selectionText = await callTextTool(client, 'designforge_get_selection', {});

    const context = contextText ? JSON.parse(contextText) as {
      source: string;
      liveAvailable: boolean;
      joinedChannelId: string | null;
      filePath: string | null;
      spec?: { root?: string; elements?: Record<string, unknown> };
      selectedIds?: string[];
    } : null;

    console.log(`Joined channel: ${channelId}`);
    if (joined) console.log(joined);

    if (context) {
      console.log('\nContext summary:');
      console.log(JSON.stringify({
        joinedChannelId: context.joinedChannelId,
        source: context.source,
        liveAvailable: context.liveAvailable,
        filePath: context.filePath,
        root: context.spec?.root ?? null,
        elementCount: Object.keys(context.spec?.elements ?? {}).length,
        selectedIds: context.selectedIds ?? [],
      }, null, 2));
    }

    if (selectionText) {
      console.log('\nSelection:');
      console.log(selectionText);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Fatal:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
