// Simple database setup script for development
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database with demo data...');
  
  try {
    // Create demo users
    const contributor = await prisma.user.upsert({
      where: { email: 'wally@followboard.com' },
      update: {},
      create: {
        email: 'wally@followboard.com',
        name: 'Wally',
        role: 'CONTRIBUTOR',
      },
    });

    const viewer = await prisma.user.upsert({
      where: { email: 'founder@followboard.com' },
      update: {},
      create: {
        email: 'founder@followboard.com',
        name: 'Founder',
        role: 'VIEWER',
      },
    });

    console.log('✅ Demo users created:', { contributor, viewer });
    
    // Create demo contacts
    const contact1 = await prisma.contact.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        company: 'Tech Corp',
        position: 'CTO',
        leadStatus: 'WARM',
        userId: contributor.id,
      },
    });

    const contact2 = await prisma.contact.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@startup.com',
        company: 'Startup Inc',
        position: 'CEO',
        leadStatus: 'HOT',
        userId: contributor.id,
      },
    });

    console.log('✅ Demo contacts created');

    // Create demo project
    const project = await prisma.project.create({
      data: {
        title: 'Q1 Product Launch',
        description: 'Launching our new product features for Q1',
        status: 'IN_PROGRESS',
        progress: 75,
        estimatedDate: new Date('2025-03-31'),
        userId: contributor.id,
      },
    });

    console.log('✅ Demo project created');

    // Create demo activities
    await prisma.activity.createMany({
      data: [
        {
          content: 'Had a great call with John Smith about potential partnership. He\'s very interested in our Q1 features.',
          type: 'CALL',
          userId: contributor.id,
          contactId: contact1.id,
          projectId: project.id,
          metadata: { duration: '45 minutes' },
        },
        {
          content: 'Sent follow-up email to Sarah with detailed product roadmap and pricing information.',
          type: 'EMAIL',
          userId: contributor.id,
          contactId: contact2.id,
          metadata: { subject: 'Product Roadmap & Pricing Details' },
        },
        {
          content: 'Posted update about our latest product features on LinkedIn. Got great engagement!',
          type: 'LINKEDIN',
          userId: contributor.id,
          metadata: { likes: 47, comments: 12 },
        },
        {
          content: 'Completed user testing for the new dashboard interface. Results look promising with 92% satisfaction rate.',
          type: 'PRODUCT_UPDATE',
          userId: contributor.id,
          projectId: project.id,
        },
      ],
    });

    console.log('✅ Demo activities created');

    // Create demo resource
    await prisma.resource.create({
      data: {
        title: 'Product Demo Video',
        description: 'Demo video showcasing our key features for prospects',
        type: 'video',
        url: 'https://example.com/demo-video',
        userId: contributor.id,
      },
    });

    console.log('✅ Demo resource created');
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });