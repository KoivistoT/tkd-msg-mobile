import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import SeenButton from "./SeenButton";
import DeleteButton from "./DeleteButton";
import ReplyButton from "./ReplyButton";
import { addReaction } from "../../../store/msgStore";
import { useDispatch, useStore } from "react-redux";

const MessageOptionsButtonGroup = ({
  onDelete,
  onSeen,
  isDeleted,
  onReply,
  message,
}) => {
  const { reactions } = message;
  console.log(reactions, "reactionsit");

  const dispatch = useDispatch();
  const { roomId, _id: messageId } = message;
  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  const onReaction = (reaction) => {
    dispatch(addReaction(roomId, messageId, reaction, currentUserId));
  };

  return (
    <View style={styles.container}>
      {/* tämä erilleen */}
      <View>
        <TouchableNativeFeedback onPress={() => onReaction("like")}>
          <Text>like</Text>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => onReaction("love")}>
          <Text>love</Text>
        </TouchableNativeFeedback>
      </View>
      {!isDeleted && <DeleteButton onPress={() => onDelete()} />}
      <SeenButton onPress={() => onSeen()}></SeenButton>
      <ReplyButton onPress={onReply} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
});
export default MessageOptionsButtonGroup;
