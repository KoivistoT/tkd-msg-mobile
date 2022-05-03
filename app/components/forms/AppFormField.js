import React from "react";
import { View, Text, Platform, StyleSheet, TextInput } from "react-native";

import AppTextInput from "../AppTextInput";
import { useFormikContext } from "formik";
import ErrorMessage from "../ErrorMessage";
import AppText from "../AppText";
import colors from "../../../config/colors";

function AppFormField({
  name,
  width,
  showLabel = false,
  marginBottom,
  padding,
  showErrorMessage = true,
  autoFocus = false,
  ...otherProps
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <View style={[styles.container, { marginBottom }]}>
      {showLabel && (
        <View style={styles.text}>
          <AppText style={styles.label}>{name}</AppText>
        </View>
      )}
      <AppTextInput
        autoFocus={autoFocus}
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        padding={padding}
        {...otherProps}
      />
      {showErrorMessage && (
        <ErrorMessage
          error={errors[name]}
          visible={touched[name]}
        ></ErrorMessage>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: "center" },
  label: {
    padding: 5,
    marginLeft: 5,
    color: colors.white,
  },
  text: {
    backgroundColor: colors.primary,
    marginTop: 10,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
});
export default AppFormField;
