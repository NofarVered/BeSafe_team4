import React from 'react';
import { View, Text, StyleSheet,Button, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import BackGround from '../../components/backGround';
import Map from '../../components/Map';

const HomeRegularScreen = ({navigation }) => {
  
  return (
    <BackGround>
      <View style={styles.container}>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/testAvatar.jpg')}
            style={styles.image} 
          />
        </View>

        {/* Name */}
        <Text style={styles.childName}>John Doe</Text>

        {/* Mood */}
        <Text style={styles.mood}>Feeling Happy 😊</Text>

        {/* Map */}
        <Map/>

        <CustomButton
            title='test - move to Support'
            onPress={() => navigation.navigate('SupportScreen')}
        />

        {/* Chat button */}
        <TouchableOpacity style={styles.chatButton} onPress={() => alert('Chat button pressed!')}>
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
  imageContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, 
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
  },
});

export default HomeRegularScreen;
