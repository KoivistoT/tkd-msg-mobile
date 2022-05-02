import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import colors from "../../../config/colors";
import AppText from "../AppText";
import { WebView } from "react-native-webview";
import ToolBarButton from "../ToolbarButton";
import RemoveButton from "../RemoveButton";

function SelectDocumentModal({
  documentURL,
  documentName,
  setDocumentName,
  showRemoveButton,
  buttonName,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const pickDocument = async () => {
    if (documentURL.current) {
      setModalVisible(true);
      return;
    }

    try {
      let result = await DocumentPicker.getDocumentAsync({});

      if (result.type !== "cancel") {
        documentURL.current = result.uri;
        setDocumentName(result.name);
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

        <WebView
          originWhitelist={["*"]}
          style={styles.webView}
          javaScriptEnabled={true}
          source={{
            url: documentURL.current,
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
          text={buttonName || "Select document"}
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
  webView: { flex: 1 },
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
