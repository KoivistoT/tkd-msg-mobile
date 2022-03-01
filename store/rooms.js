import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";

const slice = createSlice({
  name: "rooms",
  initialState: {
    allRooms: [],
    loading: false,
    members: [],
    activeRoomId: null,
  },
  reducers: {
    // action => action handler
    activeRoomIdResived: (rooms, action) => {
      rooms.activeRoomId = action.payload;
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

    memberChanged: (rooms, action) => {
      try {
        rooms.allRooms[action.payload._id].members = action.payload.members;
        // console.log(rooms.allRooms[action.payload._id].members, "täältä huoneen");
      } catch (error) {
        console.log(error, "code 39922");
      }
    },
    roomsError: (rooms, action) => {
      console.log(action.payload, "epäonnistui");
    },

    membersResived: (rooms, action) => {
      rooms.members = action.payload.members;

      // console.log(rooms.messages.messages, "nämä jälkeen");
    },

    roomCreated: (rooms, action) => {
      rooms.loading = false;
      console.log("huone luotu");
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
  roomsResived,
  activeRoomIdClearer,
  activeRoomIdResived,
  roomCreated,
  membersResived,
  memberChanged,
  roomAdded,
  roomRemoved,
  roomActivated,
  roomArchived,
  requestStarted,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getAllRooms = () =>
  apiCallBegan({
    url: url + "/rooms/all",
    onSuccess: roomsResived.type,
    onError: roomsError.type,
  });

export const createRoom = (
  roomName = "",
  type,
  userId = null,
  otherUserId = null
) =>
  apiCallBegan({
    url: url + "/rooms/create_room",
    method: "post",
    data: { roomName, type, userId, otherUserId },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const getMembersByRoomId = (roomId) =>
  apiCallBegan({
    url: url + "/rooms/members/" + roomId,
    onSuccess: membersResived.type,
    onError: roomsError.type,
  });

export const change_member = (roomId, userId, membership) =>
  apiCallBegan({
    url: url + "/rooms/change_membership",
    method: "post",
    data: { roomId, userId, membership },
    onSuccess: memberChanged.type,
    onError: roomsError.type,
  });

//tämä toki id:llä ja eri lailla

export const getRoomMembersById = (roomId) =>
  createSelector(
    (state) => state.entities.rooms,
    (roomsControl) => rooms.allRooms[roomId].members
  );

export const getUserRooms = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.allRooms
);
