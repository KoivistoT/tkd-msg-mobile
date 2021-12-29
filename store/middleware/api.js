import axios from "axios";
import * as actions from "../api";
import settings from "../../config/settings";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    try {
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
      if (onError)
        dispatch({
          type: onError,
          payload:
            // error.response.status === 400 ? error.response.data : error.message,
            error.response.status === 400 || error.response.status === 401
              ? error.response.data
              : "Something faild",
        });
    }
  };

export default api;
