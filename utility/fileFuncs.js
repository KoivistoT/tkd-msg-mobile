import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import dayjs from "dayjs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../api/firebaseClient";
import * as FileSystem from "expo-file-system";
const storage = firebaseStorage();
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
const saveImagesToFirebase = async (images) => {
  try {
    const downloadUris = [];

    var upload = new Promise((resolve) => {
      let i = 0;
      images.forEach(async (uri) => {
        const id = dayjs().format("DD.MM HH:mm:ss") + Math.random();
        const { uri: compressUri } = await compressImage(uri);
        const blob = await uriToBlob(compressUri);
        const folder = "msg-chatImages/";
        const downloadUri = await uploadToFirebase(blob, folder, id);
        downloadUris.push({ appUri: uri, downloadUri });
        i++;
        if (images.length === i) resolve();
      });
    });
    await Promise.all([upload]);

    return downloadUris;
  } catch (error) {
    console.log("error code 14992", error);
    return "error";
  }
};

const compressImage = async (uri, format = SaveFormat.JPEG) => {
  const result = await manipulateAsync(uri, [{ resize: { width: 800 } }], {
    compress: 0.5,
    format,
  });

  return {
    name: `${Date.now()}.${format}`,
    type: `image/${format}`,
    ...result,
  };
};

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

const a = [];
const uploadToFirebase = async (blob, folder, id) => {
  try {
    const storageRef = ref(storage, folder + id);
    let downloadUri = await uploadBytes(storageRef, blob).then(
      async (snapshot) => {
        return getDownloadURL(snapshot.ref);
      }
    );
    return downloadUri;
  } catch (error) {
    console.log(error, "code 299941");
  }
};

const uploadDocumentToFireBase = async (documentURL, documentName) => {
  try {
    const blob = await uriToBlob(documentURL);
    const id = documentName + dayjs().format("DD.MM HH:mm:ss") + Math.random();
    const folder = "msg-files/";
    const downloadURL = await uploadToFirebase(blob, folder, id);
    return downloadURL;
  } catch (error) {
    alert("Something faild.");
  }
};

const saveFileToPhone = async (url, name) => {
  if (Platform.OS == "ios") {
    try {
      const { uri } = await downloadResumable(url, name).downloadAsync();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const { uri } = await downloadResumable(url, name).downloadAsync();
      saveFileAsync(url, name);
    } catch (e) {
      console.error(e);
    }
  }
};

const callback = (downloadProgress) => {
  const progress =
    downloadProgress.totalBytesWritten /
    downloadProgress.totalBytesExpectedToWrite;
};

const downloadResumable = (url, name) =>
  FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + name,
    {},
    callback
  );

const saveFileAsync = async (url, name) => {
  FileSystem.downloadAsync(url, FileSystem.documentDirectory + name)
    .then(({ uri }) => {
      MediaLibrary.createAssetAsync(uri).then((asset) => {
        MediaLibrary.createAlbumAsync("msgAppFiles", asset)
          .then(() => {})
          .catch((error) => {
            console.log({
              error,
              message: "general.success",
              description: "download.failed",
              type: "danger",
            });
          });
      });
    })
    .then(() => {
      Alert.alert("", "File: " + name + " saved!", [{ text: "OK" }], {
        cancelable: false,
      });
    })
    .catch((error) => {
      Alert.alert(
        "Error",
        "File: " + name + " couldn't be saved!",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
      console.error(error);
    });
};

export default {
  saveImagesToFirebase,
  uploadDocumentToFireBase,
  saveFileToPhone,
};
