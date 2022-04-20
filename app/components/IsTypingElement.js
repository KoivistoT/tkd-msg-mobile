import React from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../../config/colors";
import { useSelector } from "react-redux";
import userFuncs from "../../utility/userFuncs";
import { selectAllUsersMinimal } from "../../store/users";
import AppLoadingIndicator from "./AppLoadingIndicator";
import AppText from "./AppText";

const IsTypingElement = ({ typer }) => {
  const allUsers = useSelector(selectAllUsersMinimal);

  return (
    <View style={styles.container}>
      <AppText style={styles.name}>{`${userFuncs.displayName(
        allUsers,
        typer
      )}`}</AppText>
      <AppLoadingIndicator text={` is typing`} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 12,
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomRightRadius: 5,
    // shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  name: {
    color: colors.secondary,
  },
});
export default IsTypingElement;
