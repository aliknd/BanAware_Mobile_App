import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import { ScrollView, StyleSheet, Alert, Text } from "react-native";
import listingsApi from "../api/listings";
import Screen from "../components/Screen";
import { CommonActions } from "@react-navigation/native";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";
import useAuth from "../auth/useAuth";
import UploadScreen from "./UploadScreen";
import colors from "../config/colors";
import AppFormDateTimePicker from "../components/forms/AppFormDateTimePicker";

const generateValidationSchemaStep2 = (categoryResponses) => {
  if (!Array.isArray(categoryResponses) || categoryResponses.length === 0) {
    return Yup.object().shape({});
  }

  const schemaFields = categoryResponses.reduce((acc, response) => {
    let fieldName;
    switch (response.step1Value.label) {
      case "Use":
        fieldName = `useTime_${response.label}`;
        acc[fieldName] = Yup.date()
          .required(`Please enter the date and time for ${response.label}.`)
          .max(new Date(), "Date and time cannot be in the future.")
          .label(`Use selection for ${response.label}`);
        break;
      case "Crave":
        fieldName = `craveIntensity_${response.label}`;
        acc[fieldName] = Yup.object()
          .nullable()
          .required(`Please select an intensity for ${response.label}.`)
          .label(`CraveIntensity_${response.label}`);
        break;
      case "None":
        fieldName = `confirmation_${response.label}`;
        acc[fieldName] = Yup.object()
          .nullable()
          .required(`Please confirm your choice for ${response.label}.`)
          .label(`Confirmation_${response.label}`);
        break;
      default:
        fieldName = undefined;
    }

    return acc;
  }, {});

  return Yup.object().shape(schemaFields);
};

const useOptions = [
  { label: "Less than 30 minutes ago", value: 1 },
  { label: "About 1 hour ago", value: 2 },
  { label: "1-2 hours ago", value: 3 },
  { label: "2-4 hours ago", value: 4 },
  { label: "4-6 hours ago", value: 5 },
  { label: "6-8 hours ago", value: 6 },
  { label: "8-10 hours ago", value: 7 },
  { label: "More than 10 hours ago", value: 8 },
];

const craveOptions = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];

const confirmOptions = [
  { label: "Not Craved", value: 0 },
  { label: "Not Used", value: 1 },
  { label: "Not Craved/Used", value: 2 },
];

function QuestionnaireStep2Screen({ route, navigation }) {
  const { categoryResponses } = route.params;
  //console.log(categoryResponses);

  const validationSchema = generateValidationSchemaStep2(categoryResponses);

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const navPage = () => {
    navigation.navigate("Questionnaires");
  };

  const { user } = useAuth();

  function handleSubmit(values, { resetForm }) {
    //console.log("triggered!");
    const updatedResponses = categoryResponses.map((response) => {
      // Depending on the response, extract the relevant value from the form
      let step2Value;
      switch (response.step1Value.label) {
        case "Use":
          step2Value = values[`useTime_${response.label}`];
          break;
        case "Crave":
          step2Value = values[`craveIntensity_${response.label}`];
          break;
        case "None":
          step2Value = values[`confirmation_${response.label}`];
          break;
        default:
          break;
      }
      return {
        ...response,
        step2Value: step2Value || {}, // Add the step2Value or an empty object if not found
      };
    });

    // Navigate to the next screen with the updatedResponses
    // navigation.navigate("QuestionnaireStep3Screen", {
    //   finalResponses: updatedResponses,
    // });
    // console.log(updatedResponses);
    setProgress(0);
    setUploadVisible(true);

    // Add an artificial delay of 2 seconds (adjust as needed)
    setTimeout(async () => {
      const result = await listingsApi.addListing(
        { ...updatedResponses, userId: user.userId },
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
        }, 2000); // Delayed navigation after 2 seconds (adjust as needed)
      }
    }, 1000); // Delayed submission after 2 seconds (adjust as needed)
  }

  const initialValues = categoryResponses.reduce((values, response) => {
    let fieldName;
    switch (response.step1Value.label) {
      case "Use":
        fieldName = `useTime_${response.label}`;
        values[fieldName] = new Date(); // Set the initial value to the current date
        break;
      case "Crave":
        fieldName = `craveIntensity_${response.label}`;
        values[fieldName] = ""; // Set a default value for crave intensity
        break;
      case "None":
        fieldName = `confirmation_${response.label}`;
        values[fieldName] = null; // Set the initial value to null or an appropriate default
        break;
      default:
        fieldName = undefined;
    }

    if (fieldName) {
      values[fieldName] = null; // Set the initial value to null or an appropriate default
    }

    return values;
  }, {});

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <AppForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {categoryResponses.map((response, index) => {
            let Component = null;
            // Use response.selectedValue.label to match the label property
            switch (response.step1Value.label) {
              case "Use":
                Component = (
                  <>
                    <AppFormText>
                      When did you last use{" "}
                      <Text style={{ color: colors.darkGreen }}>
                        {response.label}
                      </Text>
                      ?
                    </AppFormText>
                    <AppFormDateTimePicker
                      name={`useTime_${response.label}`}
                      placeholder="Select Date and Time"
                    />
                  </>
                );
                break;
              case "Crave":
                Component = (
                  <>
                    <AppFormText>
                      Please rate your current craving for{" "}
                      <Text style={{ color: colors.darkGreen }}>
                        {response.label}
                      </Text>{" "}
                      on a scale of 0-10, with 0 being “no cravings” and 10
                      being “extremely intense cravings".
                    </AppFormText>
                    <AppFormPickerSingle
                      items={craveOptions}
                      name={`craveIntensity_${response.label}`}
                      placeholder="Select Intensity"
                    />
                  </>
                );
                break;
              case "None":
                Component = (
                  <>
                    <AppFormText>
                      You have chosen "None" for{" "}
                      <Text style={{ color: colors.darkGreen }}>
                        {response.label}
                      </Text>
                      . Please confirm!
                    </AppFormText>
                    <AppFormPickerSingle
                      items={confirmOptions}
                      name={`confirmation_${response.label}`}
                      placeholder="Confirm"
                    />
                  </>
                );
                break;
              default:
                break;
            }

            return <React.Fragment key={index}>{Component}</React.Fragment>;
          })}
          <SubmitButton title="Submit" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}
export default QuestionnaireStep2Screen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
