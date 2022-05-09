import React from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { selectSocket } from "../../store/socket";
import AppTouchableIcon from "./AppTouchableIcon";
function SendButton() {
  const { handleSubmit } = useFormikContext();

  const socket = useSelector(selectSocket);

  return (
    <AppTouchableIcon
      source="mci"
      activeOpacity={0.5}
      style={styles.icon}
      size={30}
      onPress={handleSubmit}
      name="send"
      color={socket ? colors.primary : colors.lightgrey}
    />
  );
}

const styles = StyleSheet.create({
  icon: { paddingHorizontal: 10, paddingVertical: 7 },
});
export default SendButton;
