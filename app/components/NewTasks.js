import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  removeOlderTasksItemsById,
  removeTaskItemById,
  selectTasks,
} from "../../store/currentUser";
import { endLoad, startLoad } from "../../store/general";
import {
  getMessagesbyId,
  getRoomImages,
  messageDeleted,
  messagesRemoved,
  msgNewTasksResived,
  newMessageResived,
  readByRecepientsAdded,
} from "../../store/msgStore";
import {
  roomActivated,
  roomArchived,
  roomLatestMessageChanged,
  roomMembersChanged,
  roomNameChanged,
  roomNewTasksResived,
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

function NewTasks() {
  const dispatch = useDispatch();
  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  const socket = useSelector(selectSocket);
  const tasks = useSelector(selectTasks);

  useEffect(() => {
    if (tasks.length > 0) {
      let i = 0;
      if (tasks.length > 40) {
        // dispatch(startLoad());
      }
      // console.log(tasks, "hoitaa täällä");
      tasks.forEach((item) => {
        const { type, taskId } = item;

        if (type === "new message") {
          dispatch(msgNewTasksResived(item));
        }
        if (type === "roomLatestMessageChanged") {
          dispatch(roomNewTasksResived(item));
        }
        i++;

        if (i === tasks.length) {
          console.log(i, tasks.length, "nyt poistaa");
          //voiko olla niin, että task ei ole vielä storess, mutta tekee jo, tämän. teoriassa kyllä?
          dispatch(
            removeOlderTasksItemsById(
              store.getState().auth.currentUser._id,
              taskId
            )
          );
          dispatch(endLoad());
        }
      });
    }
  }, [tasks]);

  return <></>;
}

export default NewTasks;
