import React, { useState } from "react";

import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import Screen from "../Screen";
import ChangeRoomNameForm from "../forms/ChangeRoomNameForm";
import { useSelector } from "react-redux";
import { selectRoomLoading } from "../../../store/rooms";
import AppText from "../AppText";

function ChangeRoomNameModal({ roomId, title, roomNameNow }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        visible={modalVisible}
        transparent
        backdropOpacity={0.3}
        statusBarTranslucent
        animationType="slide"
        style={styles.modal}
      >
        {/* <View style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", flex: 1 }}> */}
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: "relative",
              alignSelf: "flex-end",
              padding: 20,
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={25}
              color={colors.white}
            />
          </TouchableOpacity>

          <ChangeRoomNameForm
            roomId={roomId}
            roomNameNow={roomNameNow}
            closeModal={() => setModalVisible(false)}
          />
          {/* </View> */}
        </View>
      </Modal>

      <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(true)}>
        <View style={{ borderRadius: 6, backgroundColor: colors.primary }}>
          <AppText
            style={{
              fontSize: 20,
              color: colors.white,
              padding: 10,
            }}
          >
            {title}
          </AppText>
        </View>
        <AppText
          style={{ fontSize: 16, color: colors.dark, alignSelf: "center" }}
        >
          edit name
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingBottom: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: "30%",
    marginHorizontal: "5%",
  },
  modal: { backgroundColor: "red", flex: 1 },
  button: {},
});
export default ChangeRoomNameModal;
