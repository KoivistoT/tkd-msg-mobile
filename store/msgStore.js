import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "msgStore",
  initialState: {
    allMessages: {},
    messageSendError: null,
    images: {},
  },
  reducers: {
    allImagesResived: (msgStore, action) => {
      msgStore.images = action.payload;
    },
    oneRoomImagesResived: (msgStore, action) => {
      const { imageURLs, roomId } = action.payload;
      msgStore.images[roomId] = imageURLs;
    },

    messagesResived: (msgStore, action) => {
      msgStore.allMessages = action.payload;

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
      } else {
        msgStore.allMessages = action.payload;
      }
    },
    messagesError: (msgStore, action) => {
      console.log("epännoistu2");
    },
    newMessageResived: (msgStore, action) => {
      const message = Object.values(action.payload)[0];
      var targetMessages = msgStore.allMessages[message.roomId].messages;

      Object.assign(targetMessages, action.payload);

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
  messageSent,
  messagesError,
  messageSendErrorCleared,
  newMessageResived,
  messagesRemoved,
  oneRoomImagesResived,
  allImagesResived,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: oneRoomMessagesResived.type,
    onError: messagesError.type,
  });

export const sendMessage =
  (message = "", roomId = "", messageType = "text", imageURLs = null) =>
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
        },
        onStart: messageSendErrorCleared.type,
        method: "post",
        url: url + "/messages/send_message",
        onSuccess: messageSent.type,
        onError: messageSendError.type,
      })
    );
  };

export const selectErrorMessage = (state) =>
  state.entities.messages.messageSendError;

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.messages,
    (messages) => messages.messageSendError
  );

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

export const getRoomMessages = createSelector(
  (state) => state.entities.msgStore,
  (msgStore) => msgStore.allMessages
);
export const getRoomMessagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId]?.messages
  );

export const getRoomImagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.images[roomId]
  );
