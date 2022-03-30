import React, { useEffect, useState, useRef } from "react";
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
  activateRoom,
  activateDraftRoom,
} from "../../store/rooms";
import {
  msgStoreActiveRoomIdCleared,
  msgStoreActiveRoomIdResived,
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
import fileFuncs from "../../utility/fileFuncs";
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
import {
  saveLastSeenMessageSum,
  selectLastSeenMessagesById,
} from "../../store/currentUser";
import { selectSocket } from "../../store/socket";
import AppButton from "./AppButton";
import SelectDocumentModal from "./modals/SelectDocumentModal";
import { endLoad, startLoad } from "../../store/general";

function MessageForm({ item }) {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  const [photos, setPhotos] = useState([]);
  let documentURL = useRef(null);
  const [documentName, setDocumentName] = useState(null);

  const roomData = useSelector(selectRoomDataById(item.route.params._id));
  const {
    _id: currentRoomId,
    type: currentRoomType,
    status: currentRoomStatus,
    members: currentRoomMembers,
    messageSum: currentRoomMessageSum,
  } = roomData || "null";
  const allUsers = useSelector(selectAllUsersMedium); // tämä auttaa, jos henkilön tiedot muuttuu, ehkä voi olla selector, kun ei ne usein muutu
  const replyMessageIds = useSelector(selectReplyItemIds);
  //tässä tuleekin ongelma, jos ei ole roomData objectia, kun se on null, niin objectista ei saa _id:tä
  const roomMembers = useSelector(selectRoomMembersById(currentRoomId));
  const usersOnline = useSelector(selectUsersOnline);
  // console.log("päivittää tämä kahdesti, ei ehkä haittaa");
  const socket = useSelector(selectSocket);
  const otherUser =
    currentRoomType === "private"
      ? roomFuncs.getPrivateRoomOtherUserName(
          currentRoomMembers,
          currentUserId,
          allUsers
        )
      : "";

  useEffect(() => {
    dispatch(activeRoomIdResived(currentRoomId));

    const lastSeenObject =
      store.getState().auth.currentUser.last_seen_messages[
        store
          .getState()
          .auth.currentUser.last_seen_messages.findIndex(
            (object) => object.roomId === currentRoomId
          )
      ];
    const lastSeenSumBefore = lastSeenObject?.lastSeenMessageSum || 0;
    const unreadMessagesSum = currentRoomMessageSum - lastSeenSumBefore;

    if (unreadMessagesSum !== 0) {
      dispatch(
        saveLastSeenMessageSum(
          currentUserId,
          currentRoomId,
          currentRoomMessageSum
        )
      );
    }

    // }, 10);

    //onko tähän parempi ratkaisu, tämän pitää olla muualla
    setHeader();

    return () => {
      dispatch(activeRoomIdCleared());
      dispatch(msgStoreActiveRoomIdCleared());
    };
  }, [roomMembers, roomData, allUsers]);

  const getSubTitle = () => {
    if (!roomMembers) return;
    if (currentRoomType === "private") return "View details";
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
            currentRoomMembers,
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
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon
    // try {
    //   store.getState().entities.msgStore.allMessages[currentRoomId].messages;
    // } catch (error) {
    //   console.log(error, "code 99292292");
    //   navigationRef.current.goBack();
    //   alert("tämä paremmin, huonetta ei ole enää");
    // }
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon

    const { messageId } = getReplyItem();
    const replyMessageId = messageId ? messageId : null;

    let messageType = "text";
    let imageURLs = null;

    if (photos.length !== 0) {
      dispatch(startLoad());
      messageType = "image";
      const downloadUris = await fileFuncs.saveImagesToFirebase(
        photos.map((photo) => photo.uri)
      );

      imageURLs = downloadUris.map((image) => image.downloadUri);
      // console.log(imageURLs, "Täältä tulee");
      console.log("lataus valmis");
    }

    let documentDownloadURL = null;
    let documentDisplayName = null;
    if (documentURL.current) {
      dispatch(startLoad());
      messageType = "document";
      documentDownloadURL = await fileFuncs.uploadDocumentToFireBase(
        documentURL.current,
        documentName
      );
      documentDisplayName = documentName;
    }

    // var counter = 0;
    // var i = setInterval(async function () {
    //   dispatch(
    //     sendMessage(
    //       counter,
    //       currentRoomId,
    //       messageType,
    //       imageURLs,
    //       replyMessageId
    //     )
    //   );

    //   counter++;
    //   if (counter === 1000) {
    //     clearInterval(i);
    //   }
    // }, 10);

    //en pidä tästä, että kysyy aina

    // dispatch(
    //   sendMessage(
    // message,
    // currentRoomId,
    // messageType,
    // imageURLs,
    // replyMessageId
    //   )
    // );

    socket.emit("newChatMessage", {
      message,
      currentRoomId,
      messageType,
      imageURLs,
      replyMessageId,
      currentUserId,
      documentDownloadURL,
      documentDisplayName,
    });
    dispatch(replyMessageIdCleared(currentRoomId));

    resetForm();
    dispatch(endLoad());
    if (currentRoomStatus === "draft") {
      dispatch(activateDraftRoom(currentRoomId, currentUserId));
    }

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
    return roomFuncs.isReplyItem(replyMessageIds, currentRoomId);
  };

  return (
    <>
      {getReplyItem() && <ReplyItem item={getReplyItem()} />}
      {currentRoomStatus !== "archived" &&
        otherUser.status !== "deleted" &&
        otherUser.status !== "archived" && (
          <View
            style={{
              marginBottom: Platform.OS == "ios" ? 10 : 0,
            }}
          >
            {!documentURL.current && (
              <ImageInputList
                imageUris={photos.map((photo) => photo.uri)}
                onRemoveImage={handleRemove}
                onAddImage={handleAdd}
              />
            )}
            {documentURL.current && <AppText>{documentName}</AppText>}
            {photos.length === 0 && (
              <SelectDocumentModal
                documentURL={documentURL}
                setDocumentName={setDocumentName}
              />
            )}
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
      {currentRoomStatus === "archived" && (
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
