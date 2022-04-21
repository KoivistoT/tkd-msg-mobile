import { loginFailed } from "../currentUser";
import { errorMessageAdded, successMessageAdded } from "../general";
import { setRoomLoadingToFalse } from "../rooms";
import { createSocketConnection } from "../socket";

const toast =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // console.log(action);
    // if (action.type === "api/callFailed") {
    //   console.log(
    //     "tee tämä appToastifyllä tai jotenkin hyvin. tämä siis silloin jos ip väärin, eli network error. etenkin silloi"
    //   );
    //   console.log("Toastify:", action.payload);
    // } else return next(action);

    switch (action.type) {
      // case "users/usersResived": // tämä ei ole toastiin kuuluva
      //   dispatch(createSocketConnection());
      //   break;
      case "rooms/membersChanged":
        dispatch(successMessageAdded("Users changed"));
        break;
      // case "currentUser/loginFailed":
      //   dispatch(errorMessageAdded(action.payload));
      //   break;
      case "rooms/roomsError":
        dispatch(errorMessageAdded(action.payload));
        dispatch(setRoomLoadingToFalse());
        break;
      case "rooms/roomNameChanged":
        break;
      // case "rooms/roomCreated":
      //   dispatch(errorMessageAdded(action.payload));
      //   break;

      default:
        next(action);
        break;
    }
  };

export default toast;
