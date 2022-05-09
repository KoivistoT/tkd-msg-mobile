import React from "react";
import { useFormikContext } from "formik";
import AppButton from "../AppButton";

function SubmitButton({ title, buttonWidth, backgroundColor, color, style }) {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      style={style}
      color={color}
      backgroundColor={backgroundColor}
      buttonWidth={buttonWidth}
      title={title}
      onPress={handleSubmit}
    />
  );
}

export default SubmitButton;
