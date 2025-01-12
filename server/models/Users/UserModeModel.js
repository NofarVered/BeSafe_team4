import mongoose from 'mongoose';

const userModeSchema = new mongoose.Schema({
    mode_id: {
      type: Number,
      unique: true,
      required: true,
      index: true, // Primary key equivalent
    },
    user_id: {
      type: Number,
      required: true, // Foreign key to `Users`
      ref: 'User',
    },
    mode_status: {
      type: String,
      enum: ['happy', 'motivated', 'calm', 'stressed', 'sad'],
      required: true,
    },
    mood_emoji: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  const UserMode = mongoose.model('UserMode', userModeSchema);
  
  export default UserMode;
  