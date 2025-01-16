import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import axiosInstance from '../services/api';
import axios from 'axios';

const AvatarCreator = ({ onAvatarGenerated }) => {
  const [avatarXml, setAvatarXml] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fetchAvatar = async () => {
    try {
      const response = await axiosInstance.get('/generate-avatar');
      const generatedAvatarUrl = response.data.avatarUrl;
      setAvatarUrl(generatedAvatarUrl);
      
      const svgResponse = await axios.get(generatedAvatarUrl);
      setAvatarXml(svgResponse.data);
      
      // Call the callback with the avatar URL if provided
      if (onAvatarGenerated) {
        onAvatarGenerated(generatedAvatarUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to generate avatar: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

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
        <Text>Loading...</Text>
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
});

export default AvatarCreator;