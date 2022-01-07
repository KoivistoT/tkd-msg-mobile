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

import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    email: null,
    _id: null,
    name: null,
    loading: false,
    token: null,
    error: null,
    loggedIn: false,
  },
  reducers: {
    // action => action handler
    userLoggedIn: (auth, action) => {
      const user = action.payload ? jwtDecode(action.payload) : null;
      auth.error = null;
      auth.loading = false;
      auth.token = action.payload;
      auth.email = user.email;
      auth.name = user.name;
      auth._id = user._id;
      auth.loggedIn = true;
    },

    loginFailed: (auth, action) => {
      auth.token = null;
      auth.error = action.payload;
    },
    userLoggedOut: (auth, action) => {
      //tämä ei ehkä oikea tapa tehdä tätä
      auth.error = null;
      auth.loading = false;
      auth.token = null;
      auth.email = null;
      auth.name = null;
      auth._id = null;
      auth.loggedIn = false;
      // console.log(auth);
    },
    errorMessageCleared: (auth, action) => {
      auth.error = null;
      auth.loading = false;
    },
  },
});

export const { userLoggedIn, loginFailed, userLoggedOut, errorMessageCleared } =
  slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const login = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onSuccess: userLoggedIn.type,
    onError: loginFailed.type,
  });

export const logout = () => {
  console.log("tämä suoraan logout siellä missä onkaan");
  userLoggedOut();
};

export const onLoginFailed = () => {
  loginFailed();
};

export const selectToken = (state) => state.entities.auth.token;

export const isLoggedIn = createSelector(
  (state) => state,
  (auth) => auth
);

export const getToken = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.token
);
