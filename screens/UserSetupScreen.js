import React from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useStore } from "react-redux";
import UserInfoCard from "../app/components/UserInfoCard";
import { selectCurrentUserId } from "../store/currentUser";
import UserSetupActionButtons from "../app/components/UserSetupActionButtons";

function UserSetupScreen() {
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserInfoCard userId={currentUserId} isEditable={true} />
        <UserSetupActionButtons />
      </ScrollView>
    </KeyboardAvoidingView>
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
