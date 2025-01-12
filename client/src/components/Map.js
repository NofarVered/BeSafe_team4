import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the location
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    };

    getLocation();
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
      <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Your Location" />
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
});

export default Map;
