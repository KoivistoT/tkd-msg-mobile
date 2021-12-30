import React, { useRef } from "react";
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

function AppTextInput({ icon, width = "100%", marginTop, ...ohterProps }) {
  const textInput = useRef(null);
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
    borderRadius: 25,
    flexDirection: "row",

    padding: 15,

    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});
export default AppTextInput;
