import React, { useState } from "react";

import Platform from "react-native";
import {
  Alert,
  StyleSheet,
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Button,
  View,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";

import AppButton from "../AppButton";

import AppText from "../AppText";
import Screen from "../Screen";
import CreateUserForm from "../forms/CreateUserForm";
import CreateRoomForm from "../forms/CreateRoomForm";

function CreateRoomModal({}) {
  const [modalVisible, setModalVisible] = useState(false);
  //huom ei react-native-modal
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

          <CreateRoomForm closeModal={() => setModalVisible(false)} />
        </Screen>
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"Create room"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    // marginHorizontal: 30,
    // marginVertical: 100,

    // marginTop: Constants.statusBarHeight,
    borderRadius: 5,
    // paddingTop: Constants.statusBarHeight,
  },
  button: {},
});
export default CreateRoomModal;