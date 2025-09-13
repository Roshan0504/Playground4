import { Request, Response } from 'express';
import Profile from '../models/Profile';
import mongoose from 'mongoose';

// GET all work experiences
export const getWorkExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile.work);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching work experiences', error });
  }
};

// ADD new work experience
export const addWorkExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const workData = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $push: { work: workData } },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProfile?.work);
  } catch (error) {
    res.status(400).json({ message: 'Error adding work experience', error });
  }
};

// UPDATE work experience
export const updateWorkExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const workData = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { 'work._id': id },
      { $set: { 'work.$': workData } },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProfile?.work);
  } catch (error) {
    res.status(400).json({ message: 'Error updating work experience', error });
  }
};

// DELETE work experience
export const deleteWorkExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $pull: { work: { _id: id } } },
      { new: true }
    );
    
    res.json(updatedProfile?.work);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting work experience', error });
  }
};