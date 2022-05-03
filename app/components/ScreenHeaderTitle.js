import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import AppLoadingIndicator from "./AppLoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserLastPresentByUserId,
  selectLastPresentByUserId,
  selectUsersOnline,
} from "../../store/users";
import colors from "../../config/colors";
import roomFuncs from "../../utility/roomFuncs";
import showOnlineIndicator from "../../utility/showOnlineIndicator";
import timeFuncs from "../../utility/timeFuncs";

function ScreenHeaderTitle({
  title,
  action = null,
  allUsers,
  currentRoomType,
  currentRoomMembers,
  roomMembers,
  currentUserId,
  otherUserId,
}) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const usersOnline = useSelector(selectUsersOnline);
  const otherUserLastPresent = useSelector(
    selectLastPresentByUserId(otherUserId)
  );

  useEffect(() => {
    if (
      otherUserId &&
      !showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)
    ) {
      setLoading(true);
      setTimeout(() => {
        dispatch(getUserLastPresentByUserId(otherUserId));
      }, 100);
      setTimeout(() => {
        setLoading(false);
      }, 180);
    }
  }, [showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)]);

  const getSubTitle = () => {
    if (!roomMembers) return;

    if (
      currentRoomType === "private" &&
      showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)
    ) {
      return "Present now";
    }

    if (
      currentRoomType === "private" &&
      !showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)
    ) {
      return otherUserLastPresent
        ? `last present ${timeFuncs.getWeekDayNamesWithTimes(
            otherUserLastPresent
          )}`
        : "";
    }

    return `Members ${roomFuncs.getRoomActiveMembersSum(
      roomMembers,
      allUsers
    )} >`;
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.header} onPress={action}>
      <View style={styles.titleRow}>
        {currentRoomType !== "private" ? (
          false
        ) : (
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: showOnlineIndicator(
                  usersOnline,
                  currentRoomMembers,
                  currentUserId
                )
                  ? colors.success
                  : colors.white,
              },
            ]}
          ></View>
        )}
        <AppText style={styles.text} numberOfLines={1}>
          {title}
        </AppText>
      </View>

      {loading ? (
        <AppLoadingIndicator />
      ) : (
        <AppText style={styles.subTitle}>{getSubTitle()}</AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", marginRight: 14, alignItems: "center" },
  text: {
    color: "black",
    fontWeight: "800",
    maxWidth: Dimensions.get("window").width - 160,
  },
  header: { alignItems: "center" },
  title: { fontSize: 18 },
  subTitle: { fontSize: 12 },
  onlineIndicator: {
    width: 14,
    height: 14,

    borderRadius: 7,
    marginRight: 5,
  },
});
export default ScreenHeaderTitle;
