import { combineReducers } from "redux";
import currentUserReducer from "./currentUser";

export default combineReducers({
  currentUser: currentUserReducer,
});
