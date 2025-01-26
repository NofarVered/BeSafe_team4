// services/socketService.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Initialize socket connection
  initialize(serverUrl = 'http://10.100.102.11:5000') {
    console.log(`Initializing socket connection to ${serverUrl}`);
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    // Setup basic connection listeners
    this.setupConnectionListeners();
  }

  // Setup basic socket connection listeners
  setupConnectionListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
  }

  // Connect to socket server
  connect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Login user
  login(userData) {
    console.log("login get userData : " , userData);
    this.socket.emit('login', userData);
    console.log("login event from user " , userData.username);
  }

  // Request new chat (for heroes)
  requestChat(chatData) {
    this.socket.emit('request_chat', chatData);
  }

  // Send message in chat
  sendMessage(messageData) {
    this.socket.emit('send_message', messageData);
  }

  // Close chat
  closeChat(chatId) {
    this.socket.emit('close_chat', chatId);
  }

  // Add event listener with ability to store reference
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    this.socket.on(event, callback);
  }

  // Remove specific event listener
  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      this.socket.off(event, callback);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).clear();
      this.socket.off(event);
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

// Export singleton instance
export default socketService;