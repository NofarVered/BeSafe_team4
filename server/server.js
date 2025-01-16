import express from 'express';
<<<<<<< HEAD
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/authRoutes.js';
import moodRoutes from './routes/userModeRoutes.js';
import AvatarCreatorRoutes from './routes/avatarCreator.js';
import { MONGO_URI, PORT, CLIENT_URL } from './config/config.js';

const app = express();
app.use(express.json());
=======
import path from 'path';
import { fileURLToPath } from 'url';
//import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import Mongoose
import rubberDuckRoutes from './routes/rubberDucks.js'; 
import {Server} from 'socket.io';
import http from 'http';
import {initializeSocket} from './socket/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // לבטל את ההגבלה לצורך בדיקות
    methods: ["GET", "POST"]
  }
});



app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images
/*
>>>>>>> 24e0509 (BS-22: chat logic)
app.use(
  cors({
    origin: CLIENT_URL,
  })
);
io.on('connection', (socket) => {
  console.log('Socket connected');
  console.log('user connected with socket id: ' + socket.id);
    // הגדרת אירועים שמחכים להודעות מהלקוח
    socket.on('send_message', (msg , room) => {
      console.log('Message received: ', msg); // הדפסת הודעה מהלקוח
      socket.to(room).emit('send_message' , msg);
    });
  // בשרת:
  socket.emit('receive_message', { text: 'Hello! from server', user: 'Server' });

});
*/


// Initialize socket handlers
initializeSocket(io);




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

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
=======
// Use the routes file for all `/ducks` routes
app.use('/ducks', rubberDuckRoutes);

// Start server
const PORT = process.env.PORT || 5004; // Default to port 5000 if not specified
/*

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


//console.log(io);


>>>>>>> 24e0509 (BS-22: chat logic)
