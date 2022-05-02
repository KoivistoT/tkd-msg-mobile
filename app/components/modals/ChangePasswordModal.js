import React, { useState } from "react";

import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import ChangeRoomNameForm from "../forms/ChangeRoomNameForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import {
  selectCurrentUserId,
  selectUserName,
} from "../../../store/currentUser";
import { useStore } from "react-redux";
import AppCloseButton from "./AppCloseButton";
selectCurrentUserId;
function ChangePasswordModal({
  roomId,
  roomNameNow,
  requireCurrentPassword,
  userName,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        visible={modalVisible}
        style={styles.modal}
        transparent
        backdropOpacity={0.3}
        statusBarTranslucent
        animationType="slide"
        backdropColor="black"
      >
        <View style={styles.container}>
          <AppCloseButton
            color={colors.white}
            size={25}
            onPress={() => setModalVisible(false)}
            position="relative"
          />

          <ChangePasswordForm
            requireCurrentPassword={requireCurrentPassword}
            roomId={roomId}
            userName={userName}
            roomNameNow={roomNameNow}
            closeModal={() => setModalVisible(false)}
          />
        </View>
      </Modal>

      <AppButton
        onPress={() => setModalVisible(true)}
        backgroundColor="danger"
        title={"Change password"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    // marginHorizontal: 30,
    // marginVertical: 100,
    // marginTop: Constants.statusBarHeight,
    // paddingTop: Constants.statusBarHeight,
  },
  container: {
    backgroundColor: colors.primary,
    paddingBottom: 20,
    borderRadius: 10,
    flex: 1,
    alignSelf: "center",
    marginVertical: "5%",
    marginHorizontal: "5%",
  },
  button: {},
});
export default ChangePasswordModal;
