import express from 'express';
import {
  getSkills,
  addSkill,
  deleteSkill
} from '../controllers/skillController';

const router = express.Router();

router.get('/', getSkills);
router.post('/', addSkill);
router.delete('/:skill', deleteSkill);

export default router;