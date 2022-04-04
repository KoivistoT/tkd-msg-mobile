import React from "react";
import { View, StyleSheet } from "react-native";
import SeenButton from "./SeenButton";
import DeleteButton from "./DeleteButton";
import ReplyButton from "./ReplyButton";

function MessageOptionsButtonGroup({ onDelete, onSeen, isDeleted, onReply }) {
  return (
    <View style={styles.container}>
      {!isDeleted && <DeleteButton onPress={() => onDelete()} />}
      <SeenButton onPress={() => onSeen()}></SeenButton>
      <ReplyButton onPress={onReply} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
});
export default MessageOptionsButtonGroup;
