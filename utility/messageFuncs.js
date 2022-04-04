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
      // Required: the text to parse for links
      // text="This is the string to parse for urls (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@example.com), mentions/handles (@twitter), and hashtags (#exciting)"
      // Optional: enable email linking
      text={messageBody}
      // email
      // Optional: enable hashtag linking to instagram
      // hashtag="instagram"
      // Optional: enable @username linking to twitter
      // mention="twitter"
      // Optional: enable phone linking
      // phone="true"
      // Optional: enable URL linking
      // url
      // Optional: custom linking matchers
      matchers={[
        {
          // //this is for italic
          pattern: /\_(.*?)\_/,
          style: { fontStyle: "italic" },
          getLinkText: (replacerArgs) => `${replacerArgs[1]}`,
        },
        {
          // //this is for bolding
          pattern: /\*(.*?)\*/,
          style: { fontWeight: "bold" },
          getLinkText: (replacerArgs) => `${replacerArgs[1]}`,
        },
        {
          //   // //this is for searchword

          pattern: new RegExp(searchWordRexExp),
          style: { color: "red", fontWeight: "bold" },
          // getLinkText: (replacerArgs) => `${replacerArgs[1]}`,
        },
        {
          pattern:
            /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g,
          style: { color: "blue" },
          // getLinkText: (replacerArgs) => `@${replacerArgs[1]}`,
          onPress: (match) => {
            const phoneNumber = match.replacerArgs[0];

            Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
              if (!supported) {
                // handle the error
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
