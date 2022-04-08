import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import jwtDecode from "jwt-decode";
import { createSelector } from "reselect";
import { requestStarted, requestSucceed } from "./rooms";
import sortArray from "../utility/sortArray";
import sortObjectsByfield from "../utility/sortObjectsByfield";
const slice = createSlice({
  name: "msgStore",
  initialState: {
    allMessages: {},
    messageSendError: null,
    allMessageIds: {},
    images: {},
    replyMessageIds: [],
    newTasks: {},
    messageStorage: {},
    messageIdStorage: {},
    activeRoomId: null,
  },
  reducers: {
    allImagesResived: (msgStore, action) => {
      msgStore.images = action.payload;
    },
    msgNewTasksResived: (msgStore, action) => {
      // if (Object.keys(msgStore.newTasks).includes(action.payload.taskId))
      //   return;

      msgStore.newTasks = Object.assign(msgStore.newTasks, {
        [action.payload.taskId]: action.payload,
      });
    },
    readByRecepientsAdded: (msgStore, action) => {
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // console.log(
      //   "miten tämä voisi päivittää vain kerran?, vai voiko edes. tarviiko?"
      // );
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      try {
        action.payload.forEach((item) => {
          msgStore.allMessages[item.roomId].messages[
            item._id
          ].readByRecipients = item.readByRecipients;
        });
      } catch (error) {
        console.log(error, "ei ollut viestiä");
      }

      // console.log(
      //   msgStore.allMessages[item.roomId].messages[item.messageId]
      //     .readByRecipients
      // );
    },
    replyMessageIdResived: (msgStore, action) => {
      msgStore.replyMessageIds.push(action.payload);
      // console.log(msgStore.replyMessageIds);
    },
    replyMessageIdCleared: (msgStore, action) => {
      msgStore.replyMessageIds = msgStore.replyMessageIds.filter(
        (message) => message.roomId !== action.payload
      );
      // console.log(msgStore.replyMessageIds, "Tässä reply idt");
    },
    oneRoomImagesResived: (msgStore, action) => {
      const { imageURLs, roomId } = action.payload;
      msgStore.images[roomId] = imageURLs;
    },
    msgStoreActiveRoomIdCleared: (msgStore, action) => {
      msgStore.activeRoomId = null;
    },
    msgStoreActiveRoomIdResived: (msgStore, action) => {
      msgStore.activeRoomId = action.payload;
    },

    messagesResived: (msgStore, action) => {
      // msgStore.allMessages = action.payload;
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
        // rooms.allActiveRoomsIds.push(id);
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

      Object.keys(action.payload).forEach((roomId) => {
        if (!stateNow.messageStorage[roomId]) {
          stateNow.messageStorage = Object.assign(stateNow.messageStorage, {
            [roomId]: { messages: {} },
          });
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
        // rooms.allActiveRoomsIds.push(id);

        stateNow.allMessageIds[currentRoomId] = [
          ...stateNow.allMessageIds[currentRoomId],
          ...Object.keys(action.payload[currentRoomId].messages),
        ];
      });

      msgStore = stateNow;
    },

    oneRoomMessagesResived: (msgStore, action) => {
      const { _id: roomId, messages } = action.payload;

      //tässä ei leikkaa viestejä storageen, jos niitä on paljon
      if (msgStore.allMessages) {
        msgStore.allMessages = Object.assign(msgStore.allMessages, {
          [roomId]: action.payload,
        });

        //tätä ei testattu
        // const roomId = Object.keys(action.payload);
        msgStore.allMessageIds = Object.assign(msgStore.allMessageIds, {
          [roomId]: Object.keys(messages),
        });
        msgStore.messageStorage = Object.assign(msgStore.messageStorage, {
          [roomId]: { messages: {} },
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

    messagesFromStorageFetched: (msgStore, action) => {
      const currentRoomId = action.payload;
      msgStore.allMessages[currentRoomId].messages = Object.assign(
        msgStore.allMessages[currentRoomId].messages,
        msgStore.messageStorage[currentRoomId].messages
      );

      msgStore.allMessageIds[currentRoomId] = [
        ...msgStore.allMessageIds[currentRoomId],
        ...Object.keys(msgStore.messageStorage[currentRoomId].messages),
      ];

      msgStore.messageStorage[currentRoomId].messages = {};
    },
    // msgTasksResived: (msgStore, action) => {
    //   let newState = { ...msgStore };

    //   //varmista että taskit tulee aikajärjestyksessä
    //   //varmista että taskit tulee aikajärjestyksessä
    //   //varmista että taskit tulee aikajärjestyksessä
    //   var start = null;
    //   if (action.payload.length > 50) {
    //     start = +new Date();
    //   }

    //   action.payload.forEach((task) => {
    //     const { taskType, data } = task;

    //     if (taskType === "new message") {
    //       const { roomId, _id: messageId, type, imageURLs } = data;

    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       if (
    //         newState.allMessages[roomId].messages[messageId] !== undefined ||
    //         newState.allMessages[roomId] === undefined
    //       ) {
    //         // console.log("löytyy jo viesti, tai huonetta ei ole");
    //         return;
    //       }

    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ
    //       // TESTAILE TÄTÄ

    //       newState.allMessages[roomId].messages = Object.assign(
    //         { [messageId]: data },
    //         newState.allMessages[roomId].messages
    //       );

    //       const sortedMessages = Object.entries(
    //         newState.allMessages[roomId].messages
    //       ).sort(function (a, b) {
    //         var nameA = a[1].createdAt;
    //         var nameB = b[1].createdAt;

    //         if (nameA > nameB) {
    //           return -1;
    //         }
    //         if (nameA < nameB) {
    //           return 1;
    //         }
    //         return 0;
    //       });

    //       newState.allMessages[roomId].messages = sortedMessages.reduce(
    //         (newObject, item) => {
    //           newObject[item[0]] = item[1];
    //           return newObject;
    //         },
    //         {}
    //       );

    //       newState.allMessageIds[roomId] = sortedMessages.map(
    //         (item) => item[0]
    //       );

    //       if (type === "image" && imageURLs.length > 0) {
    //         imageURLs.forEach((url) => {
    //           newState.images[roomId].unshift(url);
    //         });
    //       }
    //     }

    //     if (taskType === "messageDeleted") {
    //       const { roomId, messageId } = data;
    //       newState.allMessages[roomId].messages[messageId].is_deleted = true;
    //     }

    //     //onko viestiä
    //   });
    //   if (start) {
    //     var end = +new Date();
    //     var diff = end - start;
    //     alert(diff, "kului aikaa");
    //   }

    //   msgStore = newState;

    //   // var targetMessages = msgStore.allMessages[roomId].messages;

    //   // delete msgStore.newTasks[action.payload.taskId];
    // },
    msgTasksResived: (msgStore, action) => {
      let newState = { ...msgStore };

      var start = null;
      if (action.payload.length > 50) {
        start = +new Date();
      }

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
            // console.log("löytyy jo viesti, tai huonetta ei ole");
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
        // newState.allMessageIds[roomId] = Object.keys(
        //   newState.allMessages[roomId].messages
        // );
      });

      if (start) {
        var end = +new Date();
        var diff = end - start;
        // alert(diff, "kului aikaa");
      }

      msgStore = newState;

      //tämä, jotta menee nopeammin uudet viestit
      let newState2 = { ...msgStore };

      //tämä pitää tehdä uusiksi, koska
      //tähän myös edited message
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

      //siirrä tallennettavaksi alkaa
      //siirrä tallennettavaksi alkaa
      //siirrä tallennettavaksi alkaa
      // let newState3 = { ...msgStore.messageStorage };
      // editedRooms.forEach((currentRoomId) => {
      //   const toStorage = Object.entries(
      //     msgStore.allMessages[currentRoomId].messages
      //   ).slice(0, 30);

      //   newState3[currentRoomId].messages = toStorage.reduce(
      //     (newObject, item) => {
      //       newObject[item[0]] = item[1];
      //       return newObject;
      //     },
      //     {}
      //   );
      // });
      // msgStore.messageIdStorage = newState3;
      //siirrä tallennettavaksi loppu
      //siirrä tallennettavaksi loppu
      //siirrä tallennettavaksi loppu

      // var targetMessages = msgStore.allMessages[roomId].messages;

      // delete msgStore.newTasks[action.payload.taskId];
    },
    roomMessagesMoveToStorage: (msgStore, action) => {
      Object.keys(msgStore.allMessages).forEach((currentRoomId) => {
        if (
          msgStore.allMessageIds[currentRoomId].length > 200
          // &&
          // msgStore.activeRoomId !== currentRoomId
        ) {
          const toStorage = Object.entries(
            msgStore.allMessages[currentRoomId].messages
          ).slice(
            100,
            Object.keys(msgStore.allMessages[currentRoomId].messages).length
          );

          const leave = Object.entries(
            msgStore.allMessages[currentRoomId].messages
          ).slice(0, 100);

          msgStore.messageStorage[currentRoomId].messages = Object.assign(
            msgStore.messageStorage[currentRoomId].messages,
            toStorage.reduce((newObject, item) => {
              newObject[item[0]] = item[1];
              return newObject;
            }, {})
          );

          msgStore.allMessages[currentRoomId].messages = leave.reduce(
            (newObject, item) => {
              newObject[item[0]] = item[1];
              return newObject;
            },
            {}
          );

          const leaveIds = msgStore.allMessageIds[currentRoomId].slice(0, 100);

          msgStore.allMessageIds[currentRoomId] = leaveIds;
        }
        // console.log(
        //   msgStore.allMessageIds[currentRoomId].length,
        //   Object.keys(msgStore.messageStorage[currentRoomId].messages).length,
        //   Object.keys(msgStore.allMessages[currentRoomId].messages).length
        // );
      });
    },
    newCurrentUserMessageResived: (msgStore, action) => {
      // console.log(action.payload, "oma viesti");

      const {
        roomId: currentRoomId,
        _id: messageId,
        type,
        imageURLs,
      } = action.payload;

      // if (
      //   newState.allMessages[currentRoomId].messages[messageId] !== undefined ||
      //   newState.allMessages[currentRoomId] === undefined
      // ) {
      //   // console.log("löytyy jo viesti, tai huonetta ei ole");
      //   return;
      // }

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
    messageSent: (msgStore, action) => {
      // console.log("message lähetetty");
      // console.log(action.payload, "lähetetty viesti");
      // console.log(messages.messages);
      // Object.assign(
      //   msgStore.allMessages[action.payload.message.roomId].messages,
      //   action.payload
      // );
      // msgStore.allMessages[action.payload.message.roomId].messages.push(
      //   action.payload.message
      // );
      // tässä respondissa olisi toki viesti, mutta haluan sen aina samasta paikasta kaikille
      //   msgStore.allMessages.messages.push(action.payload.message);
    },
    messagesRemoved: (msgStore, action) => {
      const currentRoomId = action.payload;
      delete msgStore.allMessages[currentRoomId];
      delete msgStore.images[currentRoomId];
      delete msgStore.allMessageIds[currentRoomId];
      delete msgStore.messageStorage[currentRoomId];
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
      // console.log(
      //   "täällä pitää vielä tämä tehdä ja sit, että näyttää messagen is deleted messagelistalla"
      // );
      const { roomId, messageId } = action.payload;

      msgStore.allMessages[roomId].messages[messageId].is_deleted = true;

      // msgStore.allMessages[Object.keys(action.payload)];
      // .messages[
      //   Object.values(action.payload).messageId
      // ].is_deleted = true;
    },

    messageSendError: (msgStore, action) => {
      msgStore.messageSendError = action.payload;
      // console.log("message ei lähetetty", action.payload);
    },
    messageSendErrorCleared: (msgStore, action) => {
      msgStore.messageSendError = null;
    },
    reactionAdded: (msgStore, action) => {
      console.log("add reaction");
    },
    addReactionError: (msgStore, action) => {
      console.log("add reaction error");
    },
  },
});

export const {
  messagesResived,
  roomMessagesMoveToStorage,
  msgNewTasksResived,
  oneRoomMessagesResived,
  messageSendError,
  messagesFromStorageFetched,
  messageSent,
  messagesError,
  addReactionError,
  messageSendErrorCleared,
  msgTasksResived,
  reactionAdded,
  messagesRemoved,
  oneRoomImagesResived,
  allImagesResived,
  restMessagesResived,
  replyMessageIdResived,
  replyMessageIdCleared,
  readByRecepientsAdded,
  oneMessageResived,
  msgStoreActiveRoomIdCleared,
  msgStoreActiveRoomIdResived,
  newCurrentUserMessageResived,
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
    onSuccess: reactionAdded.type,
    onError: addReactionError.type,
  });

export const deleteMessageById = (roomId, messageId) =>
  apiCallBegan({
    url: url + "/messages/delete/",
    method: "post",
    data: {
      roomId,
      messageId,
    },

    onSuccess: requestSucceed.type,
    onError: messagesError.type,
  });

export const sendMessage =
  (
    message = "",
    roomId = "",
    messageType = "text",
    imageURLs = null,
    replyMessageId = null
  ) =>
  (dispatch, getState) => {
    const userId = getState().auth.currentUser._id;

    return dispatch(
      apiCallBegan({
        data: {
          messageBody: message,
          roomId,
          userId,
          messageType,
          imageURLs,
          replyMessageId,
        },
        onStart: messageSendErrorCleared.type,
        method: "post",
        url: url + "/messages/send_message",
        onSuccess: messageSent.type,
        onError: messageSendError.type,
      })
    );
  };

export const test = () =>
  apiCallBegan({
    url: url + "/messages/test2",
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

export const selectRoomMessagesByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) => msgStore.allMessages[roomId]?.messages
  );

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

export const selectRoomMessageIdsByRoomId = (roomId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) =>
      //  {
      //   //tämä tsekkaus on turha sitten jos alussa sinne luodaan heti viesti
      //   console.log("computing");
      //   const messages = sortObjectsByfield(
      //     msgStore.allMessages[roomId].messages,
      //     "createdAt"
      //   );
      //   return messages.map((message) => message._id);
      // }
      // msgStore.allMessageIds[roomId] !== undefined &&
      // msgStore.allMessageIds[roomId].length !== 0
      //   ? [...msgStore.allMessageIds[roomId]]
      //   : []

      msgStore.allMessageIds[roomId]
  );

export const selectMessageReadByRecepients = (roomId, messageId) =>
  createSelector(
    (state) => state.entities.msgStore,
    (msgStore) =>
      msgStore.allMessages[roomId].messages[messageId].readByRecipients
  );

export const selectNewTasksCompinedOldest = createSelector(
  (state) => state.entities.msgStore,
  (state) => state.entities.rooms,
  (msgStore, rooms) =>
    // Object.assign({ ...msgStore.newTasks }, { ...rooms.newTasks })

    {
      let allTasks = Object.assign(
        { ...msgStore.newTasks },
        { ...rooms.newTasks }
      );
      // console.log(allTasks);
      if (Object.keys(allTasks).length !== 0) {
        const sortedKeys = sortArray(Object.keys(allTasks));

        return {
          newest: allTasks[sortedKeys[0]],
          oldestId: sortedKeys[sortedKeys.length - 1],
        };
      } else {
        return null;
      }
    }
);
