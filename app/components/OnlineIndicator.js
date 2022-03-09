import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";
import { selectUsersOnline } from "../../store/users";
import showOnlineIndicator from "../../utility/showOnlineIndicator";

function OnlineIndicator({ members }) {
  const usersOnline = useSelector(selectUsersOnline); // tämäkin niin, että katsoo vain tämän usern
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  //   console.log("online Indicator");
  return (
    <>
      {showOnlineIndicator(usersOnline, members, currentUserId) ? (
        <View style={styles.onlineIndicator}></View>
      ) : (
        <View style={styles.indicatorSpace}></View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
  nameRow: {
    flexDirection: "row",
    marginRight: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  onlineIndicator: {
    width: 14,
    height: 14,
    backgroundColor: colors.success,
    borderRadius: 7,
  },
  indicatorSpace: {
    width: 14,
    height: 14,

    borderRadius: 7,
  },
});
export default OnlineIndicator;
