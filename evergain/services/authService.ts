import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// API URL Configuration
// Web: uses localhost since it runs in browser on same machine
// Expo Go on physical device: uses local network IP (192.168.1.5)
// Android Emulator: uses 10.0.2.2 (special alias for host machine)
// iOS Simulator: uses localhost

// IMPORTANT: Make sure your phone is on the same WiFi network as your computer!
// If backend IP changes, update the IP below
const LOCAL_IP = '192.168.1.4'; // Your computer's local IP address

const getApiUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:8080/api';
    } else if (Platform.OS === 'android') {
        // Check if running on emulator or physical device
        // Expo Go on physical device will use local IP
        return `http://${LOCAL_IP}:8080/api`;
    } else if (Platform.OS === 'ios') {
        // iOS Simulator can use localhost
        return 'http://localhost:8080/api';
    }
    return `http://${LOCAL_IP}:8080/api`;
};

const API_URL = getApiUrl();

console.log('🌐 API URL:', API_URL, '| Platform:', Platform.OS);

export const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
        localStorage.setItem('user_token', token);
    } else {
        await SecureStore.setItemAsync('user_token', token);
    }
};

export const getToken = async () => {
    if (Platform.OS === 'web') {
        return localStorage.getItem('user_token');
    } else {
        return await SecureStore.getItemAsync('user_token');
    }
};

export const clearToken = async () => {
    if (Platform.OS === 'web') {
        localStorage.removeItem('user_token');
    } else {
        await SecureStore.deleteItemAsync('user_token');
    }
};

export const saveUser = async (user: any) => {
    if (Platform.OS === 'web') {
        localStorage.setItem('user_data', JSON.stringify(user));
    } else {
        await SecureStore.setItemAsync('user_data', JSON.stringify(user));
    }
};

export const getUser = async () => {
    try {
        if (Platform.OS === 'web') {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        } else {
            const userData = await SecureStore.getItemAsync('user_data');
            return userData ? JSON.parse(userData) : null;
        }
    } catch (e) {
        console.error("Error parsing user data:", e);
        return null;
    }
};

export const clearUser = async () => {
    if (Platform.OS === 'web') {
        localStorage.removeItem('user_data');
    } else {
        await SecureStore.deleteItemAsync('user_data');
    }
};

export const register = async (fullName: string, email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ full_name: fullName, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.log("Login failed", data); // debug
            throw new Error(data.message || 'Login failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
