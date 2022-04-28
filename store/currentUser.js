import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { roomsResived } from "./rooms";
import { allImagesResived, messagesResived } from "./msgStore";
import { usersResived } from "./users";

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
  },
  reducers: {
    userLoggedIn: (currentUser, action) => {
      const user = action.payload ? jwtDecode(action.payload) : null;

      currentUser.error = null;
      currentUser.loading = false;
      currentUser.loggedIn = true;
      currentUser.accountType = user.accountType;
      currentUser.userPushNotificationToken = user.pushNotificationToken;
      currentUser._id = user._id;
      currentUser.token = action.payload;
    },

    currentUserResived: (currentUser, action) => {
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

    loginFailed: (currentUser, action) => {
      // console.log(action.payload, "ei onnistu");

      currentUser.token = null;
      currentUser.error = action.payload;
    },
    tasksCleared: (currentUser, action) => {
      currentUser.tasks = [];
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
      console.log(action.payload, "code 92992881");
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
  tasksCleared,
  lastSeenMessageSumResived,
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

export const editPassword = (email, password) =>
  //pitääkö olla et katsoo onko jo käuyttäjä
  apiCallBegan({
    url: url + "/users/edit_password",
    method: "post",
    data: { email, password },
    onStart: currentUserRequestStarted.type,
    // onSuccess: userLoggedIn.type,
    // onError: loginFailed.type,
  });

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

export const clearTasks = (currentUserId) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: url + "/tasks/clear_tasks/" + currentUserId,
      onSuccess: tasksCleared.type,
    })
  );
};

export const getCurrentUserById = (userId) => (dispatch, getState) => {
  //pitääkö olla et katsoo onko jo käuyttäjä

  return dispatch(
    apiCallBegan({
      url: url + "/users/" + getState().auth.currentUser._id,
      onSuccess: currentUserResived.type,
      onError: currentUserError.type,
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
        onError: currentUserError.type,
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

export const selectCurrentUserId = (store) =>
  store.getState().auth.currentUser._id;

export const selectUserName = (store) =>
  store.getState().auth.currentUser.email;

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
