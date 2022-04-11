import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import AppCloseButton from "./AppCloseButton";
import ImageInputList from "./imageComponents/ImageInputList";
import SelectDocumentModal from "./modals/SelectDocumentModal";
import AppText from "./AppText";
import RemoveButton from "./RemoveButton";

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 120;

function AttachmentOptions({
  documentURL,
  setDocumentName,
  onPress,
  photos,
  documentName,
  setPhotos,
  showOptions,
}) {
  const handleRemove = (uri) => {
    setPhotos(photos.filter((imageUri) => imageUri.uri !== uri));
  };
  let _animated = new Animated.Value(0);

  const [bounceValue, setBounceValue] = useState(new Animated.Value(300));
  const rowStyles = [
    styles.row,
    {
      height: _animated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, ROW_HEIGHT],
        extrapolate: "clamp",
      }),
    },
    { opacity: _animated },
    // {
    //   transform: [
    //     { scale: _animated },
    //     // {
    //     //   rotate: _animated.interpolate({
    //     //     inputRange: [0, 1],
    //     //     outputRange: ["35deg", "0deg"],
    //     //     extrapolate: "clamp",
    //     //   }),
    //     // },
    //   ],
    // },
  ];

  console.log(
    "tässä edes takaisin https://www.codedaily.io/courses/Master-React-Native-Animations/Floating-Action-Button-with-Menu"
  );
  useEffect(() => {
    // Animated.timing(_animated, {
    //   toValue: 1,
    //   duration: ANIMATION_DURATION,
    //   useNativeDriver: true,
    showOptions
      ? Animated.timing(_animated, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }).start()
      : Animated.timing(_animated, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }).start();
  }, [showOptions]);

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
      {/* <Animated.View style={rowStyles}> */}
      {/* <AppCloseButton onPress={onPress} top={-20} /> */}
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
      {/* </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
});
export default AttachmentOptions;
