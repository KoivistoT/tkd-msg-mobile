import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import dayjs from "dayjs";
import {
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { firebaseStorage } from "../api/firebaseClient";

const storage = firebaseStorage();

const saveImagesToFirebase = async (images) => {
  try {
    const downloadUris = [];

    var upload = new Promise((resolve) => {
      let i = 0;
      images.forEach(async (uri) => {
        const id = dayjs().format("DD.MM HH:mm:ss") + Math.random();
        const { uri: compressUri } = await compressImage(uri);
        const blob = await uriToBlob(compressUri);
        const downloadUri = await uploadToFirebase(blob, id);
        downloadUris.push({ appUri: uri, downloadUri });
        i++;
        if (images.length === i) resolve();
      });
    });
    await Promise.all([upload]);
    console.log(downloadUris, "tämä joo");
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
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error("uriToBlob failed"));
    };

    // this helps us get a blob
    xhr.responseType = "blob";

    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

const a = [];
const uploadToFirebase = async (blob, id) => {
  try {
    const storageRef = ref(storage, "msg-chatImages/" + id);
    let downloadUri = await uploadBytes(storageRef, blob).then(
      async (snapshot) => {
        return getDownloadURL(snapshot.ref);
      }
    );
    return downloadUri;
    // const uploadTask = uploadBytesResumable(storageRef, blob);

    //  uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //     switch (snapshot.state) {
    //       case "paused":
    //         console.log("Upload is paused");
    //         break;
    //       case "running":
    //         console.log("Upload is running");
    //         break;
    //     }
    //   },
    //   (error) => {
    //     console.log(error, "code 19939");
    //     // Handle unsuccessful uploads
    //   },
    //   () => {
    //     // Handle successful uploads on complete
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       console.log("File available at", downloadURL);
    //       return downloadURL;
    //     });
    //   }
    // );
  } catch (error) {
    console.log(error, "code 299941");
  }
};

export default {
  saveImagesToFirebase,
};
