// app/_layout.tsx
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { getToken, hasSeenOnboarding } from '../lib/api';

export default function RootLayout() {
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);
  
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded && !hasNavigated) {
      checkInitialRoute();
    }
  }, [loaded, hasNavigated]);

  const checkInitialRoute = async () => {
    console.log('🔍 Checking initial route...');
    
    const seenOnboarding = await hasSeenOnboarding();
    const token = await getToken();
    
    console.log('🔍 Has seen onboarding:', seenOnboarding);
    console.log('🔍 Has token:', !!token);
    
    // Set flag FIRST to prevent loops
    setHasNavigated(true);
    
    // Small delay to ensure state is set
    setTimeout(() => {
      if (!seenOnboarding) {
        console.log('✅ Navigating to onboarding');
        router.replace('/onboarding');
      } else if (!token) {
        console.log('✅ Navigating to login');
        router.replace('/login');
      } else {
        console.log('✅ User logged in, navigating to app');
        router.replace('/(tabs)');
      }
    }, 100);
  };

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}