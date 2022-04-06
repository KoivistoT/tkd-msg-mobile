import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AppCloseButton from "./AppCloseButton";
import ImageInputList from "./imageComponents/ImageInputList";
import SelectDocumentModal from "./modals/SelectDocumentModal";
import AppText from "./AppText";
import RemoveButton from "./RemoveButton";

function AttachmentOptions({
  documentURL,
  setDocumentName,
  onPress,
  photos,
  documentName,
  setPhotos,
}) {
  const handleRemove = (uri) => {
    setPhotos(photos.filter((imageUri) => imageUri.uri !== uri));
  };

  const handleAdd = (uri) => {
    setPhotos([
      ...photos,
      {
        name: "IMG" + Math.random(),
        type: "image/jpg",
        uri: uri,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppCloseButton onPress={onPress} />
      {!documentURL.current && (
        <ImageInputList
          imageUris={photos.map((photo) => photo.uri)}
          onRemoveImage={handleRemove}
          onAddImage={handleAdd}
        />
      )}

      {Platform.OS == "ios" && photos.length === 0 && (
        <SelectDocumentModal
          documentURL={documentURL}
          setDocumentName={setDocumentName}
          showRemoveButton={documentName ? true : false}
          buttonName={documentName}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
  documentName: { backgroundColor: "red" },
});
export default AttachmentOptions;
