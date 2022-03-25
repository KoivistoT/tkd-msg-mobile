import axios from "axios";
import * as actions from "../actions";
import { navigationRef } from "../../app/navigation/rootNavigation";
import settings from "../../config/settings";
import { useSelector } from "react-redux";
import { clearTasks, selectCurrentUserToken } from "../currentUser";
import { errorMessageAdded } from "../general";
import { createSocketConnection } from "../socket";
import { getRestMessages } from "../msgStore";
import routes from "../../app/navigation/routes";
import { notificationResponseCleared } from "../rooms";
const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError, onInitSuccess } =
      action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);
    // console.log(onStart);
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
        // dispatch(createSocketConnection()); //tämä jos tulee liian nopeasti ei reagoi huoneisiin laitettaviin viesteihin, eli voi siirtää alas tarvittaessas
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

        //tästä ainakin osa voi olla jossain funcissa
        const responseRoomId =
          getState().entities.rooms.lastNotificationResponseRoomId;
        if (responseRoomId) {
          try {
            const roomData = getState().entities.rooms.allRooms[responseRoomId];
            navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
            dispatch(notificationResponseCleared());
          } catch (error) {
            console.log(error, "app.js responselistener");
          }
        }

        // dispatch({ type: onInitSuccess.members, payload: response.data.members });
        return;
      }
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
        // dispatch(errorMessageAdded(error.response.data));
      }
    }
  };

export default api;
