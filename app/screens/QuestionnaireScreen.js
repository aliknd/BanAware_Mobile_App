import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import CategoryPickerItem from "../components/CategoryPickerItem";
import routes from "../navigation/routes";
import CategoryPickerItemColumn from "../components/CategoryPickerItemColumn";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const imageStyle = Platform.select({
  ios: {
    width: screenWidth * 0.98,
    height: screenHeight * 0.4,
    marginVertical: 15,
    alignSelf: "center",
  },
  android: {
    width: screenWidth * 0.98,
    height: screenHeight * 0.4, // or any other responsive height
    marginVertical: 15,
    alignSelf: "center",
  },
});

const validationSchema = Yup.object().shape({
  category: Yup.array()
    .required()
    .min(1, "Please select at least one category."),
});

const fruits = [
  {
    label: "None",
    value: "None",
    backgroundColor: "red",
    icon: require("../assets/animations/none.png"),
  },
  {
    label: "Melon",
    value: "Melon",
    backgroundColor: "green",
    icon: require("../assets/animations/melon.png"),
  },
  {
    label: "Almond",
    value: "Almond",
    backgroundColor: "green",
    icon: require("../assets/animations/almond.png"),
  },
  {
    label: "Carrot",
    value: "Carrot",
    backgroundColor: "green",
    icon: require("../assets/animations/carrot.png"),
  },
  {
    label: "Orange",
    value: "Orange",
    backgroundColor: "green",
    icon: require("../assets/animations/orange.png"),
  },
  {
    label: "Coconut",
    value: "Coconut",
    backgroundColor: "green",
    icon: require("../assets/animations/coconut.png"),
  },
  {
    label: "Strawberry",
    value: "Strawberry",
    backgroundColor: "green",
    icon: require("../assets/animations/strawberry.png"),
  },
  {
    label: "Nectarine",
    value: "Nectarine",
    backgroundColor: "green",
    icon: require("../assets/animations/nectarine.png"),
  },
  {
    label: "Others",
    value: "Others",
    backgroundColor: "green",
    icon: require("../assets/animations/others.png"),
  },
];

const substanceTypes = [
  { label: "None", value: "None" },
  { label: "Methamphetamine", value: "Melon" },
  { label: "Alcohol", value: "Almond" },
  { label: "Cannabis (marijuana, pakalolo)", value: "Carrot" },
  { label: "Opioid (heroin, fentanyl, oxycodone)", value: "Orange" },
  { label: "Cocaine", value: "Coconut" },
  { label: "Sedative/benzodiazepine", value: "Strawberry" },
  { label: "Nicotine (cigarettes or e-cigarettes)", value: "Nectarine" },
  { label: "Others", value: "Others" },
];

function QuestionnaireScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const { user } = useAuth();
  //var hours = new Date().getHours();
  //console.log(user);
  if (user.preference == "Fruit") {
    var finalId = "fruits";
    var imSource = require("../assets/animations/fruits.png");
    var finalCategory = fruits;
    var pickerType = CategoryPickerItemColumn;
    var columnNum = 2;
    var placeHolder = "Fruit Types";
  } else {
    var finalId = "substances";
    var imSource = require("../assets/animations/selection.png");
    var finalCategory = substanceTypes;
    var pickerType = CategoryPickerItem;
    var columnNum = 1;
    var placeHolder = "Substance Types";
  }

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // const navPage = () => {
  //   navigation.navigate("QuestionnaireStep2", { step1Data: listing });
  // };
  const handleSubmit = async (listing) => {
    navigation.navigate(routes.QUESTIONNAIRE_STEP1, { step1Data: listing });
  };

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <AppForm
          initialValues={{
            category: [], // Initialize as an empty array for multiple selections
            cuser: user.userId,
            name: null,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormText>
            Did you crave/use {finalId}? Please select from the following
            answers!
          </AppFormText>

          <Image style={imageStyle} source={imSource} resizeMode="contain" />

          <AppFormPicker
            items={finalCategory}
            placeholder={placeHolder}
            icon="paw"
            name="category" // Make sure this matches the field name in your form
            numberOfColumns={columnNum}
            PickerItemComponent={pickerType}
          />

          <SubmitButton title="Next" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}
export default QuestionnaireScreen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
