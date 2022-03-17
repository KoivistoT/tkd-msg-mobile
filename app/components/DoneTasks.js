import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { removeTaskItemById } from "../../store/currentUser";
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

function DoneTasks() {
  const dispatch = useDispatch();
  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  const socket = useSelector(selectSocket);

  let msgPreviousDoneTask = useRef(null);
  useEffect(() => {
    // if (msgDoneTask && msgDoneTask !== msgPreviousDoneTask) {
    //   //milloin voi laittaa nulliksi msdDoneTAskin siellä storessa?, ettei vain laita työn alla olevaa nulliksi, vai pitäisikö sen olla array?
    //   dispatch(removeTaskItemById(currentUserId, msgDoneTask));
    //   // eiku tämä poistaa sen taskin sieltä,
    // }
  }, []);

  return <></>;
}

export default DoneTasks;
