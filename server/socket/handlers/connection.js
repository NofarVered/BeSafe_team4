export const handleDisconnect = (io, socket, store) => {
    const user = store.connectedUsers.get(socket.id);
    if (user) {
      if (user.userType === 'hero') {
        const heroChat = Array.from(store.activeChats.values())
          .find(chat => chat.hero.socketId === socket.id);
        if (heroChat) {
          io.to(heroChat.superhero.socketId).emit('chat_closed', heroChat.id);
          store.activeChats.delete(heroChat.id);
        }
      }
      store.connectedUsers.delete(socket.id);
    }
  };