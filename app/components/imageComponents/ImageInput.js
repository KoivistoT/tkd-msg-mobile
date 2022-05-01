import React, { useEffect } from "react";
import { View, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../config/colors";
import ToolBarButton from "../ToolbarButton";

function ImageInput({ imageUri, onChangeImage }) {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library.");
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
        Alert.alert("Remove", "Are you sure you want to remove this image?", [
          { text: "Yes", onPress: () => onChangeImage(null) },
          { text: "No" },
        ]);
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
      if (!result.cancelled) onChangeImage(result.uri);
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const useCamera = async () => {
    try {
      const granted = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted)
        alert("You need to enable permission to access the camera.");

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.cancelled) onChangeImage(result.uri);
    } catch (error) {
      console.log("Error reading an image", error);
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
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button}
            onPress={() => handlePress("remove")}
          >
            <MaterialCommunityIcons
              style={styles.icon}
              name="close"
              color={colors.white}
              size={22}
            ></MaterialCommunityIcons>
          </TouchableOpacity>
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
