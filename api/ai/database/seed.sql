-- Seed Admin User
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_verified)
VALUES (
  'admin@goflex.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz', -- This is a placeholder - use bcrypt in production
  'Admin',
  'GoFlex',
  'admin',
  true,
  true
) ON CONFLICT DO NOTHING;

-- Seed Sample Residents
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_verified, phone)
VALUES 
  ('rajesh@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Rajesh', 'Kumar', 'resident', true, true, '+919876543210'),
  ('priya@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Priya', 'Singh', 'resident', true, true, '+919876543211'),
  ('vikram@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Vikram', 'Patel', 'resident', true, true, '+919876543212')
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Properties
INSERT INTO properties (
  owner_id,
  name,
  description,
  address,
  city,
  state,
  postal_code,
  latitude,
  longitude,
  property_type,
  total_rooms,
  available_rooms,
  monthly_price,
  security_deposit,
  amenities,
  featured_image,
  rating,
  total_reviews,
  occupancy_rate,
  is_verified,
  is_active
)
SELECT
  (SELECT id FROM users WHERE email = 'admin@goflex.com' LIMIT 1),
  prop.name,
  prop.description,
  prop.address,
  prop.city,
  prop.state,
  prop.postal_code,
  prop.latitude,
  prop.longitude,
  prop.property_type,
  prop.total_rooms,
  prop.available_rooms,
  prop.monthly_price,
  prop.security_deposit,
  prop.amenities,
  prop.featured_image,
  4.8,
  12,
  92.0,
  true,
  true
FROM (
  VALUES
    (
      'Sky Deck Residency',
      'Premium co-living space with rooftop lounge and high-speed Wi-Fi',
      '123 MG Road, Bengaluru',
      'Bengaluru',
      'Karnataka',
      '560001',
      12.9716,
      77.5946,
      'executive_suite',
      8,
      2,
      45000.00,
      100000.00,
      ARRAY['WiFi', 'Gym', 'Laundry', 'Kitchen', 'Security', 'Parking'],
      'https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',
      1
    ),
    (
      'Urban Haven - Mumbai',
      'Coliving space in the heart of Mumbai with modern amenities',
      '456 Marine Drive, Mumbai',
      'Mumbai',
      'Maharashtra',
      '400020',
      19.0760,
      72.8777,
      'one_bedroom',
      12,
      4,
      55000.00,
      120000.00,
      ARRAY['WiFi', 'Gym', 'Community Space', 'Kitchen', 'Security', 'Housekeeping'],
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      2
    ),
    (
      'Tech Hub Residency - Delhi',
      'Co-living community designed for tech professionals',
      '789 Connaught Place, New Delhi',
      'New Delhi',
      'Delhi',
      '110001',
      28.6328,
      77.2197,
      'studio',
      20,
      5,
      35000.00,
      80000.00,
      ARRAY['WiFi', 'Coworking', 'Kitchen', 'Security', 'Parking'],
      'https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg',
      3
    )
  ) AS prop(name, description, address, city, state, postal_code, latitude, longitude, property_type, total_rooms, available_rooms, monthly_price, security_deposit, amenities, featured_image, featured_image_num)
ON CONFLICT DO NOTHING;

-- Seed Virtual Tours
INSERT INTO virtual_tours (property_id, tour_name, tour_type, tour_url, thumbnail_url, duration_seconds, description)
SELECT
  id,
  'Complete Walkthrough',
  '3d_walkthrough',
  'https://example.com/tours/property-' || SUBSTRING(id::text, 1, 8),
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
  300,
  'Full 360-degree tour of all common areas and a sample room'
FROM properties
LIMIT 3
ON CONFLICT DO NOTHING;

-- Seed Trust Badges
INSERT INTO trust_badges (property_id, badge_name, badge_icon, badge_description, issuer, is_verified)
SELECT
  p.id,
  badge.name,
  badge.icon,
  badge.description,
  badge.issuer,
  true
FROM properties p
CROSS JOIN (
  VALUES
    ('ISO 9001 Certified', '🏅', 'Quality Management Certified', 'ISO'),
    ('Verified by GoFlex', '✓', 'GoFlex verification completed', 'GoFlex'),
    ('Safety Certified', '🛡️', 'Safety standards compliance verified', 'Government')
) AS badge(name, icon, description, issuer)
LIMIT 9
ON CONFLICT DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (property_id, user_id, rating, quote, is_featured, is_verified)
SELECT
  p.id,
  u.id,
  5,
  'Amazing experience! The team is very responsive and the amenities are top-notch.',
  true,
  true
FROM properties p
CROSS JOIN users u
WHERE u.email IN ('rajesh@example.com', 'priya@example.com')
LIMIT 6
ON CONFLICT DO NOTHING;

-- Seed Resident Stats
INSERT INTO resident_stats (user_id, total_bookings, completed_stays, avg_rating, total_spent, loyalty_points)
SELECT
  id,
  2,
  1,
  4.8,
  100000.00,
  1000
FROM users
WHERE role = 'resident'
ON CONFLICT (user_id) DO NOTHING;

-- Seed Blog Posts
INSERT INTO blog_posts (author_id, title, slug, content, excerpt, category, tags, is_published, published_at)
SELECT
  (SELECT id FROM users WHERE email = 'admin@goflex.com' LIMIT 1),
  blog.title,
  blog.slug,
  blog.content,
  blog.excerpt,
  blog.category,
  blog.tags,
  true,
  CURRENT_TIMESTAMP
FROM (
  VALUES
    (
      'The Future of Co-living in India',
      'future-of-coliving-india',
      'Co-living spaces are revolutionizing how young professionals live. Learn about the trends shaping the future of residential communities in 2024...',
      'Discover the emerging trends in co-living spaces across India and how they''re transforming the way professionals live.',
      'Lifestyle',
      ARRAY['coliving', 'lifestyle', 'india', 'trends']
    ),
    (
      'How to Choose the Perfect Property for You',
      'choose-perfect-property',
      'Finding the right property can be challenging. This guide will help you understand key factors to consider when choosing your next home...',
      'A comprehensive guide to finding the ideal property that matches your lifestyle and budget.',
      'Guide',
      ARRAY['guide', 'properties', 'tips']
    ),
    (
      'Community Living: Building Meaningful Connections',
      'community-living-connections',
      'One of the biggest benefits of co-living is the vibrant community. Explore how GoFlex fosters connections among residents...',
      'Learn how community spaces and events at GoFlex properties help residents build lasting friendships.',
      'Community',
      ARRAY['community', 'lifestyle', 'events']
    )
  ) AS blog(title, slug, content, excerpt, category, tags)
ON CONFLICT (slug) DO NOTHING;
