import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    // action => action handler
    usersResived: (users, action) => {
      console.log("lkjlj");
      users.users = action.payload;
    },
    usersError: (rooms, action) => {
      console.log("lkjlj");
      console.log("epännoistu appcode 12398321");
    },
  },
});

export const { usersResived, usersError } = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/users/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });
