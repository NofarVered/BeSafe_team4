import React from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const BackGround = ({ children }) => {
  return (
    <ImageBackground 
          source={require('../assets/background.jpg')} 
          style={styles.background} 
          resizeMode="cover" 
          >
        {children}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    background: {
      flex: 1, // Makes the background image cover the whole screen
    },
})

export default BackGround