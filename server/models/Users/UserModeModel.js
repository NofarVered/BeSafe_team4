import mongoose from 'mongoose';

const userModeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true, // Foreign key to `Users`
    ref: 'User',
    index: true,
  },
  mode_status: {
    type: String,
    enum: ['happy', 'motivated', 'calm', 'stressed', 'sad'],
    required: true,
  },
  mood_emoji: {
    type: String,
  },
  latitude: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },  
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
});

// יצירת המודל
const UserMode = mongoose.model('UserMode', userModeSchema);

export default UserMode;
