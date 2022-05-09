import React from "react";
import { StyleSheet, View } from "react-native";
import { navigate } from "../../navigation/rootNavigation";
import routes from "../../navigation/routes";
import colors from "../../../config/colors";
import AppTouchableIcon from "../AppTouchableIcon";

function RoomListRightAction({
  onPress,
  roomCreator,
  item,
  onClose,
  currentUserData,
  roomType,
}) {
  const onGoSetupScreen = () => {
    navigate(routes.ROOM_SETUP_SCREEN, item);
    onClose();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {(currentUserData.accountType === "admin" ||
        currentUserData._id === roomCreator ||
        roomType === "private") && (
        <AppTouchableIcon
          onPress={onPress}
          containerStyle={{
            backgroundColor: colors.danger,
            paddingHorizontal: 30,
          }}
          style={styles.deleteIcon}
          size={24}
          name="delete-outline"
          color={colors.white}
        />
      )}

      <AppTouchableIcon
        onPress={() => onGoSetupScreen()}
        containerStyle={styles.iconContainer}
        style={styles.setupIcon}
        size={22}
        name="settings"
        source="f"
        color={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: { paddingTop: 12 },
  iconContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
  },
  setupIcon: { paddingTop: 14 },
});

export default RoomListRightAction;
