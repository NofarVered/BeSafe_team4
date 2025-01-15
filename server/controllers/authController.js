import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/Users/UserModel.js';
import SuperDetails from '../models/Users/UserSuperDetailsModel.js';
import HeroDetails from '../models/Users/UserHeroDetailsModel.js';


const SECRET_KEY = process.env.SECRET_KEY;


//Auth User
const authUser = async (email, password, role, userModel, detailsModel) => {
  try {
      //check if the user exists
      const user = await userModel.findOne({ email, role});
     
      if(!user){
          throw new Error('Email is not found');
      }


      //check if the password correct
      const isMatch = await bcrypt.compare(password, user.password_hash);


      if (!isMatch) {
          throw new Error('password is incorrect');
      }


      const userDetails = await detailsModel.findOne({ user_id: user.user_id });


      //create JWT token
      const token = jwt.sign(
          { userId: user.user_id, role: user.role },
          SECRET_KEY,
          { expiresIn: '1H' }
      );


      return { token, userId: user.user_id, role: user.role, userDetails };
  }
  catch (error) {
    throw new Error(error.message || 'Authentication failed');
  }
};


// connect to regular user
const loginHero = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, userId, role, userDetails } = await authUser(email, password, 'hero', User, HeroDetails);
      return res.status(200).json({ token, userId, role, userDetails });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }
};
 


// connect to super hero
const loginSuperHero = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, userId, role, userDetails } = await authUser(email, password, 'super_hero', User, SuperDetails);
      return res.status(200).json({ token, userId, role, userDetails });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }
};



const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim(); // מנקה תווים מיותרים

    // בדיקת תקינות ה-ID
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const hero = await User.findById(cleanId);
    if (!hero || hero.role !== 'hero') {
      return res.status(404).json({ message: "Hero not found" });
    }

    const heroDetails = await HeroDetails.findOne({ user_id: cleanId });

    res.status(200).json({
      user: hero,
      details: heroDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Hero data", error: error.message });
  }
};

const getSuperHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim(); // מנקה תווים מיותרים

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const superHero = await User.findById(cleanId);
    if (!superHero || superHero.role !== 'super_hero') {
      return res.status(404).json({ message: "Super Hero not found" });
    }

    const superHeroDetails = await SuperDetails.findOne({ user_id: cleanId });

    res.status(200).json({
      user: superHero,
      details: superHeroDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Super Hero data", error: error.message });
  }
};


const addHero = async (req, res) => {
    try {
      const { username, email, password, age, parent_phone, address, school_name } = req.body;
  
      
      const userExists = await User.findOne({ email, role: 'hero' });  // לבדוק רק עבור תפקיד 'hero'

      if (userExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(hashedPassword);

      
      const newUser = new User({
        username: username,
        email: email,
        password_hash: hashedPassword,
        role: 'hero',
      });

      
      const savedUser = await newUser.save();

      console.log(savedUser._id);
      const newHeroDetails = new HeroDetails({
        user_id: savedUser._id,
        age: age,
        parent_phone: parent_phone,
        address: address,
        school_name: school_name,
      });

      console.log(newHeroDetails);
      await newHeroDetails.save();

      return res.status(201).json({ message: 'Hero created successfully', newUser, newHeroDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

const addSuperHero  = async (req, res) => {
    try {
        const { username, email, password, specialization, license_number, contact_number } = req.body;
   
        const userExists = await User.findOne({ email, role: 'super_hero' });  // לבדוק רק עבור תפקיד 'hero'
        if (userExists) {
          return res.status(400).json({ message: 'Email already exists' });
        }
   
        const hashedPassword = await bcrypt.hash(password, 10);
   
        const newUser = new User({
          username: username,
          email: email,
          password_hash: hashedPassword,
          role: 'super_hero',
        });
   
        const savedUser = await newUser.save();
        console.log(savedUser._id);
        const newSuperHeroDetails = new SuperDetails({
          user_id: savedUser._id,
          specialization: specialization,
          license_number: license_number,
          contact_number: contact_number,
        });
   
        await newSuperHeroDetails.save();
   
        return res.status(201).json({ message: 'Super Hero created successfully', newUser, newSuperHeroDetails });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
};



const deleteHero   = async (req, res) => {
  try {
    const { id } = req.params;

    // מחיקת המשתמש מה-User
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Hero not found" });
    }

    // מחיקת הפרטים מה- HeroDetails
    await HeroDetails.deleteOne({ user_id: id });

    res.status(200).json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hero", error: error.message });
  }
};


const deleteSuperHero   = async (req, res) => {
  try {
    const { id } = req.params;

    // בדיקה אם המשתמש קיים והאם הוא Super Hero
    const superHero = await User.findById(id);
    if (!superHero || superHero.role !== 'super_hero') {
      return res.status(404).json({ message: "Super Hero not found" });
    }

    // מחיקת המשתמש מטבלת User
    await User.findByIdAndDelete(id);

    // מחיקת פרטי ה-Super Hero מטבלת SuperDetails
    await SuperDetails.deleteOne({ user_id: id });

    res.status(200).json({ message: "Super Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Super Hero", error: error.message });
  }
};


export { loginSuperHero, loginHero, addHero, addSuperHero, deleteHero , deleteSuperHero, getHeroById, getSuperHeroById};
