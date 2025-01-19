import { handleLogin } from './handlers/auth.js';
import { handleMessage, handleChatRequest, handleChatClose } from './handlers/chat.js';
import { handleDisconnect } from './handlers/connection.js';
import { validateUser } from '../middleware/auth.js';

// Store for maintaining application state
const store = {
  connectedUsers: new Map(),
  activeChats: new Map(),
  chatIdCounter: 1
};

export function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Set a timeout for the connection
    setTimeout(() => {
      if (socket.connected) {
        console.log('Socket connection timed out');
        socket.disconnect();
      }
    }, 200000);     
    socket.on('login', (data) => {
        console.log('Login data received:', data); // הדפסת המידע שמתקבל
        handleLogin(io, socket, data, store);
        console.log("Connected users:");
        store.connectedUsers.forEach((user, socketId) => {
            console.log(`Socket ID: ${socketId}, Username: ${user.username}, UserType: ${user.userType}`);
        });
      });

 
    // Chat handlers - ניהול צ'אט
    socket.on('request_chat', (data) => {
      try {
        //+validateUser(socket, store); // בדיקת אימות לפני בקשת צ'אט
        handleChatRequest(io, socket, data, store);
      } catch (err) {
        console.error('User not authenticated for chat request:', err);
        socket.emit('error', 'User not authenticated');
      }
    });

    socket.on('send_message', (data) => {
      try {
        validateUser(socket, store); // בדיקת אימות לפני שליחת הודעה
        handleMessage(io, socket, data, store);
      } catch (err) {
        console.error('User not authenticated for sending message:', err);
        socket.emit('error', 'User not authenticated');
      }
    });

    socket.on('close_chat', (chatId) => {
      try {
        validateUser(socket, store); // בדיקת אימות לפני סגירת צ'אט
        handleChatClose(io, socket, chatId, store);
      } catch (err) {
        console.error('User not authenticated for closing chat:', err);
        socket.emit('error', 'User not authenticated');
      }
    });

    // Connection handlers - ניתוק משתמש
    socket.on('disconnect', () => handleDisconnect(io, socket, store));
  });
}
