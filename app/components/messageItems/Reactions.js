import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
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
import { selectCurrenUserId } from "../../../store/currentUser";

const Reactions = ({ message, showAllEmojis }) => {
  const { roomId, _id: messageId, reactions } = message;

  const dispatch = useDispatch();

  const store = useStore();

  const currentUserId = selectCurrenUserId(store);
  const onReaction = (reaction) => {
    dispatch(addReaction(roomId, messageId, reaction, currentUserId));
  };
  //pitää ensi tehdä niin, että on group, missä jokaisen erilaisessa reactionissa on kaikki saman reagtionit
  //sitten kun sitä painaa pitkään, niin avaa tiedot, ketkä on ja miten ragoinut, katso slackistä
  //reactionit toki jää koko ajan näkyviin, eli on edellisellä childissa ne näkyvät
  const [messageReactions, setMessageReactions] = useState([]);
  const allReactions = [];

  const allEmojis = {
    heart: { color: "danger", order: 0 },
    like1: { color: "khaki", order: 1 },
    dislike1: { color: "khaki", order: 2 },
    star: { color: "yellow", order: 3 },
    smileo: { color: "white", order: 4 },
  };
  //tämä toki voisi olla jo be:ssä tehtyä? ehkä, ehkä ei
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

  return (
    <View style={styles.container}>
      <ReactionEmoji
        currentUserId={currentUserId}
        reactions={messageReactions}
        onPress={onReaction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
});
export default Reactions;
