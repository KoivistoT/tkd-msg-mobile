// import { createSlice } from "@reduxjs/toolkit";
// import { apiCallBegan } from "./actions";
// import settings from "../config/settings";
// import jwtDecode from "jwt-decode";
// import { createSelector } from "@reduxjs/toolkit";

// const slice = createSlice({
//   name: "members",
//   initialState: {
//     members: [],
//   },
//   reducers: {
//     // action => action handler

//     memberChanged: (members, action) => {
//       // console.log(action.payload, "memberChanged");
//       members.members = action.payload.members;
//     },

//     membersResived: (members, action) => {
//       members.members = action.payload.members;

//       // console.log(members.messages.messages, "nämä jälkeen");
//     },
//     membersError: (members, action) => {
//       console.log("members error", action.payload);
//     },
//   },
// });

// export const { membersResived, memberChanged, membersError } = slice.actions;
// export default slice.reducer;

// const url = settings.apiUrl;

// export const getMembersById = (roomId) =>
//   apiCallBegan({
//     url: url + "/rooms/members/" + roomId,
//     onSuccess: membersResived.type,
//     onError: membersError.type,
//   });

// export const change_member = (roomId, userId, membership) =>
//   apiCallBegan({
//     url: url + "/rooms/change_membership",
//     method: "post",
//     data: { roomId, userId, membership },
//     onSuccess: memberChanged.type,
//     onError: membersError.type,
//   });

// //tämä toki id:llä ja eri lailla

// export const getRoomMembers = createSelector(
//   (state) => state.entities.members,
//   (members) => members.members
// );
