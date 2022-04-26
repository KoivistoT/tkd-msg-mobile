import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import routes from "../app/navigation/routes";
import memoize from "proxy-memoize";
import sortArray from "../utility/sortArray";
// import { messagesRemoved } from "./msgStore";
const slice = createSlice({
  name: "rooms",
  initialState: {
    allRooms: [],
    allActiveRoomsIds: [],
    loading: false,
    activeRoomId: null,
    errorMessage: null,
    successMessage: null,
    newTasks: {},
    roomsFetched: false,
    lastNotificationResponseRoomId: null,
    typers: [],
    requestState: null,
  },
  reducers: {
    roomNewTasksResived: (rooms, action) => {
      // if (Object.keys(rooms.newTasks).includes(action.payload.taskId)) return;

      rooms.newTasks = Object.assign(rooms.newTasks, {
        [action.payload.taskId]: action.payload,
      });
    },
    notificationResponseResived: (rooms, action) => {
      rooms.lastNotificationResponseRoomId = action.payload;
    },
    notificationResponseCleared: (rooms, action) => {
      rooms.lastNotificationResponseRoomId = null;
    },
    // action => action handler
    activeRoomIdResived: (rooms, action) => {
      rooms.activeRoomId = action.payload;
    },
    setRoomLoadingToTrue: (rooms, action) => {
      rooms.loading = true;
    },
    setRoomLoadingToFalse: (rooms, action) => {
      rooms.loading = false;
    },
    activeRoomIdCleared: (rooms, action) => {
      rooms.activeRoomId = null;
    },
    roomStateCleared: (rooms, action) => {
      rooms.allRooms = [];
      rooms.allActiveRoomsIds = [];
      rooms.loading = false;
      rooms.activeRoomId = null;
      rooms.errorMessage = null;
      rooms.successMessage = null;
    },
    roomsErrorMessageCleared: (rooms, action) => {
      rooms.loading = false;

      rooms.errorMessage = null;
    },
    requestStarted: (rooms, action) => {
      rooms.requestState = "started";
      rooms.loading = true;
    },
    testijoo: (rooms, action) => {
      alert("testijoo", action.payload);
    },
    requestSucceed: (rooms, action) => {
      rooms.requestState = "succeed";
      rooms.loading = false;
    },
    requestStateCleared: (rooms, action) => {
      rooms.requestState = null;
    },

    roomTasksResived: (rooms, action) => {
      let newState = { ...rooms };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "roomNameChanged") {
          newState.allRooms[data.roomId].roomName = data.newRoomName;
        }
        if (taskType === "roomDescriptionChanged") {
          console.log(data, "tämä data");
          newState.allRooms[data.roomId].description = data.description;
        }
        if (taskType === "membersChanged") {
          try {
            newState.allRooms[data._id].members = data.members;
          } catch (error) {
            console.log(error, "code 39922");
          }
        }
        // if (taskType === "roomRemoved") {
        //   const currentRoomId = data;
        //   delete newState.allRooms[currentRoomId];
        //   newState.allActiveRoomsIds = newState.allActiveRoomsIds.filter(
        //     (roomId) => roomId !== currentRoomId
        //   );
        // }
        if (taskType === "roomArchived") {
          const currentRoomId = data;
          newState.allRooms[currentRoomId].status = "archived";
          newState.allActiveRoomsIds = newState.allActiveRoomsIds.filter(
            (roomId) => roomId !== currentRoomId
          );
        }
        if (taskType === "roomActivated") {
          const currentRoomId = data;
          newState.allRooms[currentRoomId].status = "active";
          newState.allActiveRoomsIds.push(currentRoomId);
        }
        if (taskType === "roomLatestMessageChanged") {
          // console.log(data.messageSum, "tämä päivittymä määrä viestejä");
          const { roomId } = data;
          newState.allRooms[roomId].latestMessage = data;
          newState.allRooms[roomId].messageSum = data.messageSum;
        }
      });

      rooms = newState;
    },
    roomLatestMessageChanged: (rooms, action) => {
      const { roomId } = action.payload.data;
      rooms.allRooms[roomId].latestMessage = action.payload.data;
      rooms.allRooms[roomId].messageSum = rooms.allRooms[roomId].messageSum + 1;
      // console.log(rooms.newTasks);

      delete rooms.newTasks[action.payload.taskId];
    },

    roomsResived: (rooms, action) => {
      // action.payload.forEach((item) => {
      //   rooms.allRooms = { [item._id]: item, ...rooms.allRooms };
      // });

      rooms.allRooms = action.payload;

      Object.keys(action.payload).forEach((id) => {
        if (action.payload[id].status === "active") {
          if (!rooms.allActiveRoomsIds.includes(id)) {
            // console.log("ei ole");
            rooms.allActiveRoomsIds.push(id);
          }
        }
      });

      rooms.roomsFetched = true;
      // console.log(rooms.allActiveRoomsIds, "actiivit");
      // console.log(
      //   rooms.allRooms["61e6a80eb30d002e91d67b5a"],
      //   "huoneet vastaanotettu, tässä yksi id:llä"
      // );
    },

    roomsError: (rooms, action) => {
      rooms.errorMessage = action.payload;
      rooms.requestState = "error";
      rooms.loading = false;
    },
    roomRemoved: (rooms, action) => {
      const currentRoomId = action.payload;
      delete rooms.allRooms[currentRoomId];
      rooms.allActiveRoomsIds = rooms.allActiveRoomsIds.filter(
        (roomId) => roomId !== currentRoomId
      );
    },

    roomCreated: (rooms, action) => {
      rooms.loading = false;
    },

    roomAdded: (rooms, action) => {
      const { _id: roomId, status } = action.payload;
      if (rooms.allRooms[roomId] !== undefined) {
        console.log("löytyy jo");
        return;
      } else {
        Object.assign(rooms.allRooms, { [roomId]: action.payload });

        if (status !== "draft" && !rooms.allActiveRoomsIds.includes(roomId)) {
          rooms.allActiveRoomsIds.push(roomId);
        }
      }

      // console.log(rooms.allRooms, "now");
    },
    typersResived: (rooms, action) => {
      rooms.typers = action.payload;
    },
  },
});

export const {
  roomsError,
  setLoading,
  requestStateCleared,
  roomsResived,
  activeRoomIdCleared,
  activeRoomIdResived,
  roomCreated,
  setRoomLoadingToFalse,
  roomLatestMessageChanged,
  setRoomLoadingToTrue,
  roomStateCleared,
  typersResived,
  roomsErrorMessageCleared,
  roomRemoved,
  roomNewTasksResived,
  roomAdded,
  notificationResponseResived,
  notificationResponseCleared,
  requestSucceed,

  roomNameChanged,
  roomTasksResived,
  testijoo,
  requestStarted,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl + "/rooms/";

export const createDirectRoom = (userId, otherUsers, roomName = "direct") =>
  apiCallBegan({
    url: url + "create_direct_room",
    method: "post",
    data: { userId, otherUsers, roomName },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const createChannel = (userId, roomName, description) =>
  apiCallBegan({
    url: url + "create_channel",
    method: "post",
    data: { userId, roomName, description },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const deleteRoom = (roomId, currentUserId, requestId) =>
  apiCallBegan({
    url: url + "delete_room/",
    method: "post",
    data: { roomId, currentUserId },
    followRequestState: requestId,
    onStart: requestStarted.type,
    onSuccess: requestSucceed.type,
    onError: roomsError.type,
  });

export const createPrivateRoom = (userId = null, otherUserId = null) =>
  apiCallBegan({
    url: url + "create_private_room",
    method: "post",
    data: { userId, otherUserId },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const changeRoomName = (roomId, newRoomName, requestId) =>
  apiCallBegan({
    url: url + "change_room_name",
    method: "post",
    data: { roomId, newRoomName },
    followRequestState: requestId,
    onStart: requestStarted.type,
    onSuccess: requestSucceed.type,
    onError: roomsError.type,
  });

export const changeRoomDescription = (roomId, description, currentUserId) =>
  apiCallBegan({
    url: url + "change_room_description",
    method: "post",
    data: { roomId, description, currentUserId },
    onStart: requestStarted.type,
    onSuccess: requestSucceed.type,
    onError: roomsError.type,
  });

export const change_members = (roomId, members, currentUserId) =>
  apiCallBegan({
    url: url + "change_members",
    method: "post",
    data: { roomId, members, currentUserId },
    // onSuccess: membersChanged.type,
    onError: roomsError.type,
  });

export const leave_room =
  (roomId, userId, requestId) => (dispatch, getState) => {
    // dispatch(fefawf)

    return dispatch(
      apiCallBegan({
        url: url + "leave_room",
        method: "post",
        data: { roomId, userId },
        followRequestState: requestId,
        onStart: requestStarted.type,
        onSuccess: requestSucceed.type,
        onError: roomsError.type,
      })
    );
  };

export const activateRoom = (roomId, userId, requestId) =>
  apiCallBegan({
    url: url + "activate_room/",
    method: "post",
    data: { roomId, userId },
    onStart: requestStarted.type,
    onSuccess: requestSucceed.type,
    onError: roomsError.type,
  });
export const activateDraftRoom = (roomId, userId) =>
  apiCallBegan({
    url: url + "activate_draft_room/",
    method: "post",
    data: { roomId, userId },
    // onStart: requestStarted.type,
    onSuccess: requestSucceed.type,
    onError: roomsError.type,
  });

export const selectRoomMembersById = (roomId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) =>
      rooms.allRooms[roomId] !== undefined ? rooms.allRooms[roomId].members : []
  );

export const selectRoomDataById = (roomId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) =>
      rooms.allRooms[roomId] !== undefined ? rooms.allRooms[roomId] : null
  );

export const selectMessageSumByRoomId = (store, roomId) =>
  store.getState().entities.rooms.allRooms[roomId]?.messageSum;

export const selectUserRooms = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.allRooms
);
export const selectNotificationResponse = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.lastNotificationResponseRoomId
);

export const selectRoomsFetched = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.roomsFetched
);
export const selectRoomsErrorMessage = (store) =>
  store.getState().entities.rooms.errorMessage;

export const selectRoomLoading = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.loading
);

export const selectRoomRequestState = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.requestState
);

