import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";
import getDirectRoomTitle from "../../utility/getDirectRoomTitle";
import getPrivateRoomTitle from "../../utility/getPrivateRoomTitle";
import getRoomTitle from "../../utility/getRoomTitle";
import AppText from "./AppText";

function RoomsListItem({ item, navigation, allUsersList, currentUserId }) {
  return (
    <TouchableOpacity
      style={{
        marginBottom: 10,
        backgroundColor: item.status === "active" ? "lightgrey" : "yellow",
      }}
      onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
    >
      {allUsersList && (
        <AppText
          style={{
            color: "black",

            padding: 10,
          }}
          key={item._id}
        >
          {getRoomTitle(item, allUsersList, currentUserId)}
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
