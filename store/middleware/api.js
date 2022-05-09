import axios from "axios";
import * as actions from "../actions";
import { navigate } from "../../app/navigation/rootNavigation";
import settings from "../../config/settings";
import { selectCurrentUserToken } from "../currentUser";
import {
  errorMessageAdded,
  requestStateResived,
  requestStateUpdated,
} from "../general";
import { getRestMessages } from "../msgStore";
import routes from "../../app/navigation/routes";
import { notificationResponseCleared } from "../rooms";

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) {
      return next(action);
    }

    const {
      url,
      method,
      data,
      onStart,
      onSuccess,
      onError,
      onInitSuccess,
      followRequestState,
    } = action.payload;

    if (onStart) {
      dispatch({ type: onStart });
    }
    next(action);

    if (followRequestState) {
      dispatch(
        requestStateResived({ id: followRequestState, state: "started" })
      );
    }

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

      if (onInitSuccess) {
        onInitSuccessFunctions(dispatch, onInitSuccess, response, getState);
      }

      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data });
      }

      if (onSuccess && followRequestState) {
        dispatch(
          requestStateUpdated({ id: followRequestState, state: "succeed" })
        );
      }
    } catch (error) {
      errorFunctions(dispatch, onError, error, followRequestState);
    }
  };

const onInitSuccessFunctions = (
  dispatch,
  onInitSuccess,
  response,
  getState
) => {
  dispatch({ type: onInitSuccess.user, payload: response.data.user });
  dispatch({ type: onInitSuccess.rooms, payload: response.data.rooms });
  dispatch({
    type: onInitSuccess.messages,
    payload: response.data.messages,
  });

  dispatch(
    getRestMessages({
      currentUserId: getState().auth.currentUser._id,
      messagesNow: response.data.messages,
    })
  );

  dispatch({
    type: onInitSuccess.images,
    payload: response.data.allImages,
  });

  dispatch({
    type: onInitSuccess.users,
    payload: response.data.allUsers,
  });

  const responseRoomId =
    getState().entities.rooms.lastNotificationResponseRoomId;

  if (responseRoomId) {
    try {
      const roomData = getState().entities.rooms.allRooms[responseRoomId];

      if (!roomData) {
        return;
      }

      navigate(routes.MESSAGE_SCREEN, roomData);
      dispatch(notificationResponseCleared());
    } catch (error) {
      dispatch(errorMessageAdded("Something faild"));
    }
  }
};

const errorFunctions = (dispatch, onError, error, followRequestState) => {
  dispatch(actions.apiCallFailed(error.message));

  if (onError) {
    dispatch({
      type: onError,
      payload:
        error.response && error.response.data
          ? error.response.data
          : "Something faild",
    });

    if (error.response && error.response.data) {
      dispatch(errorMessageAdded(error.response.data));
    }
  }

  if (onError && followRequestState) {
    dispatch(requestStateUpdated({ id: followRequestState, state: "error" }));
  }
};
export default api;
