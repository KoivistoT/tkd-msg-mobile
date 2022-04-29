import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan, apiCallSuccess } from "./actions";
import settings from "../config/settings";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "msgStore",
  initialState: {
    allMessages: {},
    allMessageIds: {},
    images: {},
    replyMessageIds: [],
  },
  reducers: {
    msgStoreCleared: (msgStore, action) => {
      msgStore.allMessages = {};
      msgStore.allMessageIds = {};
      msgStore.images = {};
      msgStore.replyMessageIds = [];
    },
    allImagesResived: (msgStore, action) => {
      msgStore.images = action.payload;
    },
    replyMessageIdResived: (msgStore, action) => {
      msgStore.replyMessageIds.push(action.payload);
    },
    replyMessageIdCleared: (msgStore, action) => {
      msgStore.replyMessageIds = msgStore.replyMessageIds.filter(
        (message) => message.roomId !== action.payload
      );
    },
    oneRoomImagesResived: (msgStore, action) => {
      const { imageURLs, roomId } = action.payload;
      msgStore.images[roomId] = imageURLs;
    },

    messagesResived: (msgStore, action) => {
      let stateNow = { ...msgStore };

      Object.keys(action.payload).forEach((roomId) => {
        if (stateNow.allMessages[roomId]) {
          stateNow.allMessages[roomId].messages = Object.assign(
            stateNow.allMessages[roomId].messages,
            action.payload[roomId].messages
          );
        } else {
          stateNow.allMessages[roomId] = action.payload[roomId];
        }
      });

      Object.keys(action.payload).forEach((roomId) => {
        if (stateNow.allMessageIds[roomId]) {
          stateNow.allMessageIds[roomId] = [
            ...Object.keys(stateNow.allMessages[roomId].messages),
          ];
        } else {
          stateNow.allMessageIds[roomId] = Object.keys(
            action.payload[roomId].messages
          );
        }
      });

      msgStore = stateNow;
    },
    restMessagesResived: (msgStore, action) => {
      let stateNow = { ...msgStore };
      Object.keys(action.payload).forEach((currentRoomId) => {
        const newObject = Object.assign(
          stateNow.allMessages[currentRoomId].messages,
          action.payload[currentRoomId].messages
        );
        stateNow.allMessages[currentRoomId].messages = newObject;
      });

      Object.keys(action.payload).forEach((currentRoomId) => {
        stateNow.allMessageIds[currentRoomId] = [
          ...stateNow.allMessageIds[currentRoomId],
          ...Object.keys(action.payload[currentRoomId].messages),
        ];
      });

      msgStore = stateNow;
    },

    oneRoomMessagesResived: (msgStore, action) => {
      const { _id: roomId, messages } = action.payload;

      if (msgStore.allMessages) {
        msgStore.allMessages = Object.assign(msgStore.allMessages, {
          [roomId]: action.payload,
        });
        msgStore.allMessageIds = Object.assign(msgStore.allMessageIds, {
          [roomId]: Object.keys(messages),
        });
      } else {
        msgStore.allMessages = { [roomId]: action.payload };
        msgStore.allMessageIds = {
          [roomId]: Object.keys(messages),
        };
      }
    },
    messagesError: (msgStore, action) => {
      console.log("epännoistu2");
    },

    msgTasksResived: (msgStore, action) => {
      let newState = { ...msgStore };

      const newMessages = {};
      const editedRooms = [];

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "new message") {
          const { roomId, _id: messageId, type, imageURLs } = data;

          if (
            newState.allMessages[roomId].messages[messageId] !== undefined ||
            newState.allMessages[roomId] === undefined
          ) {
            return;
          }

          if (newMessages[roomId] !== undefined) {
            newMessages[roomId] = Object.assign(
              { [messageId]: data },

              newMessages[roomId]
            );
          } else {
            newMessages[roomId] = { [messageId]: data };
          }

          if (type === "image" && imageURLs.length > 0) {
            imageURLs.forEach((url) => {
              newState.images[roomId].unshift(url);
            });
          }

          if (!editedRooms.includes(roomId)) {
            editedRooms.push(roomId);
          }
        }
      });

      Object.keys(newMessages).forEach((roomId) => {
        newState.allMessages[roomId].messages = Object.assign(
          newMessages[roomId],
          newState.allMessages[roomId].messages
        );

        const sortedMessages = Object.entries(
          newState.allMessages[roomId].messages
        ).sort(function (a, b) {
          var nameA = a[1].createdAt;
          var nameB = b[1].createdAt;

          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });

        newState.allMessages[roomId].messages = sortedMessages.reduce(
          (newObject, item) => {
            newObject[item[0]] = item[1];
            return newObject;
          },
          {}
        );

        newState.allMessageIds[roomId] = sortedMessages.map((item) => item[0]);
      });

      msgStore = newState;

      let newState2 = { ...msgStore };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "messageDeleted") {
          const { roomId, messageId } = data;

          newState2.allMessages[roomId].messages[messageId].is_deleted = true;
        }
        if (!editedRooms.includes(data.roomId)) {
          editedRooms.push(data.roomId);
        }
      });

      msgStore = newState2;
    },
    messageUpdatedTaskResived: (msgStore, action) => {
      let newState = { ...msgStore };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "messageUpdated") {
          const { roomId, _id: messageId } = data;

          newState.allMessages[roomId].messages[messageId] = data;
        }
      });

      msgStore = newState;
    },

    newCurrentUserMessageResived: (msgStore, action) => {
      const {
        roomId: currentRoomId,
        _id: messageId,
        type,
        imageURLs,
      } = action.payload;

      try {
        msgStore.allMessages[currentRoomId].messages = Object.assign(
          msgStore.allMessages[currentRoomId].messages,
          { [messageId]: action.payload }
        );

        if (type === "image" && imageURLs.length > 0) {
          imageURLs.forEach((url) => {
            msgStore.images[currentRoomId].unshift(url);
          });
        }

        msgStore.allMessageIds[currentRoomId].unshift(messageId);
      } catch (error) {
        console.log(error, "code 9827661");
      }
    },

    messagesRemoved: (msgStore, action) => {
      const currentRoomId = action.payload;
      delete msgStore.allMessages[currentRoomId];
      delete msgStore.images[currentRoomId];
      delete msgStore.allMessageIds[currentRoomId];
    },
    oneMessageResived: (msgStore, action) => {
      const { _id: currentMessageId, roomId } = action.payload;

      try {
        msgStore.allMessages[roomId].messages[currentMessageId] =
          action.payload;
      } catch (error) {
        console.log(error, "code 766322");
      }
    },

    messageDeleted: (msgStore, action) => {
      const { roomId, messageId } = action.payload;
      msgStore.allMessages[roomId].messages[messageId].is_deleted = true;
    },

    reactionAdded: (msgStore, action) => {
      const { roomId, messageId, reaction, currentUserId } = action.payload;
      try {
        const reactionObject = { reactionByUser: currentUserId, reaction };
        const reactions =
          msgStore.allMessages[roomId].messages[messageId].reactions;

        const index = reactions.findIndex(
          (item) =>
            item.reactionByUser === currentUserId && item.reaction === reaction
        );

        index < 0 ? reactions.push(reactionObject) : reactions.splice(index, 1);
      } catch (error) {
        console.log(error, "code 9277711");
      }
    },

    addReactionError: (msgStore, action) => {
      console.log("add reaction error");
    },
  },
});

