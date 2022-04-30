import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { navigate } from "../navigation/rootNavigation";
import routes from "../navigation/routes";

function HeaderRightNewRoom() {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigate(routes.CREATE_CHAT_NAVIGATOR)}
    >
      <Entypo name="new-message" size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingRight: 20, paddingTop: 0 },
});

export default HeaderRightNewRoom;
