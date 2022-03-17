import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  bucketCleared,
  clearBucket,
  doneBucketIdResived,
  removeBucketItemById,
  selectChangeBucket,
} from "../../store/currentUser";
import {
  getMessagesbyId,
  getRoomImages,
  messageDeleted,
  messagesRemoved,
  newMessageResived,
  readByRecepientsAdded,
} from "../../store/msgStore";
import {
  roomActivated,
  roomArchived,
  roomLatestMessageChanged,
  roomMembersChanged,
  roomNameChanged,
  roomRemoved,
} from "../../store/rooms";
import { selectSocket } from "../../store/socket";
import {
  newUserResived,
  userActivated,
  userArchived,
  userDataEdited,
  userDeleted,
  userTemporaryDeleted,
} from "../../store/users";
import { navigationRef } from "../navigation/rootNavigation";

function DispatchHandler() {
  // const changeBucket = useSelector(selectChangeBucket);
  // const dispatch = useDispatch();
  // const store = useStore();

  // const msgNewBucketTasks = useSelector(msgNewBucketTasks);
  // const currentUserId = store.getState().auth.currentUser._id;
  // const socket = useSelector(selectSocket);
  // useEffect(() => {
  //   // if (socket && changeBucket && changeBucket.length !== 0) {
  //   //   //   dispatch(clearBucket(currentUserId));
  //   //   changeBucket.forEach((element) => {
  //   //     const { type, data, bucketId } = element;
  //   //     if (
  //   //       store.getState().auth.currentUser.doneBucketIds.includes(bucketId)
  //   //     ) {
  //   //       console.log("on siellä jo tehty dispatchhandler");
  //   //       dispatch(
  //   //         removeBucketItemById(
  //   //           store.getState().auth.currentUser._id,
  //   //           bucketId
  //   //         )
  //   //       );
  //   //       return;
  //   //     }
  //   //     if (type === "roomAdded") {
  //   //       const { _id: roomId } = data;
  //   //       dispatch(roomAdded(data));
  //   //       dispatch(getMessagesbyId(roomId));
  //   //       dispatch(getRoomImages(roomId));
  //   //       socket.emit("subscribe", roomId);
  //   //       // const userId = getState().auth.currentUser._id;
  //   //       //jos tämä tuo erroria, kokeile tehdä sisälle toinen if, jossa tarkistaa, että huone löytyy
  //   //       // if (data.roomCreator === userId) {
  //   //       //   navigationRef.current.navigate(routes.MESSAGE_SCREEN, data);
  //   //       // }
  //   //     }
  //   //     if (type === "roomRemoved") {
  //   //       const roomId = data;
  //   //       socket.emit("unsubscribe", roomId);
  //   //       dispatch(roomRemoved(roomId));
  //   //       dispatch(messagesRemoved(roomId));
  //   //     }
  //   //     if (type === "newUser") {
  //   //       dispatch(newUserResived(data));
  //   //     }
  //   //     if (type === "userDeleted") {
  //   //       const userId = data;
  //   //       dispatch(userDeleted(userId));
  //   //     }
  //   //     if (type === "userTemporaryDeleted") {
  //   //       const userId = data;
  //   //       dispatch(userTemporaryDeleted(userId));
  //   //     }
  //   //     if (type === "userArchived") {
  //   //       const userId = data;
  //   //       dispatch(userArchived(userId));
  //   //     }
  //   //     if (type === "roomArchived") {
  //   //       const roomId = data;
  //   //       dispatch(roomArchived(roomId));
  //   //     }
  //   //     if (type === "roomNameChanged") {
  //   //       dispatch(roomNameChanged(data));
  //   //     }
  //   //     if (type === "userDataEdited") {
  //   //       dispatch(userDataEdited(data));
  //   //     }
  //   //     if (type === "readByRecepientsAdded") {
  //   //       dispatch(readByRecepientsAdded(data));
  //   //     }
  //   //     if (type === "userActivated") {
  //   //       const userId = data;
  //   //       dispatch(userActivated(userId));
  //   //     }
  //   //     if (type === "roomActivated") {
  //   //       const roomId = data;
  //   //       dispatch(roomActivated(roomId));
  //   //     }
  //   //     if (type === "membersChanged") {
  //   //       dispatch(roomMembersChanged(data));
  //   //     }
  //   //     if (type === "roomLatestMessageChanged") {
  //   //       dispatch(roomLatestMessageChanged(data));
  //   //     }
  //   //     if (type === "messageDeleted") {
  //   //       dispatch(messageDeleted(data));
  //   //     }
  //   //     if (type === "new message") {
  //   //       dispatch(newMessageResived(data));
  //   //     }
  //   //     dispatch(doneBucketIdResived(bucketId));
  //   //   });
  //   //   // dispatch(bucketCleared());
  //   // }
  // }, [msgNewBucketTasks, socket]);

  return <></>;
}

export default DispatchHandler;
