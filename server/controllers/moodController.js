// controllers/moodController.js
import UserMode from '../models/Users/UserModeModel.js'; 
import MoodResponse from '../models/Users/MoodResponseModel.js';

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


export const createResponseMood = async (req, res) => {
    const { mood_id, responder_id, text } = req.body;
  
    if (!mood_id || !responder_id || !text) {
      return res.status(400).json({ error: 'Mood ID, responder_id, and text are required' });
    }
  
    try {
      // בדוק אם המוד קיים
      const mood = await UserMode.findById(mood_id);
      if (!mood) {
        return res.status(404).json({ error: 'Mood not found' });
      }
  
      // יצירת תגובה חדשה עם responder_id שנשלח מהבקשה
      const newResponse = new MoodResponse({
        mood_id,
        responder_id,  // responder_id יישלח מתוך ה-body של הבקשה
        text,
      });
  
      await newResponse.save();
      res.status(201).json(newResponse);  // מחזירים את התגובה שנוצרה
    } catch (err) {
      console.error('Error creating mood response:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

export const getMoodResponses = async (req, res) => {
    const { mood_id } = req.params;
  
    if (!mood_id) {
      return res.status(400).json({ error: 'Mood ID is required' });
    }
  
    try {
      // מצא את כל התגובות שקשורות ל-mood_id
      const responses = await MoodResponse.find({ mood_id })
        .sort({ timestamp: -1 });  // מסדר את התגובות לפי זמן (הכי חדש קודם)
  
      if (responses.length === 0) {
        return res.status(404).json({ error: 'No responses found for this mood' });
      }
  
      // מחזירים את התגובות
      res.json(responses);
    } catch (err) {
      console.error('Error fetching mood responses:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };