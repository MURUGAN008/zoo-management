import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Animal seed data
const animalData = [
  // Big Cats
  { species: 'African Lion', gender: 'MALE', isChild: false, age: 8, weight: 190.5 },
  { species: 'African Lion', gender: 'FEMALE', isChild: false, age: 6, weight: 140.2 },
  { species: 'African Lion', gender: 'MALE', isChild: true, age: 2, weight: 45.8 },
  { species: 'Bengal Tiger', gender: 'MALE', isChild: false, age: 7, weight: 220.3 },
  { species: 'Bengal Tiger', gender: 'FEMALE', isChild: false, age: 5, weight: 160.7 },
  { species: 'Bengal Tiger', gender: 'FEMALE', isChild: true, age: 1, weight: 25.4 },
  { species: 'Snow Leopard', gender: 'MALE', isChild: false, age: 4, weight: 55.2 },
  { species: 'Snow Leopard', gender: 'FEMALE', isChild: false, age: 3, weight: 45.8 },
  { species: 'Cheetah', gender: 'MALE', isChild: false, age: 6, weight: 65.4 },
  { species: 'Cheetah', gender: 'FEMALE', isChild: false, age: 4, weight: 50.3 },

  // Elephants
  { species: 'Asian Elephant', gender: 'MALE', isChild: false, age: 25, weight: 4500.0 },
  { species: 'Asian Elephant', gender: 'FEMALE', isChild: false, age: 20, weight: 3200.5 },
  { species: 'Asian Elephant', gender: 'FEMALE', isChild: true, age: 3, weight: 800.2 },
  { species: 'African Elephant', gender: 'MALE', isChild: false, age: 30, weight: 5500.8 },
  { species: 'African Elephant', gender: 'FEMALE', isChild: false, age: 22, weight: 4000.3 },

  // Primates
  { species: 'Western Gorilla', gender: 'MALE', isChild: false, age: 15, weight: 180.6 },
  { species: 'Western Gorilla', gender: 'FEMALE', isChild: false, age: 12, weight: 90.4 },
  { species: 'Western Gorilla', gender: 'MALE', isChild: true, age: 2, weight: 15.2 },
  { species: 'Chimpanzee', gender: 'MALE', isChild: false, age: 10, weight: 60.8 },
  { species: 'Chimpanzee', gender: 'FEMALE', isChild: false, age: 8, weight: 45.3 },
  { species: 'Chimpanzee', gender: 'FEMALE', isChild: true, age: 1, weight: 8.5 },
  { species: 'Orangutan', gender: 'MALE', isChild: false, age: 18, weight: 85.7 },
  { species: 'Orangutan', gender: 'FEMALE', isChild: false, age: 14, weight: 55.2 },

  // Bears
  { species: 'Brown Bear', gender: 'MALE', isChild: false, age: 12, weight: 320.5 },
  { species: 'Brown Bear', gender: 'FEMALE', isChild: false, age: 9, weight: 180.3 },
  { species: 'Polar Bear', gender: 'MALE', isChild: false, age: 8, weight: 450.2 },
  { species: 'Polar Bear', gender: 'FEMALE', isChild: false, age: 6, weight: 250.8 },
  { species: 'Giant Panda', gender: 'MALE', isChild: false, age: 7, weight: 110.4 },
  { species: 'Giant Panda', gender: 'FEMALE', isChild: false, age: 5, weight: 95.6 },
  { species: 'Giant Panda', gender: 'FEMALE', isChild: true, age: 1, weight: 12.3 },

  // Giraffes
  { species: 'Reticulated Giraffe', gender: 'MALE', isChild: false, age: 10, weight: 1200.5 },
  { species: 'Reticulated Giraffe', gender: 'FEMALE', isChild: false, age: 8, weight: 850.3 },
  { species: 'Reticulated Giraffe', gender: 'MALE', isChild: true, age: 2, weight: 150.7 },

  // Rhinos
  { species: 'White Rhinoceros', gender: 'MALE', isChild: false, age: 15, weight: 2300.4 },
  { species: 'White Rhinoceros', gender: 'FEMALE', isChild: false, age: 12, weight: 1800.6 },
  { species: 'Black Rhinoceros', gender: 'MALE', isChild: false, age: 18, weight: 1400.8 },
  { species: 'Black Rhinoceros', gender: 'FEMALE', isChild: false, age: 14, weight: 1100.2 },

  // Hippos
  { species: 'Hippopotamus', gender: 'MALE', isChild: false, age: 20, weight: 1800.5 },
  { species: 'Hippopotamus', gender: 'FEMALE', isChild: false, age: 16, weight: 1300.8 },
  { species: 'Hippopotamus', gender: 'FEMALE', isChild: true, age: 2, weight: 200.3 },

  // Zebras
  { species: 'Plains Zebra', gender: 'MALE', isChild: false, age: 8, weight: 350.2 },
  { species: 'Plains Zebra', gender: 'FEMALE', isChild: false, age: 6, weight: 280.5 },
  { species: 'Plains Zebra', gender: 'MALE', isChild: true, age: 1, weight: 80.4 },

  // Kangaroos
  { species: 'Red Kangaroo', gender: 'MALE', isChild: false, age: 6, weight: 85.3 },
  { species: 'Red Kangaroo', gender: 'FEMALE', isChild: false, age: 4, weight: 35.7 },
  { species: 'Red Kangaroo', gender: 'FEMALE', isChild: true, age: 1, weight: 8.2 },

  // Wolves
  { species: 'Gray Wolf', gender: 'MALE', isChild: false, age: 5, weight: 45.6 },
  { species: 'Gray Wolf', gender: 'FEMALE', isChild: false, age: 4, weight: 35.8 },
  { species: 'Gray Wolf', gender: 'MALE', isChild: true, age: 1, weight: 12.3 },

  // Seals
  { species: 'California Sea Lion', gender: 'MALE', isChild: false, age: 8, weight: 280.4 },
  { species: 'California Sea Lion', gender: 'FEMALE', isChild: false, age: 6, weight: 90.6 },
  { species: 'Harbor Seal', gender: 'MALE', isChild: false, age: 7, weight: 85.2 },
  { species: 'Harbor Seal', gender: 'FEMALE', isChild: false, age: 5, weight: 65.8 },

  // Penguins
  { species: 'Emperor Penguin', gender: 'MALE', isChild: false, age: 4, weight: 38.5 },
  { species: 'Emperor Penguin', gender: 'FEMALE', isChild: false, age: 3, weight: 32.7 },
  { species: 'Emperor Penguin', gender: 'MALE', isChild: true, age: 1, weight: 8.4 },

  // Reptiles
  { species: 'Komodo Dragon', gender: 'MALE', isChild: false, age: 12, weight: 70.5 },
  { species: 'Komodo Dragon', gender: 'FEMALE', isChild: false, age: 10, weight: 45.8 },
  { species: 'Green Sea Turtle', gender: 'FEMALE', isChild: false, age: 25, weight: 150.3 },
  { species: 'Galapagos Tortoise', gender: 'MALE', isChild: false, age: 50, weight: 220.6 },

  // Birds
  { species: 'Bald Eagle', gender: 'MALE', isChild: false, age: 8, weight: 4.5 },
  { species: 'Bald Eagle', gender: 'FEMALE', isChild: false, age: 6, weight: 5.8 },
  { species: 'Flamingo', gender: 'FEMALE', isChild: false, age: 5, weight: 2.8 },
  { species: 'Flamingo', gender: 'MALE', isChild: false, age: 4, weight: 2.5 },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create initial admin if doesn't exist
  const existingAdmin = await prisma.admin.findFirst();
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.admin.create({
      data: {
        fullName: 'System Administrator',
        email: 'admin@zms.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Initial admin created:', {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    });
  } else {
    console.log('ℹ️  Admin already exists in the database');
  }

  // Check if animals already exist
  const existingAnimals = await prisma.animal.count();
  
  if (existingAnimals > 0) {
    console.log(`ℹ️  ${existingAnimals} animals already exist in the database`);
    return;
  }

  // Create animals
  console.log('🦁 Creating animals...');
  const createdAnimals = await prisma.animal.createMany({
    data: animalData,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully created ${createdAnimals.count} animals`);

  // Get some statistics
  const totalAnimals = await prisma.animal.count();
  const maleAnimals = await prisma.animal.count({ where: { gender: 'MALE' } });
  const femaleAnimals = await prisma.animal.count({ where: { gender: 'FEMALE' } });
  const childAnimals = await prisma.animal.count({ where: { isChild: true } });
  const adultAnimals = await prisma.animal.count({ where: { isChild: false } });

  console.log('\n📊 Database Statistics:');
  console.log(`Total Animals: ${totalAnimals}`);
  console.log(`Male Animals: ${maleAnimals}`);
  console.log(`Female Animals: ${femaleAnimals}`);
  console.log(`Child Animals: ${childAnimals}`);
  console.log(`Adult Animals: ${adultAnimals}`);

  // Show species breakdown
  const speciesCount = await prisma.animal.groupBy({
    by: ['species'],
    _count: {
      species: true,
    },
    orderBy: {
      _count: {
        species: 'desc',
      },
    },
  });

  console.log('\n🐾 Species Breakdown:');
  speciesCount.forEach(species => {
    console.log(`${species.species}: ${species._count.species}`);
  });

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
