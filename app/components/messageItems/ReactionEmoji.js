import React from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";
import sortArray from "../../../utility/sortArray";

function ReactionEmoji({ onPress, reactions, currentUserId }) {
  const sortedReactions = sortArray(reactions, "name");

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
              colors[users?.includes(currentUserId) ? "success" : "white"],
            borderRadius: 10,
            paddingHorizontal: 10,
            width: 60,
            paddingVertical: 4,
            margin: 2,
            backgroundColor:
              colors[
                users?.includes(currentUserId) ? "success" : "backgroundColor1"
              ],
          }}
        >
          <AntDesign name={name} size={24} color={colors[reaction.color]} />
          {count && <AppText style={{ marginLeft: 4 }}>{`${count}`}</AppText>}
        </View>
      </TouchableNativeFeedback>
    );
  });
}

const styles = StyleSheet.create({
  container: {},
});

export default ReactionEmoji;
