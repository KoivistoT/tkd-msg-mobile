import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Keyboard, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { useDispatch, useStore, useSelector } from "react-redux";
import {
  activeRoomIdResived,
  activeRoomIdCleared,
  selectRoomDataById,
  selectRoomMembersById,
  activateDraftRoom,
} from "../../store/rooms";

import {
  msgStoreActiveRoomIdCleared,
  replyMessageIdCleared,
  selectReplyItemIds,
} from "../../store/msgStore";
import { useNavigation } from "@react-navigation/native";
import AppForm from "./forms/AppForm";
import SendButton from "./SendButton";
import fileFuncs from "../../utility/fileFuncs";
import { navigate } from "../../app/navigation/rootNavigation";

import AppText from "./AppText";

import ScreenHeaderTitle from "./ScreenHeaderTitle";
import routes from "../navigation/routes";

import { selectAllUsersMedium } from "../../store/users";
import roomFuncs from "../../utility/roomFuncs";
import ReplyItem from "./messageItems/ReplyItem";
import {
  saveLastSeenMessageSum,
  selectCurrentUserId,
} from "../../store/currentUser";
import { selectSocket } from "../../store/socket";
import {
  endLoad,
  messageFormFocusCleared,
  startLoad,
} from "../../store/general";
import colors from "../../config/colors";
import ShowSearchBarButton from "./ShowSearchBarButton";
import AttachmentOptions from "./AttachmentOptions";
import MessageFormToolBar from "./MessageFormToolBar";
import messageFuncs from "../../utility/messageFuncs";
import MessageFormField from "./forms/MessageFormField";

const PLACEHOLDER_TEXT_MAX_LENGTH = 22;

