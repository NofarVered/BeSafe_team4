import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/authRoutes.js';
import moodRoutes from './routes/userModeRoutes.js';
import AvatarCreatorRoutes from './routes/avatarCreator.js';
import { MONGO_URI, PORT, CLIENT_URL } from './config/config.js';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return null;  
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
    throw err;  
  });

app.use('/api', router);
app.use('/moodApi', moodRoutes);
app.use('/', AvatarCreatorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});