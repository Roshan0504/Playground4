import React, { useState } from 'react';
import { Education } from '../types';
import { educationAPI } from '../services/api';

interface EducationManagerProps {
  education: Education[];
  onEducationUpdate: () => void;
}

const EducationManager: React.FC<EducationManagerProps> = ({ education, onEducationUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, '_id'>>({
    institution: '',
    degree: '',
    field: '',
    startYear: new Date().getFullYear(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu._id!);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startYear: edu.startYear,
      endYear: edu.endYear,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await educationAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await educationAPI.add(formData);
        setIsAdding(false);
      }
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startYear: new Date().getFullYear(),
      });
      onEducationUpdate();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await educationAPI.delete(id);
        onEducationUpdate();
      } catch (error) {
        console.error('Error deleting education:', error);
      }
    }
  };

  return (
    <div className="education-section">
      <div className="section-header">
        <h2>Education</h2>
        <button onClick={() => setIsAdding(true)} className="add-btn">
          Add Education
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Institution:</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Degree:</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Field:</label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Year:</label>
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Year (optional):</label>
            <input
              type="number"
              name="endYear"
              value={formData.endYear || ''}
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
                  institution: '',
                  degree: '',
                  field: '',
                  startYear: new Date().getFullYear(),
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="education-list">
        {education.map((edu) => (
          <div key={edu._id} className="education-item">
            <h4>{edu.institution}</h4>
            <p>{edu.degree} in {edu.field}</p>
            <p>{edu.startYear} - {edu.endYear || 'Present'}</p>
            <div className="item-actions">
              <button onClick={() => handleEdit(edu)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(edu._id!)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManager;