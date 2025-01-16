// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './api';  // Import your axios instance

const TOKEN_KEY = '@app_token';
const USER_KEY = '@user_data';

export const authService = {
    setAuth: async (token, userData) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
            
            // Use axiosInstance instead of axios
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error('Error saving auth data:', error);
            throw error;
        }
    },

    getToken: async () => {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    getUserData: async () => {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
            // Use axiosInstance instead of axios
            delete axiosInstance.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    },

    isAuthenticated: async () => {
        const token = await authService.getToken();
        return !!token;
    }
};