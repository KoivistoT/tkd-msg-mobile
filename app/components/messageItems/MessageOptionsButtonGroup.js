import React from "react";
import { View, StyleSheet } from "react-native";
import SeenButton from "./SeenButton";
import ReplyButton from "./ReplyButton";
import { useStore } from "react-redux";
import AppTouchableIcon from "../AppTouchableIcon";

const MessageOptionsButtonGroup = ({
  onDelete,
  onSeen,
  isDeleted,
  onReply,
  sentBy,
}) => {
  const store = useStore();

  return (
    <View
      style={[
        styles.container,
        { alignSelf: sentBy === "me" ? "flex-end" : "flex-start" },
      ]}
    >
      {!isDeleted && (
        <AppTouchableIcon
          source="mi"
          onPress={() => onDelete()}
          name="delete-outline"
          size={24}
          style={styles.icon}
        />
      )}
      {sentBy === "me" && <SeenButton onPress={() => onSeen()} />}
      <ReplyButton onPress={onReply} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  icon: { paddingHorizontal: 20, padding: 10 },
});
export default MessageOptionsButtonGroup;
