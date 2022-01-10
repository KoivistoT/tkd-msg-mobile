import { combineReducers } from "redux";
import bugReducer from "./bugs";
import generalReducer from "./general";
import roomsReducer from "./rooms";
import socketReducer from "./socket";
import usersReducer from "./users";

export default combineReducers({
  bugs: bugReducer,
  general: generalReducer,
  rooms: roomsReducer,
  socket: socketReducer,
  users: usersReducer,
});
