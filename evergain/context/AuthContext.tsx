import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getToken, saveToken, clearToken, login as apiLogin, register as apiRegister, saveUser, getUser, clearUser } from '@/services/authService';



interface User {
    id: number;
    email: string;
    full_name: string;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (name: string, email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user: User | null, isLoaded: boolean) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            // If not logged in and not in auth group, redirect to login
            router.replace('/auth/login');
        } else if (user && inAuthGroup) {
            // If logged in and in auth group, redirect to tabs
            router.replace('/(tabs)');
        }
    }, [user, segments, isLoaded]);
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading true

    useEffect(() => {
        // Check for token on mount
        console.log("AuthProvider mounted, checking token...");
        checkUser();
    }, []);

    useProtectedRoute(user, !isLoading);

    const checkUser = async () => {
        try {
            const token = await getToken();
            const userData = await getUser();

            if (token && userData) {
                console.log("Restoring user session", userData);
                setUser(userData);
            } else if (token) {
                // Try to validate token or just proceed? For now, if no user object, treat as logged out
                // await clearToken(); // Optional: Clear if invalid
            }
        } catch (e) {
            console.error("Error checking user:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, pass: string) => {
        try {
            const data = await apiLogin(email, pass);
            console.log('Login response:', data);
            await saveToken(data.token);
            await saveUser(data.user);
            setUser(data.user);
        } catch (error) {
            console.error('SignIn error:', error);
            throw error;
        }
    };

    const signUp = async (name: string, email: string, pass: string) => {
        const data = await apiRegister(name, email, pass);
        await saveToken(data.token);
        await saveUser(data.user);
        setUser(data.user);
    };

    const signOut = async () => {
        await clearToken();
        await clearUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
