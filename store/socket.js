import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import settings from "../config/settings";
import { removeTaskItemById } from "./currentUser";
import {
  getMessagesbyId,
  getRoomImages,
  messageDeleted,
  messagesRemoved,
  msgNewTasksResived,
  newMessageResived,
  readByRecepientsAdded,
  selectMsgNewTasks,
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
  usersOnlineResived,
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
      // console.log("täällä kävi laittaa nulliksi");
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
        socket.emit("identity", getState().auth.currentUser._id, accountType);
      } else {
        console.log("socket connection error");
        dispatch(connectionError("Socket connection faild"));
      }
    });

    socket.emit("userOnline", getState().auth.currentUser._id);
    socket.on("userOnline", (data) => {
      dispatch(usersOnlineResived(data));
    });

    socket.on("updates", (tasks) => {
      // if (getState().entities.general.doneTasksIds.includes(taskId)) {
      //   console.log("on siellä jo tehty socket");
      //   dispatch(
      //     removeTaskItemById(getState().auth.currentUser._id, taskId)
      //   );
      //   return;
      // }

      // tässä jaottelee
      tasks.forEach((item) => {
        const { type } = item;

        if (type === "new message") {
          dispatch(msgNewTasksResived(item));
        }
      });

      // jaottelu loppuu
      return;
      if (type === "roomAdded") {
        console.log("ei täällä");
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
      if (type === "readByRecepientsAdded") {
        dispatch(readByRecepientsAdded(data));
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

      // if (type === "new message") {
      //   dispatch(newMessageResived(data));
      // }
    });

    // console.log("täällä mennee jo", getState().auth.currentUser.userRooms);
    getState().auth.currentUser.userRooms.forEach((roomId) => {
      // console.log("tänne subscripe", roomId);
      socket.emit("subscribe", roomId);
    });
  } catch (error) {
    dispatch(connectionError(error));
  }
};

export const disconnectSocket = (userId) => {
  return async (dispatch, getState) => {
    // console.log(action.payload, "tästä tuli1");
    //saako nämä jotenkin nätemmin
    const socket = getState().entities.socket.connection;

    socket.emit("userOffline", getState().auth.currentUser._id);
    socket.off("userOnline");

    await getState().auth.currentUser.userRooms.forEach((roomId) => {
      socket.emit("unsubscribe", roomId);
      socket.off("subscribe", roomId);
      // console.log("poistui täältä", roomId);
    });
    socket.disconnect();
    dispatch(socketDisconnected("Socket disconnected"));
  };
};

export const selectSocket = createSelector(
  (state) => state.entities.socket,
  (socket) => socket.connection
);

export default slice.reducer;
