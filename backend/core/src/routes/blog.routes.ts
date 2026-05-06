import { Router } from 'express';

const router = Router();

// Mock database of blog posts
const blogPosts = [
  {
    id: '1',
    title: 'The Soul of Kolkata: Victoria Memorial & More',
    slug: 'kolkata-travel-guide',
    excerpt: 'Explore the architectural grandeur of Victoria Memorial, the bustling streets of Park Street, and the divine taste of Mishti Doi.',
    content: `Kolkata, often referred to as the "City of Joy," is a tapestry of rich history, vibrant culture, and culinary excellence.

### Tourist Places
The crown jewel of Kolkata is the **Victoria Memorial**, a massive white marble building built in the memory of Queen Victoria. Other must-visit spots include:
- **Howrah Bridge**: An iconic engineering marvel.
- **Dakshineswar Kali Temple**: A spiritual retreat on the banks of the Hooghly.
- **Indian Museum**: One of the oldest museums in the world.

### Popular Dishes
Kolkata is a food lover's paradise. Don't leave without trying:
- **Mishti Doi**: Sweet fermented yogurt.
- **Kolkata Kathi Roll**: The original street food.
- **Rosogolla**: The famous Bengali sponge sweet.
- **Machher Jhol**: Traditional fish curry.

### Traveling Tips
- **The Iconic Tram**: Experience the oldest operating tram network in Asia.
- **Yellow Taxis**: A vintage way to navigate the city.
- **Best Time to Visit**: October to March, especially during Durga Puja.`,
    featured_image: 'https://images.pexels.com/photos/12313626/pexels-photo-12313626.jpeg',
    category: 'Guide',
    tags: ['Kolkata', 'Travel', 'Food', 'Culture', 'VictoriaMemorial'],
    view_count: 1250,
    published_at: new Date('2024-05-01').toISOString(),
    first_name: 'Imran',
    last_name: 'Anwar',
    avatar_url: 'https://i.pravatar.cc/150?u=imran'
  },
  {
    id: '2',
    title: 'Mumbai Unveiled: Gateway of India to Marine Drive',
    slug: 'mumbai-city-insights',
    excerpt: 'From the historic Gateway of India to the glitzy Marine Drive, Mumbai is a city that never sleeps and always surprises.',
    content: `Mumbai, the financial capital of India, is a city of dreams and contrasts.

### Tourist Places
- **Gateway of India**: The starting point for most tourists.
- **Marine Drive**: Also known as the Queen's Necklace.
- **Elephanta Caves**: A UNESCO World Heritage site reachable by ferry.
- **Siddhivinayak Temple**: A major religious landmark.

### Popular Dishes
- **Vada Pav**: The lifeline of Mumbai.
- **Pav Bhaji**: Spiced vegetable mash with buttered bread.
- **Bombay Sandwich**: A unique street food experience.
- **Seafood**: Try the Bombil Fry at local Malvani restaurants.

### Traveling Tips
- **Mumbai Local**: The fastest way to travel, but avoid peak hours!
- **Kaali Peeli Taxis**: The classic black and yellow cabs.
- **Weather**: Best visited between November and February.`,
    featured_image: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
    category: 'Guide',
    tags: ['Mumbai', 'Travel', 'VadaPav', 'GatewayOfIndia', 'CityLife'],
    view_count: 980,
    published_at: new Date('2024-05-03').toISOString(),
    first_name: 'Deepak',
    last_name: 'Sharma',
    avatar_url: 'https://i.pravatar.cc/150?u=deepak'
  },
  {
    id: '3',
    title: 'Bengaluru: Tech Hubs & Lush Garden Living',
    slug: 'bengaluru-lifestyle-guide',
    excerpt: 'Discover why Bengaluru is more than just Indias Silicon Valley. Explore its parks, pubs, and pleasant weather.',
    content: `Bengaluru, formerly Bangalore, offers a unique blend of modern tech culture and historic charm.

### Tourist Places
- **Vidhana Soudha**: A magnificent Neo-Dravidian building.
- **Lalbagh Botanical Garden**: Famous for its glass house and flower shows.
- **Bangalore Palace**: Inspired by Windsor Castle.
- **Cubbon Park**: The "lung" of the city.

### Popular Dishes
- **Benne Dose**: Butter-laden crispy crepes.
- **Craft Beer**: Bengaluru is the pub capital of India.
- **Filter Coffee**: The authentic South Indian morning brew.
- **Bisi Bele Bath**: A spicy lentil-rice dish.

### Traveling Tips
- **Namma Metro**: The most reliable way to beat the famous traffic.
- **Walking**: Parts of Indiranagar and Koramangala are great for walking.
- **Language**: Kannada is the local language, but English and Hindi are widely understood.`,
    featured_image: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
    category: 'Lifestyle',
    tags: ['Bengaluru', 'Tech', 'Gardens', 'Foodie', 'CoLiving'],
    view_count: 750,
    published_at: new Date('2024-05-05').toISOString(),
    first_name: 'Anjali',
    last_name: 'Rao',
    avatar_url: 'https://i.pravatar.cc/150?u=anjali'
  }
];

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...blogPosts];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ data: filtered });
});

router.get('/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

export default router;
