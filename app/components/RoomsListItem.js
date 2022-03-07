import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";
import getDirectRoomTitle from "../../utility/getDirectRoomTitle";
import getPrivateRoomTitle from "../../utility/getPrivateRoomTitle";
import getRoomTitle from "../../utility/getRoomTitle";
import AppText from "./AppText";

function RoomsListItem({ item, navigation, allUsers, currentUserId }) {
  return (
    <TouchableOpacity
      style={{
        marginBottom: 10,
        backgroundColor: item.status === "active" ? "lightgrey" : "yellow",
      }}
      onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
    >
      {Object.keys(allUsers).length > 0 && (
        <AppText
          style={{
            color: "black",

            padding: 10,
          }}
          key={item._id}
        >
          {getRoomTitle(item, allUsers, currentUserId)}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default RoomsListItem;
