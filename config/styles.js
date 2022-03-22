import Platform from "react-native";
import colors from "./colors";

export default {
  colors, // tämä on sama kuin colors: colors
  text: {
    fontSize: 16,
    // fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: colors.dark,
  },
};
