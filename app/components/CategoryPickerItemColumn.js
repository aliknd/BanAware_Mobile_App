import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import fonts from "../config/fonts";

function CategoryPickerItemColumn({ item, onPress, selected }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.imageContainer,
            selected && styles.selectedImageContainer, // Apply highlight to the image container when selected
          ]}
        >
          <Image style={styles.fruitLogo} source={item.icon} />
        </View>
        <AppText
          style={[
            styles.label,
            selected && styles.selectedLabel, // Apply a different style to the label when selected
          ]}
        >
          {item.label}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
    width: "50%",
  },
  label: {
    marginTop: 5,
    color: "white",
    textAlign: "center",
    fontFamily: fonts.fifthSemiBoldItalic,
  },
  selectedLabel: {
    color: colors.primary, // Define your selected item label color
  },
  imageContainer: {
    borderRadius: 30,
    overflow: "hidden",
  },
  selectedImageContainer: {
    backgroundColor: colors.medium, // Define your selected item background color for the image container
  },
  fruitLogo: {
    width: "100%",
    height: 150,
    aspectRatio: 1,
  },
});

export default CategoryPickerItemColumn;
