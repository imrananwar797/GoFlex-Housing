export const fallbackProperties = [
  {
    id: '54e20f54-c1a2-4c0d-9a06-135495b7a2c1',
    name: 'Sky Deck Residency',
    slug: 'sky-deck-residency',
    state_iso: 'KA',
    city: 'Bengaluru',
    address: '12 Skyview Road, Indiranagar',
    rent: 14000,
    beds: 'Double' as const,
    occupancy: 92,
    rating: 4.8,
    cover_image_url: 'https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg',
  },
  {
    id: '4c47639f-8744-4f73-a14e-41901df08d16',
    name: 'Riverview House',
    slug: 'riverview-house',
    state_iso: 'MH',
    city: 'Mumbai',
    address: '221 Riverside Lane, Bandra East',
    rent: 18500,
    beds: 'Single' as const,
    occupancy: 88,
    rating: 4.9,
    cover_image_url: 'https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',
  },
  {
    id: 'a9d8a2bc-89dc-4568-bbd8-9a808f260299',
    name: 'Green Court',
    slug: 'green-court',
    state_iso: 'DL',
    city: 'New Delhi',
    address: '8 Residency Park, Saket',
    rent: 12500,
    beds: 'Triple' as const,
    occupancy: 76,
    rating: 4.6,
    cover_image_url: 'https://images.pexels.com/photos/32982365/pexels-photo-32982365.jpeg',
  },
  {
    id: '01c57c8c-0a28-446d-8bf8-dc644a8f0f4b',
    name: 'Harbour Suites',
    slug: 'harbour-suites',
    state_iso: 'GA',
    city: 'Panaji',
    address: '44 Pearl Bay, Dona Paula',
    rent: 16500,
    beds: 'Double' as const,
    occupancy: 81,
    rating: 4.7,
    cover_image_url: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
  },
];

export const fallbackPhotos = [
  {
    id: 1,
    property_id: fallbackProperties[0].id,
    image_url: 'https://images.pexels.com/photos/4907205/pexels-photo-4907205.jpeg',
    alt: 'Modern hostel bunk beds',
  },
  {
    id: 2,
    property_id: fallbackProperties[1].id,
    image_url: 'https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg',
    alt: 'Sleek shared kitchen',
  },
  {
    id: 3,
    property_id: fallbackProperties[1].id,
    image_url: 'https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',
    alt: 'Apartment building facade',
  },
  {
    id: 4,
    property_id: fallbackProperties[2].id,
    image_url: 'https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg',
    alt: 'Coworking lounge',
  },
  {
    id: 5,
    property_id: fallbackProperties[3].id,
    image_url: 'https://images.pexels.com/photos/32982365/pexels-photo-32982365.jpeg',
    alt: 'Student housing exterior',
  },
];

export const fallbackTestimonials = [
  {
    id: 1,
    resident_name: 'Priya',
    quote: '“A welcoming community with great shared spaces. Feels like home.”',
    city: 'Bengaluru',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    id: 2,
    resident_name: 'Arjun',
    quote: '“Clean rooms, friendly staff, and hassle-free living.”',
    city: 'Pune',
    avatar_url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
  },
];

export const fallbackFaqs = [
  {
    id: 1,
    question: 'How do I book a room?',
    answer: 'Choose a property, fill the form, and our team will call to confirm your visit and booking.',
    category: null,
  },
  {
    id: 2,
    question: 'Is food included?',
    answer: 'Food-inclusive plans are available at select properties; details vary by location.',
    category: null,
  },
  {
    id: 3,
    question: 'What is the minimum stay?',
    answer: 'Typically 3 months; policies can vary by property.',
    category: null,
  },
];
