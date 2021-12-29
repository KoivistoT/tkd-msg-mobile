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
  initialState: { user: null, loading: false, token: null, error: null },
  reducers: {
    // action => action handler
    userLoggedIn: (auth, action) => {
      auth.error = null;
      auth.loading = false;
      auth.token = action.payload;
    },

    loginFaild: (auth, action) => {
      //tämä ei ehkä oikea tapa tehdä tätä
      auth.token = null;
      auth.error = action.payload;
    },
  },
});

export const { userLoggedIn, loginFaild } = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const loggin = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä

  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onSuccess: userLoggedIn.type,
    onError: loginFaild.type,
  });

export const getUser = createSelector(
  (state) => state,
  (auth) => (auth.token ? jwtDecode(auth.token) : null)
);
