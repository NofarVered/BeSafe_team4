import express from 'express';
import UserMode from '../models/Users/UserModeModel.js';

const router = express.Router();

router.get('/api/userMode/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const userMode = await UserMode.findOne({ user_id: userId });
    if (!userMode) {
      return res.status(404).json({ error: 'User mode not found' });
    }

    // Ensure mood_emoji is provided
    const response = {
      ...userMode._doc,
      mood_emoji: userMode.mood_emoji || '🙂', // Default emoji
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching user mode:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
