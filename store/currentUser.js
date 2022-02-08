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
  },
  reducers: {
    // action => action handler
    userLoggedIn: (currentUser, action) => {
      const user = action.payload ? jwtDecode(action.payload) : null;
      currentUser.error = null;
      currentUser.loading = false;
      currentUser.token = action.payload;
      currentUser.email = user.email;
      currentUser.name = user.name;
      currentUser._id = user._id;
      currentUser.loggedIn = true;

      // console.log("ei tule backendistä nuo huoneet userRooms");
    },
    userResived: (currentUser, action) => {
      // console.log(action.payload, "tässä käyttäjän tiedot");
      currentUser.userRooms = action.payload[0].userRooms;
      // console.log(action.payload.userRooms);
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
      currentUser.error = null;
      currentUser.loading = false;
      currentUser.token = null;
      currentUser.email = null;
      currentUser.name = null;
      currentUser._id = null;
      currentUser.loggedIn = false;
      currentUser.userRooms = [];
      // console.log(currentUser);
    },
    errorMessageCleared: (currentUser, action) => {
      currentUser.error = null;
      currentUser.loading = false;
    },
  },
});

export const {
  userLoggedIn,
  userResived,
  loginFailed,
  userLoggedOut,
  errorMessageCleared,
  userFetchFaild,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getInitialData = (email, password) =>
  // currentUserInit({
  console.log("jostain syystä tämä epäonnistuus");
apiCallBegan({
  url: url + "/init",
  // method: "post",
  // data: {},
  onSuccess: {
    init: true,
    user: userLoggedIn.type,
    rooms: "tallentaa ne dispatchilla",
    members: "jotain muuta",
    messages: "tallentaa nämä",
  },
  // onError: loginFailed.type,
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
      onSuccess: userResived.type,
      onError: userFetchFaild.type,
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

export const selectToken = (state) => state.auth.currentUser.token;

export const isLoggedIn = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.isLoggedIn
);

export const getToken = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.token
);

export const getCurrentUserRooms = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.userRooms
);

export const getCurrentUser = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser
);
