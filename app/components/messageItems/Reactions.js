import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SeenButton from "./SeenButton";
import DeleteButton from "./DeleteButton";
import ReplyButton from "./ReplyButton";
import {
  addReaction,
  selectReactionsMessageById,
} from "../../../store/msgStore";
import { useDispatch, useSelector, useStore } from "react-redux";
import ReactionEmoji from "./ReactionEmoji";
import AddReactionButton from "./AddReactionButton";
import { selectCurrentUserId } from "../../../store/currentUser";
import colors from "../../../config/colors";
import Screen from "../Screen";
import AppText from "../AppText";
import ReactionDetailsButtons from "./ReactionDetailsButtons";

const Reactions = ({ message, showAllEmojis }) => {
  const { roomId, _id: messageId, reactions } = message;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const store = useStore();

  const currentUserId = selectCurrentUserId(store);
  const onReaction = (reaction) => {
    dispatch(addReaction(roomId, messageId, reaction, currentUserId));
  };
  //pitää ensi tehdä niin, että on group, missä jokaisen erilaisessa reactionissa on kaikki saman reagtionit
  //sitten kun sitä painaa pitkään, niin avaa tiedot, ketkä on ja miten ragoinut, katso slackistä
  //reactionit toki jää koko ajan näkyviin, eli on edellisellä childissa ne näkyvät
  const [messageReactions, setMessageReactions] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const allReactions = [];

  const allEmojis = {
    heart: { color: "danger", order: 0 },
    like1: { color: "khaki", order: 1 },
    dislike1: { color: "khaki", order: 2 },
    star: { color: "yellow", order: 3 },
    smileo: { color: "white", order: 4 },
  };
  //tämä toki voisi olla jo be:ssä tehtyä? ehkä, ehkä ei

  const checkIsReactions = () => {
    let isReactions = false;
    for (const reaction of messageReactions) {
      if (reaction.users) {
        isReactions = true;
      }
    }

    return isReactions;
  };
  useEffect(() => {
    reactions.map((item) => {
      const index = allReactions.findIndex((reaction) => {
        return reaction.name === item.reaction;
      });

      if (index === -1) {
        allReactions.push({
          name: item.reaction,
          order: allEmojis[item.reaction]?.order,
          count: 1,
          color: allEmojis[item.reaction]?.color,
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
    if (showAllEmojis) {
      Object.keys(allEmojis).map((name) => {
        const index = allReactions.findIndex(
          (reaction) => reaction.name === name
        );
        if (index === -1) {
          allReactions.push({
            name,
            color: allEmojis[name].color,
            order: allEmojis[name].order,
          });
        }
      });
    }
    setMessageReactions(allReactions);
  }, [reactions, showAllEmojis]);

  const onLongPress = () => {
    const isReactions = checkIsReactions();
    if (isReactions) setModalVisible(true);
    else alert("ei ole");
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        style={styles.modal}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.0)",
            flex: 1,
            width: "100%",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "rgba(0,0,0,0.0)",
              height: "60%",
              width: "100%",
            }}
            onPress={() => setModalVisible(false)}
          ></TouchableOpacity>
          <View
            style={{
              bottom: 0,
              backgroundColor: colors.white,
              width: "100%",
              height: "40%",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
              style={{
                position: "absolute",
                top: -12,
                alignSelf: "flex-end",
                padding: 25,

                zIndex: 2,
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={25}
                color={colors.dark}
              />
            </TouchableOpacity>

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

      <TouchableOpacity style={styles.container}>
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
  container: { flexDirection: "row" },
  modalEmojiContainer: { flexDirection: "row" },
  modal: {},
  button: {},
});
export default Reactions;
