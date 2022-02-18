import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "usersControl",
  initialState: {
    users: [],
    errorMessage: null,
  },
  reducers: {
    // action => action handler
    usersResived: (usersControl, action) => {
      console.log("users resived");
      usersControl.users = action.payload;
    },
    usersError: (usersControl, action) => {
      usersControl.errorMessage = action.payload;
      console.log(action.payload, "epännoistu appcode 12398321");
    },
    userCreated: (usersControl, action) => {
      console.log(action.payload, "User lisätty");
    },
    usersErrorCleared: (usersControl, action) => {
      usersControl.errorMessage = null;
    },
  },
});

export const { usersResived, usersError, userCreated, usersErrorCleared } =
  slice.actions;
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
  lastName = null,
  displayName = null,
  email = null
) =>
  apiCallBegan({
    url: url + "/create_user",
    method: "post",
    data: {
      userName,
      password,
      accountType,
      firstName,
      lastName,
      displayName,
      email,
    },
    onSuccess: userCreated.type,
    onError: usersError.type,
  });

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.usersControl,
    (usersControl) => usersControl.errorMessage
  );

export const allUsers = () =>
  createSelector(
    (state) => state.entities.usersControl,
    (usersControl) => usersControl.users
  );
