import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font'
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "LibreBaskerville-Bold": require("../assets/fonts/LibreBaskerville-Bold.ttf"),
    "LibreBaskerville-Italic": require("../assets/fonts/LibreBaskerville-Italic.ttf"),
    "LibreBaskerville-Regular": require("../assets/fonts/LibreBaskerville-Regular.ttf"),
    "Typographica-Blp5": require("../assets/fonts/Typographica-Blp5.ttf")
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown:false 
    }} />
    <Stack.Screen name="auth/Login" options={{ headerShown:false 
    }} />
    <Stack.Screen name="auth/Register" options={{ headerShown:false 
    }} />
    <Stack.Screen name="(tabs)" options={{ headerShown:false 
    }} />
  </Stack>
  )
}

export default RootLayout
