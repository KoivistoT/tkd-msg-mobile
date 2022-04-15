import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import settings from "../config/settings";

import {
  getTasks,
  removeOlderTasksItemsById,
  removeTaskItemById,
  saveLastPresent,
  unseenMessagesRemoved,
} from "./currentUser";

import {
  getMessagesbyId,
  getRoomImages,
  messageDeleted,
  messagesRemoved,
  messageUpdatedTaskResived,
  msgNewTasksResived,
  msgTasksResived,
  newCurrentUserMessageResived,
  newMessageResived,
  readByRecepientsAdded,
  selectMsgNewTasks,
} from "./msgStore";
import { startLoad, endLoad } from "./general";
import {
  roomAdded,
  roomRemoved,
  roomArchived,
  roomActivated,
  roomNameChanged,
  membersChanged,
  roomMembersChanged,
  roomLatestMessageChanged,
  roomNewTasksResived,
  roomTasksResived,
  typersResived,
} from "./rooms";

import {
  newUserResived,
  userArchived,
  userDeleted,
  userActivated,
  userTemporaryDeleted,
  userDataEdited,
  usersOnlineResived,
  userTasksResived,
} from "./users";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";

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

        // dispatch(getTasks(getState().auth.currentUser._id, accountType));
      } else {
        console.log("socket connection error");
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
      // console.log("Nyt sai vastaan taskit", tasks.length);
      // if (getState().entities.general.doneTasksIds.includes(taskId)) {
      //   console.log("on siellä jo tehty socket");
      //   dispatch(
      //     removeTaskItemById(getState().auth.currentUser._id, taskId)
      //   );
      //   return;
      // }

      // tässä jaottelee
      let i = 0;
      // if (tasks.length > 40) {
      //   dispatch(startLoad());
      //   // console.log("oli yli");
      //   // return;
      // }
      // console.log(taskGroups);

      const taskActions = (taskGroupType, data) => {
        if (taskGroupType === "roomAdded") {
          data.forEach((room) => {
            const { _id: roomId, roomCreator } = room.data;
            dispatch(roomAdded(room.data));
            dispatch(getMessagesbyId(roomId));
            dispatch(getRoomImages(roomId));
            socket.emit("subscribe", roomId);
            const userId = getState().auth.currentUser._id;
            //jos tämä tuo erroria, kokeile tehdä sisälle toinen if, jossa tarkistaa, että huone löytyy
            //tämä voi olla ongelma, jos jostain syystä tekijä saa monta omaa
            if (roomCreator === userId) {
              navigationRef.current.navigate(routes.MESSAGE_SCREEN, room.data);
            }
          });
        }

        if (taskGroupType === "msg") {
          dispatch(msgTasksResived(data));
          // if (data.some((task) => task.taskType === "new message")) {

          // }
          // setTimeout(() => {
          //   asyncStorageFuncs.setData(
          //     "messageState",
          //     getState().entities.msgStore.messageStorage
          //   );
          // }, 1500);
        }
        if (taskGroupType === "messageUpdated") {
          dispatch(messageUpdatedTaskResived(data));
        }
        if (taskGroupType === "room") {
          dispatch(roomTasksResived(data));
          // setTimeout(() => {
          //   asyncStorageFuncs.setData(
          //     "roomState",
          //     getState().entities.rooms.allRooms
          //   );
          // }, 1500);
        }
        if (taskGroupType === "user") {
          dispatch(userTasksResived(data));
          // setTimeout(() => {
          //   asyncStorageFuncs.setData(
          //     "userState",
          //     getState().entities.users.allUsers
          //   );
          // }, 1500);
        }

        if (taskGroupType === "roomRemoved") {
          data.forEach((room) => {
            const currentRoomId = room.data;

            dispatch(roomRemoved(currentRoomId));
            dispatch(messagesRemoved(currentRoomId));
            socket.emit("unsubscribe", currentRoomId);
          });
        }
      };

      taskGroups.data.forEach((group) => {
        // console.log(group, "tässä gorup");
        const { taskGroupType, data } = group;

        if (data.length > 50) {
          dispatch(startLoad());
          setTimeout(() => {
            taskActions(taskGroupType, data);
          }, 100);
        } else {
          taskActions(taskGroupType, data);
        }
      });
      // console.log("tähän vielä viimeisin id");
      dispatch(endLoad());

      if (taskGroups.latestTaskId) {
        // console.log("käy täällä", taskGroups);
        dispatch(
          removeOlderTasksItemsById(
            getState().auth.currentUser._id,
            taskGroups.latestTaskId
          )
        );
      }
      // var end = +new Date();
      // var diff = end - start;
      // console.log(diff, "kului aikaa alussa");
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

export const disconnectSocket = (currentUserId) => {
  return async (dispatch, getState) => {
    const socket = getState().entities.socket.connection;
    socket.emit("userOffline", currentUserId);
    socket.emit("notTyping", currentUserId);
    // socket.off("userOnline"); // tätä ei kaiketi tarvi, kun socket on off kuitenkin

    await getState().auth.currentUser.userRooms.forEach((roomId) => {
      socket.emit("unsubscribe", roomId);
      socket.off("subscribe", roomId);
    });

    //timeout, koska muuten nuo edellä ei tahdo onnistua, esim userOffline ja notTyping ei mennyt ilman timeoutia, vain toinen meni
    setTimeout(() => {
      socket.disconnect();
      dispatch(socketDisconnected("Socket disconnected"));
    }, 100);
    // dispatch(unseenMessagesRemoved());
    dispatch(saveLastPresent());
  };
};

export const selectSocket = createSelector(
  (state) => state.entities.socket,
  (socket) => socket.connection
);

export default slice.reducer;
