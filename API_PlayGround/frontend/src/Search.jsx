import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Set base URL for API calls
const API_BASE_URL = 'https://playground-backend-ten.vercel.app/api';

function App() {
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [skillFilter, setSkillFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [topSkills, setTopSkills] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchTopSkills();
  }, []);

  useEffect(() => {
    if (skillFilter) {
      fetchProjectsBySkill(skillFilter);
    }
  }, [skillFilter]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProjectsBySkill = async (skill) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/projects?skill=${skill}`);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTopSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/skills/top`);
      setTopSkills(response.data);
    } catch (error) {
      console.error('Error fetching top skills:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Developer Portfolio</h1>
      </header>

      <div className="container">
        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search for skills, projects, experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Top Skills */}
        <div className="skills-section">
          <h2>Top Skills</h2>
          <div className="skills-list">
            {topSkills.map((skill, index) => (
              <button 
                key={index} 
                className="skill-tag"
                onClick={() => setSkillFilter(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Information */}
        {profile && (
          <div className="profile-section">
            <h2>Profile</h2>
            <div className="profile-info">
              <h3>{profile.name}</h3>
              <p>{profile.email}</p>
              <div className="profile-links">
                {profile.links.github && (
                  <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {profile.links.linkedin && (
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {profile.links.portfolio && (
                  <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="projects-section">
          <h2>{skillFilter ? `Projects with ${skillFilter}` : 'All Projects'}</h2>
          <div className="projects-grid">
            {(skillFilter ? filteredProjects : profile?.projects || []).map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-skills">
                  {project.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="search-results">
            <h2>Search Results for "{searchTerm}"</h2>
            {/* Display search results here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;