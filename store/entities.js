import { combineReducers } from "redux";
import bugReducer from "./bugs";
import generalReducer from "./general";
import roomReducer from "./rooms";
import socketReducer from "./socket";
import userReducer from "./users";
import msgStoreReducer from "./msgStore";

import usersControlReducer from "./usersControl";
// import memberReducer from "./members";

export default combineReducers({
  bugs: bugReducer,
  general: generalReducer,
  rooms: roomReducer,
  socket: socketReducer,
  users: userReducer,
  msgStore: msgStoreReducer,

  usersControl: usersControlReducer,
  // members: memberReducer,
});
