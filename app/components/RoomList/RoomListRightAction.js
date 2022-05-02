import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
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
          style={{
            backgroundColor: colors.danger,
            paddingHorizontal: 30,
          }}
          name="delete-outline"
          color={colors.white}
        />
      )}

      <AppTouchableIcon
        onPress={() => onGoSetupScreen()}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 30,
        }}
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
});

export default RoomListRightAction;
