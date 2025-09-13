import { Request, Response } from 'express';
import Profile from '../models/Profile';
import mongoose from 'mongoose';

// GET all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile.projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

// ADD new project
export const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectData = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $push: { projects: projectData } },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProfile?.projects);
  } catch (error) {
    res.status(400).json({ message: 'Error adding project', error });
  }
};

// UPDATE project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { 'projects._id': id },
      { $set: { 'projects.$': projectData } },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProfile?.projects);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
};

// DELETE project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $pull: { projects: { _id: id } } },
      { new: true }
    );
    
    res.json(updatedProfile?.projects);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting project', error });
  }
};