import React from "react";
import { StyleSheet } from "react-native";
import { navigate } from "../navigation/rootNavigation";
import routes from "../navigation/routes";
import AppTouchableIcon from "./AppTouchableIcon";
import colors from "../../config/colors";

function HeaderRightNewRoom() {
  return (
    <AppTouchableIcon
      color={colors.black}
      source="e"
      name="new-message"
      containerStyle={styles.container}
      size={22}
      onPress={() => navigate(routes.CREATE_CHAT_NAVIGATOR)}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingRight: 20, paddingTop: 0 },
});

export default HeaderRightNewRoom;
