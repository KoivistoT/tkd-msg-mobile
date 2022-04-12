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
import { useSelector, useStore } from "react-redux";
import { selectRoomImagesByRoomId } from "../../../store/msgStore";
import { selectAllUsersMinimal } from "../../../store/users";
import userFuncs from "../../../utility/userFuncs";
import timeFuncs from "../../../utility/timeFuncs";

function ShowImageModal({ image, item }) {
  const { roomId, createdAt, postedByUser } = item;

  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki, paitsi sitten ei indexit tule oikein, jos ei heti ole
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki, paitsi sitten ei indexit tule oikein, jos ei heti ole
  // const roomImages = useSelector(selectRoomImagesByRoomId(roomId)) || [];
  // console.log(roomImages.length);
  const store = useStore();
  const roomImages = store.getState().entities.msgStore.images[roomId] || [];
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki, paitsi sitten ei indexit tule oikein, jos ei heti ole
  // tämä voisi olla myös vain store haku. Testaa, kun tulee uusi kuva tämän ollessa auki, paitsi sitten ei indexit tule oikein, jos ei heti ole
  const allUsers = useSelector(selectAllUsersMinimal);

  useEffect(() => {
    if (roomImages.findIndex((imageURL) => imageURL === image) !== undefined) {
      setImageIndex(roomImages.findIndex((imageURL) => imageURL === image));
    }
  }, [roomImages]);

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

  const indexHeaderItem = (currentIndex) => (
    <AppText style={styles.indexHeader}>
      {`IMAGE ${currentIndex + 1}/${images.length}`}
    </AppText>
  );

  return (
    <View>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.header}>
          {/* <AppText
            style={{ alignSelf: "center", marginTop: 6 }}
          >{`${userFuncs.getFullName(
            allUsers,
            postedByUser
          )}  ${timeFuncs.getDateAndTime(createdAt)}`}</AppText> */}
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
      >
        <View style={styles.imageFrame}>
          <Image
            transitionDuration={0}
            style={[
              styles.image,

              // {
              //   transform: [
              //     {
              //       rotate: Math.floor(createdAt.slice(17, 19) - 30) + "deg",
              //     },
              //   ],
              // },
            ]}
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
    margin: 5,
    width: 120,
    backgroundColor: colors.black,
    borderRadius: 10,
  },
  imageFrame: {},
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
