import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GoFlex Housing seed...');

  // ─── Clean Existing Data ───
  console.log('🗑️  Clearing existing data...');
  await prisma.utilityReading.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.goFlexScore.deleteMany();
  await prisma.rentalAgreement.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.visitorLog.deleteMany();
  await prisma.kYC.deleteMany();
  await prisma.review.deleteMany();
  await prisma.fraudAlert.deleteMany();
  await prisma.escrowAccount.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.propertyPhoto.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared.');

  const hashPwd = (pwd: string) => bcrypt.hashSync(pwd, 10);

  // ─── USERS ───
  console.log('👤 Seeding users...');
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@goflex.in',
      full_name: 'GoFlex Administrator',
      phone: '9800000001',
      password_hash: hashPwd('Admin@123'),
      role: 'ADMIN',
      referral_code: 'ADMIN001',
    },
  });

  const owners = await Promise.all([
    prisma.user.create({ data: { username: 'rajesh_owner', email: 'owner1@goflex.in', full_name: 'Rajesh Kumar', phone: '9800000002', password_hash: hashPwd('Owner@123'), role: 'OWNER', referral_code: 'OWN001' } }),
    prisma.user.create({ data: { username: 'priya_owner', email: 'owner2@goflex.in', full_name: 'Priya Sharma', phone: '9800000003', password_hash: hashPwd('Owner@123'), role: 'OWNER', referral_code: 'OWN002' } }),
    prisma.user.create({ data: { username: 'arjun_owner', email: 'owner3@goflex.in', full_name: 'Arjun Mehta', phone: '9800000004', password_hash: hashPwd('Owner@123'), role: 'OWNER', referral_code: 'OWN003' } }),
    prisma.user.create({ data: { username: 'sunita_owner', email: 'owner4@goflex.in', full_name: 'Sunita Patel', phone: '9800000005', password_hash: hashPwd('Owner@123'), role: 'OWNER', referral_code: 'OWN004' } }),
    prisma.user.create({ data: { username: 'vikram_owner', email: 'owner5@goflex.in', full_name: 'Vikram Singh', phone: '9800000006', password_hash: hashPwd('Owner@123'), role: 'OWNER', referral_code: 'OWN005' } }),
  ]);

  const residents = await Promise.all([
    prisma.user.create({ data: { username: 'amit_r', email: 'resident1@goflex.in', full_name: 'Amit Roy', phone: '9800000007', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES001', referred_by: 'OWN001' } }),
    prisma.user.create({ data: { username: 'sneha_r', email: 'resident2@goflex.in', full_name: 'Sneha Das', phone: '9800000008', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES002' } }),
    prisma.user.create({ data: { username: 'rohit_r', email: 'resident3@goflex.in', full_name: 'Rohit Verma', phone: '9800000009', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES003' } }),
    prisma.user.create({ data: { username: 'pooja_r', email: 'resident4@goflex.in', full_name: 'Pooja Nair', phone: '9800000010', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES004' } }),
    prisma.user.create({ data: { username: 'karan_r', email: 'resident5@goflex.in', full_name: 'Karan Malhotra', phone: '9800000011', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES005' } }),
    prisma.user.create({ data: { username: 'ananya_r', email: 'resident6@goflex.in', full_name: 'Ananya Gupta', phone: '9800000012', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES006' } }),
    prisma.user.create({ data: { username: 'suresh_r', email: 'resident7@goflex.in', full_name: 'Suresh Babu', phone: '9800000013', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES007' } }),
    prisma.user.create({ data: { username: 'meera_r', email: 'resident8@goflex.in', full_name: 'Meera Krishnan', phone: '9800000014', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES008' } }),
    prisma.user.create({ data: { username: 'dev_r', email: 'resident9@goflex.in', full_name: 'Dev Sharma', phone: '9800000015', password_hash: hashPwd('Resident@123'), role: 'RESIDENT', referral_code: 'RES009' } }),
  ]);

  console.log(`✅ Users: 1 admin, ${owners.length} owners, ${residents.length} residents`);

  // ─── SUBSCRIPTION PLANS ───
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({ data: { name: 'Basic', description: 'Up to 3 properties, basic analytics', price: 999, interval: 'month', features: ['3 Properties', 'Basic Analytics', 'Email Support'], active: true } }),
    prisma.subscriptionPlan.create({ data: { name: 'Pro', description: 'Up to 15 properties, advanced analytics, priority support', price: 2499, interval: 'month', features: ['15 Properties', 'Advanced Analytics', 'Priority Support', 'AI Recommendations'], active: true } }),
    prisma.subscriptionPlan.create({ data: { name: 'Enterprise', description: 'Unlimited properties, full AI suite, dedicated manager', price: 4999, interval: 'month', features: ['Unlimited Properties', 'Full AI Suite', 'Dedicated Manager', 'Custom Integrations', 'SLA Guarantee'], active: true } }),
  ]);

  // Owner subscriptions
  await Promise.all([
    prisma.subscription.create({ data: { user_id: owners[0].id, plan_id: plans[1].id, status: 'active', current_period_start: new Date('2026-06-01'), current_period_end: new Date('2026-07-01') } }),
    prisma.subscription.create({ data: { user_id: owners[1].id, plan_id: plans[0].id, status: 'active', current_period_start: new Date('2026-06-15'), current_period_end: new Date('2026-07-15') } }),
    prisma.subscription.create({ data: { user_id: owners[2].id, plan_id: plans[2].id, status: 'active', current_period_start: new Date('2026-05-01'), current_period_end: new Date('2026-06-01') } }),
  ]);

  // ─── PROPERTIES ───
  console.log('🏢 Seeding properties...');
  const properties = await Promise.all([
    // Kolkata
    prisma.property.create({ data: { owner_id: owners[0].id, name: 'GoFlex Salt Lake Sanctuary', description: 'Premium co-living space in the heart of Salt Lake with modern amenities and 24/7 security. Perfect for IT professionals.', city: 'Kolkata', state: 'West Bengal', state_iso: 'WB', address: 'Sector V, Salt Lake, Kolkata 700091', beds: 20, baths: 8, rent: 8500, occupancy: 85, amenities: ['WiFi', 'AC', 'Laundry', 'Gym', 'CCTV', 'Security Guard', 'Power Backup', 'Cafeteria'], featured_image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', verified: true, active: true } }),
    prisma.property.create({ data: { owner_id: owners[0].id, name: 'GoFlex New Town Heights', description: 'Spacious PG accommodation near Eco Park with rooftop lounge and premium interiors.', city: 'Kolkata', state: 'West Bengal', state_iso: 'WB', address: 'Action Area 1, New Town, Kolkata 700156', beds: 15, baths: 6, rent: 7200, occupancy: 73, amenities: ['WiFi', 'AC', 'Parking', 'Rooftop', 'CCTV', 'Housekeeping'], featured_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', verified: true, active: true } }),
    // Mumbai
    prisma.property.create({ data: { owner_id: owners[1].id, name: 'GoFlex Bandra West Studio', description: 'Exclusive co-living in Bandra West with Mumbai skyline views. Steps from Linking Road.', city: 'Mumbai', state: 'Maharashtra', state_iso: 'MH', address: 'Hill Road, Bandra West, Mumbai 400050', beds: 12, baths: 5, rent: 14500, occupancy: 92, amenities: ['WiFi', 'AC', 'Gym', 'Terrace', 'CCTV', 'Concierge', 'Smart Lock'], featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', verified: true, active: true } }),
    prisma.property.create({ data: { owner_id: owners[1].id, name: 'GoFlex Powai Lake View', description: 'Modern hostel near Hiranandani with stunning lake views and tech-enabled rooms.', city: 'Mumbai', state: 'Maharashtra', state_iso: 'MH', address: 'Hiranandani Gardens, Powai, Mumbai 400076', beds: 18, baths: 7, rent: 11000, occupancy: 78, amenities: ['WiFi', 'AC', 'Laundry', 'Lake View', 'CCTV', 'Cafeteria', 'Power Backup'], featured_image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', verified: true, active: true } }),
    // Bangalore
    prisma.property.create({ data: { owner_id: owners[2].id, name: 'GoFlex Koramangala Hub', description: 'Tech-forward co-living in Koramangala. Ergonomic workstations, fiber internet, and vibrant community.', city: 'Bangalore', state: 'Karnataka', state_iso: 'KA', address: '4th Block, Koramangala, Bangalore 560034', beds: 25, baths: 10, rent: 12000, occupancy: 96, amenities: ['Fiber WiFi', 'AC', 'Co-working Space', 'Gym', 'Cafeteria', 'CCTV', 'Smart Lock', 'EV Charging'], featured_image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800', verified: true, active: true } }),
    prisma.property.create({ data: { owner_id: owners[2].id, name: 'GoFlex Whitefield Tech Park', description: 'Premium PG near ITPL with shuttle service to major tech parks. Ideal for IT professionals.', city: 'Bangalore', state: 'Karnataka', state_iso: 'KA', address: 'Whitefield Main Road, Bangalore 560066', beds: 30, baths: 12, rent: 9500, occupancy: 88, amenities: ['WiFi', 'AC', 'Shuttle Service', 'Gym', 'Laundry', 'CCTV', 'Power Backup'], featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', verified: true, active: true } }),
    // Delhi
    prisma.property.create({ data: { owner_id: owners[3].id, name: 'GoFlex Lajpat Nagar Premium', description: 'Central Delhi co-living with easy metro access. Fully furnished with premium appliances.', city: 'Delhi', state: 'Delhi', state_iso: 'DL', address: 'Lajpat Nagar II, New Delhi 110024', beds: 16, baths: 6, rent: 10500, occupancy: 81, amenities: ['WiFi', 'AC', 'Laundry', 'Metro Access', 'CCTV', 'Security', 'Power Backup'], featured_image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', verified: true, active: true } }),
    prisma.property.create({ data: { owner_id: owners[3].id, name: 'GoFlex Noida Sector 62', description: 'Modern hostel in Noida tech belt. Pool, gym, and community events every weekend.', city: 'Noida', state: 'Uttar Pradesh', state_iso: 'UP', address: 'Sector 62, Noida 201309', beds: 22, baths: 9, rent: 8800, occupancy: 69, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Cafeteria', 'CCTV', 'Events'], featured_image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800', verified: false, active: true } }),
    // Hyderabad
    prisma.property.create({ data: { owner_id: owners[4].id, name: 'GoFlex HITEC City Lounge', description: 'Luxurious co-living at the center of HITEC City. Walking distance to Mindspace and Cyberabad.', city: 'Hyderabad', state: 'Telangana', state_iso: 'TG', address: 'Madhapur, HITEC City, Hyderabad 500081', beds: 28, baths: 11, rent: 11500, occupancy: 94, amenities: ['Fiber WiFi', 'AC', 'Co-working', 'Gym', 'Cafeteria', 'CCTV', 'Smart Lock', 'Housekeeping'], featured_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', verified: true, active: true } }),
    prisma.property.create({ data: { owner_id: owners[4].id, name: 'GoFlex Gachibowli Silicon', description: 'Budget-friendly PG near Gachibowli stadium and DLF Cyber City. Great community vibe.', city: 'Hyderabad', state: 'Telangana', state_iso: 'TG', address: 'Gachibowli, Hyderabad 500032', beds: 20, baths: 8, rent: 7800, occupancy: 75, amenities: ['WiFi', 'AC', 'Laundry', 'Parking', 'CCTV', 'Security'], featured_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', verified: true, active: true } }),
  ]);

  console.log(`✅ Properties: ${properties.length}`);

  // ─── PROPERTY PHOTOS ───
  const photoUrls = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
  ];
  for (const prop of properties) {
    await Promise.all(photoUrls.slice(0, 3).map((url, i) =>
      prisma.propertyPhoto.create({ data: { property_id: prop.id, url, alt_text: `${prop.name} photo ${i + 1}` } })
    ));
  }

  // ─── ROOMS ───
  console.log('🛏️  Seeding rooms...');
  const allRooms: any[] = [];
  for (const prop of properties) {
    const baseRent = prop.rent;
    const rooms = await Promise.all([
      prisma.room.create({ data: { property_id: prop.id, name: `Room 101`, type: 'single', floor: 1, capacity: 1, rent: baseRent * 0.8, is_occupied: true, amenities: ['AC', 'WiFi', 'Wardrobe'] } }),
      prisma.room.create({ data: { property_id: prop.id, name: `Room 102`, type: 'double', floor: 1, capacity: 2, rent: baseRent * 1.0, is_occupied: true, amenities: ['AC', 'WiFi', 'Wardrobe', 'Balcony'] } }),
      prisma.room.create({ data: { property_id: prop.id, name: `Room 201`, type: 'single', floor: 2, capacity: 1, rent: baseRent * 0.9, is_occupied: false, amenities: ['AC', 'WiFi', 'Wardrobe', 'Attached Bathroom'] } }),
    ]);
    allRooms.push(...rooms);
  }
  console.log(`✅ Rooms: ${allRooms.length}`);

  // ─── KYC RECORDS ───
  console.log('📋 Seeding KYC records...');
  await Promise.all([
    prisma.kYC.create({ data: { user_id: owners[0].id, document_type: 'aadhaar', document_url: 'https://wzrphhppzfczkxxihyiy.supabase.co/storage/v1/object/public/kyc/owner1_aadhaar.pdf', status: 'verified', reviewed_by: admin.id, review_notes: 'All documents verified successfully.' } }),
    prisma.kYC.create({ data: { user_id: owners[1].id, document_type: 'pan', document_url: 'https://wzrphhppzfczkxxihyiy.supabase.co/storage/v1/object/public/kyc/owner2_pan.pdf', status: 'verified', reviewed_by: admin.id, review_notes: 'Verified.' } }),
    prisma.kYC.create({ data: { user_id: owners[2].id, document_type: 'passport', document_url: 'https://wzrphhppzfczkxxihyiy.supabase.co/storage/v1/object/public/kyc/owner3_passport.pdf', status: 'pending' } }),
    prisma.kYC.create({ data: { user_id: residents[0].id, document_type: 'aadhaar', document_url: 'https://wzrphhppzfczkxxihyiy.supabase.co/storage/v1/object/public/kyc/res1_aadhaar.pdf', status: 'verified', reviewed_by: admin.id } }),
    prisma.kYC.create({ data: { user_id: residents[1].id, document_type: 'aadhaar', document_url: 'https://wzrphhppzfczkxxihyiy.supabase.co/storage/v1/object/public/kyc/res2_aadhaar.pdf', status: 'rejected', reviewed_by: admin.id, review_notes: 'Document image blurry. Please reupload.' } }),
  ]);

  // ─── BOOKINGS ───
  console.log('📅 Seeding bookings...');
  const bookings: any[] = [];
  const residentRoomPairs = [
    [residents[0], allRooms[0], properties[0]],
    [residents[1], allRooms[3], properties[1]],
    [residents[2], allRooms[6], properties[2]],
    [residents[3], allRooms[9], properties[3]],
    [residents[4], allRooms[12], properties[4]],
    [residents[5], allRooms[15], properties[5]],
    [residents[6], allRooms[18], properties[6]],
    [residents[7], allRooms[21], properties[7]],
    [residents[8], allRooms[24], properties[8]],
  ];

  for (const [resident, room, property] of residentRoomPairs) {
    const b = await prisma.booking.create({
      data: {
        resident_id: (resident as any).id,
        property_id: (property as any).id,
        room_id: (room as any).id,
        check_in_date: new Date('2026-04-01'),
        check_out_date: new Date('2026-10-01'),
        total_amount: (room as any).rent,
        status: 'confirmed',
        payment_status: 'paid',
      },
    });
    bookings.push(b);
  }

  // A few pending bookings
  for (let i = 0; i < 3; i++) {
    const b = await prisma.booking.create({
      data: {
        resident_id: residents[i % residents.length].id,
        property_id: properties[(i + 5) % properties.length].id,
        room_id: allRooms[(i * 3 + 2)].id,
        check_in_date: new Date('2026-08-01'),
        check_out_date: new Date('2027-02-01'),
        total_amount: allRooms[(i * 3 + 2)].rent,
        status: 'pending',
        payment_status: 'pending',
      },
    });
    bookings.push(b);
  }

  // Cancelled booking
  await prisma.booking.create({
    data: {
      resident_id: residents[4].id,
      property_id: properties[0].id,
      room_id: allRooms[2].id,
      check_in_date: new Date('2026-03-01'),
      check_out_date: new Date('2026-09-01'),
      total_amount: allRooms[2].rent,
      status: 'cancelled',
      payment_status: 'refunded',
    },
  });

  console.log(`✅ Bookings: ${bookings.length + 4}`);

  // ─── PAYMENTS ───
  console.log('💰 Seeding payments...');
  const months = ['2026-04', '2026-05', '2026-06', '2026-07'];
  const paymentMethods = ['UPI', 'Card', 'NetBanking', 'UPI', 'Card'];

  for (let i = 0; i < Math.min(bookings.length, 9); i++) {
    const booking = bookings[i];
    for (let m = 0; m < Math.min(i + 1, months.length); m++) {
      await prisma.paymentTransaction.create({
        data: {
          booking_id: booking.id,
          user_id: booking.resident_id,
          stripe_payment_id: `pay_goflex_${booking.id}_${m}_${Date.now()}`,
          amount: booking.total_amount,
          currency: 'INR',
          status: m < months.length - 1 ? 'completed' : (Math.random() > 0.3 ? 'completed' : 'pending'),
          created_at: new Date(`${months[m]}-05T10:00:00Z`),
        },
      });
    }
  }
  console.log('✅ Payments seeded.');

  // ─── COMPLAINTS ───
  console.log('🔧 Seeding complaints...');
  const complaintData = [
    { resident_id: residents[0].id, property_id: properties[0].id, room_id: allRooms[0].id, category: 'maintenance', priority: 'high', title: 'Water leakage in bathroom', description: 'There is a continuous water leak from the overhead tank pipe. Needs urgent repair.', status: 'resolved', resolved_at: new Date('2026-05-15') },
    { resident_id: residents[1].id, property_id: properties[1].id, category: 'cleanliness', priority: 'medium', title: 'Common area not cleaned', description: 'The hallway on floor 1 has not been cleaned for 3 days. Strong odor noticed.', status: 'in_progress' },
    { resident_id: residents[2].id, property_id: properties[2].id, room_id: allRooms[6].id, category: 'noise', priority: 'low', title: 'Noise disturbance after 11 PM', description: 'Residents in room 103 are playing loud music after 11 PM on weekdays.', status: 'open' },
    { resident_id: residents[3].id, property_id: properties[3].id, category: 'security', priority: 'urgent', title: 'CCTV camera not working', description: 'The CCTV camera near the main entrance has been offline for 2 days.', status: 'in_progress' },
    { resident_id: residents[4].id, property_id: properties[4].id, room_id: allRooms[12].id, category: 'maintenance', priority: 'medium', title: 'AC not cooling properly', description: 'Room AC has been running but not cooling below 28°C even at max setting.', status: 'resolved', resolved_at: new Date('2026-06-20') },
    { resident_id: residents[5].id, property_id: properties[5].id, category: 'maintenance', priority: 'high', title: 'Elevator malfunction', description: 'Elevator stopped mid-floor twice this week. Safety hazard for all residents.', status: 'in_progress' },
    { resident_id: residents[6].id, property_id: properties[6].id, room_id: allRooms[18].id, category: 'cleanliness', priority: 'low', title: 'Dusty ventilation grilles', description: 'Ventilation grilles in room are heavily dusty and haven\'t been cleaned in months.', status: 'open' },
    { resident_id: residents[7].id, property_id: properties[7].id, category: 'other', priority: 'medium', title: 'WiFi router in corridor offline', description: 'The WiFi router on floor 2 corridor has been offline since yesterday. Low signal in rooms.', status: 'resolved', resolved_at: new Date('2026-07-01') },
    { resident_id: residents[8].id, property_id: properties[8].id, category: 'maintenance', priority: 'high', title: 'Window latch broken', description: 'Room window latch is completely broken. Cannot secure window properly. Security concern.', status: 'open' },
    { resident_id: residents[0].id, property_id: properties[0].id, category: 'cleanliness', priority: 'low', title: 'Pest sighting in kitchen', description: 'Saw a cockroach near the kitchen sink area twice this week.', status: 'open' },
    { resident_id: residents[1].id, property_id: properties[1].id, category: 'maintenance', priority: 'medium', title: 'Hot water not available', description: 'Hot water geyser not working since last evening. Please fix urgently.', status: 'in_progress' },
    { resident_id: residents[2].id, property_id: properties[2].id, category: 'security', priority: 'high', title: 'Door lock malfunctioning', description: 'Main door smart lock is intermittently failing. Had to use emergency override twice.', status: 'resolved', resolved_at: new Date('2026-06-10') },
  ];

  await prisma.complaint.createMany({ data: complaintData });
  console.log(`✅ Complaints: ${complaintData.length}`);

  // ─── RENTAL AGREEMENTS ───
  console.log('📄 Seeding agreements...');
  for (let i = 0; i < Math.min(bookings.length, 8); i++) {
    const booking = bookings[i];
    const owner = properties.find(p => p.id === booking.property_id);
    if (!owner) continue;
    await prisma.rentalAgreement.create({
      data: {
        property_id: booking.property_id,
        resident_id: booking.resident_id,
        owner_id: owner.owner_id!,
        room_id: booking.room_id,
        rent_amount: booking.total_amount,
        security_deposit: booking.total_amount * 2,
        start_date: new Date('2026-04-01'),
        end_date: new Date('2026-10-01'),
        notice_period: 30,
        status: i < 6 ? 'signed' : 'sent',
        resident_signed: i < 6,
        owner_signed: i < 6,
        resident_signed_at: i < 6 ? new Date('2026-03-28') : null,
        owner_signed_at: i < 6 ? new Date('2026-03-29') : null,
        clauses: { 'no_pets': true, 'no_smoking': true, 'guests_allowed': 'till 10pm', 'notice_period': '30 days' },
      },
    });
  }
  console.log('✅ Agreements seeded.');

  // ─── GOFLEX SCORES ───
  console.log('⭐ Seeding GoFlex scores...');
  const scoreData = [
    { user_id: residents[0].id, overall_score: 94, payment_score: 98, compliance_score: 90, complaint_score: 95, verification_score: 100, is_verified: true, verification_badge: 'gold', total_reviews: 3, avg_rating: 4.7 },
    { user_id: residents[1].id, overall_score: 78, payment_score: 80, compliance_score: 75, complaint_score: 70, verification_score: 0, is_verified: false, verification_badge: 'bronze', total_reviews: 1, avg_rating: 4.0 },
    { user_id: residents[2].id, overall_score: 88, payment_score: 92, compliance_score: 85, complaint_score: 88, verification_score: 100, is_verified: true, verification_badge: 'silver', total_reviews: 2, avg_rating: 4.5 },
    { user_id: residents[3].id, overall_score: 72, payment_score: 75, compliance_score: 70, complaint_score: 65, verification_score: 100, is_verified: true, verification_badge: 'bronze', total_reviews: 0, avg_rating: 0 },
    { user_id: residents[4].id, overall_score: 96, payment_score: 100, compliance_score: 95, complaint_score: 98, verification_score: 100, is_verified: true, verification_badge: 'platinum', total_reviews: 5, avg_rating: 4.9 },
    { user_id: residents[5].id, overall_score: 85, payment_score: 88, compliance_score: 82, complaint_score: 85, verification_score: 100, is_verified: true, verification_badge: 'silver', total_reviews: 2, avg_rating: 4.3 },
    { user_id: residents[6].id, overall_score: 67, payment_score: 65, compliance_score: 70, complaint_score: 60, verification_score: 0, is_verified: false, verification_badge: 'bronze', total_reviews: 1, avg_rating: 3.5 },
    { user_id: residents[7].id, overall_score: 91, payment_score: 95, compliance_score: 90, complaint_score: 92, verification_score: 100, is_verified: true, verification_badge: 'gold', total_reviews: 4, avg_rating: 4.8 },
    { user_id: residents[8].id, overall_score: 80, payment_score: 82, compliance_score: 80, complaint_score: 78, verification_score: 100, is_verified: true, verification_badge: 'silver', total_reviews: 2, avg_rating: 4.2 },
    // Owner scores
    { user_id: owners[0].id, overall_score: 97, payment_score: 100, compliance_score: 95, complaint_score: 98, verification_score: 100, maintenance_score: 96, responsiveness_score: 98, is_verified: true, verification_badge: 'platinum', total_reviews: 12, avg_rating: 4.9 },
    { user_id: owners[1].id, overall_score: 89, payment_score: 92, compliance_score: 88, complaint_score: 85, verification_score: 100, maintenance_score: 88, responsiveness_score: 90, is_verified: true, verification_badge: 'gold', total_reviews: 8, avg_rating: 4.6 },
  ];

  await Promise.all(scoreData.map(s => prisma.goFlexScore.create({ data: s })));
  console.log('✅ GoFlex scores seeded.');

  // ─── COMMUNITY POSTS ───
  console.log('💬 Seeding community posts...');
  await Promise.all([
    prisma.communityPost.create({ data: { property_id: properties[0].id, author_id: residents[0].id, type: 'announcement', title: '🎉 Welcome New Residents!', content: 'Welcome to GoFlex Salt Lake Sanctuary! Please join our WhatsApp group for quick updates.', is_pinned: true } }),
    prisma.communityPost.create({ data: { property_id: properties[0].id, author_id: residents[1].id, type: 'marketplace', title: 'Selling study table & chair', content: 'Moving out next month. Selling a study table + ergonomic chair combo. DM me. ₹2500 negotiable.' } }),
    prisma.communityPost.create({ data: { property_id: properties[0].id, author_id: residents[2].id, type: 'event', title: 'Chess Tournament this Sunday!', content: 'Organizing an informal chess tournament this Sunday 4 PM in the common room. All are welcome!' } }),
    prisma.communityPost.create({ data: { property_id: properties[4].id, author_id: residents[4].id, type: 'lost_found', title: 'Found: Blue umbrella', content: 'Found a blue Stag umbrella near the lift on floor 2. Please claim at reception.' } }),
    prisma.communityPost.create({ data: { property_id: properties[4].id, author_id: residents[5].id, type: 'announcement', title: 'Water supply disruption tomorrow', content: 'BWSSB has informed us about a scheduled maintenance. Water will be unavailable 10 AM – 2 PM tomorrow.' } }),
    prisma.communityPost.create({ data: { property_id: properties[8].id, author_id: residents[8].id, type: 'event', title: 'Diwali Celebration Party 🪔', content: 'Property Diwali party on Oct 29th! Bring sweets. Management will arrange crackers on the terrace.' } }),
  ]);
  console.log('✅ Community posts seeded.');

  // ─── VISITOR LOGS ───
  console.log('🚪 Seeding visitor logs...');
  await Promise.all([
    prisma.visitorLog.create({ data: { property_id: properties[0].id, resident_id: residents[0].id, visitor_name: 'Priya Roy', visitor_phone: '9811111111', purpose: 'Family visit', check_in: new Date('2026-07-10T14:00:00Z'), check_out: new Date('2026-07-10T20:00:00Z'), approved: true } }),
    prisma.visitorLog.create({ data: { property_id: properties[0].id, resident_id: residents[1].id, visitor_name: 'Mohan Das', visitor_phone: '9822222222', purpose: 'Friend', check_in: new Date('2026-07-12T11:00:00Z'), approved: true } }),
    prisma.visitorLog.create({ data: { property_id: properties[4].id, resident_id: residents[4].id, visitor_name: 'Anjali Mehta', visitor_phone: '9833333333', purpose: 'Office colleague', check_in: new Date('2026-07-13T17:00:00Z'), check_out: new Date('2026-07-13T21:00:00Z'), approved: true } }),
    prisma.visitorLog.create({ data: { property_id: properties[8].id, resident_id: residents[8].id, visitor_name: 'Ramesh Sharma', visitor_phone: '9844444444', purpose: 'Guest', check_in: new Date('2026-07-14T10:00:00Z'), approved: false } }),
  ]);
  console.log('✅ Visitor logs seeded.');

  // ─── UTILITY READINGS ───
  console.log('⚡ Seeding utility readings...');
  for (let i = 0; i < 5; i++) {
    await Promise.all([5, 6, 7].map(month =>
      prisma.utilityReading.create({
        data: {
          property_id: properties[i].id,
          room_id: allRooms[i * 3].id,
          month, year: 2026,
          electricity: 120 + Math.floor(Math.random() * 80),
          water: 1500 + Math.floor(Math.random() * 500),
          wifi_usage: 50 + Math.floor(Math.random() * 100),
          electricity_bill: 960 + Math.floor(Math.random() * 640),
          water_bill: 150 + Math.floor(Math.random() * 50),
          wifi_bill: 200,
          total_bill: 1310 + Math.floor(Math.random() * 690),
        },
      })
    ));
  }
  console.log('✅ Utility readings seeded.');

  // ─── SERVICE REQUESTS ───
  console.log('🛠️  Seeding service requests...');
  await Promise.all([
    prisma.serviceRequest.create({ data: { resident_id: residents[0].id, property_id: properties[0].id, service_type: 'cleaning', description: 'Deep cleaning of room before parents visit this weekend', scheduled_at: new Date('2026-07-20T09:00:00Z'), status: 'confirmed', cost_estimate: 500, provider_name: 'CleanPro Services' } }),
    prisma.serviceRequest.create({ data: { resident_id: residents[2].id, property_id: properties[2].id, service_type: 'laundry', description: 'Pickup and delivery laundry service — 5 kg load', scheduled_at: new Date('2026-07-18T08:00:00Z'), status: 'completed', cost_estimate: 200, final_cost: 180, provider_name: 'QuickWash' } }),
    prisma.serviceRequest.create({ data: { resident_id: residents[4].id, property_id: properties[4].id, service_type: 'internet', description: 'Need additional router extension for far end of room', status: 'pending', cost_estimate: 300 } }),
    prisma.serviceRequest.create({ data: { resident_id: residents[6].id, property_id: properties[6].id, service_type: 'repairs', description: 'Tube light not working in bathroom', scheduled_at: new Date('2026-07-16T11:00:00Z'), status: 'confirmed', cost_estimate: 150, provider_name: 'Property Maintenance Team' } }),
  ]);
  console.log('✅ Service requests seeded.');

  // ─── REVIEWS ───
  console.log('⭐ Seeding reviews...');
  await Promise.all([
    prisma.review.create({ data: { property_id: properties[0].id, user_id: residents[0].id, rating: 4.5, comment: 'Excellent location and facilities. Staff is very responsive. Minor issue with hot water sometimes but overall great experience.', is_featured: true, status: 'published' } }),
    prisma.review.create({ data: { property_id: properties[2].id, user_id: residents[2].id, rating: 5.0, comment: 'Best co-living I have ever stayed in! The community vibe is amazing. High-speed internet and clean rooms. 10/10 would recommend!', is_featured: true, status: 'published' } }),
    prisma.review.create({ data: { property_id: properties[4].id, user_id: residents[4].id, rating: 4.8, comment: 'Perfect for tech professionals. Co-working space is well-equipped. Management is proactive about complaints. Love it here.', is_featured: true, status: 'published' } }),
    prisma.review.create({ data: { property_id: properties[0].id, user_id: residents[1].id, rating: 4.0, comment: 'Good value for money. Cleanliness could be slightly better but overall satisfied.', status: 'published' } }),
    prisma.review.create({ data: { property_id: properties[8].id, user_id: residents[8].id, rating: 4.6, comment: 'HITEC City location is unbeatable. Walkable to most major offices. The housekeeping service is very good.', is_featured: true, status: 'published' } }),
  ]);
  console.log('✅ Reviews seeded.');

  // ─── BLOG POSTS ───
  console.log('📰 Seeding blog posts...');
  await Promise.all([
    prisma.blogPost.create({ data: { title: 'Top 5 Co-Living Spaces in Bangalore for IT Professionals', slug: 'top-5-coliving-bangalore-2026', excerpt: 'Discover the best co-living properties in Bangalore that offer fiber internet, ergonomic workstations, and vibrant communities for tech workers.', content: 'Bangalore has become the undisputed co-living capital of India. With thousands of IT professionals migrating every year, the demand for quality shared living has skyrocketed...\n\nHere are our top 5 picks for 2026:\n\n1. GoFlex Koramangala Hub — The ultimate tech co-living with 1Gbps fiber and dedicated co-working spaces.\n2. GoFlex Whitefield Tech Park — Closest to ITPL with shuttle services.\n...', featured_image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800', category: 'Lifestyle', tags: ['bangalore', 'co-living', 'IT professionals', 'real estate'], view_count: 1240, author_id: admin.id } }),
    prisma.blogPost.create({ data: { title: 'How GoFlex Score Works: Your Digital Trust Identity', slug: 'goflex-score-explained', excerpt: 'Learn how the GoFlex Score algorithm calculates your trust identity as a resident or property owner and how to improve it.', content: 'The GoFlex Score is a dynamic trust metric that ranges from 0 to 100. It is calculated based on four key components:\n\n**1. Payment Score (40 points)**: Based on your on-time payment history...\n**2. Compliance Score (30 points)**: Agreement adherence and policy compliance...\n**3. Complaint Score (20 points)**: Frequency and nature of raised complaints...\n**4. Verification Score (10 points)**: KYC and document verification status...\n\nA higher GoFlex Score unlocks better properties, priority booking, and even rental discounts!', featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', category: 'Platform', tags: ['goflex score', 'trust', 'residents', 'payments'], view_count: 867, author_id: admin.id } }),
    prisma.blogPost.create({ data: { title: 'Renting in Mumbai in 2026: What You Need to Know', slug: 'renting-mumbai-2026-guide', excerpt: 'A comprehensive guide to finding and renting co-living spaces in Mumbai — neighborhoods, budgets, legal requirements, and red flags to avoid.', content: 'Mumbai\'s rental market has evolved dramatically. Co-living has become the preferred choice for young professionals who value flexibility and community...\n\nKey neighborhoods: Bandra West (premium), Powai (tech hub), Andheri East (budget-friendly), Kurla (transit hub)...\n\nAverage monthly costs in 2026:\n- Single room: ₹12,000–₹20,000\n- Shared room: ₹8,000–₹14,000...', featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', category: 'Guide', tags: ['mumbai', 'renting', 'guide', 'co-living'], view_count: 2103, author_id: admin.id } }),
  ]);
  console.log('✅ Blog posts seeded.');

  // ─── NOTIFICATIONS ───
  console.log('🔔 Seeding notifications...');
  const notifData = [
    { user_id: residents[0].id, type: 'payment', title: 'Rent Due Reminder', message: 'Your July 2026 rent of ₹8,500 is due on July 5th. Please ensure timely payment to maintain your GoFlex Score.' },
    { user_id: residents[0].id, type: 'complaint', title: 'Complaint Resolved', message: 'Your complaint "Water leakage in bathroom" has been resolved. Please rate your experience.' },
    { user_id: residents[2].id, type: 'booking', title: 'Booking Confirmed', message: 'Your booking at GoFlex Bandra West Studio has been confirmed. Check-in: April 1, 2026.' },
    { user_id: residents[4].id, type: 'score', title: 'GoFlex Score Updated', message: 'Your GoFlex Score has increased to 96 (Platinum). You are now eligible for priority property access!' },
    { user_id: owners[0].id, type: 'booking', title: 'New Booking Request', message: 'A new booking request for Room 102 at GoFlex Salt Lake Sanctuary from Rohit Verma.' },
    { user_id: owners[1].id, type: 'complaint', title: 'New Complaint Filed', message: 'Resident Pooja Nair has filed a complaint: "CCTV camera not working" — Priority: Urgent.' },
    { user_id: admin.id, type: 'kyc', title: 'KYC Review Pending', message: 'Arjun Mehta (Owner) has submitted KYC documents. Review required.' },
  ];

  await Promise.all(notifData.map(n => prisma.notification.create({ data: n })));
  console.log('✅ Notifications seeded.');

  // ─── FRAUD ALERTS ───
  console.log('🚨 Seeding fraud alerts...');
  await Promise.all([
    prisma.fraudAlert.create({ data: { user_id: residents[6].id, booking_id: bookings[6]?.id, severity: 'medium', alert_type: 'MULTIPLE_BOOKINGS', description: 'Resident attempted to book 3 different properties in the same time period within 2 hours.', status: 'reviewed', score: 67.4 } }),
    prisma.fraudAlert.create({ data: { user_id: residents[1].id, severity: 'low', alert_type: 'PAYMENT_FAILURE', description: 'Payment attempt failed 3 consecutive times with different cards.', status: 'pending', score: 45.2 } }),
  ]);
  console.log('✅ Fraud alerts seeded.');

  console.log('\n🎉 ═══════════════════════════════════════════════════════');
  console.log('🎉  GoFlex Housing seed completed successfully!');
  console.log('🎉 ═══════════════════════════════════════════════════════');
  console.log('\n📋 Demo Login Credentials:');
  console.log('   Admin:    admin@goflex.in      / Admin@123');
  console.log('   Owner:    owner1@goflex.in     / Owner@123');
  console.log('   Resident: resident1@goflex.in  / Resident@123');
  console.log('\n📊 Data Summary:');
  console.log(`   Users: 15 (1 admin, 5 owners, 9 residents)`);
  console.log(`   Properties: 10 across 5 cities`);
  console.log(`   Rooms: 30`);
  console.log(`   Bookings: 13`);
  console.log(`   Payments: 20+`);
  console.log(`   Complaints: 12`);
  console.log(`   Agreements: 8`);
  console.log(`   GoFlex Scores: 11`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
