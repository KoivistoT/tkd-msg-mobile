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
      <View
        style={{
          backgroundColor: colors.primary,
          marginTop: 10,
          borderTopEndRadius: 5,
          borderTopStartRadius: 5,
          top: 70,
          width: "70%",
          alignSelf: "center",
        }}
      >
        <AppText
          style={{
            padding: 5,
            marginLeft: 5,
            color: colors.white,
            alignSelf: "center",
          }}
        >
          {otherProps.placeholder}
        </AppText>
      </View>
      <View style={{ width: "70%", alignSelf: "center", top: 30 }}>
        <Picker
          onBlur={() => setFieldTouched(name)}
          selectedValue={values[name]}
          onValueChange={(itemValue) => setFieldValue(name, itemValue)}
        >
          {options.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]}></ErrorMessage>
    </>
  );
}

const styles = StyleSheet.create({});
export default AppFormPicker;
