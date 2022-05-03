import React, { useState } from "react";
import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";
import colors from "../../../config/colors";
import ChangeRoomNameForm from "../forms/ChangeRoomNameForm";
import AppText from "../AppText";
import AppCloseButton from "./AppCloseButton";

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
        <View style={styles.container}>
          <AppCloseButton
            color={colors.white}
            onPress={() => setModalVisible(false)}
          />

          <ChangeRoomNameForm
            roomId={roomId}
            roomNameNow={roomNameNow}
            closeModal={() => setModalVisible(false)}
          />
        </View>
      </Modal>

      <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(true)}>
        <View style={styles.titleContainer}>
          <AppText numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
        </View>
        <AppText style={styles.edit}>edit name</AppText>
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
  edit: { fontSize: 16, color: colors.dark, alignSelf: "center" },
  modal: { backgroundColor: "red", flex: 1 },
  title: {
    fontSize: 20,
    alignSelf: "center",
    color: colors.dark,
    padding: 10,
  },
  titleContainer: { borderRadius: 6, backgroundColor: colors.background1 },
});
export default ChangeRoomNameModal;
