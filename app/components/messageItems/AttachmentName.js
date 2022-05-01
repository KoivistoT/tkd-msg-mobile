import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../../config/colors";
import AppText from "../AppText";

function AttachmentName({ documentName, photosLength, setShowOptions }) {
  const getDocumentName = () =>
    documentName
      ? documentName
      : photosLength === 1
      ? `1 photo selected`
      : `${photosLength} photos selected`;

  return (
    <TouchableOpacity
      onPress={() => setShowOptions(true)}
      style={styles.container}
    >
      <AppText style={styles.text}>{getDocumentName()}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 5, paddingLeft: 15, paddingTop: 10 },
  text: { color: colors.primary },
});

export default AttachmentName;
