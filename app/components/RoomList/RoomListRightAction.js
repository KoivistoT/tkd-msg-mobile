import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { navigate } from "../../navigation/rootNavigation";
import routes from "../../navigation/routes";
import colors from "../../../config/colors";

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
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => onGoSetupScreen()}
        style={[styles.button, { color: colors.primary }]}
      >
        <Feather name="settings" color={colors.white} size={24} />
      </TouchableOpacity>
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
  leftActionIcon: { padding: 5, alignSelf: "center" },
});

export default RoomListRightAction;
