import { createAction } from "@reduxjs/toolkit";

export const apiCallBegan = createAction("api/callBegan");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");

export const createSocketConnectionBegan = createAction(
  "createScoketConnection/began"
);
export const createSocketConnectionSuccess = createAction(
  "createScoketConnection/success"
);
export const createSocketConnectionFaild = createAction(
  "createScoketConnection/failed"
);

export const errorMessage = createAction("general/errorMessage");
