/* 
// שמירת מצב המערכת
const connectedUsers = new Map(); // מיפוי socket.id למידע על המשתמש
const activeChats = new Map();    // מיפוי chatId לאובייקט צ'אט
let chatIdCounter = 1;

// מבנה של צ'אט
class Chat {
  constructor(hero, superhero) {
    this.id = `chat_${chatIdCounter++}`;
    this.hero = hero;
    this.superhero = superhero;
    this.messages = [];
    this.createdAt = new Date();
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // טיפול בהתחברות משתמש
  socket.on('login', ({ username, userType }) => {
    connectedUsers.set(socket.id, { username, userType, socketId: socket.id });
    console.log(`${userType} ${username} logged in`);

    // אם זה סופר-גיבור, שלח לו את כל הצ'אטים הפעילים שלו
    if (userType === 'superhero') {
      const superheroChats = Array.from(activeChats.values())
        .filter(chat => chat.superhero.username === username);
      socket.emit('update_chats', superheroChats);
    }
  });

  // בקשה ליצירת צ'אט חדש (נשלחת על ידי גיבור)
  socket.on('request_chat', ({ heroName, superheroName }) => {
    const hero = Array.from(connectedUsers.values())
      .find(user => user.username === heroName && user.userType === 'hero');
    
    const superhero = Array.from(connectedUsers.values())
      .find(user => user.username === superheroName && user.userType === 'superhero');

    if (hero && superhero) {
      // בדיקה אם כבר קיים צ'אט בין המשתמשים
      const existingChat = Array.from(activeChats.values())
        .find(chat => 
          chat.hero.username === heroName && 
          chat.superhero.username === superheroName
        );

      if (!existingChat) {
        const newChat = new Chat(hero, superhero);
        activeChats.set(newChat.id, newChat);

        // שליחת עדכון לשני המשתמשים
        io.to(hero.socketId).emit('chat_created', newChat);
        io.to(superhero.socketId).emit('new_chat_request', newChat);
      }
    }
  });

  // טיפול בשליחת הודעה
  socket.on('send_message', (messageData) => {
    const chat = activeChats.get(messageData.chatId);
    if (chat) {
      // הוספת ההודעה להיסטוריה של הצ'אט
      chat.messages.push(messageData);
      
      // שליחת ההודעה למשתמש השני בצ'אט
      const sender = connectedUsers.get(socket.id);
      const recipient = sender.userType === 'hero' ? chat.superhero : chat.hero;
      io.to(recipient.socketId).emit('receive_message', messageData);
    }
  });

  // טיפול בסגירת צ'אט
  socket.on('close_chat', (chatId) => {
    const chat = activeChats.get(chatId);
    if (chat) {
      // שליחת הודעה לשני המשתמשים על סגירת הצ'אט
      io.to(chat.hero.socketId).emit('chat_closed', chatId);
      io.to(chat.superhero.socketId).emit('chat_closed', chatId);
      
      // מחיקת הצ'אט מהרשימה
      activeChats.delete(chatId);
    }
  });

  // טיפול בהתנתקות משתמש
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      // אם זה גיבור, סגור את הצ'אט שלו
      if (user.userType === 'hero') {
        const heroChat = Array.from(activeChats.values())
          .find(chat => chat.hero.socketId === socket.id);
        if (heroChat) {
          io.to(heroChat.superhero.socketId).emit('chat_closed', heroChat.id);
          activeChats.delete(heroChat.id);
        }
      }
      // הסרת המשתמש מרשימת המחוברים
      connectedUsers.delete(socket.id);
    }
  });
});
*/