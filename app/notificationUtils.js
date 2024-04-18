import * as Notifications from "expo-notifications";
import expoPushTokensApi from "./api/expoPushTokens";
import Constants from "expo-constants";

export const registerForPushNotificationsAsync = async () => {
  try {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) return;
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    expoPushTokensApi.register(token);
  } catch (error) {
    console.log("Error getting a push token in notification utils", error);
  }
};
