import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import CustomButton from '../../components/CustomButton';
import BackGround from '../../components/backGround';
import Map from '../../components/Map';
import { authService } from '../../services/authService';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';

const { width } = Dimensions.get('window');

const HomeRegularScreen = ({navigation}) => {
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

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.mindfulnessButton}
            onPress={() => navigation.navigate('MindfulnessScreen')}
          >
            <Text style={styles.buttonEmoji}>🧘‍♂️</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('ChangeMoodScreen')}
          >
            <Text style={styles.mainButtonText}>Change Mood</Text>
            <Text style={styles.buttonEmoji}>🎭</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapShadowContainer}>
            <Map style={styles.mapContent}/>
          </View>
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => navigation.navigate('SupportScreen')}
          >
            <Text style={styles.mainButtonText}>Support</Text>
            <Text style={styles.buttonEmoji}>💝</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={() => alert('Chat button pressed!')}
          >
            <Text style={styles.chatText}>💬</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#f36eb0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 75,
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
    elevation: 5,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
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
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  mainButton: {
    flex: 1,
    backgroundColor: '#EF9595',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 75,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mindfulnessButton: {
    backgroundColor: '#f36eb0',
    width: 50,
    height: 50,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonEmoji: {
    fontSize: 24,
  },
  mapContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 0, // Removed bottom margin
    borderRadius: 75,
    marginVertical: 0,
  },
  mapShadowContainer: {
    borderRadius: 75,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  mapContent: {
    flex: 1, // גורם למפה להשתמש בכל המרחב הזמין
    borderRadius: 75,
  },  
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // Added top margin to replace bottom margin from mapContainer
    marginBottom: 20,
  },
  supportButton: {
    flex: 1,
    backgroundColor: '#EF9595',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 75,
    marginRight: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatButton: {
    backgroundColor: '#f36eb0',
    width: 50,
    height: 50,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatText: {
    fontSize: 24,
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