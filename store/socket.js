import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import settings from "../config/settings";
import {
  createSocketConnectionBegan,
  createSocketConnectionSuccess,
} from "./actions";
import {
  getMessagesbyId,
  getRoomImages,
  messagesRemoved,
  newMessageResived,
} from "./msgStore";
import {
  roomAdded,
  roomRemoved,
  memberChanged,
  roomArchived,
  roomActivated,
} from "./rooms";

import { newUserResived, userDeleted } from "./users";
import {
  userControlNewUserResived,
  userControlUserArchived,
  userControlUserActivated,
  userControlUserDeleted,
} from "./usersControl";

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
      console.log(action.payload, "appCode 12312593");
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
      transports: ["websocket"],
      // jsonp: false,
    });

    socket.on("connect", () => {
      if (socket.connected) {
        dispatch(socketConnected(socket));
      }

      socket.on("updates", (type, data) => {
        // tee casella

        if (type === "roomAdded") {
          const roomId = data[Object.keys(data)]._id; // vai olisiko data[0]._id tämä
          const roomData = data[Object.keys(data)];
          // console.log(roomId, "tässä tämä");
          dispatch(roomAdded(data));
          dispatch(getMessagesbyId(roomId));
          dispatch(getRoomImages(roomId));
          socket.emit("subscribe", roomId);
          const userId = getState().auth.currentUser._id;
          console.log(
            "kun luo tai poistaa!!! uuden huoneen, tulisi latausindikaattori kaiken päälle, keskelle ruutua, josta tietää lataako"
          );
          //jos tämä tuo erroria, kokeile tehdä sisälle toinen if, jossa tarkistaa, että huone löytyy
          if (roomData.roomCreator === userId) {
            navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
          }
        }

        if (type === "roomRemoved") {
          const roomId = Object.keys(data);
          // console.log(roomId, "täällä removed id");
          socket.emit("unsubscribe", roomId);
          dispatch(roomRemoved(roomId));
          dispatch(messagesRemoved(roomId));
        }
        if (type === "newUser") {
          dispatch(newUserResived(data));
          if (accountType === "admin") {
            dispatch(userControlNewUserResived(data));
          }
        }
        if (type === "userDeleted") {
          const userId = Object.keys(data);

          dispatch(userDeleted(userId));
          if (accountType === "admin") {
            dispatch(userControlUserDeleted(userId));
          }
        }
        if (type === "userArchived") {
          const userId = Object.keys(data);

          dispatch(userDeleted(userId));
          if (accountType === "admin") {
            dispatch(userControlUserArchived(userId));
          }
        }

        if (type === "roomArchived") {
          const roomId = Object.keys(data);
          dispatch(roomArchived(roomId));
        }
        if (type === "userActivated") {
          const userId = Object.keys(data);

          dispatch(newUserResived(data));
          if (accountType === "admin") {
            dispatch(userControlUserActivated(userId));
          }
        }
        if (type === "roomActivated") {
          //tämä vain group huoneissa
          const roomId = Object.keys(data);
          dispatch(roomActivated(roomId));
        }

        if (type === "membersChanged") {
          dispatch(memberChanged(data[Object.keys(data)]));
        }
        // console.log("updates", type, data);
      });
      socket.emit("identity", getState().auth.currentUser._id, accountType); //hard code pois

      if (!socket.connected) {
        dispatch(connectionError("Socket connection faild"));
      }
      getState().auth.currentUser.userRooms.forEach((roomId) => {
        socket.emit("subscribe", roomId);
      });

      socket.on("new message", (data) => {
        dispatch(newMessageResived(data.message));
      });
    });
  } catch (error) {
    dispatch(connectionError("Something faild"));
  }
};

export const disconnectSocket = (userId) => {
  return async (dispatch, getState) => {
    // console.log(action.payload, "tästä tuli1");
    //saako nämä jotenkin nätemmin
    await getState().auth.currentUser.userRooms.forEach((roomId) => {
      console.log("lähti huoneesta roomId, unsbuscripe");
      getState().entities.socket.connection.emit("unsubscribe", roomId);
    });
    getState().entities.socket.connection.disconnect();
    dispatch(socketDisconnected("Socket disconnected"));
  };
};

export const saveSocket = (socket) => {};

export const selectSocket = (state) => state.entities.socket.connection;

export default slice.reducer;
