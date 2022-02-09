import { combineReducers } from "redux";
import bugReducer from "./bugs";
import generalReducer from "./general";
import roomReducer from "./rooms";
import socketReducer from "./socket";
import userReducer from "./users";
import messageReducer from "./messages";
// import memberReducer from "./members";

export default combineReducers({
  bugs: bugReducer,
  general: generalReducer,
  rooms: roomReducer,
  socket: socketReducer,
  users: userReducer,
  messages: messageReducer,
  // members: memberReducer,
});
