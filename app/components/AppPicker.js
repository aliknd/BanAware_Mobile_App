import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import PickerItem from "./PickerItem";
import fonts from "../config/fonts";
import AppPickerButton from "./AppPickerButton";

function AppPicker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  onRemoveItem, // Include onRemoveItem function
  PickerItemComponent = PickerItem,
  placeholder,
  selectedItems = [],
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    if (selectedItems.some((selected) => selected.value === item.value)) {
      onRemoveItem(item); // Call the onRemoveItem function
    } else {
      onSelectItem(item);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          <AppText style={styles.text}>
            {selectedItems.length
              ? selectedItems.map((item) => item.label).join(", ")
              : placeholder}
          </AppText>
          <MaterialCommunityIcons
            name="chevron-down"
            size={30}
            color={defaultStyles.colors.medium}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <AppPickerButton
            title="Done"
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.flatlist}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              numColumns={numberOfColumns}
              renderItem={({ item }) => (
                <PickerItemComponent
                  label={item.label}
                  item={item}
                  onPress={() => {
                    handleSelect(item);
                  }}
                  selected={selectedItems.some(
                    (selectedItem) => selectedItem.value === item.value
                  )}
                />
              )}
            />
          </View>
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontFamily: fonts.fifthSemiBoldItalic,
  },
  flatlist: {
    paddingBottom: 150,
  },
});

export default AppPicker;
