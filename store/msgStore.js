import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";
import { requestStarted, requestSucceed } from "./rooms";

const slice = createSlice({
  name: "msgStore",
  initialState: {
    allMessages: {},
    messageSendError: null,
    allMessageIds: {},
    images: {},
    replyMessageIds: [],
  },
  reducers: {
    allImagesResived: (msgStore, action) => {
      msgStore.images = action.payload;
    },
    replyMessageIdResived: (msgStore, action) => {
      msgStore.replyMessageIds.push(action.payload);
      // console.log(msgStore.replyMessageIds);
    },
    replyMessageIdCleared: (msgStore, action) => {
      msgStore.replyMessageIds = msgStore.replyMessageIds.filter(
        (message) => message.roomId !== action.payload
      );
      // console.log(msgStore.replyMessageIds, "Tässä reply idt");
    },
    oneRoomImagesResived: (msgStore, action) => {
      const { imageURLs, roomId } = action.payload;
      msgStore.images[roomId] = imageURLs;
    },

    messagesResived: (msgStore, action) => {
      msgStore.allMessages = action.payload;

      Object.keys(action.payload).forEach((roomId) => {
        // rooms.allActiveRoomsIds.push(id);
        msgStore.allMessageIds = Object.assign(msgStore.allMessageIds, {
          [roomId]: Object.keys(action.payload[roomId].messages),
        });
      });
      // console.log(msgStore.allMessageIds["6228a42601768b0dea508e41"]);
      // console.log(
      //   action.payload["61e6a80eb30d002e91d67b5a"].messages,
      //   "tässä kaikki viestit"
      // );
      // console.log(msgStore.messages.messages, "messagesResived");
    },

    oneRoomMessagesResived: (msgStore, action) => {
      if (msgStore.allMessages) {
        msgStore.allMessages = Object.assign(
          msgStore.allMessages,
          action.payload
        );

        //tätä ei testattu
        const roomId = Object.keys(action.payload);
        msgStore.allMessageIds = Object.assign(msgStore.allMessageIds, {
          [roomId]: Object.keys(action.payload[roomId].messages),
        });
      } else {
        msgStore.allMessages = action.payload;

        const roomId = Object.keys(action.payload);
        msgStore.allMessageIds = {
          [roomId]: Object.keys(action.payload[roomId].messages),
        };
      }
    },
    messagesError: (msgStore, action) => {
      console.log("epännoistu2");
    },
    newMessageResived: (msgStore, action) => {
      const message = Object.values(action.payload)[0];
      var targetMessages = msgStore.allMessages[message.roomId].messages;

      Object.assign(targetMessages, action.payload);
      msgStore.allMessageIds[message.roomId].push(message._id);

      if (message.type === "image") {
        message.imageURLs.forEach((url) => {
          msgStore.images[message.roomId].push(url);
        });
      }
    },
    messageSent: (msgStore, action) => {
      // console.log("message lähetetty");
      // console.log(action.payload, "lähetetty viesti");
      // console.log(messages.messages);
      // Object.assign(
      //   msgStore.allMessages[action.payload.message.roomId].messages,
      //   action.payload
      // );
      // msgStore.allMessages[action.payload.message.roomId].messages.push(
      //   action.payload.message
      // );
      // tässä respondissa olisi toki viesti, mutta haluan sen aina samasta paikasta kaikille
      //   msgStore.allMessages.messages.push(action.payload.message);
    },
    messagesRemoved: (msgStore, action) => {
      delete msgStore.allMessages[action.payload];
      delete msgStore.images[action.payload];
      delete msgStore.allMessageIds[action.payload];
    },

    messageDeleted: (msgStore, action) => {
      // console.log(
      //   "täällä pitää vielä tämä tehdä ja sit, että näyttää messagen is deleted messagelistalla"
      // );

      msgStore.allMessages[Object.keys(action.payload)].messages[
        Object.values(action.payload)[0].messageId
      ].is_deleted = true;

      // msgStore.allMessages[Object.keys(action.payload)];
      // .messages[
      //   Object.values(action.payload).messageId
      // ].is_deleted = true;
    },

    messageSendError: (msgStore, action) => {
      msgStore.messageSendError = action.payload;
      // console.log("message ei lähetetty", action.payload);
    },
    messageSendErrorCleared: (msgStore, action) => {
      msgStore.messageSendError = null;
    },
  },
});

export const {
  messagesResived,
  oneRoomMessagesResived,
  messageSendError,
  messageDeleted,
  messageSent,
  messagesError,
  messageSendErrorCleared,
  newMessageResived,
  messagesRemoved,
  oneRoomImagesResived,
  allImagesResived,
  replyMessageIdResived,
  replyMessageIdCleared,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: oneRoomMessagesResived.type,
    onError: messagesError.type,
  });

export const deleteMessageById = (roomId, messageId) =>
  apiCallBegan({
    url: url + "/messages/delete/",
    method: "post",
    data: {
      roomId,
      messageId,
    },

    onSuccess: requestSucceed.type,
    onError: messagesError.type,
  });

export const sendMessage =
  (
    message = "",
    roomId = "",
    messageType = "text",
    imageURLs = null,
    replyMessageId = null
  ) =>
  (dispatch, getState) => {
    const userId = getState().auth.currentUser._id;

    return dispatch(
      apiCallBegan({
        data: {
          messageBody: message,
          roomId,
          userId,
          messageType,
          imageURLs,
          replyMessageId,
        },
        onStart: messageSendErrorCleared.type,
        method: "post",
        url: url + "/messages/send_message",
        onSuccess: messageSent.type,
        onError: messageSendError.type,
      })
    );
  };

export const test = () =>
  apiCallBegan({
    url: url + "/messages/test2",
  });

export const getRoomImages = (id) =>
  apiCallBegan({
    url: url + "/messages/room_images/" + id,
    onSuccess: oneRoomImagesResived.type,
    onError: messagesError.type,
  });

export const selectRoomMessagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId]?.messages
  );

export const selectReplyItemIds = createSelector(
  (state) => state.entities.msgStore,
  (msgStore) => msgStore.replyMessageIds
);

export const selectRoomImagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.images[roomId]
  );

export const selectMessageById = (roomId, messageId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId].messages[messageId]
  );

export const selectRoomMessageIdsByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) =>
      msgStore.allMessageIds[roomId] !== undefined &&
      msgStore.allMessageIds[roomId].length !== 0
        ? [...msgStore.allMessageIds[roomId]].reverse()
        : []
  );