function MessageForm({ item }) {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const [photos, setPhotos] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
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

  const allUsers = useSelector(selectAllUsersMedium);
  const replyMessageIds = useSelector(selectReplyItemIds);
  const roomMembers = useSelector(selectRoomMembersById(currentRoomId));

  const socket = useSelector(selectSocket);

  let otherUserId = useRef(null);
  let roomIdRef = useRef(null);

  const setOtherUser = () => {
    otherUserId.current =
      currentRoomType === "private"
        ? roomFuncs.getPrivateRoomOtherUserId(currentRoomMembers, currentUserId)
        : null;
  };

  useEffect(() => {
    dispatch(activeRoomIdResived(currentRoomId));

    if (!otherUserId.current || currentRoomId !== roomIdRef.current) {
      roomIdRef.current = currentRoomId;
      setOtherUser();
    }

    //onko tähän parempi ratkaisu, tämän pitää olla muualla
    //ainakin header set ref jos ei muuta, ettei aina laita uusiksi

    setHeader();
  }, [roomMembers, allUsers, currentRoomId]);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      dispatch(messageFormFocusCleared());
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const setHeader = () => {
    nav.setOptions({
      headerTitle: () => (
        <ScreenHeaderTitle
          title={roomFuncs.getRoomTitle(roomData, allUsers, currentUserId)}
          roomMembers={roomMembers}
          currentRoomType={currentRoomType}
          currentRoomMembers={currentRoomMembers}
          currentUserId={currentUserId}
          allUsers={allUsers}
          otherUserId={otherUserId.current}
          action={() => navigate(routes.ROOM_SETUP_SCREEN, roomData)}
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
    //   navigate.goBack();
    //   alert("tämä paremmin, huonetta ei ole enää");
    // }
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon
    // !! katso tämä vielä kuntoon

    if (message.length === 0 && photos.length === 0 && !documentURL.current) {
      return;
    }

    const { messageId } = getReplyItem();
    const replyMessageId = messageId ? messageId : null;

    let messageType = "text";
    let imageURLs = null;
    let documentDownloadURL = null;
    let documentDisplayName = null;

    if (photos.length !== 0) {
      Keyboard.dismiss();
      dispatch(startLoad());
      messageType = "image";
      const downloadUris = await fileFuncs.saveImagesToFirebase(
        photos.map((photo) => photo.uri)
      );

      imageURLs = downloadUris.map((image) => image.downloadUri);
    }

    if (documentURL.current) {
      Keyboard.dismiss();
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

    resetForm();
    clearStates();
    // dispatch(endLoad());

    if (currentRoomStatus === "draft") {
      dispatch(activateDraftRoom(currentRoomId, currentUserId));
    }
  };

  const getReplyItem = () => {
    return roomFuncs.isReplyItem(replyMessageIds, currentRoomId);
  };

  const clearStates = () => {
    dispatch(replyMessageIdCleared(currentRoomId));
    setDocumentName(null);
    documentURL.current = null;
    setPhotos([]);
    setShowOptions(false);
  };

  return (
    <>
      {getReplyItem() && <ReplyItem item={getReplyItem()} />}
      {currentRoomStatus !== "archived" &&
        allUsers[otherUserId.current]?.status !== "deleted" &&
        allUsers[otherUserId.current]?.status !== "archived" && (
          <View
            style={{
              marginBottom: Platform.OS == "ios" ? 10 : 0,
            }}
          >
            {showOptions && (
              <AttachmentOptions
                documentURL={documentURL}
                setDocumentName={setDocumentName}
                photos={photos}
                showOptions={showOptions}
                setPhotos={setPhotos}
                onPress={() => setShowOptions(false)}
                documentName={documentName}
              />
            )}
            {!showOptions && (documentName || photos.length !== 0) && (
              <TouchableOpacity
                onPress={() => setShowOptions(true)}
                style={{ padding: 5, paddingLeft: 15, paddingTop: 10 }}
              >
                <AppText style={{ color: colors.primary }}>
                  {documentName
                    ? documentName
                    : photos.length === 1
                    ? `1 photo selected`
                    : `${photos.length} photos selected`}
                </AppText>
              </TouchableOpacity>
            )}

            <AppForm
              initialValues={{ message: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "76%",
                  maxHeight: 180,
                  paddingTop: 6,
                }}
              >
                <MessageFormToolBar
                  onPress={() => setShowOptions((prevState) => !prevState)}
                  showOptions={showOptions}
                />

                <MessageFormField
                  showErrorMessage={false}
                  currentRoomId={currentRoomId}
                  currentUserId={currentUserId}
                  // style={{ maxHeight: 85, height: 25 }}
                  multiline
                  name="message"
                  numberOfLines={1}
                  //tämä järkevämmin
                  placeholder={
                    `Message #${roomFuncs.getRoomTitle(
                      roomData,
                      allUsers,
                      currentUserId
                    )}`.length > PLACEHOLDER_TEXT_MAX_LENGTH
                      ? `Message #${roomFuncs
                          .getRoomTitle(roomData, allUsers, currentUserId)
                          .slice(0, PLACEHOLDER_TEXT_MAX_LENGTH - 3)}...`
                      : `Message #${roomFuncs.getRoomTitle(
                          roomData,
                          allUsers,
                          currentUserId
                        )}`
                  }
                ></MessageFormField>

                <SendButton />
              </View>
            </AppForm>
          </View>
        )}
      {currentRoomStatus === "archived" && (
        <AppText>
          Huone on arkistoitu. Aktivoi huone lähettääksesi viestejä.
        </AppText>
      )}

      {otherUserId.current &&
        (allUsers[otherUserId.current].status === "deleted" ||
          allUsers[otherUserId.current].status === "archived") && (
          <AppText>
            {`Käyttäjä ${allUsers[otherUserId.current].firstName} ${
              allUsers[otherUserId.current].lastName
            } on poistettu. Et voi lähettää hänelle viestejä.`}
          </AppText>
        )}
    </>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().label("Message"),
});

const styles = StyleSheet.create({});
export default MessageForm;
