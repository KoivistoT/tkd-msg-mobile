import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
function MessageItemBasic({ item, sentBy, senderName }) {
  return (
    //item type voisi isomminkin määrittää heti, ettei montaa if lausetta

    <TouchableOpacity style={styles[sentBy]}>
      <AppText>sender: {senderName}</AppText>
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
export default MessageItemBasic;
