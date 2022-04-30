import Autolink from "react-native-autolink";
import { Linking } from "react-native";
const autolinkText = (messageBody, style, searchWord) => {
  var searchWordRexExp = "";

  if (searchWord) {
    searchWordRexExp = new RegExp(searchWord + "(.*?)", "i");
  }

  return (
    <Autolink
      style={style}
      text={messageBody}
      matchers={[
        {
          //this is for italic
          pattern: /\_(.*?)\_/,
          style: { fontStyle: "italic" },
          getLinkText: (replacerArgs) => `${replacerArgs[1]}`,
        },
        {
          //this is for bolding
          pattern: /\*(.*?)\*/,
          style: { fontWeight: "bold" },
          getLinkText: (replacerArgs) => `${replacerArgs[1]}`,
        },
        {
          //this is for searchword
          pattern: new RegExp(searchWordRexExp),
          style: { color: "red", fontWeight: "bold" },
        },
        {
          pattern:
            /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g,
          style: { color: "blue" },
          onPress: (match) => {
            const phoneNumber = match.replacerArgs[0];

            Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
              if (!supported) {
              } else {
                return Linking.openURL(`tel:${phoneNumber}`);
              }
            });
          },
        },
      ]}
    />
  );
};

const getLastSeenMessage = (state, currentRoomId, currentRoomMessageSum) => {
  const lastSeenObject =
    state.auth.currentUser.last_seen_messages[
      state.auth.currentUser.last_seen_messages.findIndex(
        (object) => object.roomId === currentRoomId
      )
    ];

  const lastSeenSumBefore = lastSeenObject?.lastSeenMessageSum || 0;

  return currentRoomMessageSum - lastSeenSumBefore;
};

export default {
  autolinkText,
  getLastSeenMessage,
};
