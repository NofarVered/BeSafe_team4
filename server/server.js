import express from 'express';
import cors from 'cors';
import router from './routes/authRoutes.js';
import moodRoutes from './routes/userModeRoutes.js';
import AvatarCreatorRoutes from './routes/avatarCreator.js';
import { MONGO_URI, PORT, CLIENT_URL } from './config/config.js';

const app = express();
app.use(express.json());
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import Mongoose
import {Server} from 'socket.io';
import http from 'http';
import {initializeSocket} from './socket/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // לבטל את ההגבלה לצורך בדיקות
    methods: ["GET", "POST"]
  },
  transports: ['websocket'],  // נבחר להשתמש ב-WebSocket בלבד
  pingTimeout: 10000,  // זמן מקסימלי להמתנה לפינג
  pingInterval: 2500, 
});



app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images
app.use(
  cors({
    origin: CLIENT_URL,
  })
);



// Initialize socket handlers
initializeSocket(io);
//console.log(io);



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


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

