import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../services/api.js';
import { authService } from '../../services/authService';

//import {socket } from '../../services/socket';

const LoginScreen = ({navigation }) => {

    const [isSuperUser, setIsSuperUser] = useState(false); // default 'HeroUser'
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleSwitch = () => setIsSuperUser(previousState => !previousState);

    const handleLogin = async () => {
        // Basic validation
        if (!userEmail || !userPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            const endpoint = isSuperUser ? '/api/login/super-hero' : '/api/login/hero';

            const response = await axiosInstance.post(endpoint, {
                email: userEmail,
                password: userPassword
            });

            const { token, userId, username, avatar_url, role, userDetails } = response.data;
            
            // Save auth data
            await authService.setAuth(token, { userId, username, avatar_url, role, ...userDetails });

            // Navigate based on user role
            if (isSuperUser) {
                navigation.navigate('HomeSuperScreen');
            } else {
                navigation.navigate('HomeRegularScreen');
            }

        } catch (error) {
            const message = error.response?.data?.message || 'Email or password is incorrect';
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }

    }
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder='Email'
                value={userEmail}
                onChangeText={setUserEmail}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            
            <TextInput
                style={styles.input}
                placeholder='Password'
                value={userPassword}
                onChangeText={setUserPassword}
                secureTextEntry
            />
            
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>HeroUser</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isSuperUser ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isSuperUser}
                />
                <Text style={styles.switchLabel}>SuperUser</Text>
            </View>
            
            <CustomButton
                title={isLoading ? 'Loading...' : 'Login'}
                onPress={handleLogin}
                disabled={isLoading}
            />
            
            <Button 
                onPress={() => navigation.navigate('RegisterRegularScreen')}
                title="Register as regular user"
            />
            
            <Button 
                onPress={() => navigation.navigate('RegisterSuperScreen')}
                title="Register as Super user"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    switchLabel: {
        fontSize: 16,
        marginHorizontal: 10,
    },
});

export default LoginScreen;