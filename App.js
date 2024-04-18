import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import AuthNavigator from "./app/navigation/AuthNavigator";
import NavigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "Lato-BlackItalic": require("./app/assets/fonts/Lato/Lato-BlackItalic.ttf"),
      "Lato-BoldItalic": require("./app/assets/fonts/Lato/Lato-BoldItalic.ttf"),
      "Lato-Regular": require("./app/assets/fonts/Lato/Lato-Regular.ttf"),
      "DMSerifDisplay-Italic": require("./app/assets/fonts/DM_Serif_Display/DMSerifDisplay-Italic.ttf"),
      "DMSerifDisplay-Regular": require("./app/assets/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf"),
      "Roboto-BoldItalic": require("./app/assets/fonts/Roboto/Roboto-BoldItalic.ttf"),
      "ConcertOne-Regular": require("./app/assets/fonts/Concert_One/ConcertOne-Regular.ttf"),
      "Poppins-BoldItalic": require("./app/assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
      "Poppins-SemiBoldItalic": require("./app/assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
      "Poppins-Regular": require("./app/assets/fonts/Poppins/Poppins-Regular.ttf"),

      // Add any additional fonts here
    });
    setFontsLoaded(true); // Set fontsLoaded to true after fonts are loaded
  };

  useEffect(() => {
    async function prepare() {
      try {
        await restoreUser();
        await SplashScreen.preventAutoHideAsync();
        await loadFonts(); // Load your custom fonts
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  ////// sensor

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer
        ref={navigationRef}
        theme={NavigationTheme}
        onReady={onLayoutRootView}
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
