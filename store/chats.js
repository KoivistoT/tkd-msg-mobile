import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "chats",
  initialState: {
    messages: [],
  },
  reducers: {
    // action => action handler
    messagesResived: (chats, action) => {
      chats.messages = action.payload;
    },
  },
});

export const { messagesResived } = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: messagesResived.type,
    onError: messagesResived.type,
  });
