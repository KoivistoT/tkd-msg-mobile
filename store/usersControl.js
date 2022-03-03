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
    userControlNewUserResived: (usersControl, action) => {
      if (
        typeof usersControl.users[Object.keys(action.payload)] === "undefined"
      ) {
        Object.assign(usersControl.users, action.payload);
      }
    },
    usersResived: (usersControl, action) => {
      // console.log("users resived");
      usersControl.users = action.payload;
    },
    userControlUserDeleted: (usersControl, action) => {
      delete usersControl.users[action.payload];
    },
    userControlUserArchived: (usersControl, action) => {
      usersControl.users[action.payload].status = "archived";
    },
    userControlUserTemporaryDeleted: (usersControl, action) => {
      usersControl.users[action.payload].status = "deleted";
    },
    userControlUserActivated: (usersControl, action) => {
      usersControl.users[action.payload].status = "active";
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

export const {
  usersResived,
  usersError,
  userCreated,
  usersErrorCleared,
  userControlUserDeleted,
  userControlNewUserResived,
  userControlUserArchived,
  userControlUserTemporaryDeleted,
  userControlUserActivated,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/users";

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });

export const deleteUserById = (userId) =>
  apiCallBegan({
    url: url + "/delete_user/" + userId,
    // onSuccess: userControlUserDeleted.type,
    onError: usersError.type,
  });

export const archiveOrDeleteUserById = (userId, status) =>
  apiCallBegan({
    url: url + "/archive_or_delete_user",
    method: "post",
    data: {
      userId,
      status,
    },
    // onSuccess: userControlUserDeleted.type,
    onError: usersError.type,
  });

export const activateUserById = (userId) =>
  apiCallBegan({
    url: url + "/activate_user/" + userId,
    // onSuccess: userControlUserDeleted.type,
    onError: usersError.type,
  });

export const createUser = (
  userName = null,
  password = null,
  accountType = null,
  firstName = null,
  lastName = null,
  displayName = null,
  email = null,
  status = "active"
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
      status,
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

export const userControlgetUserById = (userId) =>
  createSelector(
    (state) => state.entities.usersControl,
    (usersControl) => usersControl.users[userId]
  );
