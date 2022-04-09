import React from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../../config/colors";
import { useSelector } from "react-redux";
import userFuncs from "../../utility/userFuncs";
import { selectAllUsersMinimal } from "../../store/users";

const IsTypingElement = ({ typer }) => {
  const allUsers = useSelector(selectAllUsersMinimal);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${userFuncs.displayName(allUsers, typer)} is typing...(tähän dot
        activity indicator)`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: "94%",
    marginBottom: 4,
    alignSelf: "center",
    backgroundColor: colors.white,
  },
  text: {
    alignSelf: "center",
    color: colors.primary,
  },
});
export default IsTypingElement;
