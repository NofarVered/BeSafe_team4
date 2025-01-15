import express from 'express';
import { createAvatar } from '../controllers/avatarCreatorController.js';

const router = express.Router();

router.get('/generate-avatar', createAvatar)

export default router;