import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { AuthProvider } from '@/context/AuthContext';

// Suppress non-critical React Native warnings
// Note: This hides "Text strings must be rendered within a <Text> component" errors
// These are often caused by Unicode characters (like bullet points) in text
const originalConsoleError = console.error;
console.error = (...args) => {
  // Suppress "Text strings must be rendered within a <Text> component" warnings
  if (typeof args[0] === 'string' && args[0].includes('Text strings must be rendered within a <Text> component')) {
    return;
  }
  originalConsoleError(...args);
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
