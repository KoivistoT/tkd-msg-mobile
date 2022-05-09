import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../AppText";
import {
  replyMessageIdCleared,
  selectMessageById,
} from "../../../store/msgStore";
import { messageFormFocusCleared } from "../../../store/general";
import AppCloseButton from "../modals/AppCloseButton";

function ReplyItem({ item }) {
  const { roomId, messageId } = item;

  const dispatch = useDispatch();

  const messageData = useSelector(selectMessageById(roomId, messageId));

  const onClose = () => {
    dispatch(replyMessageIdCleared(roomId));
    dispatch(messageFormFocusCleared());
  };

  return (
    <View style={styles.container}>
      <AppCloseButton top={-10} onPress={() => onClose()} />
      <View style={styles.indicator}>
        <View style={{ backgroundColor: colors.white }}>
          <AppText style={styles.text} numberOfLines={3}>
            {messageData.messageBody}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    padding: 8,
  },
  closeButton: { backgroundColor: colors.danger, padding: 20 },
  indicator: { backgroundColor: colors.primary, paddingLeft: 4 },
  text: {
    maxWidth: Dimensions.get("window").width - 70,
    padding: 6,
  },
});
export default ReplyItem;
