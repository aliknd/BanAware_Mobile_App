import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import fonts from "../config/fonts";

function PickerItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AppText style={styles.text}>{item.label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginVertical: 2,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.fifthSemiBoldItalic,
  },
});

export default PickerItem;
