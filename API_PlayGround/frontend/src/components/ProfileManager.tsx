import React, { useState, useEffect } from 'react';
import { Profile, Links } from '../types';
import { profileAPI } from '../services/api';

interface ProfileManagerProps {
  profile: Profile | null;
  onProfileUpdate: () => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    email: '',
    links: {} as Links,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        links: profile.links,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('links.')) {
      const linkField = name.split('.')[1] as keyof Links;
      setFormData(prev => ({
        ...prev,
        links: {
          ...(prev.links || {}),
          [linkField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileAPI.updateBasic(formData);
      onProfileUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isEditing) {
    return (
      <div className="profile-section">
        <h2>Profile Information</h2>
        {profile && (
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
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>GitHub:</label>
          <input
            type="url"
            name="links.github"
            value={formData.links?.github || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn:</label>
          <input
            type="url"
            name="links.linkedin"
            value={formData.links?.linkedin || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Portfolio:</label>
          <input
            type="url"
            name="links.portfolio"
            value={formData.links?.portfolio || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManager;


