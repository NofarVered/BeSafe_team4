import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import Mongoose
import rubberDuckRoutes from './routes/rubberDucks.js'; 
import AvatarCreatorRoutes from './routes/avatarCreator.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return true; // Return a value to satisfy ESLint
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
    throw err; // Re-throw the error to satisfy ESLint
  });


// Use the routes file for all `/ducks` routes
app.use('/ducks', rubberDuckRoutes);

app.use('/', AvatarCreatorRoutes);
// Start server
const PORT = process.env.PORT || 5004; // Default to port 5000 if not specified
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

