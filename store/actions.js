import { createAction } from "@reduxjs/toolkit";

export const apiCallBegan = createAction("api/callBegan");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");

export const errorMessage = createAction("general/errorMessage");

export const currentUserInit = createAction("currentUser/init");
