import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axiosInstance from '../services/api';
import { authService } from '../services/authService';
import { useNavigation } from '@react-navigation/native'; // Add this import

const Map = () => {
  const navigation = useNavigation(); // Add this hook
  const [moodData, setMoodData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMoodData = async () => {
    try {
      const userData = await authService.getUserData();
      setUserId(userData.user_id);
      const response = await axiosInstance.get('/moodApi/currentWeekMoods');
      setMoodData(response.data);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setErrorMsg('Failed to fetch mood data');
    }
  };

  useEffect(() => {
    fetchMoodData();
    const interval = setInterval(fetchMoodData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerPress = (mood) => {
    navigation.navigate('Comments', { mood });
  };

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (moodData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading moods...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: parseFloat(moodData[0].latitude.$numberDecimal),
        longitude: parseFloat(moodData[0].longitude.$numberDecimal),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {moodData.map((mood) => (
        <Marker
          key={mood.mood_id}
          coordinate={{
            latitude: parseFloat(mood.latitude.$numberDecimal),
            longitude: parseFloat(mood.longitude.$numberDecimal),
          }}
          onPress={() => handleMarkerPress(mood)}
        >
          <View
            style={[
              styles.moodMarker,
              mood.user_id === userId && styles.userMoodMarker,
            ]}
          >
            <Text style={styles.moodEmoji}>{mood.mood_emoji}</Text>
          </View>
        </Marker>
      ))}
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
  userMoodMarker: {
    backgroundColor: 'lightgreen',
  },
  moodEmoji: {
    fontSize: 24,
  },
});

export default Map;