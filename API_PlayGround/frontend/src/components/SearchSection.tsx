import React, { useState } from 'react';
import { searchAPI } from '../services/api';
import { Project } from '../types';

interface SearchSectionProps {
  topSkills: string[];
  onSkillFilter: (skill: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ topSkills, onSkillFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [skillFilter, setSkillFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      const response = await searchAPI.general(searchTerm);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSkillFilter = async (skill: string) => {
    setSkillFilter(skill);
    onSkillFilter(skill);
    
    try {
      const response = await searchAPI.projectsBySkill(skill);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Error filtering projects by skill:', error);
    }
  };

  const clearFilters = () => {
    setSkillFilter('');
    setSearchTerm('');
    setSearchResults(null);
    setFilteredProjects([]);
    onSkillFilter('');
  };

  return (
    <div className="search-section">
      <h2>Search & Filter</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for skills, projects, experience..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        {(searchTerm || skillFilter) && (
          <button onClick={clearFilters} className="clear-btn">
            Clear
          </button>
        )}
      </div>

      <div className="skills-filter">
        <h3>Filter by Skill</h3>
        <div className="skills-list">
          {topSkills.map((skill, index) => (
            <button
              key={index}
              className={`skill-tag ${skillFilter === skill ? 'active' : ''}`}
              onClick={() => handleSkillFilter(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {searchResults && (
        <div className="search-results">
          <h3>Search Results for "{searchTerm}"</h3>
          {/* Display search results here */}
        </div>
      )}
    </div>
  );
};

export default SearchSection;