// controllers/moodController.js
import UserMode from '../models/Users/UserModeModel.js';
import MoodResponse from '../models/Users/MoodResponseModel.js';
import User from '../models/Users/UserModel.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const PERSPECTIVE_API_KEY = 'AIzaSyAv3rQfwWW7j6cecHQdjRqx292EpAON_MM';
export const getUserMode = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    try {
      const userMode = await UserMode.findOne({ user_id: userId })
        .sort({ created_at: -1 })  // ממיין לפי הזמן שהמשתמש עדכן את המצב רוח
        .limit(1);  // רק המוד האחרון

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
    const { user_id, mode_status, mood_emoji, latitude, longitude } = req.body;

    if (!user_id || !mode_status || !latitude || !longitude) {
      return res.status(400).json({ error: 'user_id, mode_status, latitude, and longitude are required' });
    }

    const validStatuses = ['happy', 'motivated', 'calm', 'stressed', 'sad'];
    if (!validStatuses.includes(mode_status)) {
      return res.status(400).json({ error: 'Invalid mode_status' });
    }

    try {
         // בדיקת אם המשתמש קיים
      const userExists = await User.findById(user_id);
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newUserMode = new UserMode({
        user_id,
        mode_status,
        mood_emoji: mood_emoji || '🙂',
        latitude: latitude,
        longitude: longitude,
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

export const getMoodsFromCurrentWeek = async (req, res) => {
    try {
      // חישוב תחילת השבוע הנוכחי
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0); // הגדרת שעה תחילת השבוע
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // הוספת 6 ימים

      // חיפוש ה-Moods שנוצרו בשבוע הנוכחי
      const weeklyMoods = await UserMode.find({
        created_at: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      }).populate('user_id', 'name avatar'); // משייך את שם ואווטאר המשתמש

      if (weeklyMoods.length === 0) {
        return res.status(404).json({ error: 'No moods found for the current week' });
      }

      // מיפוי התוצאות להחזרת מידע רלוונטי בלבד
      const result = weeklyMoods.map(mood => ({
        user_id: mood.user_id._id,
        name: mood.user_id.name,
        mood_id: mood._id,
        mood_emoji: mood.mood_emoji,
        latitude: mood.latitude,
        longitude: mood.longitude,
        created_at: mood.created_at,
      }));

      res.json(result);
    } catch (err) {
      console.error('Error fetching weekly moods:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };


const analyzeToxicity = async (text) => {
    try {
      console.log('Analyzing text:', text);
      const response = await axios.post(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
        {
          comment: {
            text: text,
            type: 'PLAIN_TEXT'
          },
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {}
          }
        }
      );

      console.log('Perspective API Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Perspective API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        text: text
      });
      throw error;
    }
  };

export const createResponseMood = async (req, res) => {
    const { mood_id, responder_id, text } = req.body;

    try {
      if (!mood_id || !responder_id || !text) {
        return res.status(400).json({ error: 'Mood ID, responder_id, and text are required' });
      }

      // Check if mood exists
      const mood = await UserMode.findById(mood_id);
      if (!mood) {
        return res.status(404).json({ error: 'Mood not found' });
      }

      // Analyze the text for toxicity
      let analysis;
      try {
        analysis = await analyzeToxicity(text);
      } catch (error) {
        if (error.response?.status === 400) {
          // If it's a 400 error, let's just treat the text as safe
          // This can happen with very short or simple texts
          console.log('Perspective API returned 400, treating text as safe:', text);
          analysis = {
            attributeScores: {
              TOXICITY: { summaryScore: { value: 0 } },
              SEVERE_TOXICITY: { summaryScore: { value: 0 } },
              PROFANITY: { summaryScore: { value: 0 } },
              INSULT: { summaryScore: { value: 0 } }
            }
          };
        } else {
          // For other errors, reject the request
          return res.status(500).json({
            error: 'Unable to analyze comment content. Please try again later.'
          });
        }
      }

      // Set thresholds
      const TOXICITY_THRESHOLD = 0.7;
      const SEVERE_TOXICITY_THRESHOLD = 0.5;
      const PROFANITY_THRESHOLD = 0.5;
      const INSULT_THRESHOLD = 0.5;

      // Check for toxic content
      const isToxic = (
        analysis.attributeScores.TOXICITY.summaryScore.value > TOXICITY_THRESHOLD ||
        analysis.attributeScores.SEVERE_TOXICITY.summaryScore.value > SEVERE_TOXICITY_THRESHOLD ||
        analysis.attributeScores.PROFANITY.summaryScore.value > PROFANITY_THRESHOLD ||
        analysis.attributeScores.INSULT.summaryScore.value > INSULT_THRESHOLD
      );

      console.log('Content analysis results:', {
        text,
        isToxic,
        scores: {
          toxicity: analysis.attributeScores.TOXICITY.summaryScore.value,
          severeToxicity: analysis.attributeScores.SEVERE_TOXICITY.summaryScore.value,
          profanity: analysis.attributeScores.PROFANITY.summaryScore.value,
          insult: analysis.attributeScores.INSULT.summaryScore.value
        }
      });

      if (isToxic) {
        return res.status(400).json({
          error: 'Comment contains inappropriate content and cannot be posted',
          details: {
            toxicity: analysis.attributeScores.TOXICITY.summaryScore.value,
            severeToxicity: analysis.attributeScores.SEVERE_TOXICITY.summaryScore.value,
            profanity: analysis.attributeScores.PROFANITY.summaryScore.value,
            insult: analysis.attributeScores.INSULT.summaryScore.value
          }
        });
      }

      // If the comment passes the toxicity check, create and save it
      const newResponse = new MoodResponse({
        mood_id,
        responder_id,
        text,
      });

      await newResponse.save();
      res.status(201).json(newResponse);
    } catch (err) {
      console.error('Error in createResponseMood:', {
        error: err.message,
        stack: err.stack,
        requestBody: req.body
      });
      res.status(500).json({
        error: 'Server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
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