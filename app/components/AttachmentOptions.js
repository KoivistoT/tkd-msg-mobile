import React from "react";
import { View, StyleSheet } from "react-native";
import ImageInputList from "./imageComponents/ImageInputList";
import SelectDocumentModal from "./modals/SelectDocumentModal";

function AttachmentOptions({
  documentURL,
  setDocumentName,
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
});
export default AttachmentOptions;
