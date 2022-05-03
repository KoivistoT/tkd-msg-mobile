import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";
import sortArray from "../../../utility/sortArray";

function ReactionEmoji({ onPress, reactions, currentUserId, onLongPress }) {
  const sortedReactions = sortArray(reactions, "order");

  return sortedReactions.map((reaction) => {
    const { name, count, users } = reaction;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(name)}
        onLongPress={onLongPress}
        key={name}
      >
        <View
          style={[
            styles.container,
            {
              paddingLeft: count ? 7 : 13,
              borderColor:
                colors[users?.includes(currentUserId) ? "light" : "white"],
              backgroundColor:
                colors[
                  users?.includes(currentUserId)
                    ? "primary"
                    : "backgroundColor1"
                ],
            },
          ]}
        >
          <AntDesign name={name} size={16} color={colors[reaction.color]} />
          {count && <AppText style={styles.text}>{`${count}`}</AppText>}
        </View>
      </TouchableOpacity>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 6,
    padding: 5,
    minWidth: 45,
    paddingVertical: 4,
    margin: 2,
    alignItems: "center",
    borderWidth: 1,
  },
  text: { marginLeft: 2, color: colors.white },
});

export default ReactionEmoji;
