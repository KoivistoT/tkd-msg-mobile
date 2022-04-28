import { Linking } from "react-native";

export default phoneCall = (value) =>
  Linking.canOpenURL(`tel:${value}`).then((supported) => {
    if (!supported) {
    } else {
      return Linking.openURL(`tel:${value}`);
    }
  });
