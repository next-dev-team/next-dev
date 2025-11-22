import { prisma } from '@rnr/database';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await prisma.user.findMany();
    return { success: true, data: users };
  });

  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return reply.status(404).send({ success: false, error: 'User not found' });
    return { success: true, data: user };
  });

  app.post('/', async (request, reply) => {
    const parsed = createUserSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: 'Invalid body' });
    const user = await prisma.user.create({ data: parsed.data });
    return { success: true, data: user };
  });

  app.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    const parsed = updateUserSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: 'Invalid body' });
    try {
      const user = await prisma.user.update({ where: { id }, data: parsed.data });
      return { success: true, data: user };
    } catch {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }
  });

  app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    try {
      await prisma.user.delete({ where: { id } });
      return { success: true };
    } catch {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }
  });
}
