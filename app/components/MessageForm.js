import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Keyboard, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { useDispatch, useStore, useSelector } from "react-redux";
import {
  activeRoomIdResived,
  selectRoomDataById,
  selectRoomMembersById,
  activateDraftRoom,
} from "../../store/rooms";

import {
  replyMessageIdCleared,
  selectReplyItemIds,
} from "../../store/msgStore";
import { useNavigation } from "@react-navigation/native";
import AppForm from "./forms/AppForm";
import SendButton from "./SendButton";
import fileFuncs from "../../utility/fileFuncs";
import { navigate } from "../../app/navigation/rootNavigation";
import { useIsFocused } from "@react-navigation/native";
import AppText from "./AppText";

import ScreenHeaderTitle from "./ScreenHeaderTitle";
import routes from "../navigation/routes";

import { selectAllUsersMedium } from "../../store/users";
import roomFuncs from "../../utility/roomFuncs";
import ReplyItem from "./messageItems/ReplyItem";
import { selectCurrentUserId } from "../../store/currentUser";
import { selectSocket } from "../../store/socket";
import {
  endLoad,
  messageFormFocusCleared,
  startLoad,
} from "../../store/general";
import colors from "../../config/colors";
import AttachmentOptions from "./AttachmentOptions";
import MessageFormToolBar from "./MessageFormToolBar";
import MessageFormField from "./forms/MessageFormField";

const PLACEHOLDER_TEXT_MAX_LENGTH = 22;
const ARCHIVED_TEXT =
  "Huone on arkistoitu. Aktivoi huone lähettääksesi viestejä.";

function MessageForm({ item }) {
  const dispatch = useDispatch();
  const nav = useNavigation();
  const store = useStore();

  const [photos, setPhotos] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [documentName, setDocumentName] = useState(null);
  const [isOtherUserActive, setIsOtherUserActive] = useState(true);

  const roomData = useSelector(selectRoomDataById(item.route.params._id));

  const {
    _id: currentRoomId,
    type: currentRoomType,
    status: currentRoomStatus,
    members: currentRoomMembers,
  } = roomData || "null";

  const currentUserId = selectCurrentUserId(store);
  const allUsers = useSelector(selectAllUsersMedium);
  const replyMessageIds = useSelector(selectReplyItemIds);
  const roomMembers = useSelector(selectRoomMembersById(currentRoomId));
  const socket = useSelector(selectSocket);

  const isFocused = useIsFocused();

  let otherUserId = useRef(null);
  let roomIdRef = useRef(null);
  let documentURL = useRef(null);
  let roomTitle = useRef("");

  useEffect(() => {
    if (isFocused) {
      dispatch(endLoad());
    }
  }, [isFocused]);

  useEffect(() => {
    dispatch(activeRoomIdResived(currentRoomId));

    if (!otherUserId.current || currentRoomId !== roomIdRef.current) {
      setRoomDetails();
    }

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

  const setOtherUser = () => {
    otherUserId.current =
      currentRoomType === "private"
        ? roomFuncs.getPrivateRoomOtherUserId(currentRoomMembers, currentUserId)
        : null;

    setIsOtherUserActive(
      otherUserId.current && allUsers[otherUserId.current].status === "active"
    );
  };

  const setRoomDetails = () => {
    roomIdRef.current = currentRoomId;

    roomTitle.current = roomFuncs.getRoomTitle(
      roomData,
      allUsers,
      currentUserId
    );

    setOtherUser();
  };

  const getPlaceholder = () => {
    const roomTitle = roomFuncs.getRoomTitle(roomData, allUsers, currentUserId);
    return `Message #${roomTitle}`.length > PLACEHOLDER_TEXT_MAX_LENGTH
      ? `Message #${roomTitle.slice(0, PLACEHOLDER_TEXT_MAX_LENGTH - 3)}...`
      : `Message #${roomTitle}`;
  };

  const setHeader = () => {
    nav.setOptions({
      headerTitle: () => (
        <ScreenHeaderTitle
          title={roomTitle.current}
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
      const loadingText =
        photos.length === 1
          ? "Uploading image"
          : `Uploading ${photos.length} images`;
      dispatch(startLoad(loadingText));
      messageType = "image";
      const downloadUris = await fileFuncs.saveImagesToFirebase(
        photos.map((photo) => photo.uri)
      );

      imageURLs = downloadUris.map((image) => image.downloadUri);
    }

    if (documentURL.current) {
      Keyboard.dismiss();
      dispatch(startLoad("Uploading document"));
      messageType = "document";
      documentDownloadURL = await fileFuncs.uploadDocumentToFireBase(
        documentURL.current,
        documentName
      );
      documentDisplayName = documentName;
    }

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

  const showAttachmentInfo = () =>
    !showOptions && (documentName || photos.length !== 0);

  const getDocumentName = () =>
    documentName
      ? documentName
      : photos.length === 1
      ? `1 photo selected`
      : `${photos.length} photos selected`;

  const showMessageFrom = () => {
    if (currentRoomType === "private" && !isOtherUserActive) return false;
    if (currentRoomStatus !== "active" && currentRoomStatus !== "draft")
      return false;
    return true;
  };
  const getNotActiveText = () =>
    `Käyttäjä on poistettu. Et voi lähettää hänelle viestejä.`;
  // `Käyttäjä ${allUsers[otherUserId.current]?.firstName} ${
  //   allUsers[otherUserId.current]?.lastName
  // } on poistettu. Et voi lähettää hänelle viestejä.`;

  return (
    <>
      {getReplyItem() && <ReplyItem item={getReplyItem()} />}
      {showMessageFrom() && (
        <View style={styles.container}>
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
          {showAttachmentInfo() && (
            <TouchableOpacity
              onPress={() => setShowOptions(true)}
              style={styles.attachmentInfoContainer}
            >
              <AppText style={styles.attachmentInfoText}>
                {getDocumentName()}
              </AppText>
            </TouchableOpacity>
          )}

          <AppForm
            initialValues={{ message: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <View style={styles.messageFormFieldContainer}>
              <MessageFormToolBar
                onPress={() => setShowOptions((prevState) => !prevState)}
                showOptions={showOptions}
              />

              <MessageFormField
                showErrorMessage={false}
                currentRoomId={currentRoomId}
                currentUserId={currentUserId}
                multiline
                name="message"
                numberOfLines={1}
                placeholder={getPlaceholder()}
              ></MessageFormField>

              <SendButton />
            </View>
          </AppForm>
        </View>
      )}

      {currentRoomStatus === "archived" && <AppText>{ARCHIVED_TEXT}</AppText>}
      {currentRoomType === "private" && !isOtherUserActive && (
        <AppText
          style={{ padding: 10, alignSelf: "center", color: colors.secondary }}
        >
          {getNotActiveText()}
        </AppText>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  attachmentInfoContainer: { padding: 5, paddingLeft: 15, paddingTop: 10 },
  attachmentInfoText: { color: colors.primary },
  container: { marginBottom: Platform.OS == "ios" ? 10 : 0 },
  messageFormFieldContainer: {
    flexDirection: "row",
    width: "76%",
    maxHeight: 180,
    paddingTop: 6,
  },
});

const validationSchema = Yup.object().shape({
  message: Yup.string().label("Message"),
});

export default MessageForm;
