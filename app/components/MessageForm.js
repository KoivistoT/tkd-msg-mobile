import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, Button } from "react-native";
import * as Yup from "yup";
import { useDispatch, useStore, useSelector } from "react-redux";
import {
  activeRoomIdResived,
  activeRoomIdCleared,
  setLoading,
  setRoomLoadingToTrue,
  selectRoomDataById,
  selectRoomMembersById,
} from "../../store/rooms";
import {
  replyMessageIdCleared,
  selectReplyItemIds,
  sendMessage,
  test,
} from "../../store/msgStore";
import { useNavigation } from "@react-navigation/native";
import AppFormField from "./forms/AppFormField";
import AppForm from "./forms/AppForm";
import SendButton from "./SendButton";
import ImageInputList from "./imageComponents/ImageInputList";
import imageFuncs from "../../utility/imageFuncs";
import { navigationRef } from "../../app/navigation/rootNavigation";

import AppText from "./AppText";

import ScreenHeaderTitle from "./ScreenHeaderTitle";
import routes from "../navigation/routes";

import {
  allUsers,
  itemAdded,
  selectAllUsers,
  selectAllUsersAllData,
  selectAllUsersMedium,
  selectAllUsersMinimal,
  selectMyItems,
  selectOnlineUsers,
  selectUsersOnline,
} from "../../store/users";
import showOnlineIndicator from "../../utility/showOnlineIndicator";
import roomFuncs from "../../utility/roomFuncs";
import ReplyItem from "./messageItems/ReplyItem";

function MessageForm({ item }) {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  const [photos, setPhotos] = useState([]);
  const roomData = useSelector(selectRoomDataById(item.route.params._id));

  const allUsers = useSelector(selectAllUsersMedium); // tämä auttaa, jos henkilön tiedot muuttuu, ehkä voi olla selector, kun ei ne usein muutu
  const replyMessageIds = useSelector(selectReplyItemIds);
  const roomMembers = useSelector(selectRoomMembersById(roomData._id));
  const usersOnline = useSelector(selectUsersOnline);
  // console.log("päivittää");

  const otherUser =
    roomData.type === "private"
      ? roomFuncs.getPrivateRoomOtherUserName(
          roomData.members,
          currentUserId,
          allUsers
        )
      : "";

  useEffect(() => {
    dispatch(activeRoomIdResived(roomData._id));
    setHeader();

    return () => {
      dispatch(activeRoomIdCleared());
    };
  }, [roomMembers, roomData, allUsers]);

  const getSubTitle = () => {
    if (!roomMembers) return;
    if (roomData.type === "private") return "View details";
    return `Members ${roomFuncs.getRoomActiveMembersSum(
      roomMembers,
      allUsers
    )} >`;
  };

  const setHeader = () => {
    nav.setOptions({
      headerTitle: () => (
        <ScreenHeaderTitle
          title={roomFuncs.getRoomTitle(roomData, allUsers, currentUserId)}
          subTitle={getSubTitle()}
          showOnlineIndicator={showOnlineIndicator(
            usersOnline,
            roomData.members,
            currentUserId
          )}
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

    const { messageId } = getReplyItem();
    const replyMessageId = messageId ? messageId : null;

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
    // var counter = 0;
    // var i = setInterval(async function () {
    //   dispatch(
    //     sendMessage(
    //       Math.random(),
    //       roomData._id,
    //       messageType,
    //       imageURLs,
    //       replyMessageId
    //     )
    //   );

    //   counter++;
    //   if (counter === 50) {
    //     clearInterval(i);
    //   }
    // }, 1000);

    dispatch(
      sendMessage(message, roomData._id, messageType, imageURLs, replyMessageId)
    );
    dispatch(replyMessageIdCleared(roomData._id));
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
    dispatch(itemAdded());
    // dispatch(test());
  };

  const getReplyItem = () => {
    return roomFuncs.isReplyItem(replyMessageIds, roomData._id);
  };

  return (
    <>
      {getReplyItem() && <ReplyItem item={getReplyItem()} />}
      {roomData.status !== "archived" &&
        otherUser.status !== "deleted" &&
        otherUser.status !== "archived" && (
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
                  showErrorMessage={false}
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
        )}
      {roomData.status === "archived" && (
        <AppText>
          Huone on arkistoitu. Aktivoi huone lähettääksesi viestejä.
        </AppText>
      )}

      {(otherUser.status === "deleted" || otherUser.status === "archived") && (
        <AppText>
          {`Käyttäjä ${otherUser.firstName} ${otherUser.lastName} on poistettu. Et voi lähettää hänelle viestejä.`}
        </AppText>
      )}
    </>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

const styles = StyleSheet.create({});
export default MessageForm;
