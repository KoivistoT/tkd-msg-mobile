import React, { useState } from "react";
import { StyleSheet, Modal, View, KeyboardAvoidingView } from "react-native";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import CreateUserForm from "../forms/CreateUserForm";
import AppCloseButton from "./AppCloseButton";

function CreateUserModal() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <Screen>
          <AppCloseButton onPress={() => setModalVisible(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={styles.container}
          >
            <CreateUserForm closeModal={() => setModalVisible(false)} />
          </KeyboardAvoidingView>
        </Screen>
      </Modal>
      <AppButton
        onPress={() => setModalVisible(true)}
        title={"Create new user"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
});
export default CreateUserModal;
