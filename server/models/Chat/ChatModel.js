import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chat_id: {
    type: Number,
    unique: true,
    required: true,
    index: true, // Primary key equivalent
  },
  user_id: {
    type: Number,
    required: true, // Foreign key to Users
    ref: 'User',
  },
  super_hero_id: {
    type: Number,
    required: true, // Foreign key to Users
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set timestamp
  },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
