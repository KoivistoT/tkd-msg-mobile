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
import { apiCallBegan } from "./api";
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

    loginFaild: (auth, action) => {
      //tämä ei ehkä oikea tapa tehdä tätä
      auth.token = null;
      auth.error = action.payload;
    },
    userLoggedOut: (auth, action) => {
      //tämä ei ehkä oikea tapa tehdä tätä
      auth.token = null;
      auth.user = null;
      auth.loggedIn = false;
    },
  },
});

export const { userLoggedIn, loginFaild, userLoggedOut } = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const login = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onSuccess: userLoggedIn.type,
    onError: loginFaild.type,
  });

export const selectToken = (state) => state.entities.auth.token;

export const getUser = createSelector(
  (state) => state,
  (auth) => (auth.token ? jwtDecode(auth.token) : null)
);
