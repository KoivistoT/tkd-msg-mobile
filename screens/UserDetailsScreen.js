import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import UserInfoCard from "../app/components/UserInfoCard";
import UserDetailsActionButtons from "../app/components/UserDetailsActionButtons";

function UserDetailsScreen(item) {
  const userId = item.route.params._id;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <UserInfoCard userId={userId} />
      <UserDetailsActionButtons userId={userId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
export default UserDetailsScreen;
