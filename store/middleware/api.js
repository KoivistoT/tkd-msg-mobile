import axios from "axios";
import * as actions from "../actions";

import settings from "../../config/settings";
import { useSelector } from "react-redux";
import { getToken } from "../auth";

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    try {
      axios.defaults.headers.common["x-auth-token"] = getToken(getState());
      const response = await axios.request({
        baseURL: settings.apiUrl,
        url,
        method,
        data,
      });

      dispatch(actions.apiCallSuccess(response.data));

      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      dispatch(actions.apiCallFailed(error.message));
      console.log(error);
      if (onError)
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
    }
  };

export default api;
