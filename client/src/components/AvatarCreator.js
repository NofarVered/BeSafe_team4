import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import axiosInstance from '../services/api';
import axios from 'axios';

const AvatarCreator = ({ onAvatarGenerated }) => {
  const [avatarXml, setAvatarXml] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, generate avatar URL from your backend
      const response = await axiosInstance.get('/generate-avatar');
      const generatedAvatarUrl = response.data.avatarUrl;
      setAvatarUrl(generatedAvatarUrl);

      // If URL is from an external service that might be down
      const svgResponse = await axios.get(generatedAvatarUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      setAvatarXml(svgResponse.data);
      
      if (onAvatarGenerated) {
        onAvatarGenerated(generatedAvatarUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        setError(`Server Error: ${error.response.status}`);
        Alert.alert('Error', `Failed to generate avatar. Status: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from avatar service');
        Alert.alert('Network Error', 'Unable to connect to avatar generation service');
      } else {
        // Something happened in setting up the request
        setError('Error in avatar generation');
        Alert.alert('Error', 'Failed to generate avatar');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Generating Avatar...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load avatar</Text>
        <Button title="Retry" onPress={fetchAvatar} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Random Avatar</Text>
      {avatarXml ? (
        <View style={styles.avatarContainer}>
          <SvgXml
            xml={avatarXml}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </View>
      ) : (
        <Text>No avatar available</Text>
      )}
      <Button title="Generate New Avatar" onPress={fetchAvatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgb(139, 167, 158)',
    shadowColor: 'rgb(80, 138, 138)',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1.8,
    shadowRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    fontSize: 18,
  }
});

export default AvatarCreator;