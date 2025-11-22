import 'dotenv/config';
import { createServer } from './server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const port = Number(process.env.PORT ?? 3000);

async function start() {
  const app = createServer();

  app.get('/api/docs', async (request, reply) => {
    const specPath = join(process.cwd(), '..', '..', 'packages', 'api-spec', 'openapi.yaml');
    try {
      const content = await readFile(specPath, 'utf8');
      reply.type('text/yaml').send(content);
    } catch {
      reply.status(404).send({ success: false, error: 'OpenAPI spec not found' });
    }
  });

  await app.listen({ port });
}

start();
