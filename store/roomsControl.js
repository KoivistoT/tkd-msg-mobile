import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import { createSelector } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "roomControl",
  initialState: {
    rooms: [],
    members: [],
    loading: false,
    errorMessage: null,
  },
  reducers: {
    // action => action handler
    requestStarted: (roomControl, action) => {
      roomControl.loading = true;
    },
    roomsResived: (roomControl, action) => {
      // action.payload.forEach((item) => {
      //   rooms.rooms = { [item._id]: item, ...rooms.rooms };
      // });

      roomControl.rooms = action.payload;
      roomControl.loading = false;
      // console.log(
      //   rooms.rooms["61e6a80eb30d002e91d67b5a"],
      //   "huoneet vastaanotettu, tässä yksi id:llä"
      // );
    },

    roomsError: (roomControl, action) => {
      roomControl.errorMessage = action.payload;
      console.log(action.payload, "epännoistu appcode 12333298321");
    },

    roomsControlMemberChanged: (roomControl, action) => {
      // console.log(action.payload, "memberChanged");
      try {
        roomControl.rooms[action.payload._id].members = action.payload.members;
      } catch (error) {
        console.log(error, "code 92992");
      }
    },
    roomsError: (roomControl, action) => {
      console.log(action.payload, "epäonnistui");
    },

    roomsErrorCleared: (roomControl, action) => {
      console.log("käy täälläkin joo");
      roomControl.errorMessage = null;
    },

    membersResived: (roomControl, action) => {
      roomControl.members = action.payload.members;
      roomControl.loading = false;
      // console.log(rooms.messages.messages, "nämä jälkeen");
    },

    roomCreated: (roomControl, action) => {
      console.log("huone luotu");
      roomControl.loading = false;
    },
    roomAdded: (roomControl, action) => {
      if (roomControl.rooms) {
        roomControl.rooms = Object.assign(roomControl.rooms, action.payload);
      } else {
        roomControl.rooms = action.payload;
      }
      // console.log(rooms.rooms, "now");
    },
    roomRemoved: (roomControl, action) => {
      delete roomControl.rooms[action.payload];
    },
  },
});

export const {
  roomsError,
  roomsResived,
  roomCreated,
  membersResived,
  roomsControlMemberChanged,
  roomAdded,
  roomRemoved,
  roomsErrorCleared,
  requestStarted,
} = slice.actions;
export default slice.reducer;

const url = settings.apiUrl;

export const getAllRooms = () =>
  apiCallBegan({
    url: url + "/rooms/all",
    onStart: requestStarted.type,
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
    // onSuccess: memberChanged.type,
    onError: roomsError.type,
  });

export const getErrorMessage = () =>
  createSelector(
    (state) => state.entities.roomsControl,
    (roomsControl) => roomsControl.errorMessage
  );

export const getRoomMembersById = (roomId) =>
  createSelector(
    (state) => state.entities.roomsControl,
    (roomsControl) => roomsControl.rooms[roomId].members
  );
