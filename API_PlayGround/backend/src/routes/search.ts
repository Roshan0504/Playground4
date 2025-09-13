import express from 'express';
import Profile from '../models/Profile';

const router = express.Router();

// GET projects by skill
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    
    if (!skill) {
      return res.status(400).json({ message: 'Skill parameter is required' });
    }
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const filteredProjects = profile.projects.filter(project => 
      project.skills.map(s => s.toLowerCase()).includes((skill as string).toLowerCase())
    );
    
    res.json(filteredProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// GET top skills
router.get('/skills/top', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Count skill occurrences across all projects
    const skillCount: { [key: string]: number } = {};
    
    profile.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
    
    profile.projects.forEach(project => {
      project.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);
    
    res.json(topSkills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top skills', error });
  }
});

// General search
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const query = (q as string).toLowerCase();
    const results = {
      profile: {
        name: profile.name.toLowerCase().includes(query) ? profile.name : null,
        skills: profile.skills.filter(skill => 
          skill.toLowerCase().includes(query)
        ),
        education: profile.education.filter(edu => 
          edu.institution.toLowerCase().includes(query) || 
          edu.degree.toLowerCase().includes(query) || 
          edu.field.toLowerCase().includes(query)
        )
      },
      projects: profile.projects.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query) || 
        project.skills.some(skill => skill.toLowerCase().includes(query))
      ),
      work: profile.work.filter(job => 
        job.company.toLowerCase().includes(query) || 
        job.position.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query)
      )
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error performing search', error });
  }
});

export default router;