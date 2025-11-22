import { prisma } from '@rnr/database';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(6),
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: hashedPassword,
      },
    });
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
      // First check if user exists
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }

      // Check if user has any posts
      const postCount = await prisma.post.count({ where: { authorId: id } });
      if (postCount > 0) {
        return reply.status(400).send({
          success: false,
          error: 'Cannot delete user with existing posts. Please delete their posts first.',
        });
      }

      // If no posts, proceed with deletion
      await prisma.user.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      console.error('Delete user error:', error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
