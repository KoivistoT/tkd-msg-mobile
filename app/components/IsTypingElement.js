import React from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../../config/colors";
import { useSelector } from "react-redux";
import userFuncs from "../../utility/userFuncs";
import { selectAllUsersMinimal } from "../../store/users";
import AppLoadingIndicator from "./AppLoadingIndicator";

const IsTypingElement = ({ typer }) => {
  const allUsers = useSelector(selectAllUsersMinimal);

  return (
    <View style={styles.container}>
      <AppLoadingIndicator
        text={`${userFuncs.displayName(allUsers, typer)} is typing`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,

    width: "94%",
    marginBottom: 4,
    alignSelf: "center",
    backgroundColor: colors.white,
  },
});
export default IsTypingElement;
