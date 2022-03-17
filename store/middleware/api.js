import axios from "axios";
import * as actions from "../actions";

import settings from "../../config/settings";
import { useSelector } from "react-redux";
import { clearTasks, selectCurrentUserToken } from "../currentUser";
import { errorMessageAdded } from "../general";
import { createSocketConnection } from "../socket";
const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError, onInitSuccess } =
      action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      axios.defaults.headers.common["x-auth-token"] = selectCurrentUserToken(
        getState()
      );
      const response = await axios.request({
        baseURL: settings.apiUrl,
        url,
        method,
        data,
      });

      dispatch(actions.apiCallSuccess(response.data));
      // console.log(
      //   response.data.success,
      //   "messagen succes, mieti tulisiko tämä aina, onko apua success jutusta?"
      // );

      if (onInitSuccess) {
        //tämä voisi olla myös functiolla joka on alhaalla, jotta tämä selkeämpi, tai sitten function on ihan jossain muualla
        // dispatch({ type: onInitSuccess.messages, payload: response.data.messages });

        dispatch({ type: onInitSuccess.user, payload: response.data.user });
        dispatch(createSocketConnection()); //tämä jos tulee liian nopeasti ei reagoi huoneisiin laitettaviin viesteihin, eli voi siirtää alas tarvittaessas
        dispatch({ type: onInitSuccess.rooms, payload: response.data.rooms });
        dispatch({
          type: onInitSuccess.messages,
          payload: response.data.messages,
        });
        dispatch({
          type: onInitSuccess.images,
          payload: response.data.allImages,
        });
        dispatch({
          type: onInitSuccess.users,
          payload: response.data.allUsers,
        });
        dispatch(clearTasks(getState().auth.currentUser._id));

        // dispatch({ type: onInitSuccess.members, payload: response.data.members });
        return;
      }
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      dispatch(actions.apiCallFailed(error.message));
      console.log(error, "täältä tulee error1", onSuccess);
      if (onError) {
        dispatch({
          type: onError,
          payload:
            // error.response.status === 400 ? error.response.data : error.message,
            //tässä ehkä pitää miettiä toista raktaisua voi olla esim 403 ja silti viesti
            //  error.response.status >= 400 &&
            // error.response.status < 500
            //nuo yllä vidly reactista
            error.response && error.response.data
              ? error.response.data || error.response.message
              : "Something faild",
        });
        // dispatch(errorMessageAdded(error.response.data));
      }
    }
  };

export default api;
