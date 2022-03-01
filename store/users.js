import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
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
    newUserResived: (users, action) => {
      Object.assign(users.allUsers, action.payload);
    },
    userDeleted: (users, action) => {
      delete users.allUsers[action.payload];
    },

    usersError: (users, action) => {
      console.log(action.payload, "epännoistu appcode 1233322");
    },
  },
});

export const {
  usersResived,
  usersError,
  userCreated,
  newUserResived,
  userDeleted,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/users";

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });
