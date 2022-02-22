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
function SendButton() {
  const { handleSubmit } = useFormikContext();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSubmit}
      color="primary"
      activeOpacity={0.5}
    >
      <MaterialCommunityIcons
        name="send"
        size={30}
        color={colors.primary}
        style={{ padding: 15, paddingLeft: 10 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    top: -15,
    // borderRadius: 15,
    // paddingBottom: 20,
    // marginLeft: 10,
  },
  text: { color: colors.white },
});
export default SendButton;
