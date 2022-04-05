import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import colors from "../../config/colors";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectSocket } from "../../store/socket";
function SendButton() {
  const { handleSubmit } = useFormikContext();

  const socket = useSelector(selectSocket);
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSubmit}
      color="primary"
      activeOpacity={0.5}
      // disabled={socket}
    >
      <MaterialCommunityIcons
        name="send"
        size={30}
        color={socket ? colors.primary : colors.lightgrey}
        style={{ paddingHorizontal: 10, paddingVertical: 7 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {},
  text: { color: colors.white },
});
export default SendButton;
