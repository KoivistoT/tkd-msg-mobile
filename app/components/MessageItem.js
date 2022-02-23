import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../config/colors";

import AppText from "./AppText";
function MessageItem({ item, userId }) {
  console.log("tee avattava kuva");
  return (
    <TouchableOpacity
      style={item.postedByUser === userId ? styles.me : styles.otherUser}
    >
      <AppText key={item._id}>{item.messageBody}</AppText>
      {item.imageURLs &&
        item.imageURLs.length !== 0 &&
        item.imageURLs.map((url) => (
          <Image
            style={{ width: 20, height: 20 }}
            source={{ uri: url.toString() }}
          />
        ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
