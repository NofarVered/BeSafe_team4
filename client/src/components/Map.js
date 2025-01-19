import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axiosInstance from '../services/api'; // הייבוא של axiosInstance
import { authService } from '../services/authService'; // הייבוא של authService

const Map = () => {
  const [moodData, setMoodData] = useState([]); // שונה למערך
  const [userId, setUserId] = useState(null); // סטייט עבור user_id
  const [errorMsg, setErrorMsg] = useState('');

  // פונקציה לקבלת המצב רוח של המשתמש
  const fetchMoodData = async () => {
    try {
      // קבלת ה-user_id מהשירות
      const userData = await authService.getUserData();
      setUserId(userData.user_id);

      // קריאה ל-API לקבלת כל המצבים
      const response = await axiosInstance.get('/moodApi/currentWeekMoods');
      setMoodData(response.data); // שמור את המידע של כל המצבים
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setErrorMsg('Failed to fetch mood data');
    }
  };

  useEffect(() => {
    fetchMoodData(); // קריאה לפונקציה שמביאה את המידע
  }, []);

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
        latitude: parseFloat(moodData[0].latitude.$numberDecimal), // המיקום הראשון
        longitude: parseFloat(moodData[0].longitude.$numberDecimal),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {moodData.map((mood) => (
        <Marker
          key={mood.mood_id} // מפתח ייחודי לכל מרקר
          coordinate={{
            latitude: parseFloat(mood.latitude.$numberDecimal),
            longitude: parseFloat(mood.longitude.$numberDecimal),
          }}
          title={`Mood: ${mood.mood_emoji}`}
        >
          {/* הצגת האימוג'י במרקר עם רקע ירוק למשתמש הנוכחי */}
          <View
            style={[
              styles.moodMarker,
              mood.user_id === userId && styles.userMoodMarker, // רקע ירוק אם ה-user_id תואם
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
    backgroundColor: 'lightgreen', // רקע ירוק למשתמש הנוכחי
  },
  moodEmoji: {
    fontSize: 24,
  },
});

export default Map;
