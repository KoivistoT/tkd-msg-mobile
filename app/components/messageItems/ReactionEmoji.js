import React from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";
import sortArray from "../../../utility/sortArray";

function ReactionEmoji({ onPress, reactions, currentUserId }) {
  const sortedReactions = sortArray(reactions, "order");

  return sortedReactions.map((reaction) => {
    const { name, count, users } = reaction;

    return (
      <TouchableNativeFeedback
        onPress={() => onPress(name)}
        style={{
          margin: 20,
          flexDirection: "row",
        }}
        key={name}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
            borderWidth: 1,
            borderColor:
              colors[users?.includes(currentUserId) ? "light" : "white"],
            borderRadius: 6,
            paddingHorizontal: 8,
            minWidth: 45,
            paddingVertical: 4,

            margin: 2,
            backgroundColor:
              colors[
                users?.includes(currentUserId) ? "light" : "backgroundColor1"
              ],
          }}
        >
          <AntDesign name={name} size={16} color={colors[reaction.color]} />
          {count && <AppText style={{ marginLeft: 2 }}>{`${count}`}</AppText>}
        </View>
      </TouchableNativeFeedback>
    );
  });
}

const styles = StyleSheet.create({
  container: {},
});

export default ReactionEmoji;
