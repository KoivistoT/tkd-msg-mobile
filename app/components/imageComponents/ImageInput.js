import React, { useEffect } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../config/colors";
import ToolBarButton from "../ToolbarButton";
import AppTouchableIcon from "../AppTouchableIcon";
import appMessages from "../../../config/appMessages";
import { useDispatch } from "react-redux";
import { errorMessageAdded } from "../../../store/general";

function ImageInput({ imageUri, onChangeImage }) {
  const dispatch = useDispatch();
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      alert(appMessages.notifications.LIBRARY_PERMISSION);
    }
  };

  const handlePress = (select) => {
    switch (select) {
      case "image":
        selectImage();
        break;
      case "camera":
        useCamera();
        break;
      case "remove":
        Alert.alert(
          appMessages.questions.REMOVE_IMAGE.title,
          appMessages.questions.REMOVE_IMAGE.body,
          [{ text: "Yes", onPress: () => onChangeImage(null) }, { text: "No" }]
        );
        break;
      default:
        break;
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        onChangeImage(result.uri);
      }
    } catch (error) {}
  };

  const useCamera = async () => {
    try {
      const granted = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        alert(appMessages.notifications.CAMERA_PERMISSION);
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.cancelled) {
        onChangeImage(result.uri);
      }
    } catch (error) {
      dispatch(errorMessageAdded("Error reading an image"));
    }
  };

  return (
    <>
      {!imageUri && (
        <View>
          <ToolBarButton
            onPress={() => handlePress("image")}
            icon="image-plus"
            text="Add image"
          />

          <ToolBarButton
            onPress={() => handlePress("camera")}
            icon="camera"
            text="Take photo"
          />
        </View>
      )}
      {imageUri && (
        <View style={{ padding: 5 }}>
          <AppTouchableIcon
            source="mci"
            name="close"
            color={colors.white}
            size={18}
            style={styles.icon}
            containerStyle={styles.button}
            onPress={() => handlePress("remove")}
          />

          <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 15,
    height: 100,
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
    width: 100,
  },
  icon: {
    padding: 4,
    borderRadius: 10,
  },
  button: {
    position: "absolute",
    top: 5,
    right: 0,
    zIndex: 1,
    borderRadius: 10,
    backgroundColor: colors.black,
  },
  buttons: {
    marginLeft: 5,
    borderRadius: 15,
    height: 80,
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
    width: "110%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});

export default ImageInput;
