import { prisma } from '@rnr/database';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  authorId: z.number().int(),
  published: z.boolean().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  authorId: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function postsRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const parsed = paginationSchema.safeParse(request.query);
    const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
    const pageSize = parsed.success && parsed.data.pageSize ? parsed.data.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.post.findMany({ skip, take: pageSize, include: { author: true } }),
      prisma.post.count(),
    ]);
    return { success: true, data: items, page, pageSize, total };
  });

  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    const post = await prisma.post.findUnique({ where: { id }, include: { author: true } });
    if (!post) return reply.status(404).send({ success: false, error: 'Post not found' });
    return { success: true, data: post };
  });

  app.post('/', async (request, reply) => {
    const parsed = createPostSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: 'Invalid body' });
    const post = await prisma.post.create({ data: parsed.data });
    return { success: true, data: post };
  });

  app.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    const parsed = updatePostSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: 'Invalid body' });
    try {
      const post = await prisma.post.update({ where: { id }, data: parsed.data });
      return { success: true, data: post };
    } catch {
      return reply.status(404).send({ success: false, error: 'Post not found' });
    }
  });

  app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    try {
      await prisma.post.delete({ where: { id } });
      return { success: true };
    } catch {
      return reply.status(404).send({ success: false, error: 'Post not found' });
    }
  });

  app.get<{ Params: { authorId: string } }>('/author/:authorId', async (request) => {
    const authorId = Number(request.params.authorId);
    const posts = await prisma.post.findMany({ where: { authorId }, include: { author: true } });
    return { success: true, data: posts };
  });
}
