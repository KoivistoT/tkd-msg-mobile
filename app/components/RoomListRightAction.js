import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { navigationRef } from "../navigation/rootNavigation";
import routes from "../navigation/routes";

function RoomListRightAction({
  onPress,
  roomCreator,
  item,
  onClose,
  currentUserData,
  roomType,
}) {
  const onGoSetupScreen = () => {
    navigationRef.current.navigate(routes.ROOM_SETUP_SCREEN, item);
    onClose();
  };
  console.log(
    currentUserData.accountType === "admin" ||
      currentUserData._id === roomCreator ||
      roomType === "private"
  );
  return (
    <View style={{ flexDirection: "row" }}>
      {(currentUserData.accountType === "admin" ||
        currentUserData._id === roomCreator ||
        roomType === "private") && (
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 80,
            backgroundColor: colors.danger,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => onGoSetupScreen()}
        style={{
          width: 80,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="settings" color={colors.white} size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  leftActionIcon: { padding: 5, alignSelf: "center" },
});

export default RoomListRightAction;
