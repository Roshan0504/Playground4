import express from 'express';
import {
  getProfile,
  updateProfile,
  updateBasicInfo,
  deleteProfile
} from '../controllers/profileController';

const router = express.Router();

router.get('/', getProfile);
router.post('/', updateProfile);
router.put('/', updateProfile);
router.patch('/basic', updateBasicInfo);
router.delete('/', deleteProfile);

export default router;