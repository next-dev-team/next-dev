import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { usersRoutes } from './users';
import { postsRoutes } from './posts';
import { authRoutes } from './auth';
import { authenticateToken } from './auth-middleware';

export function createServer() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? '*',
  });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? 'Internal Server Error';
    reply.status(statusCode).send({ success: false, error: message });
  });

  app.register(usersRoutes, { prefix: '/api/users' });
  app.register(postsRoutes, { prefix: '/api/posts' });
  app.register(authRoutes, { prefix: '/api/auth' });

  // Add authentication hook to protected routes
  app.addHook('preHandler', async (request, reply) => {
    const url = request.url;
    const method = request.method;

    // Skip authentication for auth routes and GET requests
    if (url?.startsWith('/api/auth') || method === 'GET') {
      return;
    }

    // Require authentication for POST, PUT, DELETE operations on protected routes
    if (url?.startsWith('/api/users') || url?.startsWith('/api/posts')) {
      await authenticateToken(request, reply);
    }
  });

  return app;
}
