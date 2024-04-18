import React, { useState } from "react";
import { useFormikContext } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View, Button, Platform } from "react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import AppPickerButton from "../AppPickerButton";
import CustomErrorMessage from "./CustomErrorMessage";

function AppFormDatePicker({ name }) {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const [show, setShow] = useState(false);
  const [dateConfirmed, setDateConfirmed] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || values[name];
    if (Platform.OS === "android") {
      setShow(false); // Hide picker on Android after selection
      if (event.type === "set") {
        setFieldValue(name, currentDate);
        setDateConfirmed(true);
      }
    } else if (Platform.OS === "ios") {
      // For iOS, we handle the date confirmation with separate buttons
      if (event.type === "set") {
        setFieldValue(name, currentDate);
      }
    }
  };

  const handleConfirm = () => {
    setShow(false);
    setDateConfirmed(true);
  };

  const handleCancel = () => {
    setShow(false);
    setDateConfirmed(false);
  };

  return (
    <View>
      <AppPickerButton
        title="Birthdate"
        onPress={() => setShow(true)}
        color="medium"
      />
      {show && (
        <>
          <DateTimePicker
            testID="dateTimePicker"
            value={values[name] || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            onChange={onChange}
            maximumDate={new Date()}
            textColor="red"
          />
          {Platform.OS === "ios" && (
            <View>
              <Button title="Confirm" onPress={handleConfirm} />
              <Button title="Cancel" onPress={handleCancel} />
            </View>
          )}
        </>
      )}
      {dateConfirmed && values[name] && (
        <Text style={styles.selectedDateText}>
          Selected Date: {values[name].toLocaleDateString()}
        </Text>
      )}
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = {
  selectedDateText: {
    color: colors.white,
    alignSelf: "center",
    margin: 5,
    fontFamily: fonts.fifthRegular,
    fontSize: 16,
  },
};

export default AppFormDatePicker;
