import { successMessageAdded } from "../general";

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
      case "rooms/membersChanged":
        dispatch(successMessageAdded("onnnistui "));
        break;

      default:
        next(action);
        break;
    }
  };

export default toast;
