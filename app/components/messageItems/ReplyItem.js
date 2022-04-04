import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import ShowImageModal from "../imageComponents/ShowImageModal";
import {
  replyMessageIdCleared,
  selectMessageById,
} from "../../../store/msgStore";
import { messageFormFocusCleared } from "../../../store/general";
import AppCloseButton from "../AppCloseButton";

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
    <View
      style={{
        maxHeight: 100,
        borderWidth: 1,
        borderColor: colors.lightgrey,
        padding: 8,
      }}
    >
      <View style={{ position: "absolute", top: -10, right: 0, zIndex: 120 }}>
        <AppCloseButton onPress={() => onClose()} />
      </View>
      <View style={{ backgroundColor: colors.primary, paddingLeft: 4 }}>
        <View style={{ backgroundColor: colors.white }}>
          <AppText
            style={{
              maxWidth: Dimensions.get("window").width - 70,
              padding: 6,
            }}
            numberOfLines={3}
          >
            {messageData.messageBody}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: { backgroundColor: colors.danger, padding: 20 },
});
export default ReplyItem;
