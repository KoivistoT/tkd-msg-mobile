import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import AppLoadingIndicator from "../AppLoadingIndicator";
import AppText from "../AppText";
import userFuncs from "../../../utility/userFuncs";

function RoomListLatestMessage({
  latestMessage,
  allUsers,
  typer,
  currentUserId,
}) {
  const getLatestMessageWithSender = (message, userId) => {
    let text = "";

    if (message.postedByUser === userId) {
      text = "You";
    } else {
      text = allUsers[message.postedByUser].displayName;
    }

    return `${text}: ${message.messageBody}`;
  };

  return (
    <View style={styles.container}>
      {typer ? (
        <AppLoadingIndicator
          text={`${userFuncs.displayName(allUsers, typer)} is typing`}
        />
      ) : (
        <AppText style={styles.text} numberOfLines={2}>
          {getLatestMessageWithSender(latestMessage, currentUserId)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "black",
    maxWidth: Dimensions.get("window").width - 160,
  },
});

export default RoomListLatestMessage;
