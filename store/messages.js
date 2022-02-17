import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    messageSendError: null,
  },
  reducers: {
    messagesResived: (messages, action) => {
      messages.messages = action.payload;

      // console.log(
      //   action.payload["61e6a80eb30d002e91d67b5a"].messages,
      //   "tässä kaikki viestit"
      // );
      // console.log(messages.messages.messages, "messagesResived");
    },
    oneRoomMessagesResived: (messages, action) => {
      messages.messages = Object.assign(messages.messages, action.payload);
      // console.log(messages.messages);
    },
    messagesError: (messages, action) => {
      console.log("epännoistu2");
    },
    newMessageResived: (messages, action) => {
      // console.log(action.payload);
      // messages.messages.messages.push(action.payload);
      messages.messages[action.payload.roomId].messages.push(action.payload);
    },
    messageSent: (messages, action) => {
      // console.log("message lähetetty");
      // console.log(action.payload, "lähetetty viesti");
      // console.log(messages.messages);
      // Object.assign(
      //   messages.messages[action.payload.message.roomId].messages,
      //   action.payload
      // );
      // messages.messages[action.payload.message.roomId].messages.push(
      //   action.payload.message
      // );
      // tässä respondissa olisi toki viesti, mutta haluan sen aina samasta paikasta kaikille
      //   messages.messages.messages.push(action.payload.message);
    },
    messagesRemoved: (messages, action) => {
      delete messages.messages[action.payload];
    },
    messageSendError: (messages, action) => {
      messages.messageSendError = action.payload;
      // console.log("message ei lähetetty", action.payload);
    },
    messageSendErrorCleared: (messages, action) => {
      messages.messageSendError = null;
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
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: oneRoomMessagesResived.type,
    onError: messagesError.type,
  });

export const sendMessage = (message = "", roomId = "") =>
  apiCallBegan({
    data: {
      messageBody: message,
      roomId,
    },
    onStart: messageSendErrorCleared.type,
    method: "post",
    url: url + "/messages/send_message",
    onSuccess: messageSent.type,
    onError: messageSendError.type,
  });

export const selectErrorMessage = (state) =>
  state.entities.messages.messageSendError;

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.messages,
    (messages) => messages.messageSendError
  );

export const getRoomMessages = createSelector(
  (state) => state.entities.messages,
  (messages) => messages.messages
);
export const getRoomMessagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.messages,
    (messages) => messages.messages[roomId]?.messages
  );
