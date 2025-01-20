import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../../services/api';
import CustomButton from '../../components/CustomButton';
import * as Location from 'expo-location';
import { authService } from '../../services/authService';
import BackGround from '../../components/backGround';

const ChangeMoodScreen = ({navigation, route}) => {
  const [selectedMood, setSelectedMood] = useState("happy");
  const [userId, setUserId] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user ID
        const storedUserId = await authService.getUserData();
        if (!storedUserId.user_id) {
          throw new Error('No user ID found');
        }
        setUserId(storedUserId.user_id);

        // Get location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }

        // Get current location
        const locationData = await Location.getCurrentPositionAsync({});
        if (!locationData || !locationData.coords) {
          throw new Error('Could not get location');
        }
        setLocation(locationData.coords);

      } catch (error) {
        console.error('Initialization error:', error);
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleMoodSubmit = async () => {
    if (!location || !userId) {
      Alert.alert(
        'Error',
        'Cannot submit mood without location. Please ensure location services are enabled.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsLoading(true);
      const moodData = {
        user_id: userId,
        mode_status: selectedMood,
        mood_emoji: getMoodEmoji(selectedMood),
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await axiosInstance.post('/moodApi/userMode', moodData);
      console.log('Mood updated successfully:', response.data);
      Alert.alert(
        'Success',
        'Your mood has been updated!',
        [
          { 
            text: 'OK',
            onPress: () => navigation.navigate('HomeRegularScreen')
          }
        ]
      );
    } catch (error) {
      console.error('Error updating mood:', error);
      Alert.alert(
        'Error',
        'Failed to update mood. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      happy: "😊",
      motivated: "💪",
      calm: "😌",
      sad: "🙁"
    };
    return emojiMap[mood] || "😊";
  };

  if (isLoading) {
    return (
      <BackGround>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </BackGround>
    );
  }

  if (errorMsg) {
    return (
      <BackGround>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </BackGround>
    );
  }

  return (
    <BackGround>
      <View style={styles.container}>
        <Text style={styles.title}>בחר את מצב הרוח שלך</Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMood}
            onValueChange={(itemValue) => setSelectedMood(itemValue)}
            style={styles.picker}
            dropdownIconColor="white"
            mode="dropdown"
          >
            <Picker.Item label="Happy 😊" value="happy" />
            <Picker.Item label="Motivated 💪" value="motivated" />
            <Picker.Item label="Calm 😌" value="calm" />
            <Picker.Item label="Sad 🙁" value="sad" />
          </Picker>
        </View>

        <CustomButton
          title="Submit Mood"
          onPress={handleMoodSubmit}
        />
      </View>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: 'black',
  },
});

export default ChangeMoodScreen;