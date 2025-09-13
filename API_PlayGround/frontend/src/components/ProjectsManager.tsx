import React, { useState } from 'react';
import { Project } from '../types';
import { projectsAPI } from '../services/api';

interface ProjectsManagerProps {
  projects: Project[];
  onProjectsUpdate: () => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onProjectsUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, '_id'>>({
    title: '',
    description: '',
    skills: [],
    links: {},
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('links.')) {
      const linkField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          [linkField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id!);
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills,
      links: project.links,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projectsAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await projectsAPI.add(formData);
        setIsAdding(false);
      }
      setFormData({
        title: '',
        description: '',
        skills: [],
        links: {},
      });
      onProjectsUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        onProjectsUpdate();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="projects-section">
      <div className="section-header">
        <h2>Projects</h2>
        <button onClick={() => setIsAdding(true)} className="add-btn">
          Add Project
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Skills:</label>
            <div className="skills-input">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                Add
              </button>
            </div>
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-skill-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>GitHub URL:</label>
            <input
              type="url"
              name="links.github"
              value={formData.links.github || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Demo URL:</label>
            <input
              type="url"
              name="links.demo"
              value={formData.links.demo || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  title: '',
                  description: '',
                  skills: [],
                  links: {},
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-skills">
              {project.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
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
            <div className="item-actions">
              <button onClick={() => handleEdit(project)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(project._id!)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;