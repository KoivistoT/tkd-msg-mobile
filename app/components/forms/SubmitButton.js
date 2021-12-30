import React from "react";
import { View, Text, Platform, StyleSheet, TextInput } from "react-native";

import { useFormikContext } from "formik";
import AppButton from "../AppButton";

function SubmitButton({ title, buttonWidth }) {
  const { handleSubmit } = useFormikContext();
  return (
    <AppButton buttonWidth={buttonWidth} title={title} onPress={handleSubmit} />
  );
}

const styles = StyleSheet.create({});
export default SubmitButton;
