import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { socket } from '../services/socket';

const SuperheroChatsListScreen = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const { username } = route.params;

  useEffect(() => {
    // Listen for new chat requests
    socket.on('new_chat_request', (newChat) => {
      setChats(currentChats => [...currentChats, newChat]);
    });

    // Listen for chat updates
    socket.on('update_chats', (updatedChats) => {
      setChats(updatedChats);
    });

    // Listen for closed chats
    socket.on('chat_closed', (chatId) => {
      setChats(currentChats => currentChats.filter(chat => chat.id !== chatId));
    });

    return () => {
      socket.off('new_chat_request');
      socket.off('update_chats');
      socket.off('chat_closed');
    };
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id, username, userType: 'superhero' })}
    >
      <Text style={styles.heroName}>Chat with {item.hero.username}</Text>
      <Text style={styles.lastMessage}>
        {item.messages.length > 0 
          ? item.messages[item.messages.length - 1].content 
          : 'No messages yet'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No active chats</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '500',
  },
  lastMessage: {
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});
