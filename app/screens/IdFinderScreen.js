import React from "react";
import * as Yup from "yup";

import { AppFormField, AppForm, SubmitButton } from "../components/forms";
import { ScrollView, StyleSheet, Image } from "react-native";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function IdFinderScreen({ navigation }) {
  const { user } = useAuth();

  const handleSubmit = async (listing) => {
    navigation.navigate(routes.IDFINDER_STEP2, { step1Data: listing });
  };

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        <AppForm
          initialValues={{
            email: "", // Initialize as an empty array for multiple selections
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Image
            style={{
              width: "100%",
              height: 370,
              borderRadius: 30,
              overlayColor: colors.bgcolor,
              overflow: "hidden",
              marginTop: 15,
            }}
            source={require("../assets/idfinder.png")}
          />

          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            placeholder="Email"
            textContentType="emailAddress"
            name="email"
          />

          <SubmitButton title="Submit" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}
export default IdFinderScreen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
