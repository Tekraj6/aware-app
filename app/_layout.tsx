import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { isOnboarded } from '../storage/dataStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      const onboarded = await isOnboarded();
      if (!onboarded) {
        router.replace('/onboarding');
      }
    }
    checkOnboarding();
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quadrant/open" />
        <Stack.Screen name="quadrant/blindspot" />
        <Stack.Screen name="quadrant/hidden" />
        <Stack.Screen name="quadrant/unknown" />
        <Stack.Screen name="collect" options={{ presentation: 'modal' }} />
        <Stack.Screen name="feedback/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
