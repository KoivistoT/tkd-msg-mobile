import { combineReducers } from "redux";
import bugReducer from "./bugs";
import authReducer from "./auth";
import generalReducer from "./general";
import roomsReducer from "./rooms";

export default combineReducers({
  bugs: bugReducer,
  auth: authReducer,
  general: generalReducer,
  rooms: roomsReducer,
});
