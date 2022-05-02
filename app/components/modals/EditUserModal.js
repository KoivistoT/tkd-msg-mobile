import React, { useState } from "react";
import { StyleSheet, Modal, View, KeyboardAvoidingView } from "react-native";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import EditUserForm from "../forms/EditUserForm";
import { useSelector } from "react-redux";
import { selectUserById } from "../../../store/users";
import AppCloseButton from "./AppCloseButton";

function EditUserModal({ userId, hideFields = [], title = "Edit user" }) {
  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector(selectUserById(userId));

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <AppCloseButton onPress={() => setModalVisible(false)} top={40} />

        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : ""}
          style={styles.container}
        >
          <EditUserForm
            hideFields={hideFields}
            userData={userData}
            closeModal={() => setModalVisible(false)}
          />
        </KeyboardAvoidingView>
      </Modal>

      <AppButton onPress={() => setModalVisible(true)} title={title} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
});
export default EditUserModal;
