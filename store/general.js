import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "general",
  initialState: {
    errorMessage: null,
    successMessage: null,
    errorMessageVisibleTime: 3000,
    successMessageVisibleTime: 3000,
  },
  reducers: {
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
  },
});

export const {
  errorMessageAdded,
  errorMessageCleared,
  successMessageAdded,
  successMessageCleared,
} = slice.actions;

export default slice.reducer;

export const getErrorMessage = createSelector(
  (state) => state.entities.general,
  (general) => general.errorMessage
);
