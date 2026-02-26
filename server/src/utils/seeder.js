const User = require('../models/User');
const Furniture = require('../models/Furniture');
const furnitureCatalog = require('../data/furnitureCatalog.json');

const seedData = async () => {
  try {
    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding Users...');
      await User.create([
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
      ]);
      console.log('Users Seeded');
    }

    // Check if furniture exists
    const furnitureCount = await Furniture.countDocuments();
    if (furnitureCount === 0) {
      console.log('Seeding Furniture...');
      await Furniture.insertMany(furnitureCatalog);
      console.log('Furniture Seeded');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
