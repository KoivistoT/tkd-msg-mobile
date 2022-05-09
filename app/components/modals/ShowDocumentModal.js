import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import Constants from "expo-constants";
import colors from "../../../config/colors";
import AppText from "../AppText";
import AutoHeightWebView from "react-native-autoheight-webview";
import AppButton from "../AppButton";
import fileFuncs from "../../../utility/fileFuncs";

function ShowDocumentModal({ name, url, disapleOnPress = false }) {
  const [modalVisible, setModalVisible] = useState(false);
  const onClose = () => {
    setModalVisible(false);
  };

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

        <AutoHeightWebView
          style={styles.webView}
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
      {disapleOnPress && <View style={styles.cover} />}
      <TouchableOpacity
        activeOpacity="0.8"
        onPress={() => setModalVisible(true)}
      >
        <AppText style={styles.text}>{name}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    position: "absolute",
    opacity: 0,
    flex: 1,
    backgroundColor: "red",
    zIndex: 2,
    height: "100%",
    width: "100%",
  },
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
  loader: {
    height: (200 / 16) * 9,
    alignSelf: "center",
    marginTop: 20,
    width: 200,
    position: "absolute",

    backgroundColor: colors.white,
  },
  webView: {
    width: Dimensions.get("window").width - 15,
    marginTop: 20,
    marginHorizontal: 10,
  },
});
export default ShowDocumentModal;
