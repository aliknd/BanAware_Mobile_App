import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import RecordScreen from "../screens/RecordScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessageDetailsScreen from "../screens/MessageDetailsScreen";
import DownloadScreen from "../screens/DownloadScreen";
import QuestionnaireStep2Screen from "../screens/QuestionnaireStep2Screen";
import StarsScreen from "../screens/StarsScreen";
import IdFinderScreen from "../screens/IdFinderScreen";
import IdFinderStep2Screen from "../screens/IdFinderStep2Screen";
import fonts from "../config/fonts";
import FeedbackScreen from "../screens/FeedbackScreen";
import QuestionnaireStep1Screen from "../screens/QuestionnaireStep1Screen";

const Stack = createStackNavigator();

const RecordNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontFamily: fonts.fifthBoldItalic,
      },
    }}
  >
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Records" component={RecordScreen} />
    <Stack.Screen name="Stars" component={StarsScreen} />
    <Stack.Screen name="FitBit Connection" component={DownloadScreen} />
    <Stack.Screen name="ID Finder" component={IdFinderScreen} />
    <Stack.Screen name="My Questionnaire" component={QuestionnaireScreen} />
    <Stack.Screen name="My Messages" component={MessagesScreen} />
    <Stack.Screen name="Message Details" component={MessageDetailsScreen} />
    <Stack.Screen name="Crave or Use?" component={QuestionnaireStep1Screen} />
    <Stack.Screen
      name="One More Question!"
      component={QuestionnaireStep2Screen}
    />
    <Stack.Screen name="My Feedbacks" component={FeedbackScreen} />
    <Stack.Screen name="User Info Details" component={IdFinderStep2Screen} />
  </Stack.Navigator>
);

export default RecordNavigator;
