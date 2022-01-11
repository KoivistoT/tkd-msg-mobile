import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "general",
  initialState: {
    errorMessage: null,
    errorMessageVisibleTime: 3000,
  },
  reducers: {
    error: (general, action) => {
      console.log(action.payload, "Tämä viesti menee toastiin!");
      general.errorMessageVisibleTime = 3000;
      general.errorMessage = action.payload;
    },
    errorMessageCleared: (general, action) => {
      console.log(action.payload, "Error message cleared");
      general.errorMessage = null;
    },
  },
});

export const { error, errorMessageCleared } = slice.actions;

export default slice.reducer;

export const getErrorMessage = createSelector(
  (state) => state.entities.general,
  (general) => general.errorMessage
);
