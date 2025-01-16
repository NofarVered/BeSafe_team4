//screens/Home/HomeRegularScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import CustomButton from '../../components/CustomButton';
import BackGround from '../../components/backGround';
import Map from '../../components/Map';
import { authService } from '../../services/authService';
import axios from 'axios';

const HomeRegularScreen = ({navigation, route}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarXml, setAvatarXml] = useState(null);

  const fetchAvatarXml = async (avatarUrl) => {
    try {
      const response = await axios.get(avatarUrl);
      setAvatarXml(response.data);
    } catch (error) {
      console.error('Error fetching avatar SVG:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Logout",
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await authService.getUserData();
        setUserData(data);
        
        if (data?.avatar_url) {
          await fetchAvatarXml(data.avatar_url);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <BackGround>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </BackGround>
    );
  }
  
  return (
    <BackGround>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {avatarXml ? (
            <SvgXml
              xml={avatarXml}
              width="150"
              height="150"
              style={styles.image}
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>
                {userData?.username?.[0] || '?'}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.childName}>
          {userData?.username || 'User Name'}
        </Text>
        
        <Text style={styles.mood}>Feeling Happy 😊</Text>
        
        <Map/>
        
        <CustomButton
          title='test - move to Support'
          onPress={() => navigation.navigate('SupportScreen')}
        />
        
        <TouchableOpacity 
          style={styles.chatButton} 
          onPress={() => alert('Chat button pressed!')}
        >
          <Text style={styles.chatText}>💬</Text>
        </TouchableOpacity>
      </View>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    backgroundColor: '#EF9595',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  mood: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#EF9595',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  chatText: {
    fontSize: 30,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
});

export default HomeRegularScreen;