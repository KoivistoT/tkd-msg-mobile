import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { useStore } from "react-redux";
import Screen from "../app/components/Screen";
import AppButton from "../app/components/AppButton";
import Constants from "expo-constants";
import UserInfoCard from "../app/components/UserInfoCard";
import { selectCurrentUserId, selectUserName } from "../store/currentUser";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
import AutoLoginSetupButton from "../app/components/AutoLoginSetupButton";
import LogoutButton from "../app/components/LogoutButton";
import ChangePasswordModal from "../app/components/modals/ChangePasswordModal";

function UserSetupScreen() {
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const userName = selectUserName(store);
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : ""}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <UserInfoCard userId={currentUserId} isEditable={true} />
          <View style={{ marginBottom: 40 }}>
            <AutoLoginSetupButton />
            <ChangePasswordModal userName={userName} />
            <LogoutButton />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: "center",
    padding: 20,
  },
});
export default UserSetupScreen;
