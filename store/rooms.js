import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "@reduxjs/toolkit";

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
      // console.log(rooms.messages.messages, "messagesResived");
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
    newMessageResived: (rooms, action) => {
      rooms.messages.messages.push(action.payload);
      // console.log(rooms.messages.messages, "nämä jälkeen");
    },
    messageSent: (rooms, action) => {
      // console.log("message lähetetty", action.payload);
      // return action.payload;
    },
    messageSendError: (rooms, action) => {
      rooms.messageSendError = action.payload;
      // console.log("message ei lähetetty", action.payload);
    },
    messageSendErrorCleared: (rooms, action) => {
      rooms.messageSendError = null;
    },
    roomCreated: (rooms, action) => {
      console.log("huone luotu");
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
  roomCreated,
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

export const getAllRooms = () =>
  apiCallBegan({
    url: url + "/rooms/all",
    onSuccess: roomsResived.type,
    onError: roomsError.type,
  });

export const sendMessage = (
  message = "",
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
    url: url + "/messages/send_message",
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

export const createRoom = (roomName, type) =>
  apiCallBegan({
    url: url + "/rooms/create_room",
    method: "post",
    data: { roomName, type },
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

//tämä toki id:llä ja eri lailla
export const getRoomMessages = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.messages
);
