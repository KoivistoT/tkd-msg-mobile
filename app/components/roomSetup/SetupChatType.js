import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../../config/colors";
import AppText from "../AppText";

function SetupChatType({ roomType, roomStatus }) {
  return (
    <View style={styles.container}>
      <AppText>{`Chat type: ${roomType}`}</AppText>
      <AppText
        style={[
          styles.text,
          {
            color: roomStatus === "active" ? colors.success : colors.lightgrey,
          },
        ]}
      >{`(${roomStatus})`}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  text: {
    marginLeft: 5,
  },
});

export default SetupChatType;
