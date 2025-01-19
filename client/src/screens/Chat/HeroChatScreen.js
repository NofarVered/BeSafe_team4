// screens/HeroChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { socket } from '../../services/SocketService';

const HeroChatScreen = ({ navigation, route }) => {
  const [superheroName, setSuperheroName] = useState('');
  const { username } = route.params;

  const startChat = () => {
    if (superheroName.trim()) {
      socket.emit('request_chat', {
        heroName: username,
        superheroName: superheroName.trim()
      });

      socket.once('chat_created', (chat) => {
        navigation.navigate('Chat', {
          chatId: chat.id,
          username,
          userType: 'hero'
        });
      });

      // Handle potential errors or timeouts
      setTimeout(() => {
        socket.off('chat_created');
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