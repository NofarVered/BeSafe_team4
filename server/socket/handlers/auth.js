export const handleLogin = (io, socket, { username, userType }, store) => {
  store.connectedUsers.set(socket.id, { username, userType, socketId: socket.id });
  console.log(`${userType} ${username} logged in`);

  if (userType === 'superhero') {
    const superheroChats = Array.from(store.activeChats.values())
      .filter(chat => chat.superhero.username === username);
    socket.emit('update_chats', superheroChats);
  }
};