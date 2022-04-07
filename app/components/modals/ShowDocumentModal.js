import React, { useEffect, useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import colors from "../../../config/colors";
import AppText from "../AppText";
import AutoHeightWebView from "react-native-autoheight-webview";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useStore } from "react-redux";
import { selectRoomImagesByRoomId } from "../../../store/msgStore";
import { WebView } from "react-native-webview";
import AppButton from "../AppButton";
import fileFuncs from "../../../utility/fileFuncs";
function ShowDocumentModal({ name, url }) {
  const [modalVisible, setModalVisible] = useState(false);
  const onClose = () => {
    setModalVisible(false);
  };

  const Spinner = () => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ActivityIndicator
        animating={true}
        size="small"
        style={{
          opacity: 1,
          marginTop: 20,
        }}
        color="#999999"
      />
    </View>
  );

  return (
    <View>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.header}>
          <AppText>{name}</AppText>
          <AppButton
            title="Save document"
            onPress={() => fileFuncs.saveFileToPhone(url, name)}
          />
        </View>

        {/* <WebView
          
          originWhitelist={["*"]}
          style={styles.container}
          renderLoading={Spinner}
          startInLoadingState={true}
          source={{
            uri: url,
          }}
        /> */}
        <AutoHeightWebView
          style={{
            width: Dimensions.get("window").width - 15,
            marginTop: 20,
            marginHorizontal: 10,
          }}
          files={[
            {
              href: "cssfileaddress",
              type: "text/css",
              rel: "stylesheet",
            },
          ]}
          source={{
            uri: url,
          }}
          scalesPageToFit={true}
          viewportContent={"width=device-width, user-scalable=no"}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onClose();
            }}
          >
            <AppText style={styles.text}>close</AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity="0.8"
        onPress={() => setModalVisible(true)}
      >
        <View>
          <AppText style={{ padding: 20 }}>{name}</AppText>
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
    paddingTop: 20,
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
  buttons: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-around",
    height: 70,
    flexDirection: "row",

    width: Dimensions.get("window").width,
  },
  text: {
    alignSelf: "center",
    color: colors.black,
    marginTop: 10,
    marginRight: 20,
    fontWeight: "600",
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
export default ShowDocumentModal;
