import React, { useState } from "react";
import { Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFormikContext } from "formik";

import CustomErrorMessage from "./CustomErrorMessage";
import colors from "../../config/colors";
import AppPickerButton from "../AppPickerButton";
import fonts from "../../config/fonts";

function AppFormDateTimePicker({ name, placeholder }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const dateValue = values[name];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFieldValue(name, date);
    hideDatePicker();
  };

  return (
    <View>
      <AppPickerButton
        title={placeholder}
        color="medium"
        onPress={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display="spinner" // Set the picker to spinner mode
      />
      {dateValue && (
        <Text
          style={{
            color: colors.white,
            alignSelf: "center",
            marginTop: 5,
            fontSize: 18,
            fontFamily: fonts.fifthRegular,
          }}
        >
          Date/Time: {dateValue.toLocaleString()}
        </Text>
      )}
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

export default AppFormDateTimePicker;
