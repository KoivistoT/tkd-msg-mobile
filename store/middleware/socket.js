import settings from "../../config/settings";
import io from "socket.io-client";
import * as actions from "../actions";

const socket =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.createSocketConnectionBegan.type)
      return next(action);
    next(action);

    const { userId, onStart, url, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    try {
      const socket = io(url, {
        transports: ["websocket"],
        // jsonp: false,
      });

      socket.on("connect", () => {
        if (socket.connected) {
          dispatch(actions.createSocketConnectionSuccess(socket));
          if (onSuccess) dispatch({ type: onSuccess, payload: socket });
        }
        if (!socket.connected) {
          dispatch(actions.createSocketConnectionFaild("Connection faild"));

          if (onError)
            dispatch({
              type: onError,
              payload: "Socket connection faild",
            });
        }
      });
    } catch (error) {
      dispatch(actions.createSocketConnectionFaild("Something faild"));
      if (onError)
        dispatch({
          type: onError,
          payload: "Something faild",
        });
    }
  };

export default socket;
