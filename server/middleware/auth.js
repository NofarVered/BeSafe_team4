export const validateUser = (socket, store) => {
  const user = store.connectedUsers.get(socket.id);
  if (!user) {
    throw new Error('User not authenticated');
  }
};