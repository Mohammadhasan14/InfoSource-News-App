import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000))

      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
