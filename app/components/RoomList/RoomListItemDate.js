import React from "react";
import { View, StyleSheet } from "react-native";
import timeFuncs from "../../../utility/timeFuncs";
import AppText from "../AppText";
import { MemoUnreadMessagesItem } from "../UnreadMessagesItem";

function RoomListItemDate({ latestMessage, item }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.date}>
        {latestMessage && timeFuncs.getWeekDayNames(latestMessage.createdAt)}
      </AppText>
      <View style={{ height: 30 }}>
        <MemoUnreadMessagesItem item={item} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 15, alignSelf: "center" },
  date: { fontSize: 14 },
});

export default RoomListItemDate;
