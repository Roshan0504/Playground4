import express from 'express';
import {
  getWorkExperiences,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} from '../controllers/workController';

const router = express.Router();

router.get('/', getWorkExperiences);
router.post('/', addWorkExperience);
router.put('/:id', updateWorkExperience);
router.delete('/:id', deleteWorkExperience);

export default router;