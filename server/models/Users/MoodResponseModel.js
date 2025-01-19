import mongoose from 'mongoose';

const moodResponseSchema = new mongoose.Schema({
  mood_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'UserMode', 
    index: true,
  },
  responder_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User', 
  },
  text: {
    type: String,
    required: true, 
  },
  timestamp: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true, 
});

// יצירת המודל
const MoodResponse = mongoose.model('MoodResponse', moodResponseSchema);

export default MoodResponse;
