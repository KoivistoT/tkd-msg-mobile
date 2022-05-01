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
  return (
    <View style={styles.container}>
      {typer ? (
        <AppLoadingIndicator
          text={`${userFuncs.displayName(allUsers, typer)} is typing`}
        />
      ) : (
        <AppText style={styles.text} numberOfLines={2}>
          {`${
            latestMessage.postedByUser === currentUserId
              ? "You"
              : allUsers[latestMessage.postedByUser].displayName
          }: ${latestMessage.messageBody}`}
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
