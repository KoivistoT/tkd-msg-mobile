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
import { apiCallBegan, apiCallFailed, currentUserInit } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { requestStarted, roomsResived } from "./rooms";
import {
  allImagesResived,
  messagesResived,
  newMessageResived,
} from "./msgStore";
import { usersResived } from "./users";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
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
    userPushNotificationToken: null,
    last_seen_messages: [],
    tasks: [],
    doneTasksIds: [],
    currentRoomUnseenMessagesSum: null,
  },
  reducers: {
    // action => action handler

    unseenMessageSumResived: (currentUser, action) => {
      currentUser.currentRoomUnseenMessagesSum = action.payload.newMessagesSum;
    },
    unseenMessagesRemoved: (currentUser, action) => {
      currentUser.currentRoomUnseenMessagesSum = null;
    },
    userLoggedIn: (currentUser, action) => {
      const user = action.payload ? jwtDecode(action.payload) : null;

      currentUser.error = null;
      currentUser.loading = false;
      currentUser.loggedIn = true;
      currentUser.accountType = user.accountType;
      currentUser.userPushNotificationToken = user.pushNotificationToken;
      currentUser._id = user._id;
      currentUser.token = action.payload;

      // console.log("ei tule backendistä nuo huoneet userRooms");
    },
    currentUserLastSeenMessagesResived: (currentUser, action) => {
      if (action.payload) {
        currentUser.last_seen_messages = action.payload;
      }
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
    tasksResived: (currentUser, action) => {
      // console.log("täällä mennään");
      currentUser.tasks = action.payload.tasks;
    },
    loginFailed: (currentUser, action) => {
      console.log(action.payload, "ei onnistu");
      currentUser.token = null;
      currentUser.error = action.payload;
    },
    tasksCleared: (currentUser, action) => {
      currentUser.tasks = [];
    },
    doneTaskResived: (currentUser, action) => {
      currentUser.doneTasksIds.push(action.payload);
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
      console.log("error täällä code 92992881", action.payload);
    },
    lastSaveError: (currentUser, action) => {
      console.log("error täällä code 22");
    },
    currentUserRequestStarted: (currentUser, action) => {},
  },
});

export const {
  userLoggedIn,
  currentUserResived,
  currentUserError,
  lastSaveError,
  loginFailed,
  userLoggedOut,
  errorMessageCleared,
  currentUserRequestStarted,
  userFetchFaild,
  tasksResived,
  unseenMessagesRemoved,
  tasksCleared,
  unseenMessageSumResived,
  doneTaskResived,
  lastSeenMessageSumResived,
  currentUserLastSeenMessagesResived,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getInitialData = apiCallBegan({
  url: url + "/initial",
  onStart: currentUserRequestStarted.type,
  onInitSuccess: {
    init: true,
    user: currentUserResived.type,
    rooms: roomsResived.type,
    messages: messagesResived.type, // tällä hakee vain vähän alkuun kaikkiin
    images: allImagesResived.type,
    users: usersResived.type,
  },

  onError: currentUserError.type,
});

export const login = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onStart: currentUserRequestStarted.type,
    onSuccess: userLoggedIn.type,
    onError: loginFailed.type,
  });

export const saveLastPresent = () => (dispatch, getState) => {
  const currentUserId = getState().auth.currentUser._id;
  return dispatch(
    apiCallBegan({
      url: url + "/users/last_present/",
      method: "post",
      data: { currentUserId },
      onSuccess: currentUserRequestStarted.type,
      onError: currentUserError.type,
    })
  );
};
export const removeTasksItemById = (currentUserId, taskId) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/tasks/remove_tasks_item",
    method: "post",
    data: { currentUserId, taskId },
    // onSuccess: userLoggedIn.type,
    onError: currentUserError.type,
  });

export const removeOlderTasksItemsById = (currentUserId, taskId) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/tasks/remove_older_tasks_items",
    method: "post",
    data: { currentUserId, taskId },
    // onSuccess: userLoggedIn.type,
    onError: currentUserError.type,
  });

export const getTasks = (currentUserId) => (dispatch, getState) => {
  //pitääkö olla et katsoo onko jo käuyttäjä
  return dispatch(
    apiCallBegan({
      url: url + "/tasks/get_tasks/" + currentUserId,
      onSuccess: tasksResived.type,
      // onError: loginFailed.type,
    })
  );
};
export const clearTasks = (currentUserId) => (dispatch, getState) => {
  //pitääkö olla et katsoo onko jo käuyttäjä
  return dispatch(
    apiCallBegan({
      url: url + "/tasks/clear_tasks/" + currentUserId,
      onSuccess: tasksCleared.type,
      // onError: loginFailed.type,
    })
  );
};

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

export const saveCurrentUserPushToken =
  (currentUserPushToken) => (dispatch, getState) => {
    const currentUserId = getState().auth.currentUser._id;
    return dispatch(
      apiCallBegan({
        url: url + "/users/save_push_token/",
        method: "post",
        data: { currentUserId, currentUserPushToken },
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
        data: {
          currentUserId,
          roomId,
          lastSeenMessageSum,
        },
        onSuccess: currentUserRequestStarted.type,
        onError: lastSaveError.type,
      })
    );
  };

export const getUnseenMessageSum =
  (roomId, currentUserId) => (dispatch, getState) => {
    return dispatch(
      apiCallBegan({
        url: url + "/users/get_unseen_message_sum",
        method: "post",
        data: {
          currentUserId,
          roomId,
        },

        onSuccess: unseenMessageSumResived.type,
        //tämä väärä
        onError: lastSaveError.type,
      })
    );
  };

export const logout = () => {
  console.log("tämä suoraan logout siellä missä onkaan");
  userLoggedOut();
};

export const selectLastSeenMessagSumByRoomId = (store, roomId) => {
  const index = store
    .getState()
    .auth.currentUser.last_seen_messages.findIndex(
      (object) => object.roomId === roomId
    );
  return index >= 0
    ? store.getState().auth.currentUser.last_seen_messages[index]
        .lastSeenMessageSum
    : null;
};

export const selectAccountType = (state) => state.auth.currentUser.accountType;

export const selectCurrenUserId = (store) =>
  store.getState().auth.currentUser._id;

export const selectCurrentUserToken = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.token
);

export const selectCurrentUserData = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser
);
export const selectCurrentRoomNewMessagesSum = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.currentRoomUnseenMessagesSum
);

export const selectLastSeenMessagesById = (roomId) =>
  createSelector(
    (state) => state.auth,
    (auth) => {
      const condition =
        auth.currentUser.last_seen_messages[
          auth.currentUser.last_seen_messages.findIndex(
            (object) => object.roomId === roomId
          )
        ];
      return condition !== undefined ? condition.lastSeenMessageSum : 0;
    }
  );

export const selectTasks = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.tasks
);

export const selectDoneTasksIds = createSelector(
  (state) => state.auth,
  (auth) => auth.currentUser.doneTasksIds
);
