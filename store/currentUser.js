import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan, apiCallFailed, apiCallSuccess } from "./actions";
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
    lastSeenMessages: [],
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
      const { email, lastSeenMessages, userRooms } = action.payload;
      currentUser.email = email;
      currentUser.lastSeenMessages = lastSeenMessages;
      currentUser.userRooms = userRooms;
    },
    lastSeenMessageSumResived: (currentUser, action) => {
      const lastSeeObjectsNow = currentUser.lastSeenMessages;
      const { roomId, lastSeenMessageSum } = action.payload;

      const index = lastSeeObjectsNow.findIndex(
        (object) => object.roomId === roomId
      );

      if (index === -1) {
        lastSeeObjectsNow.push(action.payload);
      } else {
        lastSeeObjectsNow[index].lastSeenMessageSum = lastSeenMessageSum;
      }
    },

    loginFailed: (currentUser, action) => {
      currentUser.token = null;
      currentUser.error = action.payload;
    },
    tasksCleared: (currentUser) => {
      currentUser.tasks = [];
    },

    userLoggedOut: (currentUser) => {
      currentUser.user = null;
      currentUser.accountType = null;
      currentUser.error = null;
      currentUser.loading = false;
      currentUser.token = null;
      currentUser.email = null;
      currentUser.name = null;
      currentUser._id = null;
      currentUser.loggedIn = false;
      currentUser.userRooms = [];
      currentUser.userPushNotificationToken = null;
      currentUser.lastSeenMessages = [];
    },
    errorMessageCleared: (currentUser) => {
      currentUser.error = null;
      currentUser.loading = false;
    },
    currentUserError: (currentUser) => {
      currentUser.loading = false;
    },

    currentUserRequestStarted: (currentUser) => {
      currentUser.loading = false;
    },
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
    messages: messagesResived.type,
    images: allImagesResived.type,
    users: usersResived.type,
  },
  onError: currentUserError.type,
});

export const login = (email, password) =>
  apiCallBegan({
    url: url + "/auth",
    method: "post",
    data: { email, password },
    onStart: currentUserRequestStarted.type,
    onSuccess: userLoggedIn.type,
    onError: loginFailed.type,
  });

export const editPassword = (email, password) =>
  apiCallBegan({
    url: url + "/users/edit_password",
    method: "post",
    data: { email, password },
    onStart: currentUserRequestStarted.type,
    onSuccess: apiCallSuccess.type,
    onError: apiCallFailed.type,
  });

export const removeOlderTasksItemsById = (currentUserId, taskId) =>
  apiCallBegan({
    url: url + "/tasks/remove_older_tasks_items",
    method: "post",
    data: { currentUserId, taskId },
    onSuccess: apiCallSuccess.type,
    onError: currentUserError.type,
  });

export const clearTasks = (currentUserId) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + "/tasks/clear_tasks/" + currentUserId,
      onSuccess: tasksCleared.type,
      onError: currentUserError.type,
    })
  );
};

export const saveLastSeenMessageSum =
  (currentUserId, roomId, lastSeenMessageSum) => (dispatch) => {
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
        onSuccess: apiCallSuccess.type,
        onError: currentUserError.type,
      })
    );
  };

export const selectLastSeenMessagSumByRoomId = (store, roomId) => {
  const index = store
    .getState()
    .auth.currentUser.lastSeenMessages.findIndex(
      (object) => object.roomId === roomId
    );

  return index >= 0
    ? store.getState().auth.currentUser.lastSeenMessages[index]
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
        auth.currentUser.lastSeenMessages[
          auth.currentUser.lastSeenMessages.findIndex(
            (object) => object.roomId === roomId
          )
        ];

      return condition !== undefined ? condition.lastSeenMessageSum : 0;
    }
  );
