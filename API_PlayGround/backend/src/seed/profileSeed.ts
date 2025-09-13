import mongoose from 'mongoose';
import Profile from '../models/Profile';
import connectDB from '../config/database';

const sampleData = {
  name: "John Doe",
  email: "john.doe@example.com",
  education: [
    {
      institution: "Tech University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startYear: 2016,
      endYear: 2020
    }
  ],
  skills: ["JavaScript", "TypeScript", "Node.js", "React", "MongoDB", "Python"],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce application with React and Node.js",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      links: {
        github: "https://github.com/johndoe/ecommerce",
        demo: "https://ecommerce-demo.com"
      }
    },
    {
      title: "Task Management App",
      description: "A task management application with drag and drop functionality",
      skills: ["React", "TypeScript", "CSS", "Node.js"],
      links: {
        github: "https://github.com/johndoe/taskmanager",
        demo: "https://taskmanager-demo.com"
      }
    },
    {
      title: "Data Visualization Dashboard",
      description: "A dashboard for visualizing complex data sets",
      skills: ["React", "D3.js", "Python", "Data Analysis"],
      links: {
        github: "https://github.com/johndoe/dataviz",
        demo: "https://dataviz-demo.com"
      }
    }
  ],
  work: [
    {
      company: "Tech Solutions Inc.",
      position: "Senior Developer",
      startDate: new Date("2020-06-01"),
      description: "Developed and maintained web applications using modern technologies"
    },
    {
      company: "StartUp Co",
      position: "Full Stack Developer",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2020-05-31"),
      description: "Built MVP products for various clients using React and Node.js"
    }
  ],
  links: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe-portfolio.com"
  }
};

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing data
    await Profile.deleteMany({});
    console.log('Cleared existing profiles');
    
    // Insert sample data
    const profile = new Profile(sampleData);
    await profile.save();
    console.log('Sample data inserted successfully');
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;