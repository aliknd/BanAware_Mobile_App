import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import RecordNavigator from "./RecordNavigator";
import FeedNavigator from "./FeedNavigator";
import NewListingButton from "./NewListingButton";
import expoPushTokensApi from "../api/expoPushTokens";
import navigation from "./rootNavigation";
import { scheduleNotifications } from "../components/NotificationSender";
import Constants from "expo-constants";
import fonts from "../config/fonts";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState();
  useEffect(() => {
    registerForPushNotifications();
    Notifications.addPushTokenListener((notification) => {
      navigation.navigate("My Questionnaire");
    });

    ////////////////////////////////////////////
    const notificationListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate("My Questionnaire");
        setInitialRoute("Questionnaires");
      });
    ///////////////////////////////////////////

    scheduleNotifications();

    return () => {
      notificationListener.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      expoPushTokensApi.register(token);
    } catch (error) {
      console.log("Error getting a push token in app navigator", error);
    }
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: fonts.fifthBoldItalic,
        },
      }}
      initialRouteName={initialRoute}
    >
      <Tab.Screen
        name="My Account"
        component={RecordNavigator}
        options={{
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("My Account")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Questionnaires"
        component={FeedNavigator}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="ballot" color={color} size={42} />
          ),
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
