import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../config/colors";

import AppText from "./AppText";
import ShowImageModal from "./imageComponents/ShowImageModal";
function MessageItem({ item, userId, sender }) {
  return (
    //item type voisi isomminkin määrittää heti, ettei montaa if lausetta

    <TouchableOpacity
      style={item.postedByUser === userId ? styles.me : styles.otherUser}
    >
      <AppText>sender: {sender}</AppText>
      {item.type == "image" &&
        item.imageURLs.map((url) => (
          <ShowImageModal key={url} roomId={item.roomId} image={url} />
        ))}
      <AppText key={item._id}>{item.messageBody}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
