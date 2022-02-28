import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";

const slice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
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
    roomsResived: (rooms, action) => {
      // action.payload.forEach((item) => {
      //   rooms.rooms = { [item._id]: item, ...rooms.rooms };
      // });
      rooms.rooms = action.payload;

      // console.log(
      //   rooms.rooms["61e6a80eb30d002e91d67b5a"],
      //   "huoneet vastaanotettu, tässä yksi id:llä"
      // );
    },

    memberChanged: (rooms, action) => {
      try {
        rooms.rooms[action.payload._id].members = action.payload.members;
        // console.log(rooms.rooms[action.payload._id].members, "täältä huoneen");
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
      rooms.rooms = Object.assign(rooms.rooms, action.payload);
      // console.log(rooms.rooms, "now");
    },
    roomRemoved: (rooms, action) => {
      delete rooms.rooms[action.payload];
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

export const createRoom = (roomName, type) =>
  apiCallBegan({
    url: url + "/rooms/create_room",
    method: "post",
    data: { roomName, type },
    onStart: requestStarted.type,
    onSuccess: roomCreated.type,
    onError: roomsError.type,
  });

export const getMembersById = (roomId) =>
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

export const getRoomMembers = createSelector(
  (state) => state.entities.rooms,
  (rooms) => rooms.members
);
