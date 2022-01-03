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
  },
});

export const { messagesResived, roomsError, messagesError, roomsResived } =
  slice.actions;
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
