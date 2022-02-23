import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { activeRoomIdResived, activeRoomIdClearer } from "../store/rooms";
import { sendMessage } from "../store/msgStore";
import AppFormField from "../app/components/forms/AppFormField";
import AppForm from "../app/components/forms/AppForm";
import SendButton from "../app/components/SendButton";
import ImageInputList from "../app/components/imageComponents/ImageInputList";

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
    dispatch(sendMessage(message, roomId));
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
