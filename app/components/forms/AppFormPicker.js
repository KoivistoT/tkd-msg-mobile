import React, { useState } from "react";
import { View, Text, Platform, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AppTextInput from "../AppTextInput";
import { useFormikContext } from "formik";
import ErrorMessage from "../ErrorMessage";
import AppText from "../AppText";
import colors from "../../../config/colors";

function AppFormPicker({ name, width, options, ...otherProps }) {
  //   const [selectedAccountType, setSelectedAccountType] = useState("worker");
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <AppText style={{ color: colors.primary, alignSelf: "center" }}>
        {otherProps.placeholder}
      </AppText>
      <Picker
        onBlur={() => setFieldTouched(name)}
        selectedValue={values[name]}
        onValueChange={(itemValue) => setFieldValue(name, itemValue)}
      >
        {options.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>

      <ErrorMessage error={errors[name]} visible={touched[name]}></ErrorMessage>
    </>
  );
}

const styles = StyleSheet.create({});
export default AppFormPicker;
