import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan, apiCallSuccess } from "./actions";
import settings from "../config/settings";
import memoize from "proxy-memoize";

const slice = createSlice({
  name: "users",
  initialState: {
    allUsers: {},
    usersOnline: {},
    allUsersId: [],
  },

  reducers: {
    usersResived: (users, action) => {
      users.allUsers = action.payload;
      users.allUsersId = Object.keys(action.payload);
    },
    usersStoreCleared: (users, action) => {
      users.allUsers = {};
      users.usersOnline = {};
      users.allUsersId = [];
    },
    usersOnlineResived: (users, action) => {
      users.usersOnline = action.payload;
    },
    userTasksResived: (users, action) => {
      let newState = { ...users };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "userArchived") {
          const userId = data;
          newState.allUsers[userId].status = "archived";
        }
        if (taskType === "userActivated") {
          const userId = data;
          newState.allUsers[userId].status = "active";
        }
        if (taskType === "newUser") {
          const { _id: userId } = data;
          Object.assign(newState.allUsers, { [userId]: data });
        }
        if (taskType === "userTemporaryDeleted") {
          const userId = data;
          newState.allUsers[userId].status = "deleted";
        }
        if (taskType === "userDataEdited") {
          const { _id: userId } = data;
          newState.allUsers[userId] = data;
        }
      });
      users = newState;
    },
    usersError: (users, action) => {
      users.errorMessage = action.payload;
    },
    usersErrorMessageCleared: (users, action) => {
      users.errorMessage = null;
    },
    userDataFieldEdited: (users, action) => {
      action.payload.forEach((item) => {
        const { currentUserId, fieldName, value } = item;
        users.allUsers[currentUserId][fieldName] = value;
      });
    },
    userLastPresentResived: (users, action) => {
      const { userId, last_present } = action.payload;
      users.allUsers[userId].last_present = last_present;
    },
  },
});

export const {
  usersResived,
  userDataFieldEdited,
  usersError,
  usersOnlineResived,
  userLastPresentResived,
  usersErrorMessageCleared,
  requestSucceed,
  userTasksResived,
  usersStoreCleared,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/users";

export const archiveOrDeleteUserById = (userId, status, currentUserId) =>
  apiCallBegan({
    url: url + "/archive_or_delete_user",
    method: "post",
    data: {
      userId,
      status,
      currentUserId,
    },

    onSuccess: apiCallSuccess.type,
    onError: usersError.type,
  });

export const getUserLastPresentByUserId = (userId) =>
  apiCallBegan({
    url: url + "/get_last_user_last_present",
    method: "post",
    data: {
      userId,
    },
    onSuccess: userLastPresentResived.type,
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
    onSuccess: apiCallSuccess.type,
    onError: usersError.type,
  });

export const editUserData = (data) =>
  apiCallBegan({
    url: url + "/edit_user_data",
    method: "post",
    data,
    onSuccess: apiCallSuccess.type,
    onError: usersError.type,
  });

export const saveEditedUserdata = (data) =>
  apiCallBegan({
    url: url + "/save_edited_user_data",
    method: "post",
    data: {
      data,
    },
    onSuccess: apiCallSuccess.type,
    onError: usersError.type,
  });

export const activateUserById = (userId, currentUserId) =>
  apiCallBegan({
    url: url + "/activate_user/",
    method: "post",
    data: {
      userId,
      currentUserId,
    },

    onSuccess: apiCallSuccess.type,
    onError: usersError.type,
  });

export const selectUserById = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId]
  );

export const selectLastPresentByUserId = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId]?.last_present
  );

export const selectUsersOnline = createSelector(
  (state) => state.entities.users,
  (users) => users.usersOnline
);

export const selectAllUsersAllData = memoize((state) => {
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const {
        _id,
        firstName,
        lastName,
        accountType,
        displayName,
        email,
        phone,
        status,
        userRooms,
      } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          accountType,
          displayName,
          email,
          phone,
          status,
          userRooms: userRooms ? [...userRooms] : null,
        },
      });
    },
    {}
  );
});

export const selectAllUsersMinimal = memoize((state) => {
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const { _id, firstName, lastName, displayName } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          displayName,
        },
      });
    },
    {}
  );
});

export const selectAllUsersMedium = memoize((state) => {
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const { _id, firstName, lastName, displayName, status } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          displayName,
          status,
        },
      });
    },
    {}
  );
});
