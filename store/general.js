import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "general",
  initialState: {
    errorMessage: null,
    successMessage: null,
    errorMessageVisibleTime: 3000,
    successMessageVisibleTime: 3000,
    doneTasksIds: [],
    loading: false,
    messageFormFocus: false,
    selectedMessage: null,
    pushNotificationPressed: false,
    newMessage: null,
  },
  reducers: {
    doneTaskIdResived: (general, action) => {
      general.doneTasksIds.push(action.payload);
    },
    errorMessageAdded: (general, action) => {
      // console.log(action.payload, "Tämä viesti menee toastiin!");
      general.errorMessageVisibleTime = 3000;
      general.errorMessage = action.payload;
    },
    successMessageAdded: (general, action) => {
      // console.log(action.payload, "Tämä viesti menee toastiin!");

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
      general.loading = true;
    },
    endLoad: (general, action) => {
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
      // console.log(general.selectedMessage, "valittu");
    },
    pushNotificationPressed: (general, action) => {
      general.pushNotificationPressed = true;
      // console.log(general.selectedMessage, "valittu");
    },
    pushNotificationPressedDeactivated: (general, action) => {
      general.pushNotificationPressed = false;
      // console.log(general.selectedMessage, "valittu");
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
  },
});

export const {
  errorMessageAdded,
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
  doneTaskIdResived,
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

export default slice.reducer;
