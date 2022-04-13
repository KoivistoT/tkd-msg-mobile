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
  const usersOnline = useSelector(selectUsersOnline);
  const dispatch = useDispatch();

  const otherUserLastPresent = useSelector(
    selectLastPresentByUserId(otherUserId)
  );

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      otherUserId &&
      !showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)
    ) {
      setLoading(true);
      //tämä siksi että ensin sen lähteneen käyttäjän tulee olla tallentanut lähtö aika, sitten voi vasta hakea. haku olisi nopeampi kuin tallennus
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
      return "View details";
    }

    if (
      currentRoomType === "private" &&
      !showOnlineIndicator(usersOnline, currentRoomMembers, currentUserId)
    ) {
      return otherUserLastPresent
        ? timeFuncs.getWeekDayNamesWithTimes(otherUserLastPresent)
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
        <AppText
          style={{
            color: "black",
            fontWeight: "800",
            maxWidth: Dimensions.get("window").width - 160,
          }}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {/* <AppText style={styles.title}></AppText> */}
      </View>

      <AppText style={styles.subTitle}>{loading ? "" : getSubTitle()}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", marginRight: 14, alignItems: "center" },
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
