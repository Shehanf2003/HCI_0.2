const User = require('../models/User');
const Furniture = require('../models/Furniture');

const seedData = async () => {
  try {
    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding Users...');
      await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });
      console.log('User Seeded');
    }

    // Check if furniture exists
    const furnitureCount = await Furniture.countDocuments();
    if (furnitureCount === 0) {
      console.log('Seeding Furniture...');
      const furnitureItems = [
        {
          name: 'Modern Chair',
          type: 'chair',
          dimensions: { width: 0.5, height: 1, depth: 0.5 },
          defaultColor: '#FF5733',
          price: 150,
          modelUrl: '/assets/chair.glb', // Placeholder
        },
        {
          name: 'Dining Table',
          type: 'table',
          dimensions: { width: 1.5, height: 0.8, depth: 1 },
          defaultColor: '#8B4513',
          price: 450,
          modelUrl: '/assets/table.glb', // Placeholder
        },
        {
          name: 'Comfort Sofa',
          type: 'sofa',
          dimensions: { width: 2, height: 1, depth: 1 },
          defaultColor: '#3357FF',
          price: 800,
          modelUrl: '/assets/sofa.glb', // Placeholder
        },
      ];
      await Furniture.insertMany(furnitureItems);
      console.log('Furniture Seeded');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
