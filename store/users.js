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
      console.log("users resived");
      users.users = action.payload;
    },
    usersError: (rooms, action) => {
      console.log(action.payload, "epännoistu appcode 12398321");
    },
    userCreated: (rooms, action) => {
      console.log(action.payload, "User lisätty");
    },
  },
});

export const { usersResived, usersError, userCreated } = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/users";

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });

export const createUser = (
  userName = null,
  password = null,
  accountType = null,
  firstName = null,
  lastName = null
) =>
  apiCallBegan({
    url: url + "/create_user",
    method: "post",
    data: { userName, password, accountType, firstName, lastName },
    onSuccess: userCreated.type,
    onError: usersError.type,
  });
