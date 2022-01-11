import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "rooms",
  initialState: {
    messages: [],
    rooms: [],
    messageSendError: null,
  },
  reducers: {
    // action => action handler
    messagesResived: (rooms, action) => {
      rooms.messages = action.payload;
    },
    messagesError: (rooms, action) => {
      console.log("epännoistu2");
    },
    roomsResived: (rooms, action) => {
      rooms.rooms = action.payload;
    },
    roomsError: (rooms, action) => {
      console.log(action.payload, "epäonnistui");
    },
    messageSent: (rooms, action) => {
      // console.log("message lähetetty", action.payload);
      return action.payload;
    },
    messageSendError: (rooms, action) => {
      rooms.messageSendError = action.payload;
      // console.log("message ei lähetetty", action.payload);
    },
    messageSendErrorCleared: (rooms, action) => {
      rooms.messageSendError = null;
    },
  },
});

export const {
  messagesResived,
  messageSendError,
  messageSent,
  roomsError,
  messagesError,
  roomsResived,
  messageSendErrorCleared,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: messagesResived.type,
    onError: messagesError.type,
  });

export const getAllRooms = () =>
  apiCallBegan({
    url: url + "/rooms/all",
    onSuccess: roomsResived.type,
    onError: roomsError.type,
  });

export const sendMessage = (
  message = "jaaha",
  // roomId = "61d3f5b8145d1e3e2bc83ff0c"
  roomId = ""
) =>
  apiCallBegan({
    data: {
      messageBody: message,
      roomId,
    },
    onStart: messageSendErrorCleared.type,
    method: "post",
    url: url + "/messages/send_message2",
    onSuccess: messageSent.type,
    onError: messageSendError.type,
  });

export const selectErrorMessage = (state) =>
  state.entities.rooms.messageSendError;

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => rooms.messageSendError
  );
