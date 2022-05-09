import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import { navigate } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import settings from "../config/settings";
import moment from "moment";
import {
  removeOlderTasksItemsById,
  saveLastSeenMessageSum,
} from "./currentUser";

import {
  getMessagesbyId,
  getRoomImages,
  messagesRemoved,
  messageUpdatedTaskResived,
  msgTasksResived,
  newCurrentUserMessageResived,
} from "./msgStore";
import { startLoad, endLoad } from "./general";
import {
  roomAdded,
  roomRemoved,
  roomTasksResived,
  typersResived,
} from "./rooms";

import {
  saveEditedUserdata,
  usersOnlineResived,
  userTasksResived,
} from "./users";
import taskGroupTypes from "../config/taskGroupTypes";

const slice = createSlice({
  name: "socket",
  initialState: {
    connection: null,
  },
  reducers: {
    socketStoreCleared: (socket) => {
      socket.connection = null;
    },
    socketConnected: (socket, action) => {
      socket.connection = action.payload;
    },
    socketDisconnected: (socket) => {
      socket.connection = null;
    },
    connectionError: (socket) => {
      socket.connection = null;
    },
  },
});

export const {
  socketConnected,
  connectionError,
  socketDisconnected,
  socketStoreCleared,
} = slice.actions;

export const createSocketConnection = () => (dispatch, getState) => {
  const accountType = getState().auth.currentUser.accountType;

  try {
    const socket = io(settings.baseUrl, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      if (socket.connected) {
        dispatch(socketConnected(socket));
        socket.emit("identity", getState().auth.currentUser._id, accountType);
      } else {
        dispatch(connectionError("Socket connection faild"));
      }
    });

    socket.emit("userOnline", getState().auth.currentUser._id);
    socket.on("userOnline", (data) => {
      dispatch(usersOnlineResived(data));
    });
    socket.on("currentUserMessage", (data) => {
      dispatch(newCurrentUserMessageResived(data));
    });

    socket.on("typers", (data) => {
      dispatch(typersResived(data));
    });

    socket.on("updates", (taskGroups) => {
      const taskActions = (taskGroupType, data) => {
        if (taskGroupType === taskGroupTypes.roomAdded) {
          data.forEach((room) => {
            const {
              _id: roomId,
              roomCreator,
              messageSum,
              updatedAt,
              createdAt,
            } = room.data;
            dispatch(roomAdded(room.data));
            dispatch(getMessagesbyId(roomId));
            dispatch(getRoomImages(roomId));
            const userId = getState().auth.currentUser._id;
            dispatch(saveLastSeenMessageSum(userId, roomId, messageSum));

            if (roomCreator === userId && updatedAt === createdAt) {
              navigate(routes.MESSAGE_SCREEN, room.data);
            }
          });
        }

        if (taskGroupType === taskGroupTypes.msg) {
          dispatch(msgTasksResived(data));
        }

        if (taskGroupType === taskGroupTypes.messageUpdated) {
          dispatch(messageUpdatedTaskResived(data));
        }

        if (taskGroupType === taskGroupTypes.room) {
          dispatch(roomTasksResived(data));
        }
        if (taskGroupType === taskGroupTypes.user) {
          dispatch(userTasksResived(data));
        }

        if (taskGroupType === taskGroupTypes.roomRemoved) {
          data.forEach((room) => {
            const currentRoomId = room.data;

            if (getState().entities.rooms.activeRoomId === currentRoomId) {
              navigate(routes.ROOM_SCREEN);
            }
            setTimeout(() => {
              dispatch(roomRemoved(currentRoomId));
              dispatch(messagesRemoved(currentRoomId));
            }, 500);
          });
        }
      };

      taskGroups.data.forEach((group) => {
        const { taskGroupType, data } = group;

        if (data.length > 50) {
          dispatch(startLoad("Loading data..."));
          setTimeout(() => {
            taskActions(taskGroupType, data);
          }, 100);
        } else {
          taskActions(taskGroupType, data);
        }
      });
      dispatch(endLoad());

      if (taskGroups.latestTaskId) {
        dispatch(
          removeOlderTasksItemsById(
            getState().auth.currentUser._id,
            taskGroups.latestTaskId
          )
        );
      }
    });
  } catch (error) {
    dispatch(connectionError(error));
  }
};

export const disconnectSocket = (currentUserId) => {
  return (dispatch, getState) => {
    const socket = getState().entities.socket.connection;
    socket.emit("userOffline", currentUserId);
    socket.emit("notTyping", currentUserId);

    setTimeout(() => {
      socket.disconnect();
      dispatch(socketDisconnected("Socket disconnected"));
    }, 100);

    const payload = {
      currentUserId,
      fieldName: "lastPresent",
      value: moment().format(),
    };
    dispatch(saveEditedUserdata(payload));
  };
};

export const selectSocket = createSelector(
  (state) => state.entities.socket,
  (socket) => socket.connection
);

export default slice.reducer;
