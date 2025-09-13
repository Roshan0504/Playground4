import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/database';
import profileRoutes from './routes/profile';
import educationRoutes from './routes/education';
import skillsRoutes from './routes/skills';
import projectsRoutes from './routes/projects';
import workRoutes from './routes/work';
import searchRoutes from './routes/search';
import seedDatabase from './seed/profileSeed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/work', workRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Seed endpoint (optional - for manual seeding)
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error });
  }
});

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Check if database is empty and seed if needed
    const Profile = require('./models/Profile').default;
    const profileCount = await Profile.countDocuments();
    
    if (profileCount === 0) {
      console.log('No profiles found, seeding database...');
      await seedDatabase();
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();