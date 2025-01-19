
import express from 'express';
import { getUserMode, createUserMode } from '../controllers/moodController.js';

const moodRoutes = express.Router();

moodRoutes.get('/userMode/:userId', getUserMode);

moodRoutes.post('/userMode', createUserMode);

export default moodRoutes;