import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../../config/styles";
import { useSelector } from "react-redux";
import { selectMessageFormFocus } from "../../store/general";

function AppTextInput({ icon, width = "100%", marginTop, ...ohterProps }) {
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
            style={styles.icon}
          />
        )}
        <View style={{ width: "100%" }}>
          <TextInput
            ref={textInput}
            placeholderTextColor={defaultStyles.colors.medium}
            style={defaultStyles.text}
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
});
export default AppTextInput;
