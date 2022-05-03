import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { addReaction, reactionAdded } from "../../../store/msgStore";
import { useDispatch, useStore } from "react-redux";
import ReactionEmoji from "./ReactionEmoji";
import { selectCurrentUserId } from "../../../store/currentUser";
import colors from "../../../config/colors";
import ReactionDetailsButtons from "./ReactionDetailsButtons";
import AppCloseButton from "../modals/AppCloseButton";

const ALL_EMOJIS = {
  heart: { color: "danger", order: 0 },
  like1: { color: "khaki", order: 1 },
  dislike1: { color: "khaki", order: 2 },
  star: { color: "yellow", order: 3 },
  smileo: { color: "black", order: 4 },
};

const Reactions = ({ message, showAllEmojis, onRemoveSelections }) => {
  const { roomId, _id: messageId, reactions } = message;

  const store = useStore();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [messageReactions, setMessageReactions] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const allReactions = [];
  const currentUserId = selectCurrentUserId(store);

  const onReaction = (reaction) => {
    onRemoveSelections();
    dispatch(reactionAdded({ roomId, messageId, reaction, currentUserId }));
    dispatch(addReaction(roomId, messageId, reaction, currentUserId));
  };

  const checkIsReactions = () => {
    let isReactions = false;
    for (const reaction of messageReactions) {
      if (reaction.users) {
        isReactions = true;
      }
    }
    return isReactions;
  };

  const handleReactions = () => {
    reactions.map((item) => {
      const index = allReactions.findIndex((reaction) => {
        return reaction.name === item.reaction;
      });

      if (index === -1) {
        allReactions.push({
          name: item.reaction,
          order: ALL_EMOJIS[item.reaction]?.order,
          count: 1,
          color: ALL_EMOJIS[item.reaction]?.color,
          users: [item.reactionByUser],
        });
      } else {
        allReactions[index].count++;
        allReactions[index].users = [
          ...allReactions[index].users,
          item.reactionByUser,
        ];
      }
    });
  };

  const showEmojis = () => {
    if (showAllEmojis) {
      Object.keys(ALL_EMOJIS).map((name) => {
        const index = allReactions.findIndex(
          (reaction) => reaction.name === name
        );
        if (index === -1) {
          allReactions.push({
            name,
            color: ALL_EMOJIS[name].color,
            order: ALL_EMOJIS[name].order,
          });
        }
      });
    }
  };

  useEffect(() => {
    handleReactions();
    showEmojis();
    setMessageReactions(allReactions);
  }, [reactions, showAllEmojis]);

  const onLongPress = () => {
    const isReactions = checkIsReactions();
    if (isReactions) setModalVisible(true);
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        style={styles.modal}
      >
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.detailsContainer}>
            <AppCloseButton onPress={() => setModalVisible(false)} />

            <ReactionDetailsButtons
              style={{ padding: 20 }}
              currentUserId={currentUserId}
              reactions={messageReactions}
              onPress={onReaction}
              selectedReaction={selectedReaction}
              setSelectedReaction={setSelectedReaction}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.emojis}>
        <ReactionEmoji
          onLongPress={() => onLongPress()}
          currentUserId={currentUserId}
          reactions={messageReactions}
          onPress={onReaction}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.0)",
    height: "60%",
    width: "100%",
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.0)",
    flex: 1,
    width: "100%",
  },
  detailsContainer: {
    bottom: 0,
    backgroundColor: colors.white,
    width: "100%",
    height: "40%",
  },
  emojis: { flexDirection: "row" },
  modalEmojiContainer: { flexDirection: "row" },
  modal: {},
  button: {},
});
export default Reactions;
