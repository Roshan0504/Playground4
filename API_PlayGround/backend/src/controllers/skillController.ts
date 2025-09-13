import { Request, Response } from 'express';
import Profile from '../models/Profile';

// GET all skills
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
};

// ADD new skill
export const addSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill } = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $addToSet: { skills: skill } }, // Using addToSet to avoid duplicates
      { new: true }
    );
    
    res.json(updatedProfile?.skills);
  } catch (error) {
    res.status(400).json({ message: 'Error adding skill', error });
  }
};

// DELETE skill
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill } = req.params;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $pull: { skills: skill } },
      { new: true }
    );
    
    res.json(updatedProfile?.skills);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting skill', error });
  }
};