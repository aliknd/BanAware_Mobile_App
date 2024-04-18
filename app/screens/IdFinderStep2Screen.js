import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import { AppFormText } from "../components/forms";
import { ScrollView, StyleSheet, Alert, Image, Text } from "react-native";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function IdFinderStep2Screen({ route }) {
  const { step1Data } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [userArray, setUserArray] = useState([]);
  const [recordNumber, setRecordNumber] = useState([]);
  const [badge, setBadge] = useState([]);

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken();
      const uResponse = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const uJson = await uResponse.json();
      const myUserArray = uJson.filter((d) => d.email == step1Data.email);
      setUserArray(myUserArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      const myRecordArray = rJson.filter((d) => d.user_id == userArray[0]?.id);
      var lenRecordArray = myRecordArray.length;
      setRecordNumber(lenRecordArray);
      var userBadge = Math.floor(lenRecordArray / 4);
      setBadge(userBadge);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (userArray.length > 0) {
      getRecords();
    }
  }, [userArray]); // This effect depends on `userArray`

  const { user } = useAuth();

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        {isLoading || userArray.length === 0 ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif_s.gif")}
          />
        ) : (
          <>
            <AppFormText>Email: {userArray[0].email}</AppFormText>
            <AppFormText>Age: {userArray[0].birthdate}</AppFormText>
            <AppFormText>Gender: {userArray[0].genCategory}</AppFormText>
            <AppFormText>ID: {userArray[0].id}</AppFormText>
            <AppFormText>Badge: {badge}</AppFormText>
            <AppFormText>Record's Number: {recordNumber}</AppFormText>
          </>
        )}

        <Image
          style={{
            width: "100%",
            height: 370,
            borderRadius: 30,
            overlayColor: colors.bgcolor,
            overflow: "hidden",
            marginVertical: 15,
          }}
          source={require("../assets/finded_user.png")}
        />
      </ScrollView>
    </Screen>
  );
}
export default IdFinderStep2Screen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
