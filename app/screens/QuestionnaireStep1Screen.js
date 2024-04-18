import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import {
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";
import routes from "../navigation/routes";
import AppFormTextInput from "../components/forms/AppFormTextInput";

const generateValidationSchema = (categories) => {
  // Check if categories is an array and has elements
  if (!Array.isArray(categories) || categories.length === 0) {
    return Yup.object().shape({});
  }

  const schemaFields = categories.reduce((acc, categoryItem) => {
    // Each category will have a corresponding picker field that should be an object and required
    acc[`craveuse_${categoryItem.value}`] = Yup.object()
      .nullable()
      .required(`Please select an option for ${categoryItem.label}.`);

    // If the category is 'Others', we will need a description field that is a non-empty string
    if (categoryItem.label === "Others") {
      acc["description"] = Yup.string().required(
        'Description is required when "Others" is selected.'
      );
    }

    return acc;
  }, {});

  // Return the validation schema object
  return Yup.object().shape(schemaFields);
};

const craveUse = [
  {
    label: "Crave",
    value: 1,
    backgroundColor: "red",
    icon: require("../assets/animations/crave.png"),
  },
  {
    label: "Use",
    value: 2,
    backgroundColor: "green",
    icon: require("../assets/animations/use.png"),
  },
  {
    label: "None",
    value: 3,
    backgroundColor: "green",
    icon: require("../assets/animations/none.png"),
  },
];

function QuestionnaireStep1Screen({ route, navigation }) {
  const { step1Data } = route.params;

  // Call the function to generate the validation schema
  const validationSchema = generateValidationSchema(step1Data.category);

  // Check if 'Others' is in the selected categories
  const includesOthers = step1Data.category.some(
    (cat) => cat.label === "Others"
  );

  const [isLoading, setLoading] = useState(true);

  const { user } = useAuth();

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing) => {
    const categoryResponses = step1Data.category.map((categoryItem) => {
      const { backgroundColor, icon, ...pickerValue } =
        listing[`craveuse_${categoryItem.value}`];

      let response = {
        label: categoryItem.label,
        value: categoryItem.value,
        step1Value: pickerValue,
      };

      if (categoryItem.label === "Others") {
        response.description = listing.description;
      }
      return response;
    });

    // Navigate to the next screen with the refined categoryResponses array
    navigation.navigate(routes.QUESTIONNAIRE_STEP2, {
      step1Data: listing,
      categoryResponses: categoryResponses,
    });
  };

  const renderCategoryPickers = () => {
    // Separate the "Others" category for rendering at the end
    const otherCategory = step1Data.category.find(
      (cat) => cat.label === "Others"
    );
    const regularCategories = step1Data.category.filter(
      (cat) => cat.label !== "Others"
    );

    return (
      <>
        {regularCategories.map((categoryItem, index) => (
          <React.Fragment key={index}>
            <AppFormText>
              Did you Crave or Use{" "}
              <Text style={{ color: colors.darkGreen }}>
                {categoryItem.label}
              </Text>
              ?
            </AppFormText>
            <AppFormPickerSingle
              items={craveUse}
              placeholder="Crave/Use"
              icon="paw"
              name={`craveuse_${categoryItem.value}`} // Create a unique name for each picker
              numberOfColumns={1}
              PickerItemComponent={CategoryPickerItem}
            />
          </React.Fragment>
        ))}
        {/* Render the "Others" picker and its question if it exists */}
        {otherCategory && (
          <>
            <AppFormText>
              Did you Crave or Use{" "}
              <Text style={{ color: colors.darkGreen }}>
                {otherCategory.label}
              </Text>
              ?
            </AppFormText>
            <AppFormPickerSingle
              items={craveUse}
              placeholder="Crave/Use"
              icon="paw"
              name={`craveuse_${otherCategory.value}`} // Create a unique name for the "Others" picker
              numberOfColumns={1}
              PickerItemComponent={CategoryPickerItem}
            />
          </>
        )}
      </>
    );
  };

  const formContent = (
    <>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppForm
        initialValues={{
          category: null,
          cuser: user.userId,
          description: "",
          // Initialize state for each picker
          ...step1Data.category.reduce((acc, curr) => {
            acc[`craveuse_${curr.value}`] = null;
            return acc;
          }, {}),
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {renderCategoryPickers()}

        {includesOthers && (
          <AppFormTextInput
            name="description"
            multiline
            numberOfLines={7}
            placeholder="Enter your description here..."
            // Add other TextInput props as needed
          />
        )}

        <SubmitButton title="Next" />
      </AppForm>
    </>
  );

  return (
    <Screen style={styles.quScreen}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={64}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView>{formContent}</ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView>{formContent}</ScrollView>
      )}
    </Screen>
  );
}
export default QuestionnaireStep1Screen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
