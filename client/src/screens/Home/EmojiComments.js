import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import axiosInstance from '../../services/api';
import { authService } from '../../services/authService';

const CommentsScreen = ({ route, navigation }) => {
  const { mood } = route.params;
  const [responses, setResponses] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await authService.getUserData();
        setUserId(userData.user_id);
        await fetchResponses();
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await axiosInstance.get(`/moodApi/moodResponses/${mood.mood_id}`);
      setResponses(response.data);
    } catch (error) {
      // If it's a 404 error, just set empty responses (this is normal when there are no comments)
      if (error.response && error.response.status === 404) {
        setResponses([]);
      } else {
        // For other errors, log them but still set empty responses
        console.error('Error fetching responses:', error);
        setResponses([]);
      }
    }
  };

  const handleSubmitResponse = async () => {
    if (!newComment.trim()) return;
  
    try {
      const response = await axiosInstance.post('/moodApi/moodResponse', {
        mood_id: mood.mood_id,
        responder_id: userId,
        text: newComment.trim(),
      });
  
      if (response && response.data) {
        setResponses(prevResponses => [...prevResponses, response.data]);
        setNewComment('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        // מציג פופ-אפ עם תוכן השגיאה
        alert(`${error.response.data.error}`);
      } else {
        console.error('Error submitting response:', error);
        alert('Failed to submit comment. Please try again.');
      }
    }
  };  

  const renderResponseItem = ({ item }) => (
    <View style={styles.responseItem}>
      <Text style={styles.responseText}>{item.text}</Text>
      <Text style={styles.responseTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading comments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Comments for {mood.mood_emoji} mood
        </Text>
      </View>

      <FlatList
        data={responses}
        renderItem={renderResponseItem}
        keyExtractor={item => item._id}
        style={styles.responsesList}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={responses.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !newComment.trim() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitResponse}
          disabled={!newComment.trim()}
        >
          <Text style={styles.submitButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  responsesList: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  responseItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
  },
  responseTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentsScreen;