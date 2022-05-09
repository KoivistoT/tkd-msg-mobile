import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan, apiCallSuccess } from "./actions";
import settings from "../config/settings";
import memoize from "proxy-memoize";
import sortArray from "../utility/sortArray";
import taskTypes from "../config/taskTypes";

const slice = createSlice({
  name: "rooms",
  initialState: {
    allRooms: [],
    allActiveRoomsIds: [],
    loading: false,
    activeRoomId: null,
    errorMessage: null,
    successMessage: null,
    roomsFetched: false,
    lastNotificationResponseRoomId: null,
    typers: [],
    requestState: null,
  },
  reducers: {
    notificationResponseResived: (rooms, action) => {
      rooms.lastNotificationResponseRoomId = action.payload;
    },
    notificationResponseCleared: (rooms) => {
      rooms.lastNotificationResponseRoomId = null;
    },
    activeRoomIdResived: (rooms, action) => {
      rooms.activeRoomId = action.payload;
    },
    activeRoomIdCleared: (rooms) => {
      rooms.activeRoomId = null;
    },
    roomStoreCleared: (rooms) => {
      rooms.allRooms = [];
      rooms.allActiveRoomsIds = [];
      rooms.loading = false;
      rooms.activeRoomId = null;
      rooms.errorMessage = null;
      rooms.successMessage = null;
      rooms.roomsFetched = false;
      rooms.lastNotificationResponseRoomId = null;
      rooms.typers = [];
      rooms.requestState = null;
    },
    roomsErrorMessageCleared: (rooms) => {
      rooms.loading = false;
      rooms.errorMessage = null;
    },
    requestStarted: (rooms) => {
      rooms.requestState = "started";
      rooms.loading = true;
    },
    requestSucceed: (rooms) => {
      rooms.requestState = "succeed";
      rooms.loading = false;
    },
    requestStateCleared: (rooms) => {
      rooms.requestState = null;
    },

    roomTasksResived: (rooms, action) => {
      const newState = { ...rooms };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === taskTypes.roomNameChanged) {
          newState.allRooms[data.roomId].roomName = data.newRoomName;
        }
        if (taskType === taskTypes.roomDescriptionChanged) {
          newState.allRooms[data.roomId].description = data.description;
        }
        if (taskType === taskTypes.membersChanged) {
          try {
            newState.allRooms[data._id].members = data.members;
          } catch (error) {
            rooms.loading = false;
          }
        }

        if (taskType === taskTypes.roomArchived) {
          const currentRoomId = data;
          newState.allRooms[currentRoomId].status = "archived";
          newState.allActiveRoomsIds = newState.allActiveRoomsIds.filter(
            (roomId) => roomId !== currentRoomId
          );
        }
        if (taskType === taskTypes.roomActivated) {
          const currentRoomId = data;
          newState.allRooms[currentRoomId].status = "active";
          newState.allActiveRoomsIds.push(currentRoomId);
        }
        if (taskType === taskTypes.roomLatestMessageChanged) {
          const { roomId } = data;
          newState.allRooms[roomId].latestMessage = data;
          newState.allRooms[roomId].messageSum = data.messageSum;
        }
      });

      rooms = newState;
    },

    roomsResived: (rooms, action) => {
      rooms.allRooms = action.payload;

      Object.keys(action.payload).forEach((id) => {
        if (action.payload[id].status === "active") {
          if (!rooms.allActiveRoomsIds.includes(id)) {
            rooms.allActiveRoomsIds.push(id);
          }
        }
      });

      rooms.roomsFetched = true;
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
    roomCreated: (rooms) => {
      rooms.loading = false;
    },

    roomAdded: (rooms, action) => {
      const { _id: roomId, status } = action.payload;
      if (rooms.allRooms[roomId] !== undefined) {
        return;
      } else {
        Object.assign(rooms.allRooms, { [roomId]: action.payload });
        if (status !== "draft" && !rooms.allActiveRoomsIds.includes(roomId)) {
          rooms.allActiveRoomsIds.push(roomId);
        }
      }
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
  roomStoreCleared,
  typersResived,
  roomsErrorMessageCleared,
  roomRemoved,
  roomAdded,
  notificationResponseResived,
  notificationResponseCleared,
  requestSucceed,
  roomTasksResived,
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

export const deleteRoom = (roomId, currentUserId) =>
  apiCallBegan({
    url: url + "delete_room/",
    method: "post",
    data: { roomId, currentUserId },
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

export const changeMembers = (roomId, members, currentUserId) =>
  apiCallBegan({
    url: url + "change_members",
    method: "post",
    data: { roomId, members, currentUserId },
    onSuccess: apiCallSuccess.type,
    onError: roomsError.type,
  });

export const leaveRoom = (roomId, userId, requestId) => (dispatch) => {
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

export const activateRoom = (roomId, userId) =>
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

export const selectActiveRoomId = (store) =>
  store.getState().entities.rooms.activeRoomId;

export const selectTypersByRoomId = (roomId, currentUserId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => {
      const index = rooms.typers.findIndex(
        (item) => item.roomId === roomId && item.userId !== currentUserId
      );

      if (index === -1) {
        return null;
      }

      return rooms.typers[index]?.userId;
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
    (state) => state.auth.currentUser.lastSeenMessages,
    (messageSum, lastSeenMessages) => {
      const condition =
        lastSeenMessages[
          lastSeenMessages.findIndex((object) => object.roomId === roomId)
        ];

      return condition !== undefined
        ? messageSum - condition.lastSeenMessageSum
        : 0;
    }
  );

export const selectAllActiveRoomsIds = memoize((state) => {
  const rooms = [];

  state.entities.rooms.allActiveRoomsIds.forEach((roomId) => {
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
