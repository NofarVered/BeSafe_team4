import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../services/api';

const RegisterSuperScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    specialization: '',
    license_number: '',
    contact_number: '',
    avatar_url: '',
  });

  const handleRegister = async () => {
    try {
      // Check if required fields are filled
      if (!formData.username || !formData.email || !formData.password || 
          !formData.specialization || !formData.avatar_url) {
        Alert.alert('Error', 'Please fill all required fields and generate an avatar');
        return;
      }
      const response = await axiosInstance.post('/api/super-hero', formData);
      console.log('Registration successful:', response.data);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  const handleSetAvatarUrl = (url) => {
    setFormData({...formData, avatar_url: url});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Super Hero Registration</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={formData.username}
                onChangeText={(text) => setFormData({...formData, username: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialization *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your specialization"
                value={formData.specialization}
                onChangeText={(text) => setFormData({...formData, specialization: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter license number"
                value={formData.license_number}
                onChangeText={(text) => setFormData({...formData, license_number: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter contact number"
                value={formData.contact_number}
                onChangeText={(text) => setFormData({...formData, contact_number: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Avatar *</Text>
              <TouchableOpacity 
                style={styles.avatarButton} 
                onPress={() => navigation.navigate('CreateAvatarScreen', { 
                  onSelectAvatar: handleSetAvatarUrl 
                })}
              >
                <Text style={styles.avatarButtonText}>
                  {formData.avatar_url ? 'Avatar Selected' : 'Generate Avatar'}
                </Text>
              </TouchableOpacity>
              {formData.avatar_url && (
                <Text style={styles.avatarUrlText}>
                  Avatar URL: {formData.avatar_url}
                </Text>
              )}
            </View>

            <CustomButton
              title="Register"
              onPress={handleRegister}
              style={styles.button}
            />

            <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
              Already have an account? Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    textDecorationLine: 'underline',
  },
  avatarButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  avatarButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  avatarUrlText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default RegisterSuperScreen;