export const selectAllActiveRoomsIdsOld = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.allActiveRoomsIds
);

export const selectActiveRoomId = (store) =>
  store.getState().entities.rooms.activeRoomId;

export const selectTypersByRoomId = (roomId, currentUserId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => {
      const index = rooms.typers.findIndex(
        (item) => item.roomId === roomId && item.userId !== currentUserId
      );

      if (index === -1) return null;
      const typer = rooms.typers[index]?.userId;
      return typer;
    }
  );

export const selectRoomMessageSumByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => rooms.allRooms[roomId]?.messageSum
  );

export const selectUnreadSum = (roomId) =>
  createSelector(
    (state) => state.entities.rooms.allRooms[roomId]?.messageSum,
    (state) => state.auth.currentUser.last_seen_messages,
    (messageSum, last_seen_messages) => {
      const condition =
        last_seen_messages[
          last_seen_messages.findIndex((object) => object.roomId === roomId)
        ];
      return condition !== undefined
        ? messageSum - condition.lastSeenMessageSum
        : 0;
    }
  );

// (state) => state.entities.bugs, // tämä eka menee tuohon toiseen, eli tässä otetaan bugs
// (state) => state.entities.projects,
// (bugs, projects) => bugs.list.filter((bug) => !bug.resolved) // jos bugs tai projects ei mu

export const selectAllActiveRoomsIds = memoize((state) => {
  const rooms = [];

  state.entities.rooms.allActiveRoomsIds.forEach((roomId) => {
    //latest message kysymysmerkki voi olla pois, jos aina on alussa viesti?

    rooms.push({
      roomId,
      lastMessageTimestamp:
        state.entities.rooms.allRooms[roomId]?.latestMessage?.createdAt ||
        state.entities.rooms.allRooms[roomId]?.createdAt,
    });
  });

  return sortArray(rooms, "lastMessageTimestamp", "DESC").map(
    (item) => item.roomId
  );
});
