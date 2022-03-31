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
  },
});

export const {
  errorMessageAdded,
  messageFormFocusAdded,
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

export default slice.reducer;
