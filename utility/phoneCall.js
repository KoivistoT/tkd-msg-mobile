import { Linking } from "react-native";

export default (value) => {
  return Linking.canOpenURL(`tel:${value}`).then((supported) => {
    if (supported) {
      return Linking.openURL(`tel:${value}`);
    }
  });
};
