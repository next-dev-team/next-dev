import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { email: "alice@example.com", name: "Alice" }
  })

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { email: "bob@example.com", name: "Bob" }
  })

  await prisma.post.create({
    data: { title: "Hello World", content: "First post", published: true, authorId: alice.id }
  })

  await prisma.post.create({
    data: { title: "Draft Post", content: "Work in progress", published: false, authorId: bob.id }
  })
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
