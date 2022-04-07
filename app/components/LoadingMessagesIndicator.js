import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../config/colors";
import { selectLastSeenMessagesById } from "../../store/currentUser";
import AppText from "./AppText";

function LoadingMessagesIndicator({}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,

        // borderBottomLeftRadius: 10,
        borderRadius: 10,
        // borderBottomRightRadius: 10,
        alignSelf: "center",
        backgroundColor: colors.white,
        zIndex: 200,
        // borderBottomWidth: 1,
        // borderRightWidth: 1,
        // borderLeftWidth: 1,
        borderColor: colors.primary,
        flexDirection: "row",
        padding: 5,
      }}
    >
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={{ color: colors.primary, paddingHorizontal: 10 }}>
        Loading messages
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default LoadingMessagesIndicator;
