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

      // console.log(messages.messages.messages, "messagesResived");
    },
    messagesError: (messages, action) => {
      console.log("epännoistu2");
    },
    newMessageResived: (messages, action) => {
      messages.messages.messages.push(action.payload);
    },
    messageSent: (messages, action) => {
      console.log("message lähetetty", action.payload);
      // tässä respondissa olisi toki viesti, mutta haluan sen aina samasta paikasta kaikille
      //   messages.messages.messages.push(action.payload.message);
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
  messageSendError,
  messageSent,
  messagesError,
  messageSendErrorCleared,
  newMessageResived,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: messagesResived.type,
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
