import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "general",
  initialState: {
    errorMessage: null,
    successMessage: null,
    errorMessageVisibleTime: 3000,
    successMessageVisibleTime: 3000,
    loading: false,
    messageFormFocus: false,
    selectedMessage: null,
    pushNotificationPressed: false,
    newMessage: null,
    requestStates: [],
    loadingMessage: "",
  },
  reducers: {
    generalStoreCleared: (general, action) => {
      general.errorMessage = null;
      general.successMessage = null;
      general.errorMessageVisibleTime = 3000;
      general.successMessageVisibleTime = 3000;
      general.loading = false;
      general.messageFormFocus = false;
      general.selectedMessage = null;
      general.pushNotificationPressed = false;
      general.newMessage = null;
      general.requestStates = [];
      general.loadingMessage = "";
    },
    errorMessageAdded: (general, action) => {
      general.errorMessageVisibleTime = 3000;
      general.errorMessage = action.payload;
    },
    successMessageAdded: (general, action) => {
      general.successMessageVisibleTime = 2000;
      general.successMessage = action.payload;
    },
    errorMessageCleared: (general, action) => {
      general.errorMessage = null;
    },
    successMessageCleared: (general, action) => {
      general.successMessage = null;
    },
    startLoad: (general, action) => {
      general.loadingMessage = action.payload;
      general.loading = true;
    },
    endLoad: (general, action) => {
      general.loadingMessage = "";
      general.loading = false;
    },
    messageFormFocusAdded: (general, action) => {
      general.messageFormFocus = true;
    },
    messageFormFocusCleared: (general, action) => {
      general.messageFormFocus = false;
    },
    messageSelected: (general, action) => {
      general.selectedMessage = action.payload;
    },
    pushNotificationPressed: (general, action) => {
      general.pushNotificationPressed = true;
    },
    pushNotificationPressedDeactivated: (general, action) => {
      general.pushNotificationPressed = false;
    },
    messageSelectionRemoved: (general, action) => {
      general.selectedMessage = null;
    },
    newMessageResived: (general, action) => {
      general.newMessage = action.payload;
    },
    newMessageCleared: (general, action) => {
      general.newMessage = null;
    },
    requestStateResived: (general, action) => {
      general.requestStates.push(action.payload);
    },
    requestStateUpdated: (general, action) => {
      const { state, id } = action.payload;
      const index = general.requestStates.findIndex((item) => item.id === id);
      if (index >= 0) {
        general.requestStates[index].state = state;
      }
    },
    requestStateRemoved: (general, action) => {
      const { id } = action.payload;
      const index = general.requestStates.findIndex((item) => item.id === id);
      if (index >= 0) {
        general.requestStates.splice(index, 1);
      }
    },
  },
});

export const {
  errorMessageAdded,
  requestStateUpdated,
  requestStateRemoved,
  requestStateResived,
  newMessageResived,
  newMessageCleared,
  messageFormFocusAdded,
  pushNotificationPressed,
  pushNotificationPressedDeactivated,
  messageSelected,
  messageSelectionRemoved,
  messageFormFocusCleared,
  startLoad,
  endLoad,
  errorMessageCleared,
  successMessageAdded,
  successMessageCleared,
  generalStoreCleared,
} = slice.actions;

export const selectMessageFormFocus = createSelector(
  (state) => state.entities.general,
  (general) => general.messageFormFocus
);
export const selectSelectedMessage = createSelector(
  (state) => state.entities.general,
  (general) => general.selectedMessage
);

export const isPushNotificationPressed = (store) =>
  store.getState().entities.general.pushNotificationPressed;

export const selectRequestStateById = (id) =>
  createSelector(
    (state) => state.entities.general,
    (general) => {
      return general.requestStates.filter((request) => request.id === id);
    }
  );

export default slice.reducer;
