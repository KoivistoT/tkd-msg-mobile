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
import { useSelector } from "react-redux";
import { getRoomImagesByRoomId } from "../../../store/msgStore";

function ShowImageModal({ image, roomId }) {
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki
  const roomImages = useSelector(getRoomImagesByRoomId(roomId)) || [];
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki

  useEffect(() => {
    setImageIndex(roomImages.findIndex((imageURL) => imageURL === image));
  }, [modalVisible]);

  const [modalVisible, setModalVisible] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save image");
  const [imageIndex, setImageIndex] = useState();

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
      alert("You need to enable permission to access the library.");
    }
  };

  const images = roomImages.map((imageURL) => {
    return { url: imageURL };
  });

  return (
    <View>
      <Modal
        onSwipeComplete={() => ended()}
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
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
          saveToLocalByLongPress={false}
          enableSwipeDown={true}
          swipeDownThreshold={150}
          index={imageIndex}
          onChange={(index) => setImageIndex(index)}
          renderIndicator={() => null}
          onSwipeDown={() => setModalVisible(false)}
          loadingRender={() => (
            <ActivityIndicator color={colors.white} size="large" />
          )}
          imageUrls={images}
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
      >
        <View>
          <Image
            transitionDuration={0}
            style={styles.image}
            resizeMode="contain"
            source={{ uri: image }}
          />
        </View>
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
  headerButtons: {
    backgroundColor: colors.white,

    padding: 10,
    flexDirection: "row",
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
    height: (250 / 16) * 9,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,

    width: 200,
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
