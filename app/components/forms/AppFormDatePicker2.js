import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFormikContext } from "formik";

import CustomErrorMessage from "./CustomErrorMessage";

function AppFormDatePicker2({ name, placeholder }) {
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
      <Button title={placeholder} onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display="spinner" // Set the picker to spinner mode
      />
      {dateValue && (
        <Text>Selected Date: {dateValue.toLocaleDateString()}</Text>
      )}
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

export default AppFormDatePicker2;
