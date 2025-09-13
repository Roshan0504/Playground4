import { Request, Response } from 'express';
import Profile from '../models/Profile';
import mongoose from 'mongoose';

// GET all education entries
export const getEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile.education);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching education', error });
  }
};

// ADD new education entry
export const addEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const educationData = req.body;
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $push: { education: educationData } },
      { new: true, runValidators: true }
    );
    res.json(updatedProfile?.education);
  } catch (error) {
    res.status(400).json({ message: 'Error adding education', error });
  }
};

// UPDATE education entry
export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const educationData = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { 'education._id': id },
      { $set: { 'education.$': educationData } },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProfile?.education);
  } catch (error) {
    res.status(400).json({ message: 'Error updating education', error });
  }
};

// DELETE education entry
export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $pull: { education: { _id: id } } },
      { new: true }
    );
    
    res.json(updatedProfile?.education);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting education', error });
  }
};