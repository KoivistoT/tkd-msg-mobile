import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
import MessageItemBasic from "./MessageItemBasic";
import MessageItemImage from "./MessageItemImage";
function MessageItem({ item, currentUserId, senderName }) {
  const sentBy = item.postedByUser === currentUserId ? "me" : "otherUser";
  const messageType = item.type;
  const messageData = { item, sentBy, senderName };
  return (
    <>
      {messageType === "text" && <MessageItemBasic messageData={messageData} />}
      {messageType === "image" && (
        <MessageItemImage messageData={messageData} />
      )}
    </>
  );
}

const styles = StyleSheet.create({});

export default MessageItem;
