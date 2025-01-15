import React from 'react';
import { View, StyleSheet } from 'react-native';
import AvatarCreator from '../../components/AvatarCreator';

const AvatarScreen = () => {
  return (
    <View style={styles.container}>
      <AvatarCreator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AvatarScreen;
