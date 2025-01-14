import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return null;  
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
    throw err;  
  });



app.use('/api', router);

// Start server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
