import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Image } from "react-native";
import moment from "moment";

import Screen from "../components/Screen";

import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import AppRecordText from "../components/AppRecordText";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function ListingsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getRecords = async () => {
    try {
      const token = await authStorage.getToken();
      const response = await fetch(endpointURL + "/records", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  const { user } = useAuth();

  //console.log(data);

  var newArray = data.filter((d) => d.user_id == user.userId);
  //console.log(newArray.length);

  return (
    <>
      <Screen style={styles.screen}>
        {isLoading ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : (
          <FlatList
            data={newArray}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <AppRecordText>
                <Text style={styles.logodescColor}>
                  {item.substance_fruit_label}; {"\n"}
                  {item.crave_use_none_label}:{" "}
                  {moment(
                    item.crave_use_none_value,
                    moment.ISO_8601,
                    true
                  ).isValid()
                    ? moment(item.crave_use_none_value).format(
                        "dddd, MMMM Do YYYY, h:mm a"
                      )
                    : item.crave_use_none_value}
                  {"\n"}
                </Text>
                <Text style={{ color: colors.black }}>@:</Text>
                {moment(item.created_at).format("dddd, MMMM Do YYYY - h:mm a")}
              </AppRecordText>
            )}
          />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
  logodescColor: {
    color: colors.black,
    fontWeight: "bold",
  },
  loading: {
    alignSelf: "center",
  },
});

export default ListingsScreen;
