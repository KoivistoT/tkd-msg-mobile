import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";

function RoomsListItem({ item, navigation }) {
  return (
    <TouchableOpacity
      style={{ marginBottom: 10 }}
      onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
    >
      <Text
        style={{
          color: "black",
          backgroundColor: "green",
          padding: 10,
        }}
        key={item._id}
      >
        {item.roomName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default RoomsListItem;
