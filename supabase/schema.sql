-- Properties core data
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  state_iso text not null,
  city text not null,
  address text,
  rent integer not null,
  beds text not null check (beds in ('Single','Double','Triple')),
  occupancy integer not null default 0,
  rating numeric(2,1),
  cover_image_url text not null,
  inserted_at timestamptz not null default now()
);

-- Property gallery photos
create table if not exists public.property_photos (
  id bigserial primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  alt text,
  inserted_at timestamptz not null default now()
);

-- Resident testimonials
create table if not exists public.testimonials (
  id bigserial primary key,
  resident_name text not null,
  quote text not null,
  avatar_url text,
  city text,
  inserted_at timestamptz not null default now()
);

-- Frequently asked questions
create table if not exists public.faqs (
  id bigserial primary key,
  question text not null,
  answer text not null,
  category text,
  inserted_at timestamptz not null default now()
);

-- Enable Row Level Security so policies can be added later
alter table public.properties enable row level security;
alter table public.property_photos enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;

-- Sample seed data ---------------------------------------------------------
insert into public.properties (id, name, slug, state_iso, city, address, rent, beds, occupancy, rating, cover_image_url)
values
  ('54e20f54-c1a2-4c0d-9a06-135495b7a2c1','Sky Deck Residency','sky-deck-residency','KA','Bengaluru','12 Skyview Road, Indiranagar',14000,'Double',92,4.8,'https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg'),
  ('4c47639f-8744-4f73-a14e-41901df08d16','Riverview House','riverview-house','MH','Mumbai','221 Riverside Lane, Bandra East',18500,'Single',88,4.9,'https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg'),
  ('a9d8a2bc-89dc-4568-bbd8-9a808f260299','Green Court','green-court','DL','New Delhi','8 Residency Park, Saket',12500,'Triple',76,4.6,'https://images.pexels.com/photos/32982365/pexels-photo-32982365.jpeg'),
  ('01c57c8c-0a28-446d-8bf8-dc644a8f0f4b','Harbour Suites','harbour-suites','GA','Panaji','44 Pearl Bay, Dona Paula',16500,'Double',81,4.7,'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg')
on conflict (id) do update set name = excluded.name;

insert into public.property_photos (property_id, image_url, alt)
values
  ('54e20f54-c1a2-4c0d-9a06-135495b7a2c1','https://images.pexels.com/photos/4907205/pexels-photo-4907205.jpeg','Modern hostel bunk beds'),
  ('4c47639f-8744-4f73-a14e-41901df08d16','https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg','Sleek shared kitchen'),
  ('4c47639f-8744-4f73-a14e-41901df08d16','https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg','Apartment building facade'),
  ('a9d8a2bc-89dc-4568-bbd8-9a808f260299','https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg','Coworking lounge'),
  ('01c57c8c-0a28-446d-8bf8-dc644a8f0f4b','https://images.pexels.com/photos/32982365/pexels-photo-32982365.jpeg','Student housing exterior');

insert into public.testimonials (resident_name, quote, avatar_url, city)
values
  ('Priya','“A welcoming community with great shared spaces. Feels like home.”','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg','Bengaluru'),
  ('Arjun','“Clean rooms, friendly staff, and hassle-free living.”','https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg','Pune');

insert into public.faqs (question, answer, category)
values
  ('How do I book a room?','Choose a property, fill the form, and our team will call to confirm your visit and booking.',null),
  ('Is food included?','Food-inclusive plans are available at select properties; details vary by location.',null),
  ('What is the minimum stay?','Typically 3 months; policies can vary by property.',null);
