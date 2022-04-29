import React from "react";
import { View, StyleSheet, Image } from "react-native";
import colors from "../config/colors";

function AppSplashScreen(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/splash.png")}
        defaultSource={require("../assets/splash.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: colors.white,
    zIndex: 2,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
});

export default AppSplashScreen;
