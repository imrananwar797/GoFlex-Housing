import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Demo seed started...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@goflex.com' },
    update: {},
    create: {
      username: 'prime_owner',
      email: 'owner@goflex.com',
      password_hash: passwordHash,
      full_name: 'Vikram Singh',
      role: 'OWNER',
      referral_code: 'OWNER_PRIME',
    },
  });

  // 2. Create Properties for this owner
  const p1 = await prisma.property.create({
    data: {
      owner_id: owner1.id,
      name: 'Cyber Heights Residency',
      description: 'Ultra-modern co-living with smart automation in Indiranagar.',
      state_iso: 'KA',
      city: 'Bengaluru',
      rent: 22000,
      beds: 'Single',
      occupancy: 95,
      cover_image_url: 'https://images.pexels.com/photos/12313626/pexels-photo-12313626.jpeg',
    }
  });

  const p2 = await prisma.property.create({
    data: {
      owner_id: owner1.id,
      name: 'The Whitehouse Suites',
      description: 'Luxury heritage stay near Whitefield tech corridor.',
      state_iso: 'KA',
      city: 'Bengaluru',
      rent: 18000,
      beds: 'Double',
      occupancy: 88,
      cover_image_url: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
    }
  });

  const p3 = await prisma.property.create({
    data: {
      owner_id: owner1.id,
      name: 'Oceanic Vista',
      description: 'High-rise executive housing with Worli Sea Link views.',
      state_iso: 'MH',
      city: 'Mumbai',
      rent: 35000,
      beds: 'Single',
      occupancy: 92,
      cover_image_url: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
    }
  });

  // 3. Create Residents
  const r1 = await prisma.user.create({
    data: {
      username: 'arnav_dev',
      email: 'arnav@example.com',
      password_hash: passwordHash,
      full_name: 'Arnav Roy',
      role: 'RESIDENT',
      referral_code: 'ARNAV1',
    }
  });

  const r2 = await prisma.user.create({
    data: {
      username: 'kiara_m',
      email: 'kiara@example.com',
      password_hash: passwordHash,
      full_name: 'Kiara Malhotra',
      role: 'RESIDENT',
      referral_code: 'KIARA2',
    }
  });

  // 4. Create Bookings
  const b1 = await prisma.booking.create({
    data: {
      user_id: r1.id,
      property_id: p1.id,
      check_in_date: new Date('2026-01-01'),
      check_out_date: new Date('2026-12-31'),
      status: 'active',
      total_amount: 22000,
    }
  });

  const b2 = await prisma.booking.create({
    data: {
      user_id: r2.id,
      property_id: p2.id,
      check_in_date: new Date('2026-02-15'),
      check_out_date: new Date('2026-08-15'),
      status: 'active',
      total_amount: 18000,
    }
  });

  // 5. Create Payment Transactions (Revenue)
  const months = [1, 2, 3, 4, 5];
  for (const m of months) {
    await prisma.paymentTransaction.create({
      data: {
        user_id: r1.id,
        booking_id: b1.id,
        amount: 22000,
        method: 'upi',
        status: 'completed',
        transaction_id: `TXN_B1_M${m}`,
        created_at: new Date(2026, m-1, 5),
      }
    });

    await prisma.paymentTransaction.create({
      data: {
        user_id: r2.id,
        booking_id: b2.id,
        amount: 18000,
        method: 'card',
        status: 'completed',
        transaction_id: `TXN_B2_M${m}`,
        created_at: new Date(2026, m-1, 7),
      }
    });
  }

  console.log('Demo seed completed successfully!');
  console.log('Owner Login: owner@goflex.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
