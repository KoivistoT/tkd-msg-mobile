import React from "react";
import { View, StyleSheet } from "react-native";
import AppCloseButton from "./AppCloseButton";
import ImageInputList from "./imageComponents/ImageInputList";
import SelectDocumentModal from "./modals/SelectDocumentModal";
import AppText from "./AppText";

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
    <View>
      <AppCloseButton onPress={onPress} />

      {!documentURL.current && (
        <ImageInputList
          imageUris={photos.map((photo) => photo.uri)}
          onRemoveImage={handleRemove}
          onAddImage={handleAdd}
        />
      )}
      {documentURL.current && <AppText>{documentName}</AppText>}
      {Platform.OS == "ios" && photos.length === 0 && (
        <SelectDocumentModal
          documentURL={documentURL}
          setDocumentName={setDocumentName}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
export default AttachmentOptions;
