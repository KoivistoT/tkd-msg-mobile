import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import { useSelector } from "react-redux";
import { selectUsersOnline } from "../../store/users";
import colors from "../../config/colors";

function ScreenHeaderTitle({
  title,
  subTitle,
  action = null,
  showOnlineIndicator = false,
}) {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.header} onPress={action}>
      <View style={styles.titleRow}>
        {showOnlineIndicator && <View style={styles.onlineIndicator}></View>}
        <AppText style={styles.title}>{title}</AppText>
      </View>
      {subTitle && <AppText style={styles.subTitle}>{subTitle}</AppText>}
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
    backgroundColor: colors.success,
    borderRadius: 7,
    marginRight: 5,
  },
});
export default ScreenHeaderTitle;
