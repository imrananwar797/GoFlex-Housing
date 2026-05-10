import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding missing models...');

  // 1. FAQs
  await prisma.fAQ.createMany({
    data: [
      { question: 'What is GoFlex?', answer: 'Flexible co-living for modern professionals.', category: 'General' },
      { question: 'How do I book?', answer: 'Simply search for a property and click Book Now.', category: 'Booking' },
      { question: 'Is KYC mandatory?', answer: 'Yes, all residents must complete AI verification.', category: 'Safety' }
    ],
    skipDuplicates: true
  });

  // 2. Testimonials
  await prisma.testimonial.createMany({
    data: [
      { name: 'Alex Rivera', role: 'Software Engineer', content: 'GoFlex changed how I travel for work. The community is amazing.', rating: 5 },
      { name: 'Sarah Chen', role: 'Digital Nomad', content: 'Seamless experience from booking to check-out. Highly recommend.', rating: 5 }
    ],
    skipDuplicates: true
  });

  // 3. Blog Posts
  // Get an author id (User id 1 is likely admin/imran)
  const author = await prisma.user.findFirst();
  if (author) {
    await prisma.blogPost.createMany({
      data: [
        { 
          title: 'Future of Flexible Housing in India', 
          slug: 'future-flexible-housing-india', 
          excerpt: 'How co-living is reshaping urban lifestyles.',
          content: 'Full content about flexible housing...',
          category: 'Lifestyle',
          author_id: author.id
        },
        { 
          title: '5 Tips for Digital Nomads', 
          slug: '5-tips-digital-nomads', 
          excerpt: 'Essential advice for remote workers on the move.',
          content: 'Full content for nomads...',
          category: 'Travel',
          author_id: author.id
        }
      ],
      skipDuplicates: true
    });
  }

  console.log('Seed v2 complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
