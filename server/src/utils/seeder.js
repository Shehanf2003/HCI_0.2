const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Furniture = require('../models/Furniture');
const furnitureCatalog = require('../data/furnitureCatalog.json');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    const usersToSeed = [
      {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
      },
    ];

    console.log('Checking Users...');
    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Seeded user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }
    console.log('User check complete.');

    console.log('Checking Furniture...');
    for (const furnitureData of furnitureCatalog) {
      const existingFurniture = await Furniture.findOne({ name: furnitureData.name });
      if (!existingFurniture) {
        await Furniture.create(furnitureData);
        console.log(`Seeded furniture: ${furnitureData.name}`);
      } else {
        console.log(`Furniture already exists: ${furnitureData.name}`);
      }
    }
    console.log('Furniture check complete.');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

if (require.main === module) {
  const runSeeder = async () => {
    // If running as a standalone script, make sure dotenv is loaded relative to project root
    // It's usually safe to let dotenv use the default config if we cd into server/
    dotenv.config();
    await connectDB();
    await seedData();
    process.exit();
  };
  runSeeder();
} else {
  module.exports = seedData;
}
