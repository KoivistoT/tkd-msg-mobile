import React from "react";

import { StyleSheet, View } from "react-native";
import Screen from "../app/components/Screen";

import UserInfoCard from "../app/components/UserInfoCard";

function UserInfoCardScreen(item) {
  return (
    <Screen style={styles.container}>
      <UserInfoCard
        userId={item.route.params}
        hideFields={["accountType", "status"]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
export default UserInfoCardScreen;
