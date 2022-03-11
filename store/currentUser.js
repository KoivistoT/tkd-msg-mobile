// tänne ne mitä on auth storagessa
// tänne ne mitä on auth storagessa
// tänne ne mitä on auth storagessa
// tänne ne mitä on auth storagessa
// mieti miten useAuth. katso react kussista
// mieti miten useAuth. katso react kussista
// mieti miten useAuth. katso react kussista
// mieti miten useAuth. katso react kussista
// katso myös mitä clientissa
// katso myös mitä clientissa
// katso myös mitä clientissa
// katso myös mitä clientissa
// ekana tee auth logini tähän

import { createSlice, createSelector, current } from "@reduxjs/toolkit";
import { apiCallBegan, currentUserInit } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { roomsResived } from "./rooms";
import { allImagesResived, messagesResived } from "./msgStore";
import { usersResived } from "./users";
// import { createSelector } from "reselect";

const slice = createSlice({
  name: "currentUser",
  initialState: {
    user: null,
    email: null,
    _id: null,
    name: null,
    loading: false,
    token: null,
    error: null,
    loggedIn: false,
    userRooms: [],
    last_seen_messages: [],
  },
  reducers: {
    // action => action handler
    userLoggedIn: (currentUser, action) => {
      const user = action.payload ? jwtDecode(action.payload) : null;

      currentUser.error = null;
      currentUser.loading = false;
      currentUser.loggedIn = true;
      currentUser.accountType = user.accountType;
      currentUser._id = user._id;
      currentUser.token = action.payload;

      // console.log("ei tule backendistä nuo huoneet userRooms");
    },
    currentUserResived: (currentUser, action) => {
      // console.log(action.payload, "tässä käyttäjän tiedot");
      const { email, last_seen_messages, userRooms } = action.payload;
      currentUser.email = email;
      currentUser.last_seen_messages = last_seen_messages;
      currentUser.userRooms = userRooms;
    },
    lastSeenMessageSumResived: (currentUser, action) => {
      const lastSeeObjectsNow = currentUser.last_seen_messages;
      const { roomId, lastSeenMessageSum } = action.payload;

      const index = lastSeeObjectsNow.findIndex(
        (object) => object.roomId === roomId
      );

      index === -1
        ? lastSeeObjectsNow.push(action.payload)
        : (lastSeeObjectsNow[index].lastSeenMessageSum = lastSeenMessageSum);
    },
    userFetchFaild: (currentUser, action) => {
      console.log(action.payload, "error cod 99991");
    },
    loginFailed: (currentUser, action) => {
      currentUser.token = null;
      currentUser.error = action.payload;
    },
    userLoggedOut: (currentUser, action) => {
      //tämä ei ehkä oikea tapa tehdä tätä
      currentUser.accountType = null;
      currentUser.error = null;
      currentUser.loading = false;
      currentUser.token = null;
      currentUser.email = null;
      currentUser.name = null;
      currentUser._id = null;
      currentUser.loggedIn = false;
      currentUser.userRooms = [];
      currentUser.lastSeenMessageSum = [];
    },
    errorMessageCleared: (currentUser, action) => {
      currentUser.error = null;
      currentUser.loading = false;
    },
    currentUserError: (currentUser, action) => {
      console.log("error täällä code 92992881");
    },
    currentUserRequestStarted: (currentUser, action) => {},
  },
});

export const {
  userLoggedIn,
  currentUserResived,
  currentUserError,
  loginFailed,
  userLoggedOut,
  errorMessageCleared,
  currentUserRequestStarted,
  userFetchFaild,
  lastSeenMessageSumResived,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getInitialData = apiCallBegan({
  url: url + "/initial",
  onInitSuccess: {
    init: true,
    user: currentUserResived.type,
    rooms: roomsResived.type,
    messages: messagesResived.type,
    images: allImagesResived.type,
    users: usersResived.type,
  },
});

export const login = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onSuccess: userLoggedIn.type,
    onError: loginFailed.type,
  });

export const getCurrentUserById = (userId) => (dispatch, getState) => {
  //pitääkö olla et katsoo onko jo käuyttäjä

  return dispatch(
    apiCallBegan({
      url: url + "/users/" + getState().auth.currentUser._id,
      onSuccess: currentUserResived.type,
      onError: userFetchFaild.type,
    })
  );
};

export const saveLastSeenMessageSum =
  (currentUserId, roomId, lastSeenMessageSum) => (dispatch, getState) => {
    dispatch(lastSeenMessageSumResived({ roomId, lastSeenMessageSum }));
    return dispatch(
      apiCallBegan({
        url: url + "/users/save_last_seen_message_sum",
        method: "post",
        data: { currentUserId, roomId, lastSeenMessageSum },
        onSuccess: currentUserRequestStarted.type,
        onError: currentUserError.type,
      })
    );
  };

export const logout = () => {
  console.log("tämä suoraan logout siellä missä onkaan");
  userLoggedOut();
};

export const onLoginFailed = () => {
  loginFailed();
};

export const selectAccountType = (state) => state.auth.currentUser.accountType;

export const selectCurrentUserToken = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.token
);

export const selectCurrentUserData = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser
);

export const selectLastSeenMessagesById = (roomId) =>
  createSelector(
    (state) => state.auth,
    (auth) => {
      return auth.currentUser.last_seen_messages[
        auth.currentUser.last_seen_messages.findIndex(
          (object) => object.roomId === roomId
        )
      ].lastSeenMessageSum;
    }
  );
