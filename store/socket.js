import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import io from "socket.io-client";
import settings from "../config/settings";
import {
  createSocketConnectionBegan,
  createSocketConnectionSuccess,
} from "./actions";
import {
  getMessagesbyId,
  messagesRemoved,
  newMessageResived,
} from "./messages";
import { roomAdded, roomRemoved } from "./rooms";

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
      // nämä testiä*********r
      // nämä testiä*********
      // socket.on("notification", (notif) => {
      //   console.log(notif, "tämä tulee socket.js ");
      // });
      // console.log(
      //   "pitää hakea käyttäjän huoneet, nyt hakee alussa kaikki huoneet käyttäjälle samalla tulisi hakea myös kaikki muu tieto yhdellä kutsulla, eli alkutiedot, init, eli viestit ja memberit. Tämä tapahtuu get current user by id app js ssä"
      // );

      socket.on("updates", (type, data) => {
        // tee casella

        if (type === "roomAdded") {
          const roomId = data[Object.keys(data)]._id; // vai olisiko data[0]._id tämä
          dispatch(roomAdded(data));
          dispatch(getMessagesbyId(roomId));
          socket.emit("subscribe", roomId);
        }
        if (type === "roomRemoved") {
          const roomId = Object.keys(data);
          dispatch(roomRemoved(roomId));
          dispatch(messagesRemoved(roomId));
          socket.emit("unsubscribe", roomId);
        }
        // console.log("updates", type, data);
      });
      socket.emit("identity", getState().auth.currentUser._id);
      if (!socket.connected) {
        dispatch(connectionError("Socket connection faild"));
      }
      getState().auth.currentUser.userRooms.forEach((roomId) => {
        socket.emit("subscribe", roomId);
      });

      socket.on("new message", (data) => {
        dispatch(newMessageResived(data.message));
      });
      // socket.on("new message", (message) => {
      //   console.log("tässä tuli uusi viesti", message);
      // });
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
    //saako nämä jotenkin nätemmin
    await getState().auth.currentUser.userRooms.forEach((roomId) => {
      console.log("lähti huoneesta roomId, unsbuscripe");
      getState().entities.socket.connection.emit("unsubscribe", roomId);
    });
    getState().entities.socket.connection.disconnect();
    dispatch(socketDisconnected("Socket disconnected"));
  };
};

export const saveSocket = (socket) => {};

export const selectSocket = (state) => state.entities.socket.connection;

export default slice.reducer;
