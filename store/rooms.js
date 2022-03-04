import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";

const slice = createSlice({
  name: "rooms",
  initialState: {
    allRooms: [],
    loading: false,
    members: [],
    activeRoomId: null,
    errorMessage: null,
  },
  reducers: {
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
    activeRoomIdClearer: (rooms, action) => {
      rooms.activeRoomId = null;
    },
    requestStarted: (rooms, action) => {
      rooms.loading = true;
    },

    roomArchived: (rooms, action) => {
      rooms.allRooms[action.payload].status = "archived";
    },
    roomActivated: (rooms, action) => {
      rooms.allRooms[action.payload].status = "active";
    },
    roomsResived: (rooms, action) => {
      // action.payload.forEach((item) => {
      //   rooms.allRooms = { [item._id]: item, ...rooms.allRooms };
      // });

      rooms.allRooms = action.payload;

      // console.log(
      //   rooms.allRooms["61e6a80eb30d002e91d67b5a"],
      //   "huoneet vastaanotettu, tässä yksi id:llä"
      // );
    },

    membersChanged: (rooms, action) => {
      try {
        // console.log(action.payload, "tässä memberit");
        rooms.allRooms[action.payload._id].members = action.payload.members;
        // console.log(rooms.allRooms[action.payload._id].members, "täältä huoneen");
      } catch (error) {
        console.log(error, "code 39922");
      }
    },
    roomsError: (rooms, action) => {
      rooms.errorMessage = action.payload;
      rooms.loading = false;
    },

    membersResived: (rooms, action) => {
      rooms.members = action.payload.members;

      // console.log(rooms.messages.messages, "nämä jälkeen");
    },

    roomCreated: (rooms, action) => {
      rooms.loading = false;
    },
    roomAdded: (rooms, action) => {
      // console.log(action.payload);

      rooms.allRooms = Object.assign(rooms.allRooms, action.payload);

      // console.log(rooms.allRooms, "now");
    },
    roomRemoved: (rooms, action) => {
      delete rooms.allRooms[action.payload];
    },
  },
});

export const {
  roomsError,
  setLoading,
  roomsResived,
  activeRoomIdClearer,
  activeRoomIdResived,
  roomCreated,
  setRoomLoadingToFalse,
  setRoomLoadingToTrue,
  membersResived,
  membersChanged,
  roomAdded,
  roomRemoved,
  roomActivated,
  roomArchived,
  requestStarted,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const createDirectRoom = (userId, otherUsers, roomName = "direct") =>
  apiCallBegan({
    url: url + "/rooms/create_direct_room",
    method: "post",
    data: { userId, otherUsers, roomName },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const createChannel = (userId, roomName, description) =>
  apiCallBegan({
    url: url + "/rooms/create_channel",
    method: "post",
    data: { userId, roomName, description },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const deleteRoom = (roomId) =>
  apiCallBegan({
    url: url + "/rooms/delete_room/" + roomId,
    onStart: requestStarted.type,
    onError: roomsError.type,
  });

export const createPrivateRoom = (userId = null, otherUserId = null) =>
  apiCallBegan({
    url: url + "/rooms/create_private_room",
    method: "post",
    data: { userId, otherUserId },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const archiveRoomById = (roomId) =>
  apiCallBegan({
    url: url + "/rooms/archive_room/" + roomId,
    onStart: requestStarted.type,
    onError: roomsError.type,
  });

export const change_members = (roomId, members) =>
  apiCallBegan({
    url: url + "/rooms/change_members",
    method: "post",
    data: { roomId, members },
    onSuccess: membersChanged.type,
    onError: roomsError.type,
  });

export const leave_room = (roomId, userId) =>
  apiCallBegan({
    url: url + "/rooms/leave_room",
    method: "post",
    data: { roomId, userId },
    onSuccess: membersChanged.type,
    onError: roomsError.type,
  });

export const activateRoom = (roomId, userId) =>
  apiCallBegan({
    url: url + "/rooms/activate_room/",
    method: "post",
    data: { roomId, userId },
    onStart: requestStarted.type,
    onError: roomsError.type,
  });

//tämä toki id:llä ja eri lailla

export const getRoomMembersById = (roomId) =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) =>
      rooms.allRooms[roomId] !== undefined
        ? rooms.allRooms[roomId].members
        : null
  );

export const getUserRooms = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.allRooms
);

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => rooms.errorMessage
  );

export const getRoomLoadingStatus = () =>
  createSelector(
    (state) => state.entities.rooms,
    (rooms) => rooms.loading
  );
