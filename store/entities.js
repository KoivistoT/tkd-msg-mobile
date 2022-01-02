import { combineReducers } from "redux";
import bugReducer from "./bugs";
import authReducer from "./auth";
import generalReducer from "./general";
import chatReducer from "./chats";

export default combineReducers({
  bugs: bugReducer,
  auth: authReducer,
  general: generalReducer,
  chats: chatReducer,
});
