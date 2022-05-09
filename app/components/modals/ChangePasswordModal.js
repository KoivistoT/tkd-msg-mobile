import React, { useState } from "react";
import { StyleSheet, Modal, View } from "react-native";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import AppCloseButton from "./AppCloseButton";

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
  container: {
    backgroundColor: colors.primary,
    paddingBottom: 20,
    borderRadius: 10,
    flex: 1,
    alignSelf: "center",
    marginVertical: "5%",
    marginHorizontal: "5%",
  },
});
export default ChangePasswordModal;
