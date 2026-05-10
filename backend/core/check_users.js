const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  users.forEach(u => {
    console.log(`User: ${u.username} | Email: ${u.email} | Role: ${u.role}`);
  });
  process.exit(0);
}

check();
