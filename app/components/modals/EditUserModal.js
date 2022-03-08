import React, { useState } from "react";

import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import EditUserForm from "../forms/EditUserForm";
import { useSelector } from "react-redux";
import { selectUserById } from "../../../store/users";

function EditUserModal({ userId }) {
  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector(selectUserById(userId));

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <Screen>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ position: "relative", alignSelf: "flex-end", padding: 20 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={25}
              color={colors.dark}
            />
          </TouchableOpacity>
          <EditUserForm
            userData={userData}
            closeModal={() => setModalVisible(false)}
          />
        </Screen>
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton onPress={() => setModalVisible(true)} title={"Edit user"} />
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
});
export default EditUserModal;
