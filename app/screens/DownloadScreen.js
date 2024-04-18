import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Linking,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";
import fonts from "../config/fonts";

function DownloadScreen({ navigation }, props) {
  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getFitBitUsers = async () => {
    try {
      const response = await fetch(
        "https://fitbitcollector.slades.dev/participants/apiindex?token=17bfba7f3a11578f344d1b00ee79e344"
      );
      const json = await response.json();
      const isUserIdInArray = json.ids.includes(user.userId.toString());
      setUserData(isUserIdInArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFitBitUsers();
  }, []);

  const { user } = useAuth();

  //console.log(userData);

  return (
    <Screen style={styles.mycontainer}>
      {isLoading || userData.length === 0 ? (
        <Image
          style={styles.loading}
          source={require("../assets/animations/loading_gif.gif")}
        />
      ) : userData ? (
        <>
          <View style={styles.mycontainer}>
            <Image
              source={require("../assets/check.png")} // Replace with your success image path
              style={styles.image}
            />
            <Text style={styles.title}>FitBit Device Registered!</Text>
            <Text style={styles.description}>
              Your FitBit device has been successfully registered with our
              server.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.ACCOUNT)} // Replace with your navigation logic
              style={styles.button}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Image style={styles.logo} source={require("../assets/sync.png")} />
            <AppText style={styles.explanation}>
              To synchronize data between the EMA application and FitBit data,
              please click on the provided link. This link will guide you to the
              server for configuring data integration with the FitBit server.
            </AppText>
            <AppButton
              title="FitBit Connection"
              onPress={() =>
                Linking.openURL(
                  "https://fitbitcollector.slades.dev?study_id=" + user.userId
                )
              }
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
  },
  fitbit: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    width: 350,
    height: 350,
  },
  check: {
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 40,
    borderRadius: 20,
    width: 85,
    height: 85,
  },
  explanation: {
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    textAlign: "justify",
    fontFamily: fonts.fifthRegular,
  },
  loading: {
    alignSelf: "center",
  },

  mycontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5cb85c",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5cb85c",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DownloadScreen;
