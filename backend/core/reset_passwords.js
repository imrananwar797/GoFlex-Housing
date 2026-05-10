const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.update({
    where: { email: 'user1@goflex.com' },
    data: { password_hash: passwordHash }
  });
  
  console.log('Password reset for user:', user.email);
  
  const owner = await prisma.user.update({
    where: { email: 'owner1@goflex.com' },
    data: { password_hash: passwordHash }
  });
  console.log('Password reset for owner:', owner.email);
  
  process.exit(0);
}

reset().catch(err => {
  console.error(err);
  process.exit(1);
});
