import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ScrollDownButton({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          styles={{ margin: 20, padding: 20 }}
          name="arrow-down-drop-circle-outline"
          color={colors.white}
          size={35}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 45,
    position: "absolute",
    bottom: 10,
    right: 0,

    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    // borderRadius: 15,
    // borderWidth: 2,
    // borderColor: colors.dark,

    alignItems: "center",
    justifyContent: "center",
  },
});
export default ScrollDownButton;
