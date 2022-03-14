import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import settings from "../config/settings";
import {
  getMessagesbyId,
  getRoomImages,
  messageDeleted,
  messagesRemoved,
  newMessageResived,
} from "./msgStore";
import {
  roomAdded,
  roomRemoved,
  roomArchived,
  roomActivated,
  roomNameChanged,
  membersChanged,
  roomMembersChanged,
  roomLatestMessageChanged,
} from "./rooms";

import {
  newUserResived,
  userArchived,
  userDeleted,
  userActivated,
  userTemporaryDeleted,
  userDataEdited,
} from "./users";

const slice = createSlice({
  name: "socket",
  initialState: {
    connection: null,
  },
  reducers: {
    socketConnected: (socket, action) => {
      socket.connection = action.payload;
    },
    socketDisconnected: (socket, action) => {
      socket.connection = null;
      // console.log(action.payload, "appCode 12312593");
    },
    connectionError: (socket, action) => {
      console.log(action.payload, "tästä tuli2");
    },
  },
});

export const { socketConnected, connectionError, socketDisconnected } =
  slice.actions;

export const createSocketConnection = (userId) => (dispatch, getState) => {
  const accountType = getState().auth.currentUser.accountType;

  try {
    const socket = io(settings.baseUrl, {
      //nämä arvot on erittäin tärkeitä,
      transports: ["websocket"],
      // jsonp: false,
    });

    socket.on("connect", () => {
      if (socket.connected) {
        dispatch(socketConnected(socket));
      }

      socket.on("updates", (type, data) => {
        if (type === "roomAdded") {
          const { _id: roomId } = data;
          dispatch(roomAdded(data));
          dispatch(getMessagesbyId(roomId));
          dispatch(getRoomImages(roomId));
          socket.emit("subscribe", roomId);
          const userId = getState().auth.currentUser._id;

          //jos tämä tuo erroria, kokeile tehdä sisälle toinen if, jossa tarkistaa, että huone löytyy
          if (data.roomCreator === userId) {
            navigationRef.current.navigate(routes.MESSAGE_SCREEN, data);
          }
        }
        if (type === "roomRemoved") {
          const roomId = data;
          socket.emit("unsubscribe", roomId);
          dispatch(roomRemoved(roomId));
          dispatch(messagesRemoved(roomId));
        }
        if (type === "newUser") {
          dispatch(newUserResived(data));
        }
        if (type === "userDeleted") {
          const userId = data;
          dispatch(userDeleted(userId));
        }
        if (type === "userTemporaryDeleted") {
          const userId = data;
          dispatch(userTemporaryDeleted(userId));
        }
        if (type === "userArchived") {
          const userId = data;
          dispatch(userArchived(userId));
        }
        if (type === "roomArchived") {
          const roomId = data;
          dispatch(roomArchived(roomId));
        }
        if (type === "roomNameChanged") {
          dispatch(roomNameChanged(data));
        }
        if (type === "userDataEdited") {
          dispatch(userDataEdited(data));
        }
        if (type === "readByRecepientsResived") {
          console.log(data, "tämä sitten sinne read by juttuun storessa");
        }
        if (type === "userActivated") {
          const userId = data;
          dispatch(userActivated(userId));
        }
        if (type === "roomActivated") {
          const roomId = data;
          dispatch(roomActivated(roomId));
        }

        if (type === "membersChanged") {
          dispatch(roomMembersChanged(data));
        }
        if (type === "roomLatestMessageChanged") {
          dispatch(roomLatestMessageChanged(data));
        }
        if (type === "messageDeleted") {
          dispatch(messageDeleted(data));
        }

        if (type === "new message") {
          dispatch(newMessageResived(data));
        }
      });

      socket.emit("identity", getState().auth.currentUser._id, accountType);

      if (!socket.connected) {
        dispatch(connectionError("Socket connection faild"));
      }

      // console.log("täällä mennee jo", getState().auth.currentUser.userRooms);
      getState().auth.currentUser.userRooms.forEach((roomId) => {
        // console.log("tänne subscripe", roomId);
        socket.emit("subscribe", roomId);
      });
    });
  } catch (error) {
    dispatch(connectionError(error));
  }
};

export const disconnectSocket = (userId) => {
  return async (dispatch, getState) => {
    // console.log(action.payload, "tästä tuli1");
    //saako nämä jotenkin nätemmin
    await getState().auth.currentUser.userRooms.forEach((roomId) => {
      getState().entities.socket.connection.emit("unsubscribe", roomId);
    });
    getState().entities.socket.connection.disconnect();
    dispatch(socketDisconnected("Socket disconnected"));
  };
};

export const saveSocket = (socket) => {};

export const selectSocket = createSelector(
  (state) => state.entities.socket,
  (socket) => socket.connection
);

export default slice.reducer;
