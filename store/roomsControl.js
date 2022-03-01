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
      roomControl.rooms = action.payload;
      roomControl.loading = false;
    },

    roomsError: (roomControl, action) => {
      roomControl.errorMessage = action.payload;
      console.log(action.payload, "epännoistu appcode 12333298321");
    },

    roomsControlMembersChanged: (roomControl, action) => {
      //ei voi päivittää, jollei huoneita ole haettu, kun ei ole käynyt huoneissa controllissa, se ei tosin haittaa
      //ei voi päivittää, jollei huoneita ole haettu, kun ei ole käynyt huoneissa controllissa, se ei tosin haittaa
      //ei voi päivittää, jollei huoneita ole haettu, kun ei ole käynyt huoneissa controllissa, se ei tosin haittaa
      // pitää silti päivittää, jos joku muu on huoneissa silloin
      // pitää silti päivittää, jos joku muu on huoneissa silloin
      // pitää silti päivittää, jos joku muu on huoneissa silloin
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
    },
    roomsControlRoomRemoved: (roomControl, action) => {
      delete roomControl.rooms[action.payload];
    },
  },
});

export const {
  roomsError,
  roomsResived,
  roomCreated,
  membersResived,
  roomsControlMembersChanged,
  roomAdded,
  roomsControlRoomRemoved,

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

export const roomControlDeleteRoom = (roomId) =>
  apiCallBegan({
    url: url + "/rooms/delete_room/" + roomId,
    onStart: requestStarted.ype,
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
