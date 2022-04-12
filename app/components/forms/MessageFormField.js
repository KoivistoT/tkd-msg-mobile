import React, { useEffect, useRef } from "react";
import { View, Text, Platform, StyleSheet, TextInput } from "react-native";

import AppTextInput from "../AppTextInput";
import { useFormikContext } from "formik";
import ErrorMessage from "../ErrorMessage";
import AppText from "../AppText";
import colors from "../../../config/colors";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { selectSocket } from "../../../store/socket";
function MessageFormField({
  name,
  width,
  showLabel = false,
  showErrorMessage = true,
  currentRoomId,
  currentUserId,
  ...otherProps
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  const isFocused = useIsFocused();
  const socket = useSelector(selectSocket);

  let isTypingSent = useRef(false);
  useEffect(() => {
    if (!socket) return;

    sendTyping();

    if (!isFocused) {
      socket.emit("notTyping", currentRoomId, currentUserId);
    }
  }, [values, isFocused]);

  const sendTyping = () => {
    if (values.message.length > 0 && !isTypingSent.current) {
      socket.emit("isTyping", currentRoomId, currentUserId);
      isTypingSent.current = true;
    }
    if (values.message.length === 0 && isTypingSent.current) {
      socket.emit("notTyping", currentRoomId, currentUserId);
      isTypingSent.current = false;
    }
  };

  return (
    <>
      {showLabel && (
        <View style={styles.labelFrame}>
          <AppText style={styles.label}>{name}</AppText>
        </View>
      )}
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      {showErrorMessage && (
        <ErrorMessage
          error={errors[name]}
          visible={touched[name]}
        ></ErrorMessage>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    alignSelf: "center",
  },
  labelFrame: {
    width: "100%",
    color: colors.primary,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.primary,
    marginTop: 10,
  },
});
export default MessageFormField;
