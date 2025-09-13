import { Request, Response } from 'express';
import Profile, { IProfile } from '../models/Profile';

// GET complete profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// CREATE or UPDATE complete profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileData: IProfile = req.body;
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      profileData,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error });
  }
};

// UPDATE basic profile info (name, email, links)
export const updateBasicInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, links } = req.body;
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { name, email, links },
      { new: true, runValidators: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating basic info', error });
  }
};

// DELETE profile
export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    await Profile.deleteOne({});
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error });
  }
};