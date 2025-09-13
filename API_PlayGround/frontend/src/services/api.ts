import axios from 'axios';
import { Education, Project, WorkExperience, Profile } from '../types';

const api = axios.create({
  baseURL: 'https://playground1-nu.vercel.app/api',
});
// const api = axios.create({
//   baseURL: 'https://playground1-nu.vercel.app/api',
// });

export const profileAPI = {
  get: () => api.get<Profile>('/profile'),
  updateBasic: (data: Partial<Profile>) => api.put('/profile', data),
};

export const educationAPI = {
  add: (data: Omit<Education, '_id'>) => api.post('/education', data),
  update: (id: string, data: Partial<Education>) => api.put(`/education/${id}`, data),
  delete: (id: string) => api.delete(`/education/${id}`),
};

export const projectsAPI = {
  add: (data: Omit<Project, '_id'>) => api.post('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const workAPI = {
  add: (data: Omit<WorkExperience, '_id'>) => api.post('/work', data),
  update: (id: string, data: Partial<WorkExperience>) => api.put(`/work/${id}`, data),
  delete: (id: string) => api.delete(`/work/${id}`),
};

export const skillsAPI = {
  add: (skill: string) => api.post('/skills', { name: skill }),
  delete: (skill: string) => api.delete(`/skills/${encodeURIComponent(skill)}`),
};

export const searchAPI = {
  general: (q: string) => api.get('/search', { params: { q } }),
  projectsBySkill: (skill: string) => api.get('/search/projects', { params: { skill } }),
  topSkills: () => api.get<string[]>('/search/skills/top'),
};

export const seedAPI = {
  seed: () => api.post('/seed/profile'),
};


