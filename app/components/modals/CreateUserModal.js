import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import CreateUserForm from "../forms/CreateUserForm";

function CreateUserModal() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <Screen>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: "absolute",
              right: 0,
              padding: 20,
              zIndex: 2,
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={25}
              color={colors.dark}
            />
          </TouchableOpacity>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={styles.container}
          >
            <CreateUserForm closeModal={() => setModalVisible(false)} />
          </KeyboardAvoidingView>
        </Screen>
      </Modal>
      <View style={{ alignSelf: "center", margin: 20 }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"Create new user"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
});
export default CreateUserModal;
