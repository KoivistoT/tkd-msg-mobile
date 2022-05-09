import React, { useState } from "react";
import { StyleSheet } from "react-native";
import colors from "../../../config/colors";
import messageFuncs from "../../../utility/messageFuncs";
import AppText from "../AppText";

function MessageText({
  numberOfLines,
  messageBody,
  searchWord,
  showMore,
  setShowMore,
}) {
  const [isTruncatedText, setIsTruncatedText] = useState(false);

  const onTextLayout = (event) => {
    const { lines } = event.nativeEvent;
    setIsTruncatedText(lines?.length > numberOfLines);
  };

  const message = () => (
    <AppText>
      {messageFuncs.autolinkText(messageBody, null, searchWord)}
    </AppText>
  );

  const getNumberOfLines = (isThereMoreLinesToShow, currentNumberOfLines) => {
    if (isThereMoreLinesToShow) {
      return currentNumberOfLines;
    } else {
      return 0;
    }
  };

  const getButtonText = (isThereMoreLinesToShow) => {
    if (isThereMoreLinesToShow) {
      return "Read More";
    } else {
      return "Less";
    }
  };

  return isTruncatedText ? (
    <>
      <AppText numberOfLines={getNumberOfLines(showMore, numberOfLines)}>
        {message()}
      </AppText>
      <AppText
        onPress={() => setShowMore(!showMore)}
        style={styles.moreLessButton}
      >
        {getButtonText(showMore)}
      </AppText>
    </>
  ) : (
    <AppText onTextLayout={onTextLayout}>{message()}</AppText>
  );
}

const styles = StyleSheet.create({
  moreLessButton: {
    color: colors.secondary,
    alignSelf: "flex-end",
  },
});

export default MessageText;
