import React from "react";
import { StyleSheet } from "react-native";
import AppText from "./AppText";
import { useSelector } from "react-redux";
import { selectLastSeenMessagesById } from "../../store/currentUser";

function UnreadMessagesItem({ item }) {
  const { messageSum, _id: roomId } = item;
  const lastSeenMessagesNow = useSelector(selectLastSeenMessagesById(roomId));
  const unreadMessages = messageSum - lastSeenMessagesNow;
  return <AppText>{unreadMessages < 0 ? 0 : unreadMessages}</AppText>;
}

const styles = StyleSheet.create({});

function areEqual(prevProps, nextProps) {
  return (
    prevProps.item.messageSum === nextProps.item.messageSum &&
    prevProps.item._id === nextProps.item._id
  );
}

export const MemoUnreadMessagesItem = React.memo(UnreadMessagesItem, areEqual);
