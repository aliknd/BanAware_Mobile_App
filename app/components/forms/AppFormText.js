import React from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";

function AppFormText({ children }) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: fonts.fifthBoldItalic,
          textAlign: "center",
          color: colors.white,
          fontSize: 16,
          marginLeft: 10,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 12,
    alignItems: "center",
  },
});

export default AppFormText;
