
import express from 'express';
import { getUserMode, createUserMode, createResponseMood, getMoodResponses } from '../controllers/moodController.js';

const moodRoutes = express.Router();

moodRoutes.get('/userMode/:userId', getUserMode);

moodRoutes.post('/userMode', createUserMode);

moodRoutes.post('/moodResponse', createResponseMood);

moodRoutes.get('/moodResponses/:mood_id', getMoodResponses);

export default moodRoutes;