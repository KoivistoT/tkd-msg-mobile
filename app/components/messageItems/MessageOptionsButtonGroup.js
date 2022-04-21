import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import SeenButton from "./SeenButton";
import DeleteButton from "./DeleteButton";
import ReplyButton from "./ReplyButton";
import {
  addReaction,
  selectReactionsMessageById,
} from "../../../store/msgStore";
import { useDispatch, useSelector, useStore } from "react-redux";
import Reactions from "./Reactions";
import EmojiSelector from "react-native-emoji-selector";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../../config/colors";
import ReactionEmoji from "./ReactionEmoji";
import AddReactionButton from "./AddReactionButton";
const MessageOptionsButtonGroup = ({
  onDelete,
  onSeen,
  isDeleted,
  onReply,
  sentBy,
}) => {
  const store = useStore();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignSelf: sentBy === "me" ? "flex-end" : "flex-start",
        }}
      >
        {!isDeleted && <DeleteButton onPress={() => onDelete()} />}
        {sentBy === "me" && <SeenButton onPress={() => onSeen()}></SeenButton>}
        <ReplyButton onPress={onReply} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
export default MessageOptionsButtonGroup;
