import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

function AppKeyboardDismiss({ children }) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}

export default AppKeyboardDismiss;
