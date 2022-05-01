import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { useSelector } from "react-redux";
import colors from "../../config/colors";
import { selectUnreadSum } from "../../store/rooms";

function UnreadMessagesItem({ item }) {
  const { _id: roomId } = item;
  const unreadMessages = useSelector(selectUnreadSum(roomId));

  if (unreadMessages === 0 || unreadMessages < 0) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{unreadMessages}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: colors.success,
    padding: 6,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  text: {
    color: colors.white,
  },
});

function areEqual(prevProps, nextProps) {
  return (
    prevProps.item.messageSum === nextProps.item.messageSum &&
    prevProps.item._id === nextProps.item._id
  );
}

export const MemoUnreadMessagesItem = React.memo(UnreadMessagesItem, areEqual);