export const {
  messagesResived,

  oneRoomMessagesResived,

  messagesError,
  addReactionError,
  msgTasksResived,
  reactionAdded,
  messagesRemoved,
  oneRoomImagesResived,
  allImagesResived,
  restMessagesResived,
  replyMessageIdResived,
  replyMessageIdCleared,
  oneMessageResived,
  messageUpdatedTaskResived,
  newCurrentUserMessageResived,
  msgStoreCleared,
} = slice.actions;

export default slice.reducer;

const url = settings.apiUrl;

export const getMessagesbyId = (id) =>
  apiCallBegan({
    url: url + "/messages/" + id,
    onSuccess: oneRoomMessagesResived.type,
    onError: messagesError.type,
  });

export const getOneMessageById = (roomId, messageId) =>
  apiCallBegan({
    url: url + "/messages/get_one_message/",
    method: "post",
    data: {
      roomId,
      messageId,
    },
    onSuccess: oneMessageResived.type,
    onError: messagesError.type,
  });

export const addReaction = (roomId, messageId, reaction, currentUserId) =>
  apiCallBegan({
    url: url + "/messages/add_reaction/",
    method: "post",
    data: {
      roomId,
      messageId,
      reaction,
      currentUserId,
    },
    onSuccess: apiCallSuccess.type,
    onError: addReactionError.type,
  });

export const deleteMessageById = (roomId, messageId, currentUserId) =>
  apiCallBegan({
    url: url + "/messages/delete/",
    method: "post",
    data: {
      roomId,
      messageId,
      currentUserId,
    },

    onSuccess: apiCallSuccess.type,
    onError: messagesError.type,
  });

export const getRoomImages = (id) =>
  apiCallBegan({
    url: url + "/messages/room_images/" + id,
    onSuccess: oneRoomImagesResived.type,
    onError: messagesError.type,
  });

export const getRestMessages = (object) =>
  apiCallBegan({
    url: url + "/initial/rest_messages/",
    method: "post",
    data: object,
    onSuccess: restMessagesResived.type,
    onError: messagesError.type,
  });

export const selectLastSeenMessageIdByRoomId = (store, roomId, index) =>
  store.getState().entities.msgStore.allMessageIds[roomId]
    ? store.getState().entities.msgStore.allMessageIds[roomId][index]
    : null;

export const selectRoomMessagesById = (store, roomId) =>
  store.getState().entities.msgStore.allMessages[roomId].messages;

export const selectRoomMessagesIdsById = (store, roomId) =>
  store.getState().entities.msgStore.allMessageIds[roomId];

export const selectIsLastMessageSentByCurrentUser = (
  store,
  currentUserId,
  lastMessageId,
  roomId
) =>
  store.getState().entities.msgStore.allMessages[roomId]?.messages[
    lastMessageId
  ]?.postedByUser === currentUserId;

export const selectReplyItemIds = createSelector(
  (state) => state.entities.msgStore,
  (msgStore) => msgStore.replyMessageIds
);

export const selectRoomImagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.images[roomId]
  );

export const selectMessageById = (roomId, messageId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId].messages[messageId]
  );

export const selectReactionsMessageById = (roomId, messageId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId].messages[messageId].messageBody
  );

export const selectRoomMessageIdsByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessageIds[roomId]
  );
