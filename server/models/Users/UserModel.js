import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
    required: true,
    index: true, // Primary key equivalent
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['hero', 'super_hero'],
    default: 'hero',
  },
  avatar_url: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;