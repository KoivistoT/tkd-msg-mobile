import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Constants from "expo-constants";
import colors from "../../../config/colors";
import AppText from "../AppText";
import { ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useStore } from "react-redux";
import appMessages from "../../../config/appMessages";

function ShowImageModal({ image, item, onLongPress }) {
  const store = useStore();
  const { roomId } = item;
  const [modalVisible, setModalVisible] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save image");
  const [imageIndex, setImageIndex] = useState();
  const roomImages = store.getState().entities.msgStore.images[roomId] || [];

  useEffect(() => {
    if (roomImages.findIndex((imageURL) => imageURL === image) !== undefined) {
      setImageIndex(roomImages.findIndex((imageURL) => imageURL === image));
    }
  }, [roomImages]);

  const saveImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      setSaveButtonText("Image saved!");
      try {
        console.log(imageIndex, "tallentaa oikean kuvan");
        const link = roomImages[imageIndex];
        const myFolder = FileSystem.documentDirectory;
        const resp = await FileSystem.downloadAsync(
          link,
          `${myFolder}/image.jpg`
        );
        MediaLibrary.createAssetAsync(resp.uri);
      } catch (error) {
        console.log("error code 123993", error);
      }
      setTimeout(() => {
        setSaveButtonText("Save image");
      }, 800);
    } else {
      alert(appMessages.notifications.LIBRARY_PERMISSION);
    }
  };

  const images = roomImages.map((imageURL) => {
    return { url: imageURL };
  });

  const indexHeaderItem = (currentIndex) => (
    <AppText style={styles.indexHeader}>
      {`IMAGE ${currentIndex + 1}/${images.length}`}
    </AppText>
  );

  return (
    <View>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.headerButtons}
            onPress={() => saveImage()}
          >
            <MaterialCommunityIcons
              style={styles.icon}
              name="download"
              size={22}
              color={colors.black}
            ></MaterialCommunityIcons>
            <AppText style={{ color: colors.black }}>{saveButtonText}</AppText>
          </TouchableOpacity>
        </View>

        <ImageViewer
          renderHeader={(currentIndex) => indexHeaderItem(currentIndex)}
          saveToLocalByLongPress={false}
          enableSwipeDown={true}
          swipeDownThreshold={150}
          index={roomImages.findIndex((imageURL) => imageURL === image)}
          onChange={(index) => setImageIndex(index)}
          renderIndicator={() => null}
          onSwipeDown={() => setModalVisible(false)}
          useNativeDriver
          enablePreload
          loadingRender={() => (
            <ActivityIndicator color={colors.white} size="large" />
          )}
          imageUrls={images}
          style={styles.ImageViewer}
        />

        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={1}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <AppText style={styles.text}>CLOSE</AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity="0.8"
        onPress={() => setModalVisible(true)}
        onLongPress={onLongPress}
        style={styles.imageFrame}
      >
        <Image
          transitionDuration={0}
          style={[styles.image]}
          source={{ uri: image }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    marginTop: Constants.statusBarHeight,
    alignItems: "center",
  },
  ImageViewer: { backgroundColor: "black" },
  headerButtons: {
    backgroundColor: colors.white,

    padding: 10,
    flexDirection: "row",
  },
  indexHeader: {
    backgroundColor: colors.white,
    alignSelf: "center",
    marginTop: 2,
    padding: 10,
  },
  modal: {
    width: Dimensions.get("window").width,
    margin: 0,
  },
  closeButton: {
    backgroundColor: colors.white,
    alignSelf: "center",
    height: 70,

    width: Dimensions.get("window").width,
  },
  text: {
    alignSelf: "center",
    color: colors.black,
    marginTop: 10,

    fontWeight: "800",
  },
  image: {
    height: 120,
    alignSelf: "center",
    margin: 3,
    width: 110,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
  imageFrame: {
    // backgroundColor: colors.black,
    margin: 5,
    borderRadius: 10,
  },
  icon: { marginRight: 10 },
  button: {},
  loader: {
    height: (200 / 16) * 9,
    alignSelf: "center",
    marginTop: 20,
    width: 200,
    position: "absolute",

    backgroundColor: colors.white,
  },
});
export default ShowImageModal;
