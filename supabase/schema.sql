-- Users table
create table if not exists public.users (
  id serial primary key,
  username text not null unique,
  email text not null unique,
  full_name text,
  phone text,
  hashed_password text not null,
  role text not null default 'RESIDENT',
  referral_code text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Properties table
create table if not exists public.properties (
  id serial primary key,
  owner_id integer references public.users(id),
  name text not null,
  slug text not null unique,
  city text not null,
  state text,
  address text,
  monthly_price numeric(10,2) not null,
  occupancy numeric(5,2) default 0,
  amenities jsonb,
  featured_image text,
  verified boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings table
create table if not exists public.bookings (
  id serial primary key,
  property_id integer references public.properties(id),
  resident_id integer references public.users(id),
  check_in_date timestamptz not null,
  check_out_date timestamptz not null,
  total_amount numeric(10,2) not null,
  status text default 'pending',
  payment_status text default 'pending',
  created_at timestamptz default now()
);

-- Escrow Accounts table
create table if not exists public.escrow_accounts (
  id serial primary key,
  booking_id integer unique references public.bookings(id),
  user_id integer references public.users(id),
  amount_held numeric(10,2) not null,
  status text default 'active',
  release_date timestamptz,
  created_at timestamptz default now()
);

-- KYC Documents table
create table if not exists public.kyc_documents (
  id serial primary key,
  user_id integer unique references public.users(id),
  document_type text not null,
  file_path text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.properties enable row level security;
alter table public.bookings enable row level security;
alter table public.escrow_accounts enable row level security;
alter table public.kyc_documents enable row level security;

-- Basic Policies (To be refined)
create policy "Public properties are viewable by everyone" on public.properties for select using (true);
create policy "Users can see their own data" on public.users for select using (auth.uid()::text = id::text);
