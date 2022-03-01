import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, Button } from "react-native";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { activeRoomIdResived, activeRoomIdClearer } from "../../store/rooms";
import { sendMessage, test } from "../../store/msgStore";
import AppFormField from "./forms/AppFormField";
import AppForm from "./forms/AppForm";
import SendButton from "./SendButton";
import ImageInputList from "./imageComponents/ImageInputList";
import imageFuncs from "../../utility/imageFuncs";

import { deleteUser } from "../../store/usersControl";

function MessageForm({ item }) {
  const dispatch = useDispatch();
  const [photos, setPhotos] = useState([]);
  const roomId = item.route.params._id;

  useEffect(() => {
    dispatch(activeRoomIdResived(roomId));

    return () => {
      dispatch(activeRoomIdClearer());
    };
  }, []);

  const handleSubmit = async ({ message }, { resetForm }) => {
    // console.log("aloittaa latauksen");

    let messageType = "text";
    let imageURLs = null;
    if (photos.length !== 0) {
      messageType = "image";
      const downloadUris = await imageFuncs.saveImagesToFirebase(
        photos.map((photo) => photo.uri)
      );

      imageURLs = downloadUris.map((image) => image.downloadUri);
      // console.log(imageURLs, "Täältä tulee");
      console.log("lataus valmis");
    }

    dispatch(sendMessage(message, roomId, messageType, imageURLs));
    resetForm();
    Keyboard.dismiss();
  };

  const handleAdd = (uri) => {
    setPhotos([
      ...photos,
      {
        name: "IMG" + Math.random(),
        type: "image/jpg",
        uri: uri,
      },
    ]);
  };
  const handleRemove = (uri) => {
    setPhotos(photos.filter((imageUri) => imageUri.uri !== uri));
  };

  const testi = async () => {
    dispatch(deleteUser("621c682b76f652219f559c24"));
    // dispatch(test());
  };

  return (
    <>
      <View
        style={{
          marginBottom: Platform.OS == "ios" ? 10 : 0,
        }}
      >
        <ImageInputList
          imageUris={photos.map((photo) => photo.uri)}
          onRemoveImage={handleRemove}
          onAddImage={handleAdd}
        />
        <AppForm
          initialValues={{ message: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View
            style={{
              marginLeft: 0,

              flexDirection: "row",
              width: "75%",
            }}
          >
            <AppFormField
              borderRadius={0}
              marginTop={0}
              style={{ maxHeight: 85, height: 65 }}
              multiline
              name="message"
              numberOfLines={2}
              placeholder="Message..."
            />
            <SendButton />
          </View>
        </AppForm>
        <Button title={"test"} onPress={testi}></Button>
      </View>
    </>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().label("Message"),
  message: Yup.string().required().min(1).label("Message"),
});

const styles = StyleSheet.create({});
export default MessageForm;
