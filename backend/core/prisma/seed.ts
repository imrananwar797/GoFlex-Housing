import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@goflex.com' },
    update: {},
    create: {
      username: 'rahul_owner',
      email: 'owner1@goflex.com',
      password_hash: passwordHash,
      full_name: 'Rahul Sharma',
      role: 'OWNER',
      referral_code: 'OWNER100',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@goflex.com' },
    update: {},
    create: {
      username: 'priya_owner',
      email: 'owner2@goflex.com',
      password_hash: passwordHash,
      full_name: 'Priya Das',
      role: 'OWNER',
      referral_code: 'OWNER200',
    },
  });

  // 2. Create Residents (Users)
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@goflex.com' },
    update: {},
    create: {
      username: 'amit_resident',
      email: 'user1@goflex.com',
      password_hash: passwordHash,
      full_name: 'Amit Kumar',
      role: 'RESIDENT',
      referral_code: 'RES101',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@goflex.com' },
    update: {},
    create: {
      username: 'sneha_resident',
      email: 'user2@goflex.com',
      password_hash: passwordHash,
      full_name: 'Sneha Rao',
      role: 'RESIDENT',
      referral_code: 'RES202',
    },
  });

  // 3. Create Properties
  await prisma.property.createMany({
    data: [
      {
        name: 'The Victorian Suite',
        description: 'Luxury co-living near Victoria Memorial.',
        state_iso: 'WB',
        city: 'Kolkata',
        rent: 15000,
        beds: 'Single',
        occupancy: 2,
        cover_image_url: 'https://images.pexels.com/photos/12313626/pexels-photo-12313626.jpeg',
      },
      {
        name: 'Gateway Residence',
        description: 'Premium stay with Mumbai harbor views.',
        state_iso: 'MH',
        city: 'Mumbai',
        rent: 25000,
        beds: 'Double',
        occupancy: 4,
        cover_image_url: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
      },
      {
        name: 'Silicon Valley Heights',
        description: 'Modern tech-integrated housing in HSR Layout.',
        state_iso: 'KA',
        city: 'Bengaluru',
        rent: 18000,
        beds: 'Single',
        occupancy: 1,
        cover_image_url: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
      }
    ]
  });

  // 4. Create Subscription Plans
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'Starter',
        description: 'Perfect for digital nomads and short-term stays.',
        price: 999,
        interval: 'month',
        features: ['High-speed WiFi', 'Weekly housekeeping', 'Community events', 'Basic support'],
        active: true,
      },
      {
        name: 'Premium',
        description: 'Designed for professionals seeking comfort and community.',
        price: 2499,
        interval: 'month',
        features: ['All Starter features', 'Gym access', 'Private workspace', 'Priority support', 'Guest passes'],
        active: true,
      },
      {
        name: 'Elite',
        description: 'The ultimate co-living experience with all-inclusive perks.',
        price: 4999,
        interval: 'month',
        features: ['All Premium features', 'Personal concierge', 'Meal plans included', 'Airport transfers', 'Global access'],
        active: true,
      }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
