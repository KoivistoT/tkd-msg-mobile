import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import ShowImageModal from "../imageComponents/ShowImageModal";
import {
  replyMessageIdCleared,
  selectMessageById,
} from "../../../store/msgStore";
import { messageFormFocusCleared } from "../../../store/general";

function ReplyItem({ item }) {
  const dispatch = useDispatch();
  const { roomId, messageId } = item;

  const messageData = useSelector(selectMessageById(roomId, messageId));

  //   console.log(messageData, "täällä reply data");

  const onClose = () => {
    dispatch(replyMessageIdCleared(roomId));
    dispatch(messageFormFocusCleared());
  };
  return (
    <View>
      <View style={{ alignSelf: "center" }}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={1}
          onPress={() => onClose()}
        >
          <AppText style={styles.text}>CLOSE</AppText>
        </TouchableOpacity>
      </View>
      <AppText>{messageData.messageBody}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: { backgroundColor: colors.danger, padding: 5 },
});
export default ReplyItem;
