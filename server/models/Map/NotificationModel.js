import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notification_id: {
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
    message: {
      type: String,
      required: true,
    },
    read_status: {
      type: Boolean,
      default: false, // Default to unread
    },
    sent_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  
  export default Notification;
  