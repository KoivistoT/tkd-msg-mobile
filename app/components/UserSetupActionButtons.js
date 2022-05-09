import React from "react";
import { View, StyleSheet } from "react-native";
import { useStore } from "react-redux";
import { selectUserName } from "../../store/currentUser";
import AutoLoginSetupButton from "./AutoLoginSetupButton";
import LogoutButton from "./LogoutButton";
import ChangePasswordModal from "./modals/ChangePasswordModal";

function UserSetupActionButtons() {
  const store = useStore();
  const userName = selectUserName(store);

  return (
    <View style={styles.container}>
      <AutoLoginSetupButton />
      <ChangePasswordModal userName={userName} />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 40 },
});

export default UserSetupActionButtons;
