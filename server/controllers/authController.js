import bcrypt from 'bcryptjs';
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
          { expiresIn: '1s' }
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


/*
const getHeroById = async (req, res) => {
   
    try {
        const user = await User.findOne({ user_id: req.params.id, role: 'hero' });
        if (!user) {
          return res.status(404).json({ message: 'Hero not found' });
        }
        const heroDetails = await HeroDetails.findOne({ user_id: user.user_id });
        return res.status(200).json({ user, heroDetails });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
*/


/*const getSuperHeroById  = async (req, res) => {


};*/



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

    
      const newHeroDetails = new HeroDetails({
        user_id: savedUser._id,  
        age: age,
        parent_phone: parent_phone,
        address: address,
        school_name: school_name,
      });
  
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



/*const deleteHero   = async (req, res) => {


};


const deleteSuperHero   = async (req, res) => {


};*/


export { loginSuperHero, loginHero, addHero, addSuperHero };
