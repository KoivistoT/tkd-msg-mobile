import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    allChannels: [],
    errorMessage: null,
    loading: false,
  },
  reducers: {
    // action => action handler
    usersResived: (users, action) => {
      // console.log("users resived");
      users.allUsers = action.payload;
      // alert(Object.keys(users.allUsers).length, "monta käyttäjää tulee");
      // console.log(
      //   "users resived",
      //   users.allUsers["61e6a7f6b30d002e91d67b50"].email
      // );
    },
    userActivated: (users, action) => {
      users.allUsers[action.payload].status = "active";
    },
    newUserResived: (users, action) => {
      Object.assign(users.allUsers, action.payload);
    },
    userDeleted: (users, action) => {
      delete users.allUsers[action.payload];
    },
    userCreated: (users, action) => {
      console.log(action.payload, "User lisätty");
    },
    userDataEdited: (users, action) => {
      users.allUsers[action.payload._id] = action.payload.newUserData;
    },
    requestSuccess: (users, action) => {
      users.loading = false;
    },
    userArchived: (users, action) => {
      users.allUsers[action.payload].status = "archived";
    },
    userTemporaryDeleted: (users, action) => {
      users.allUsers[action.payload].status = "deleted";
    },
    usersError: (users, action) => {
      users.errorMessage = action.payload;

      console.log(action.payload, "epännoistu appcode 1233322");
    },
    usersErrorCleared: (users, action) => {
      users.errorMessage = null;
    },
    channelsResived: (users, action) => {
      users.allChannels = action.payload;
    },
  },
});

export const {
  usersResived,
  usersError,
  userCreated,
  newUserResived,
  userDeleted,
  channelsResived,
  userActivated,
  usersErrorCleared,
  userDataEdited,
  requestSuccess,
  userTemporaryDeleted,
  userArchived,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/users";

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });

export const getAllChannels = () =>
  apiCallBegan({
    url: settings.apiUrl + "/rooms/all_channels",
    onSuccess: channelsResived.type,
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

export const createUser = (
  password,
  accountType,
  firstName,
  lastName,
  displayName,
  email,
  phone,
  status = "active"
) =>
  apiCallBegan({
    url: url + "/create_user",
    method: "post",
    data: {
      password,
      accountType,
      firstName,
      lastName,
      displayName,
      email,
      phone,
      status,
    },
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });
export const editUserData = (
  accountType,
  displayName,
  firstName,
  lastName,
  email,
  phone,
  userId
) =>
  apiCallBegan({
    url: url + "/edit_user_data",
    method: "post",
    data: {
      accountType,
      displayName,
      firstName,
      lastName,
      email,
      phone,
      userId,
    },
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });

export const activateUserById = (userId) =>
  apiCallBegan({
    url: url + "/activate_user/" + userId,
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });

export const getRoomUsersById = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId]
  );

export const allUsers = () =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers
  );

export const selectAllChannels = () =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allChannels
  );

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.errorMessage
  );
