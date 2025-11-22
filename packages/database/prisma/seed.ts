import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', name: 'Alice', password: hashedPassword },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', name: 'Bob', password: hashedPassword },
  });

  await prisma.post.create({
    data: { title: 'Hello World', content: 'First post', published: true, authorId: alice.id },
  });

  await prisma.post.create({
    data: { title: 'Draft Post', content: 'Work in progress', published: false, authorId: bob.id },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
