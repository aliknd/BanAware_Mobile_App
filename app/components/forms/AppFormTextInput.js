import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, TextInput, View } from "react-native";
import CustomErrorMessage from "./CustomErrorMessage";
import colors from "../../config/colors";
import fonts from "../../config/fonts";

function AppFormTextInput({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={values[name]}
          onChangeText={handleChange(name)}
          onBlur={() => setFieldTouched(name)}
          {...otherProps}
        />
      </View>
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormTextInput;

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
    // Add other styling as needed
  },
});
