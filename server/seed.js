const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const usersToSeed = [
  { name: 'Vandan', email: 'vandan@test.com', password: 'password123' },
  { name: 'Raj', email: 'raj@test.com', password: 'password123' },
  { name: 'Aastha', email: 'aastha@test.com', password: 'password123' },
  { name: 'Vardhman', email: 'vardhman@test.com', password: 'password123' },
  { name: 'Himanshu', email: 'himanshu@test.com', password: 'password123' }
];

const stacks = [
  { language: 'js', stylingSystem: 'tailwind' },
  { language: 'ts', stylingSystem: 'css-modules' },
  { language: 'js', stylingSystem: 'bootstrap' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codraw');
    console.log('Connected to MongoDB.');

    // Optional: Clear existing data for these test users
    const emails = usersToSeed.map(u => u.email);
    const existingUsers = await User.find({ email: { $in: emails } });
    const userIds = existingUsers.map(u => u._id);
    await Project.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ email: { $in: emails } });
    console.log('Cleared existing test users and their projects.');

    for (let i = 0; i < usersToSeed.length; i++) {
      const userData = usersToSeed[i];
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const user = new User({
        email: userData.email,
        passwordHash
      });
      await user.save();

      console.log(`Created user: ${userData.name} (${userData.email})`);

      // Create 2 projects for each user
      for (let j = 0; j < 2; j++) {
        const stack = stacks[(i + j) % stacks.length];
        const projectId = uuidv4();
        
        const project = new Project({
          userId: user._id,
          projectId: projectId,
          name: `${userData.name}'s Project ${j + 1}`,
          jsonBlob: {
            meta: {
              projectId: projectId,
              name: `${userData.name}'s Project ${j + 1}`,
              version: '1.0',
              framework: 'react-cra',
              language: stack.language,
              stylingSystem: stack.stylingSystem,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            canvas: {
              width: 1440,
              gridSize: 8,
              components: [
                {
                  id: uuidv4(),
                  type: 'HeroSection',
                  parentId: null,
                  order: 0,
                  props: {
                    title: `Welcome to ${userData.name}'s App`,
                    subtitle: `Built with ${stack.language.toUpperCase()} and ${stack.stylingSystem}.`,
                    ctaText: 'Explore',
                    backgroundColor: 'transparent',
                    textColor: '#ffffff',
                    linkTo: '',
                    innerStyles: {}
                  },
                  children: []
                }
              ]
            }
          }
        });
        await project.save();
        console.log(`  -> Created project: ${project.name} (${stack.language}, ${stack.stylingSystem})`);
      }
    }

    console.log('Seeding completed successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error during seeding:', err);
    mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
