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
    <View style={{ marginBottom, alignSelf: "center" }}>
      {showLabel && (
        <View
          style={{
            backgroundColor: colors.primary,
            marginTop: 10,
            borderTopEndRadius: 5,
            borderTopStartRadius: 5,
          }}
        >
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
  label: {
    padding: 5,
    marginLeft: 5,
    color: colors.white,
  },
});
export default AppFormField;
