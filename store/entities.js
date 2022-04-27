import { combineReducers } from "redux";
import generalReducer from "./general";
import roomReducer from "./rooms";
import socketReducer from "./socket";
import userReducer from "./users";
import msgStoreReducer from "./msgStore";

// import memberReducer from "./members";

export default combineReducers({
  general: generalReducer,
  rooms: roomReducer,
  socket: socketReducer,
  users: userReducer,
  msgStore: msgStoreReducer,
});
