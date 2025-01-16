import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import AvatarCreator from '../../components/AvatarCreator';

const CreateAvatarScreen = ({ navigation, route }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleAvatarGenerated = (url) => {
    setAvatarUrl(url);
  };

  const handleSelectAvatar = () => {
    if (!avatarUrl) {
      Alert.alert('Error', 'Please generate an avatar first');
      return;
    }

    // Call the callback function passed from the registration screen
    const onSelectAvatar = route.params?.onSelectAvatar;
    if (onSelectAvatar) {
      onSelectAvatar(avatarUrl);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <AvatarCreator onAvatarGenerated={handleAvatarGenerated} />
      <Button 
        title="Select This Avatar" 
        onPress={handleSelectAvatar}
        disabled={!avatarUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default CreateAvatarScreen;