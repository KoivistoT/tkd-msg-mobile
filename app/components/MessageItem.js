import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";

import AppText from "./AppText";
function MessageItem({ item, userId }) {
  return (
    <TouchableOpacity
      style={item.postedByUser === userId ? styles.me : styles.otherUser}
    >
      <AppText
        style={{
          color: "black",
          backgroundColor: "white",
        }}
        key={item._id}
      >
        {item.messageBody}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  messageFrame: {},
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
