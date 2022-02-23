import React, { useState, useEffect, useRef } from "react";

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

function ShowImageModal({ imageURLs, image }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState("");

  const [saveButtonText, setSaveButtonText] = useState("Save image");

  const saveImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      setSaveButtonText("Image saved!");
      try {
        // const date = dayjs().format("DD.MM HH:mm:ss SSS");

        const link = image;
        const myFolder = FileSystem.documentDirectory;
        const resp = await FileSystem.downloadAsync(
          link,
          `${myFolder}/image.jpg`
        );
        const assetLink = await MediaLibrary.createAssetAsync(resp.uri);
        // console.log(assetLink);
      } catch (error) {
        console.log("error", error);
      }
      setTimeout(() => {
        setSaveButtonText("Save image");
      }, 800);
    } else {
      alert("You need to enable permission to access the library.");
    }
  };

  const ended = () => {
    setModalVisible(false);
  };
  // const a = async () => {
  //   const kk = await ScreenOrientation.getOrientationAsync();
  //   console.log("kkk" + kk);
  // };
  // a();
  // console.log("https://reactnavigation.org/docs/hiding-tabbar-in-screens/");
  const images = [
    {
      // Simplest usage.
      url: imageURLs,
      // url: fileUrl,
      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {},
    },
  ];

  return (
    <View>
      <Modal
        // statusBarTranslucent={true}
        // supportedOrientations={["portrait", "landscape-right"]}

        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        // hideModalContentWhileAnimating
        // animationType="none"
        // animationInTiming={0}
      >
        {/* {fileType == "mp4" && <VideoMessage uri={fileUrl} />} */}

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

        {/* {fileType == "jpg" && ( */}
        <ImageViewer
          saveToLocalByLongPress={false}
          enableSwipeDown={true}
          swipeDownThreshold={150}
          renderIndicator={() => null}
          onSwipeDown={() => setModalVisible(false)}
          loadingRender={() => (
            <ActivityIndicator
              // style={styles.loader}
              color={colors.white}
              size="large"
            />
          )}
          imageUrls={images}
        />
        {/* )} */}

        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.white,
              alignSelf: "center",
              height: 70,

              width: Dimensions.get("window").width,
            }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <AppText
              style={{
                alignSelf: "center",
                color: colors.black,
                marginTop: 10,

                fontWeight: "800",
              }}
            >
              CLOSE
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity="0.8"
        onPress={() => setModalVisible(true)}
        // onPress={() => console.log("jlj")}
      >
        <View>
          {/* {loading && (
            <ActivityIndicator
              style={styles.loader}
              color={colors.black}
              size="small"
            />
          )} */}
          <Image
            transitionDuration={0}
            style={{
              height: (250 / 16) * 9,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 5,

              width: 200,
            }}
            onLoadEnd={() => setLoading(false)}
            resizeMode="contain"
            // tint="light"
            // preview={{
            //   uri:
            //     "https://riverchurch.fi/wp-content/uploads/2020/12/logo_black_small.png",
            // }}
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
    // width: "50%",

    padding: 10,
    // backgroundColor: "red",
    flexDirection: "row",
  },
  modal: {
    // height: Dimensions.get("window").height ,

    width: Dimensions.get("window").width,

    margin: 0,
    // marginTop: Constants.statusBarHeight,
    // borderRadius: 4,
    // paddingTop: Constants.statusBarHeight,
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
