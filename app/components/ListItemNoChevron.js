import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";

import colors from "../config/colors";
import AppText from "./AppText";
import fonts from "../config/fonts";

function ListItemNoChevron({ title, subTitle, image, IconComponent, onPress }) {
  return (
    <TouchableHighlight underlayColor={colors.lightGray} onPress={onPress}>
      <View style={styles.container}>
        {IconComponent}
        {image && <Image style={styles.image} source={image} />}
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          {subTitle && (
            <AppText style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </AppText>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.bglight,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontWeight: "500",
    fontSize: 17,
    color: colors.white,
    fontFamily: fonts.fifthBoldItalic,
  },
  subTitle: {
    color: colors.medium,
    color: colors.white,
    fontFamily: fonts.fifthBoldItalic,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
});

export default ListItemNoChevron;
