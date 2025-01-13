import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message_id: {
      type: Number,
      unique: true,
      required: true,
      index: true, // Primary key equivalent
    },
    chat_id: {
      type: Number,
      required: true, // Foreign key to Chats
      ref: 'Chat',
    },
    sender_id: {
      type: Number,
      required: true, // ID of the sender (user or super-hero)
      ref: 'User',
    },
    message_text: {
      type: String,
      required: true,
    },
    sent_at: {
      type: Date,
      default: Date.now, // Automatically set timestamp
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  export default Message;
  