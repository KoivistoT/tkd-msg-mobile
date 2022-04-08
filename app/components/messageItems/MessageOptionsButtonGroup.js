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

const MessageOptionsButtonGroup = ({
  onDelete,
  onSeen,
  isDeleted,
  onReply,
  message,
}) => {
  const { roomId, _id: messageId, reactions } = message;

  const dispatch = useDispatch();

  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  const onReaction = (reaction) => {
    dispatch(addReaction(roomId, messageId, reaction, currentUserId));
  };
  //pitää ensi tehdä niin, että on group, missä jokaisen erilaisessa reactionissa on kaikki saman reagtionit
  //sitten kun sitä painaa pitkään, niin avaa tiedot, ketkä on ja miten ragoinut, katso slackistä
  //reactionit toki jää koko ajan näkyviin, eli on edellisellä childissa ne näkyvät
  return (
    <View>
      <View style={styles.container}>
        <View>
          <TouchableNativeFeedback
            onPress={() => onReaction("like")}
            style={{ margin: 20 }}
          >
            <Text>like</Text>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => onReaction("love")}
            style={{ margin: 20 }}
          >
            <Text>love</Text>
          </TouchableNativeFeedback>
        </View>
        {!isDeleted && <DeleteButton onPress={() => onDelete()} />}
        <SeenButton onPress={() => onSeen()}></SeenButton>
        <ReplyButton onPress={onReply} />
      </View>
      {reactions &&
        reactions.map((item) => {
          return (
            <Text key={item.reaction + item.reactionByUser}>
              {item.reaction} {item.reactionByUser}
            </Text>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
});
export default MessageOptionsButtonGroup;
