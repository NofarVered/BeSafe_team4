import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import socketService from '../../services/SocketService'; // Importing the socket service

const HeroChatScreen = ({ navigation, route }) => {
  const [superheroName, setSuperheroName] = useState('');
  const { username } = route.params;

  useEffect(() => {
    // Ensure socket connection is initialized before using it
    socketService.initialize();

    // Clean up listeners when the component is unmounted
    return () => {
      socketService.removeAllListeners('chat_created');
    };
  }, []);

  const startChat = () => {
    if (superheroName.trim()) {
      console.log("client emit request_chat");

      // Use socketService to emit the 'request_chat' event
      socketService.requestChat({ heroName: username, superheroName: superheroName.trim() });

      // Listen for 'chat_created' event using socketService
      socketService.addListener('chat_created', (chat) => {
        navigation.navigate('Chat', {
          chatId: chat.id,
          username,
          userType: 'hero'
        });
      });

      // Handle potential errors or timeouts
      setTimeout(() => {
        socketService.removeListener('chat_created');
        Alert.alert('Error', 'Could not connect to superhero. Please try again.');
      }, 5000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Start a Chat with a Superhero</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter superhero's name"
        value={superheroName}
        onChangeText={setSuperheroName}
      />
      <TouchableOpacity
        style={styles.startButton}
        onPress={startChat}
        disabled={!superheroName.trim()}
      >
        <Text style={styles.buttonText}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HeroChatScreen;
