const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  console.time('query');
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.timeEnd('query');
    console.log('DB Connection OK');
  } catch (err) {
    console.error('DB Connection FAIL:', err.message);
  }
  process.exit(0);
}

test();
