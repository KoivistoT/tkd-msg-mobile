import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "general",
  initialState: {
    errorMessage: null,
  },
  reducers: {
    error: (general, action) => {
      general.errorMessage = action.payload.errorMessage;
    },
  },
});

export const { error } = slice.actions;
export default slice.reducer;
