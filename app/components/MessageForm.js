import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, Button } from "react-native";
import * as Yup from "yup";
import { useDispatch, useStore, useSelector } from "react-redux";
import {
  activeRoomIdResived,
  activeRoomIdClearer,
  setLoading,
  setRoomLoadingToTrue,
  getRoomMembersById,
} from "../../store/rooms";
import { sendMessage, test } from "../../store/msgStore";
import { useNavigation } from "@react-navigation/native";
import AppFormField from "./forms/AppFormField";
import AppForm from "./forms/AppForm";
import SendButton from "./SendButton";
import ImageInputList from "./imageComponents/ImageInputList";
import imageFuncs from "../../utility/imageFuncs";
import { navigationRef } from "../../app/navigation/rootNavigation";
import { deleteUser } from "../../store/usersControl";
import AppText from "./AppText";
import { error as errorToast } from "../../store/general";
import ScreenHeaderTitle from "./ScreenHeaderTitle";
import routes from "../navigation/routes";
import getPrivateRoomTitle from "../../utility/getPrivateRoomTitle";

function MessageForm({ item }) {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const store = useStore();
  const [photos, setPhotos] = useState([]);
  const roomData = item.route.params;

  const currentUserId = store.getState().auth.currentUser._id;
  const allUsersList = store.getState().entities.users.allUsers;
  const roomMembers = useSelector(getRoomMembersById(roomData._id));

  useEffect(() => {
    dispatch(activeRoomIdResived(roomData._id));
    setHeader();
    return () => {
      dispatch(activeRoomIdClearer());
    };
  }, [roomMembers]);

  const setHeader = () => {
    nav.setOptions({
      headerTitle: () => (
        <ScreenHeaderTitle
          title={
            roomData.type === "private"
              ? getPrivateRoomTitle(
                  roomData.members,
                  currentUserId,
                  allUsersList
                )
              : roomData.roomName
          }
          subTitle={
            roomData.type === "private"
              ? `View details`
              : `Members ${roomMembers.length} >`
          }
          action={() =>
            navigationRef.current.navigate(routes.ROOM_SETUP_SCREEN, roomData)
          }
        />
      ),
    });
  };

  const handleSubmit = async ({ message }, { resetForm }) => {
    try {
      store.getState().entities.msgStore.allMessages[roomData._id].messages;
    } catch (error) {
      console.log(error, "code 99292292");
      navigationRef.current.goBack();
      alert("tämä paremmin, huonetta ei ole enää");
    }

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

    dispatch(sendMessage(message, roomData._id, messageType, imageURLs));
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
    dispatch(setRoomLoadingToTrue());
    // dispatch(test());
  };

  return (
    <>
      {roomData.status !== "archived" ? (
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
      ) : (
        <AppText>
          Huone on arkistoitu. Aktivoi huone lähettääksesi viestejä.
        </AppText>
      )}
    </>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().label("Message"),
  message: Yup.string().required().min(1).label("Message"),
});

const styles = StyleSheet.create({});
export default MessageForm;
