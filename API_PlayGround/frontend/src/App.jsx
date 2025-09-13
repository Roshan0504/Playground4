import React, { useState, useEffect } from 'react';
import ProfileManager from './components/ProfileManager';
import EducationManager from './components/EducationManager';
import SkillsManager from './components/SkillsManager';
import ProjectsManager from './components/ProjectsManager';
import WorkManager from './components/WorkManager';
import SearchSection from './components/SearchSection';

import { profileAPI, searchAPI, seedAPI } from './services/api';
import './App.css';

function App() {
  const [profile, setProfile] = useState(null);
  const [skillFilter, setSkillFilter] = useState('');
  const [topSkills, setTopSkills] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchTopSkills = async () => {
    try {
      const response = await searchAPI.topSkills();
      setTopSkills(response.data);
    } catch (error) {
      console.error('Error fetching top skills:', error);
    }
  };

  const handleSeed = async () => {
    if (window.confirm('This will replace all your data with sample data. Continue?')) {
      try {
        await seedAPI.seed();
        fetchProfile();
        fetchTopSkills();
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTopSkills();
  }, []);

  const handleSkillFilter = (skill) => {
    setSkillFilter(skill);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Developer Portfolio Manager</h1>
        <button onClick={handleSeed} className="seed-btn">
          Reset with Sample Data
        </button>
      </header>

      <div className="container">
        <SearchSection 
          topSkills={topSkills} 
          onSkillFilter={handleSkillFilter} 
        />

        {profile && (
          <>
            <ProfileManager profile={profile} onProfileUpdate={fetchProfile} />
            <EducationManager education={profile.education} onEducationUpdate={fetchProfile} />
            <SkillsManager skills={profile.skills} onSkillsUpdate={fetchProfile} />
            <ProjectsManager 
              projects={skillFilter 
                ? profile.projects.filter(p => p.skills.includes(skillFilter))
                : profile.projects
              } 
              onProjectsUpdate={fetchProfile} 
            />
            <WorkManager work={profile.work} onWorkUpdate={fetchProfile} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
