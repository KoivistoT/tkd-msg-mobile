import React, { useState } from "react";

import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import ChangeRoomNameForm from "../forms/ChangeRoomNameForm";

function ChangeRoomNameModal({ roomId, roomNameNow }) {
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

          <ChangeRoomNameForm
            roomId={roomId}
            roomNameNow={roomNameNow}
            closeModal={() => setModalVisible(false)}
          />
        </Screen>
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"Change channel name"}
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
export default ChangeRoomNameModal;
