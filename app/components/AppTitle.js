import React from "react";
import { Text, StyleSheet } from "react-native";
import defaultStyles from "../../config/styles";

function AppTitle({ children, fontWeight = "700", style, ...otherProps }) {
  return (
    <Text style={[styles.title, style, { fontWeight }]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { alignSelf: "center", marginTop: 20, marginBottom: 10, fontSize: 16 },
});

export default AppTitle;
