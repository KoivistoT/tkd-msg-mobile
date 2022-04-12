import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../../../config/colors";
import messageFuncs from "../../../utility/messageFuncs";
import AppText from "../AppText";

function MessageText({ numberOfLines, messageBody, searchWord }) {
  const [isTruncatedText, setIsTruncatedText] = useState(false);
  const [showMore, setShowMore] = useState(true);

  const message = () => (
    <AppText style={{ minWidth: 80 }}>
      {messageFuncs.autolinkText(messageBody, null, searchWord)}
    </AppText>
  );

  return isTruncatedText ? (
    <>
      <AppText numberOfLines={showMore ? numberOfLines : 0}>
        {message()}
      </AppText>
      <AppText
        onPress={() => setShowMore(!showMore)}
        style={styles.moreLessButton}
      >
        {showMore ? "Read More" : "Less"}
      </AppText>
    </>
  ) : (
    <AppText
      onTextLayout={(event) => {
        const { lines } = event.nativeEvent;
        setIsTruncatedText(lines?.length > numberOfLines);
      }}
    >
      {message()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  container: {},
  moreLessButton: {
    color: colors.secondary,
    alignSelf: "flex-end",
  },
});

export default MessageText;
