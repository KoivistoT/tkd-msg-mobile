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
import { StorageAccessFramework } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useStore } from "react-redux";
import { selectRoomImagesByRoomId } from "../../../store/msgStore";
import { WebView } from "react-native-webview";
import ToolBarButton from "../ToolbarButton";
import RemoveButton from "../RemoveButton";

function SelectDocumentModal({
  documentURL,
  documentName,
  setDocumentName,
  showRemoveButton,
  buttonName = "Select document",
}) {
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

  const onRemove = () => {
    documentURL.current = null;
    setDocumentName(null);
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
        {/* 
        <WebView
          originWhitelist={["*"]}
          style={styles.container}
          // renderLoading={Spinner}
          // startInLoadingState={true}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/test2-6663b.appspot.com/o/msg-files%2Fexercise.txt30.03%2011%3A59%3A280.8865077095855219?alt=media&token=42ac90dc-3d4a-4934-87c3-3a50f3b3fe36",
          }}
        /> */}
        <WebView
          originWhitelist={["*"]}
          style={{ flex: 1 }}
          // renderLoading={Spinner}
          javaScriptEnabled={true}
          // startInLoadingState={true}
          source={{
            url: documentURL.current,
            // url: "file://content://com.android.providers.downloads.documents/document/5625",
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

      <View style={styles.documentButtons}>
        <ToolBarButton
          onPress={() => pickDocument()}
          icon="file-document"
          text={buttonName}
        />
        {showRemoveButton && (
          <RemoveButton text="REMOVE" onPress={() => onRemove()} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    marginTop: Constants.statusBarHeight,
    alignItems: "center",
  },
  documentButtons: { flexDirection: "row" },
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
