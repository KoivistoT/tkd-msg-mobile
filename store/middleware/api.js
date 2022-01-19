import axios from "axios";
import * as actions from "../actions";

import settings from "../../config/settings";
import { useSelector } from "react-redux";
import { getToken } from "../currentUser";
import { error as errorToast } from "../general";
const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      axios.defaults.headers.common["x-auth-token"] = getToken(getState());
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
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      dispatch(actions.apiCallFailed(error.message));
      console.log(error, "täältä tulee error1");
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
        dispatch(errorToast(error.response.data));
      }
    }
  };

export default api;
