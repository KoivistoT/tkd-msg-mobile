import { combineReducers } from "redux";
import bugReducer from "./bugs";
import authReducer from "./auth";

export default combineReducers({
  bugs: bugReducer,
  auth: authReducer,
});
