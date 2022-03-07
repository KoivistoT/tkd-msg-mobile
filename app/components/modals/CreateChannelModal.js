import React, { useState } from "react";

import Platform from "react-native";
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
import CreateChannelForm from "../forms/CreateChannelForm";

function CreateChannelModal({}) {
  console.log("käy täällä");
  const [modalVisible, setModalVisible] = useState(false);
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

          <CreateChannelForm closeModal={() => setModalVisible(false)} />
        </Screen>
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"New channel"}
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
  button: {},
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoCreateChannelModal = React.memo(CreateChannelModal, areEqual);

// export default CreateChannelModal;
