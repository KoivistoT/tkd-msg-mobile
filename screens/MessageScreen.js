import React, { useState } from "react";
import MessageForm from "../app/components/MessageForm";
import Screen from "../app/components/Screen";
import MessageList from "../app/components/MessageList";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
function MessageScreen(item) {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={styles.container}
      keyboardVerticalOffset={60}
    >
      <MessageList
        item={item}
        showSearchBar={showSearchBar}
        setShowSearchBar={() => setShowSearchBar((prevState) => !prevState)}
      />
      <MessageForm
        item={item}
        setShowSearchBar={() => setShowSearchBar((prevState) => !prevState)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
});

export default MessageScreen;
