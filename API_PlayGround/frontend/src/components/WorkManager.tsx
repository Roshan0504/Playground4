import React, { useState } from 'react';
import { WorkExperience } from '../types';
import { workAPI } from '../services/api';

interface WorkManagerProps {
  work: WorkExperience[];
  onWorkUpdate: () => void;
}

const WorkManager: React.FC<WorkManagerProps> = ({ work, onWorkUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [current, setCurrent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (workExp: WorkExperience) => {
    setEditingId(workExp._id!);
    setFormData({
      company: workExp.company,
      position: workExp.position,
      startDate: workExp.startDate.split('T')[0],
      endDate: workExp.endDate ? workExp.endDate.split('T')[0] : undefined,
      description: workExp.description,
    });
    setCurrent(!workExp.endDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        endDate: current ? undefined : formData.endDate,
      };
      
      if (editingId) {
        await workAPI.update(editingId, submitData);
        setEditingId(null);
      } else {
        await workAPI.add(submitData);
        setIsAdding(false);
      }
      setFormData({
        company: '',
        position: '',
        startDate: new Date().toISOString().split('T')[0],
        description: '',
      });
      setCurrent(false);
      onWorkUpdate();
    } catch (error) {
      console.error('Error saving work experience:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      try {
        await workAPI.delete(id);
        onWorkUpdate();
      } catch (error) {
        console.error('Error deleting work experience:', error);
      }
    }
  };

  return (
    <div className="work-section">
      <div className="section-header">
        <h2>Work Experience</h2>
        <button onClick={() => setIsAdding(true)} className="add-btn">
          Add Work Experience
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={current}
                onChange={(e) => setCurrent(e.target.checked)}
              />
              I currently work here
            </label>
          </div>
          {!current && (
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
              />
            </div>
          )}
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
                  company: '',
                  position: '',
                  startDate: new Date().toISOString().split('T')[0],
                  description: '',
                });
                setCurrent(false);
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="work-list">
        {work.map((workExp) => (
          <div key={workExp._id} className="work-item">
            <h4>{workExp.company}</h4>
            <p className="position">{workExp.position}</p>
            <p className="dates">
              {new Date(workExp.startDate).toLocaleDateString()} -{' '}
              {workExp.endDate ? new Date(workExp.endDate).toLocaleDateString() : 'Present'}
            </p>
            <p className="description">{workExp.description}</p>
            <div className="item-actions">
              <button onClick={() => handleEdit(workExp)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(workExp._id!)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkManager;