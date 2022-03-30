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
import * as DocumentPicker from "expo-document-picker";
import colors from "../../../config/colors";
import AppText from "../AppText";
import { ActivityIndicator } from "react-native";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useStore } from "react-redux";
import { selectRoomImagesByRoomId } from "../../../store/msgStore";
import { WebView } from "react-native-webview";

function SelectDocumentModal({ documentURL, documentName, setDocumentName }) {
  const [modalVisible, setModalVisible] = useState(false);

  //nämä file funcsiin!!!
  const pickDocument = async () => {
    if (documentURL.current) {
      setModalVisible(true);
      return;
    }
    try {
      let result = await DocumentPicker.getDocumentAsync({
        // type: "application/pdf",
        // copyToCacheDirectory: false,
      });

      if (result.type !== "cancel") {
        console.log(result, "Tässä resultti");
        documentURL.current = result.uri;
        setDocumentName(result.name);
        // const nameWithTime = name + " " + dayjs().format("DD.MM HH:mm:ss");
        // setDocumentName(nameWithTime);
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error, "pdfviewer error");
    }
  };

  const onCancel = () => {
    documentURL.current = null;
    setDocumentName(null);
    setModalVisible(false);

    setTimeout(() => {
      pickDocument();
    }, 800);
  };
  const onAddDocument = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.header}>
          <AppText>{documentName}</AppText>
        </View>

        <WebView
          originWhitelist={["file://"]}
          style={{ flex: 1, backgroundColor: "red" }}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccess={true}
          source={{
            url: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dev_koivisto%252Fmsg-mobile/DocumentPicker/9e3dfe2d-f1f4-4aed-8592-1b58f3f1b192.pdf",
            // url: documentURL.current,
          }}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onAddDocument();
            }}
          >
            <AppText style={styles.text}>Add</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onCancel();
            }}
          >
            <AppText style={styles.text}>Cancel</AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity="0.8"
        // onPress={() => setModalVisible(true)}
        onPress={() => pickDocument()}
      >
        <View>
          <AppText style={{ padding: 20 }}>doc</AppText>
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
export default SelectDocumentModal;
