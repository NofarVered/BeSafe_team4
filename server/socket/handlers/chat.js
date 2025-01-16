//import Chat from '../../models/Chat';

class Chat {
    constructor(hero, superhero, counter) {
      this.id = `chat_${counter}`;
      this.hero = hero;
      this.superhero = superhero;
      this.messages = [];
      this.createdAt = new Date();
    }
  }
  

export const handleChatRequest = (io, socket, { heroName, superheroName }, store) => {
    const hero = Array.from(store.connectedUsers.values())
      .find(user => user.username === heroName && user.userType === 'hero');
    
    const superhero = Array.from(store.connectedUsers.values())
      .find(user => user.username === superheroName && user.userType === 'superhero');
  
    if (hero && superhero) {
      const existingChat = Array.from(store.activeChats.values())
        .find(chat => 
          chat.hero.username === heroName && 
          chat.superhero.username === superheroName
        );
  
      if (!existingChat) {
        const newChat = new Chat(hero, superhero, store.chatIdCounter++);
        console.log("creating new chat : " + newChat.id + " between " + "hero: " + heroName + "super: " + superheroName);
        store.activeChats.set(newChat.id, newChat);
  
        io.to(hero.socketId).emit('chat_created', newChat);
        console.log("socketId sent to hero , hero.socketId: " + hero.socketId);
        io.to(superhero.socketId).emit('new_chat_request', newChat);
        console.log("socketId sent to super , superhero.socketId: " + superhero.socketId);

      }
    }
  };
  
  export const handleMessage = (io, socket, messageData, store) => {
    const chat = store.activeChats.get(messageData.chatId);
    if (chat) {
      chat.messages.push(messageData);
      
      const sender = store.connectedUsers.get(socket.id);
      const recipient = sender.userType === 'hero' ? chat.superhero : chat.hero;
      io.to(recipient.socketId).emit('receive_message', messageData);
    }
  };
  
  export const handleChatClose = (io, socket, chatId, store) => {
    const chat = store.activeChats.get(chatId);
    if (chat) {
      io.to(chat.hero.socketId).emit('chat_closed', chatId);
      io.to(chat.superhero.socketId).emit('chat_closed', chatId);
      store.activeChats.delete(chatId);
    }
  };
  
  // middleware/auth.js
  export const validateUser = (socket, store) => {
    const user = store.connectedUsers.get(socket.id);
    if (!user) {
      throw new Error('User not authenticated');
    }
  };