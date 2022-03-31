import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShowSearchBarButton from "./ShowSearchBarButton";

function MessageFormToolBar({ onPress, setShowSearchBar }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity="0.5"
        onPress={onPress}
        style={{
          paddingBottom: 6,
        }}
      >
        <MaterialCommunityIcons
          name="attachment"
          size={24}
        ></MaterialCommunityIcons>
      </TouchableOpacity>
      <ShowSearchBarButton onPress={setShowSearchBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-around" },
});
export default MessageFormToolBar;
