import React, { useState } from 'react';
import { skillsAPI } from '../services/api';

interface SkillsManagerProps {
  skills: string[];
  onSkillsUpdate: () => void;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onSkillsUpdate }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = async () => {
    const skill = newSkill.trim();
    if (!skill) return;
    try {
      await skillsAPI.add(skill);
      setNewSkill('');
      onSkillsUpdate();
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDelete = async (skill: string) => {
    if (!window.confirm(`Delete skill "${skill}"?`)) return;
    try {
      await skillsAPI.delete(skill);
      onSkillsUpdate();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="skills-section">
      <div className="section-header">
        <h2>Skills</h2>
      </div>

      <div className="skills-add">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button onClick={handleAdd} className="add-btn">Add</button>
      </div>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
            <button className="remove-skill-btn" onClick={() => handleDelete(skill)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
