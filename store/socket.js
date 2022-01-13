import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import settings from "../config/settings";
import {
  createSocketConnectionBegan,
  createSocketConnectionSuccess,
} from "./actions";

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
      console.log(action.payload, "appCode 12312593");
    },
    connectionError: (socket, action) => {
      console.log(action.payload, "tästä tuli2");
    },
  },
});

export const { socketConnected, connectionError, socketDisconnected } =
  slice.actions;

export const createSocketConnection = (userId) => (dispatch, getState) => {
  try {
    const socket = io(settings.baseUrl, {
      transports: ["websocket"],
      // jsonp: false,
    });
    socket.on("connect", () => {
      if (socket.connected) {
        dispatch(socketConnected(socket));
      }
      // nämä testiä*********
      // nämä testiä*********
      // nämä testiä*********
      socket.on("notification", (notif) => {
        console.log(notif, "tämä tulee socket.js ");
      });
      socket.emit("identity", Math.random());
      if (!socket.connected) {
        dispatch(connectionError("Socket connection faild"));
      }
      // nämä testiä*********
      // nämä testiä*********
      // nämä testiä*********
    });
  } catch (error) {
    dispatch(connectionError("Something faild"));
  }
};

export const disconnectSocket = (userId) => {
  return async (dispatch, getState) => {
    // console.log(action.payload, "tästä tuli1");
    getState().entities.socket.connection.disconnect();
    dispatch(socketDisconnected("Socket disconnected"));
  };
};

export const saveSocket = (socket) => {};

export const selectSocket = (state) => state.entities.socket.connection;

export default slice.reducer;
