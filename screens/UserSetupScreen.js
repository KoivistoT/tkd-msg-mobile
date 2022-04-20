import React, { useEffect, useState } from "react";

import { StyleSheet, View, Text } from "react-native";
import { useStore } from "react-redux";
import Screen from "../app/components/Screen";
import AppButton from "../app/components/AppButton";

import UserInfoCard from "../app/components/UserInfoCard";
import { selectCurrenUserId } from "../store/currentUser";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
import AutoLoginSetupButton from "../app/components/AutoLoginSetupButton";

function UserSetupScreen() {
  const store = useStore();
  const currentUserId = selectCurrenUserId(store);

  return (
    <Screen style={styles.container}>
      <UserInfoCard userId={currentUserId} isEditable={true} />
      <AutoLoginSetupButton />
      <Text>Change login data, password</Text>
      <Text>autologin off on</Text>
      <Text>Logout</Text>
      <Text>edit button tuohon yläkulmaan, jossa boxi</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
export default UserSetupScreen;
