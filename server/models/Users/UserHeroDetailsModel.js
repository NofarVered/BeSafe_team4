import mongoose from 'mongoose';

const heroDetailsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
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
