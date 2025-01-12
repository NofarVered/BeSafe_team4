import mongoose from 'mongoose';

const superDetailsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    ref: 'User', 
  },
  specialization: {
    type: String,
    required: true,
  },
  license_number: {
    type: String, 
  },
  contact_number: {
    type: String, 
  },
});

const SuperDetails = mongoose.model('SuperDetails', superDetailsSchema);

export default SuperDetails;
