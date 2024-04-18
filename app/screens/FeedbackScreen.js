import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import { CommonActions } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import feedbacksApi from "../api/feedbacks";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import CategoryPickerItem from "../components/CategoryPickerItem";
import fonts from "../config/fonts";
import AppFormTextInput from "../components/forms/AppFormTextInput";

const validationSchema = Yup.object().shape({
  category: Yup.array()
    .required()
    .min(1, "Please select at least one category."),
  description: Yup.string().required("Description is required"),
});

const feedbackTypes = [
  { label: "Study Related", value: 1 },
  { label: "App Related", value: 2 },
  { label: "Fitbit Related", value: 3 },
];

function FeedbackScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [description, setDescription] = useState("");

  const { user } = useAuth();

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const navPage = () => {
    navigation.navigate("Questionnaires");
  };
  const handleSubmit = async (feedback, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);

    // Add an artificial delay of 2 seconds (adjust as needed)
    setTimeout(async () => {
      const result = await feedbacksApi.addFeedback(
        { ...feedback },
        (progress) => setProgress(progress)
      );

      if (!result.ok) {
        setUploadVisible(false);
        Alert.alert("Could not save the listing");
      } else {
        // Delayed navigation
        setTimeout(() => {
          navPage();
          resetForm();

          // Reset the stack to the HomeScreen
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Account" }],
            })
          );
        }, 1500); // Delayed navigation after 2 seconds (adjust as needed)
      }
    }, 1000); // Delayed submission after 2 seconds (adjust as needed)
  };

  const feedbackForm = (
    <>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppForm
        initialValues={{
          category: [], // Initialize as an empty array for multiple selections
          description: "",
          cuser: user.userId,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <AppFormText>
          Please select the category of your feedback and provide us with the
          description as follows:
        </AppFormText>

        <Image
          style={{
            width: "40%",
            height: 150,
            borderRadius: 30,
            overlayColor: colors.bgcolor,
            overflow: "hidden",
            marginTop: 20,
            marginVertical: 10,
            alignSelf: "center",
          }}
          source={require("../assets/animations/feedback.png")}
        />

        <AppFormPicker
          items={feedbackTypes}
          placeholder="Select Category"
          icon="paw"
          name="category" // Make sure this matches the field name in your form
          numberOfColumns={1}
          PickerItemComponent={CategoryPickerItem}
        />

        <AppFormTextInput
          name="description"
          multiline
          numberOfLines={7}
          placeholder="Enter your description here..."
          // Add other TextInput props as needed
        />

        <SubmitButton title="Submit" />
      </AppForm>
    </>
  );

  return (
    <Screen style={{ flex: 1, ...styles.quScreen }}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={64}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>{feedbackForm}</ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>{feedbackForm}</ScrollView>
        </TouchableWithoutFeedback>
      )}
    </Screen>
  );
}
export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  input: {
    height: 180, // Starting height
    width: "100%", // Take full width of the container
    borderColor: "gray",
    borderWidth: 1,
    textAlignVertical: "top", // For multiline text inputs, align text to the top
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 20,
    fontFamily: fonts.fifthRegular,
    fontSize: 18,
  },
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
