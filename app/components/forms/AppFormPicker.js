import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFormikContext } from "formik";
import ErrorMessage from "../ErrorMessage";
import AppText from "../AppText";
import colors from "../../../config/colors";

function AppFormPicker({ name, width, options, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <View style={styles.container}>
        <AppText style={styles.text}>{otherProps.placeholder}</AppText>
      </View>
      <View style={styles.picker}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    marginTop: 10,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    top: 70,
    width: "70%",
    alignSelf: "center",
  },
  text: {
    padding: 5,
    marginLeft: 5,
    color: colors.white,
    alignSelf: "center",
  },
  picker: { width: "70%", alignSelf: "center", top: 30 },
});
export default AppFormPicker;
