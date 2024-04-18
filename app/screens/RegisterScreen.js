import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as Yup from "yup";
import colors from "../config/colors";
import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";

import {
  CustomErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";
import useApi from "../hooks/useApi";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";
import AppFormDatePicker from "../components/forms/AppFormDatePicker";

import fonts from "../config/fonts";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Given Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
  genCategory: Yup.object().required().nullable().label("Gender"),
  birthdate: Yup.date()
    .required("Birthdate is required")
    .nullable()
    .max(new Date(), "Birthdate cannot be in the future")
    .label("Birthdate"),
  raceCategory: Yup.object().required().nullable().label("Race"),
  preference: Yup.object().required().nullable().label("Naming Preference"),
  //catDog: Yup.object().required().nullable().label("Cat/Dog"),
});

const genCategories = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Non-binary", value: 3 },
  { label: "Prefer Not to State", value: 4 },
];

const raceCategories = [
  { label: "Black/African American", value: 1 },
  { label: "White", value: 2 },
  { label: "Filipino", value: 3 },
  { label: "Native Hawaiian", value: 4 },
  { label: "Samoan or Tongan", value: 5 },
  { label: "Guamanian or Chamorro", value: 6 },
  { label: "Fijian", value: 7 },
  { label: "Marshallese", value: 8 },
  { label: "Other Pacific Islander", value: 9 },
  { label: "Chinese", value: 10 },
  { label: "Japanese", value: 11 },
  { label: "Korean", value: 12 },
  { label: "Vietnamese", value: 13 },
  { label: "Indian (Southeast Asia)", value: 14 },
  { label: "Other Asian", value: 15 },
  { label: "American Indian (Native American) or Alaskan Native", value: 16 },
  { label: "Portuguese", value: 17 },
  { label: "Mexican", value: 18 },
  { label: "Puerto Rican", value: 19 },
  { label: "Other Latino/a or Hispanic", value: 20 },
  { label: "Other", value: 21 },
  { label: "Prefer Not to State", value: 22 },
];

const preference = [
  { label: "Fruit", value: 1 },
  { label: "Substance", value: 2 },
];

// const catDog = [
//   { label: "Cat", value: 1 },
//   { label: "Dog", value: 2 },
// ];

function RegisterScreen(props) {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unxpected error occured.");
        console.log(result);
      }
      return;
    }

    const { data: authToken } = await loginApi.request(
      userInfo.email,
      userInfo.password
    );

    auth.logIn(authToken);
  };

  return (
    <>
      <AppActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView>
            <Image style={styles.logo} source={require("../assets/logo.png")} />

            <AppForm
              initialValues={{
                name: "",
                email: "",
                birthdate: new Date(), // Add this line for the birthdate
                genCategory: "",
                raceCategory: "",
                preference: "",
                //catDog: "",
                password: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <CustomErrorMessage error={error} visible={error} />
              <AppFormField
                autoCapitalize
                autoCorrect={false}
                icon="account-circle"
                placeholder="Given Name"
                textContentType="givenName"
                name="name"
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
              <AppFormDatePicker name="birthdate" placeholder="Birthdate" />
              <AppFormPickerSingle
                items={genCategories}
                placeholder="Gender"
                icon="account-group"
                name="genCategory"
              />
              <AppFormPickerSingle
                items={raceCategories}
                placeholder="Race"
                icon="account-child"
                name="raceCategory"
              />
              <AppFormPickerSingle
                items={preference}
                placeholder="Naming Preference"
                icon="account-child"
                name="preference"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="Password"
                secureTextEntry={true}
                textContentType="password"
                name="password"
              />
              <SubmitButton title="Register" />
            </AppForm>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 120,
    height: 90,
    alignSelf: "center",
    marginBottom: 20,
  },
  error: {
    color: colors.error,
  },
  selectedDateText: {
    color: colors.white,
    alignSelf: "center",
    margin: 5,
    fontFamily: fonts.fifthRegular,
    fontSize: 16,
  },
});

export default RegisterScreen;
