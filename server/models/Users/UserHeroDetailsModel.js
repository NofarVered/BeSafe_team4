import mongoose from 'mongoose';

const heroDetailsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    ref: 'User', 
  },
  age: {
    type: Number,
    required: true,
  },
  parent_phone: {
    type: String, 
    required: true,
  },
  address: {
    type: String, 
  },
  school_name: {
    type: String, 
  },
});

const HeroDetails = mongoose.model('HeroDetails', heroDetailsSchema);

export default HeroDetails;
