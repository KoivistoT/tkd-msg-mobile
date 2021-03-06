import { Alert } from "react-native";

let reply = false;

export default async (
  title = "",
  text = "",
  option1 = "No",
  option2 = "Yes"
) => {
  var result = new Promise((resolve) => {
    Alert.alert(
      title,
      text,
      [
        {
          text: option1,
          onPress: () => {
            reply = false;
            resolve();
          },
          style: "cancel",
        },
        {
          text: option2,
          onPress: () => {
            reply = true;
            resolve();
          },
        },
      ],
      { cancelable: false }
    );
  });
  await Promise.resolve(result);

  return reply;
};
