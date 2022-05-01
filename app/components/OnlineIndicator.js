import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import colors from "../../config/colors";
import { selectCurrentUserId } from "../../store/currentUser";
import { selectUsersOnline } from "../../store/users";
import showOnlineIndicator from "../../utility/showOnlineIndicator";

function OnlineIndicator({ members }) {
  const usersOnline = useSelector(selectUsersOnline);
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  return (
    <>
      {showOnlineIndicator(usersOnline, members, currentUserId) && (
        <View style={styles.onlineIndicator} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  onlineIndicator: {
    position: "absolute",
    left: 10,
    top: 8,
    width: 14,
    height: 14,
    backgroundColor: colors.success,
    borderRadius: 7,
  },
});
export default OnlineIndicator;
