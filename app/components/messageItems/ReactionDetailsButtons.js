import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";
import sortArray from "../../../utility/sortArray";
import userFuncs from "../../../utility/userFuncs";
import { useSelector } from "react-redux";
import { selectAllUsersMinimal } from "../../../store/users";

function ReactionDetailsButtons({
  reactions,
  currentUserId,
  setSelectedReaction,
  selectedReaction,
}) {
  const allUsers = useSelector(selectAllUsersMinimal);
  const sortedReactions = sortArray(reactions, "order");
  const listKeyExtractor = (data) => data;

  const listItem = ({ item }) => {
    return <AppText>{userFuncs.getFullName(allUsers, item)}</AppText>;
  };

  useEffect(() => {
    setSelectedReaction(
      sortedReactions[sortedReactions.findIndex((reaction) => reaction.users)]
        .name
    );
  }, []);

  const getReactions = () => {
    const index = sortedReactions.findIndex(
      (reaction) => reaction.name === selectedReaction
    );

    if (index >= 0) {
      return sortedReactions[index].users;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {sortedReactions.map((reaction) => {
          const { name, count, users } = reaction;
          if (!users) {
            return null;
          }

          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelectedReaction(name)}
              key={name}
            >
              <View
                style={[
                  styles.icon,
                  {
                    borderColor:
                      colors[
                        users?.includes(currentUserId) ? "light" : "white"
                      ],
                    backgroundColor:
                      colors[selectedReaction === name ? "success" : "light"],
                  },
                ]}
              >
                <AntDesign
                  name={name}
                  size={16}
                  color={colors[reaction.color]}
                />
                {count && (
                  <AppText style={{ marginLeft: 2 }}>{`${count}`}</AppText>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.reactions}>
        <FlatList
          style={styles.list}
          data={getReactions()}
          maxToRenderPerBatch={15}
          initialNumToRender={15}
          windowSize={15}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 10, paddingTop: 10 },
  icon: {
    borderRadius: 6,
    paddingHorizontal: 8,
    minWidth: 45,
    paddingVertical: 4,
    flexDirection: "row",

    borderWidth: 1,
    margin: 6,
  },
  list: { paddingTop: 10, paddingBottom: 80 },
  reactions: { paddingHorizontal: 10 },
  row: { flexDirection: "row" },
});

export default ReactionDetailsButtons;
