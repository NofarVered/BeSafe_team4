import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axiosInstance from '../services/api'; // הייבוא של axiosInstance
import { authService } from '../services/authService'; // הייבוא של authService

const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [moodData, setMoodData] = useState(null);

  // פונקציה לקבלת המצב רוח של המשתמש
  const fetchMoodData = async () => {
    try {
      const userData = await authService.getUserData();
      if (userData && userData.user_id) {
        // שלח בקשה ל-API עם ה- user_id
        const response = await axiosInstance.get(`/moodApi/userMode/${userData.user_id}`);
        setMoodData(response.data);  // שמור את המידע של המצב רוח
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  useEffect(() => {
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
    fetchMoodData(); // קריאה לפונקציה שמביאה את המצב רוח
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!moodData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading mood...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Your Location">
        {/* הצגת האימוג'י במרקר */}
        <View style={styles.moodMarker}>
          <Text style={styles.moodEmoji}>{moodData.mood_emoji}</Text>
        </View>
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  moodMarker: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 10,
  },
  moodEmoji: {
    fontSize: 24,
  },
});

export default Map;
