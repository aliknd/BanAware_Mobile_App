import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import authStorage from "../auth/storage";
import endpointURL from "../api/serverPoint";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";
import StarsDisplay from "../components/StarsDisplay";
import fonts from "../config/fonts";

function StarsScreen(props) {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [badge, setBadge] = useState([]);
  const [recordNumber, setRecordNumber] = useState([]);
  const [badgeLoaded, setBadgeLoaded] = useState(false); // New state to track if badge data is loaded

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken(); // Retrieve the token
      if (!token) {
        throw new Error("Token not found"); // Check if the token exists
      }
      const response = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users"); // Check if the response is ok
      }
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error("Expected an array of users"); // Check if the response is an array
      }
      setUserData(json);
      const userDataArray = json.filter((item) => item.id === user.userId);
      setFilteredUserData(userDataArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUsers();
    }
  }, [user]);

  const getRecords = async () => {
    try {
      const token = await authStorage.getToken();
      const rResponse = await fetch(endpointURL + "/records", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const rJson = await rResponse.json();
      const myRecordArray = rJson.filter(
        (d) => d.user_id == filteredUserData[0]?.id
      );
      var lenRecordArray = myRecordArray.length;
      setRecordNumber(lenRecordArray);
      var userBadge = Math.floor(lenRecordArray / 4);
      setBadge(userBadge);
      setBadgeLoaded(true); // Set badge data as loaded after setting the badge
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filteredUserData.length > 0) {
      getRecords();
    }
  }, [filteredUserData]);

  return (
    <Screen style={styles.container}>
      <ScrollView>
        {isLoading || !badgeLoaded ? ( // Check if loading or badge data is not loaded
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : badge > 0 ? (
          <>
            <AppText style={styles.heading}>🌟 Stars Recieved!</AppText>
            <View style={styles.star}>
              <StarsDisplay starCount={badge.toString()} />
            </View>
            <Image
              style={styles.congrats}
              source={require("../assets/congrats.png")}
            />
            <AppText style={styles.explanation}>
              🌟 Why Collect Stars? Stars aren't just for show! Accumulating
              stars can unlock special rewards, bonuses, and exclusive content
              tailored just for you. Plus, they represent your progress and
              dedication.
            </AppText>
          </>
        ) : (
          <>
            <AppText style={styles.explanation}>
              🌟 What are the Stars? Here, you'll track the stars you earn
              throughout your journey with us. Stars are a token of recognition
              for your achievements, activities, and milestones.
            </AppText>
            <Image
              style={styles.logo}
              source={require("../assets/starspage.png")}
            />
            <AppText style={styles.explanation}>
              🌟 How Can I Earn Stars? Engage with our platform, complete
              challenges, participate in events, and watch out for special
              opportunities to gather stars. The more involved you are, the more
              stars you'll earn!
            </AppText>
            <AppText style={styles.explanation}>
              🌟 Why Collect Stars? Stars aren't just for show! Accumulating
              stars can unlock special rewards, bonuses, and exclusive content
              tailored just for you. Plus, they represent your progress and
              dedication.
            </AppText>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    width: "40%",
    height: 140,
    alignSelf: "center",
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
  heading: {
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    alignSelf: "center",
  },
  star: {
    marginVertical: 20,
  },
  congrats: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default StarsScreen;
