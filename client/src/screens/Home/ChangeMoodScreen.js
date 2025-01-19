import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../../services/api'; // שימוש ב- axiosInstance שלך
import CustomButton from '../../components/CustomButton';
import * as Location from 'expo-location';
import { authService } from '../../services/authService';

const ChangeMoodScreen = ({navigation, route}) => {
  const [selectedMood, setSelectedMood] = useState("happy");
  const [userId, setUserId] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await authService.getUserData();
        if (storedUserId.user_id) {
          setUserId(storedUserId.user_id); // שמירת ה-user_id בסטייט
        } else {
          console.error('No user ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error);
      }
    };

    const getLocation = async () => {
          // בקשת הרשאות למיקום
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          // קבלת המיקום
          let { coords } = await Location.getCurrentPositionAsync({});
          setLocation(coords);
    };
        

    getLocation();
    fetchUserId();
  }, []);



  const handleMoodSubmit = () => {
    // הוספת המידע הנחוץ למשלוח לשרת
    const moodData = {
      user_id: userId, // להחליף ב-id של המשתמש
      mode_status: selectedMood, // מצב הרוח שנבחר
      mood_emoji: getMoodEmoji(selectedMood), // אייקון רגשי בהתאם למצב רוח
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    };

    // שלח את מצב הרוח לשרת
    axiosInstance.post('/moodApi/userMode', moodData)
      .then(response => {
        console.log('Mood updated successfully:', response.data);
        navigation.navigate('HomeRegularScreen');
      })
      .catch(error => {
        console.error('Error updating mood:', error);
      });
  };

  // פונקציה לקבלת האייקון הרגשי לפי מצב הרוח
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy':
        return "😊";
      case 'motivated':
        return "💪";
      case 'calm':
        return "😌";
      case 'sad':
        return "🙁";
      default:
        return "😊";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר את מצב הרוח שלך</Text>
      
      <Picker
        selectedValue={selectedMood}
        onValueChange={(itemValue) => setSelectedMood(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Happy" value="happy" />
        <Picker.Item label="Motivated" value="motivated" />
        <Picker.Item label="Calm" value="calm" />
        <Picker.Item label="Sad" value="sad" />
      </Picker>

      <CustomButton
        title="Submit Mood"
        onPress={handleMoodSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
});

export default ChangeMoodScreen;
