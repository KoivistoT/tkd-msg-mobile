import React, { useState } from "react";

import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import EditUserForm from "../forms/EditUserForm";
import { useSelector } from "react-redux";
import { selectUserById } from "../../../store/users";

function EditUserModal({ userId, hideFields = [], title = "Edit user" }) {
  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector(selectUserById(userId));

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            padding: 20,
            top: 10,
            zIndex: 2,
          }}
        >
          <MaterialCommunityIcons name="close" size={25} color={colors.dark} />
        </TouchableOpacity>
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
      <View style={{ width: "50%", alignSelf: "center" }}>
        <AppButton onPress={() => setModalVisible(true)} title={title} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  button: {},
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
export default EditUserModal;
