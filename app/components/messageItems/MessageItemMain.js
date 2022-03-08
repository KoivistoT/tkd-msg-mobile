import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
import MessageItemBasic from "./MessageItemBasic";
function MessageItem({ item, currentUserId, senderName }) {
  const sentBy = item.postedByUser === currentUserId ? "me" : "otherUser";
  const messageType = item.type;
  return (
    <>
      {messageType === "text" && (
        <MessageItemBasic item={item} sentBy={sentBy} senderName={senderName} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
