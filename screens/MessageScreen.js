import React from "react";
import MessageForm from "../app/components/MessageForm";
import MessageList from "../app/components/MessageList";
import { KeyboardAvoidingView, StyleSheet, Platform } from "react-native";

function MessageScreen(item) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={styles.container}
      keyboardVerticalOffset={60}
    >
      <MessageList item={item} />
      <MessageForm item={item} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
});

export default MessageScreen;
