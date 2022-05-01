import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../../config/styles";
import { useSelector } from "react-redux";
import { selectMessageFormFocus } from "../../store/general";

function AppTextInput({
  icon,
  width = "100%",
  marginTop,
  padding,
  autoFocus = false,
  defaultValue = "",
  onChangeText = null,
  ...ohterProps
}) {
  const textInput = useRef(null);
  const focus = useSelector(selectMessageFormFocus);

  useEffect(() => {
    focus ? textInput.current.focus() : textInput.current.blur();
  }, [focus]);

  return (
    <TouchableWithoutFeedback onPress={() => textInput.current.focus()}>
      <View style={[styles.container, { width, marginTop }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={defaultStyles.colors.medium}
            style={[styles.icon, { padding }]}
          />
        )}
        <View style={styles.textInputContainer[{ width }]}>
          <TextInput
            autoFocus={autoFocus}
            ref={textInput}
            onChangeText={onChangeText}
            defaultValue={defaultValue}
            placeholderTextColor={defaultStyles.colors.medium}
            style={[defaultStyles.text, { padding }]}
            {...ohterProps}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 5,
    flexDirection: "row",
    padding: 5,
  },

  icon: {
    marginRight: 10,
  },
  textInputContainer: { marginLeft: 5, marginTop: 2 },
});
export default AppTextInput;
