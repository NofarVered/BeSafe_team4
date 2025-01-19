// controllers/moodController.js
import UserMode from '../models/Users/UserModeModel.js';  // Make sure to add .js extension

export const getUserMode = async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
  
    try {
      const userMode = await UserMode.findOne({ user_id: userId })
        .sort({ created_at: -1 }) 
        .limit(1); 
        
      if (!userMode) {
        return res.status(404).json({ error: 'User mode not found' });
      }
  
      res.json(userMode);
    } catch (err) {
      console.error('Error fetching user mode:', err);
      res.status(500).json({ error: 'Server error' });
    }
};

export const createUserMode = async (req, res) => {
    const { user_id, mode_status, mood_emoji } = req.body;
  
    if (!user_id || !mode_status) {
      return res.status(400).json({ error: 'user_id and mode_status are required' });
    }
  
    const validStatuses = ['happy', 'motivated', 'calm', 'stressed', 'sad'];
    if (!validStatuses.includes(mode_status)) {
      return res.status(400).json({ error: 'Invalid mode_status' });
    }
  
    try {
      const newUserMode = new UserMode({
        user_id,
        mode_status,
        mood_emoji: mood_emoji || '🙂'
      });
  
      await newUserMode.save();
  
      res.status(201).json({
        message: 'User mode created successfully',
        userMode: newUserMode
      });
    } catch (err) {
      console.error('Error creating user mode:', err);
      res.status(500).json({ error: 'Server error' });
    }
};
