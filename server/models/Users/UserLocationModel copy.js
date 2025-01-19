import mongoose from 'mongoose';

const userLocationSchema = new mongoose.Schema({
    user_id: {
      type: Number,
      required: true, // Foreign key to `Users`
      ref: 'User', // Reference to the Users table
    },
    latitude: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    longitude: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    shared_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  const UserLocation = mongoose.model('UserLocation', userLocationSchema);
  
  export default UserLocation;
  