import { navigate } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import sortArray from "./sortArray";

const getRoomTitle = (item, allUsers, currentUserId) => {
  if (allUsers === {} || !allUsers || !item) {
    return;
  }
  if (item.type === "private") {
    return getPrivateRoomTitle(item.members, currentUserId, allUsers);
  }
  if (item.type === "direct") {
    return getDirectRoomTitle(item.members, allUsers);
  }

  return item.roomName;
};

const getRoomActiveMembersSum = (roomMembers, allUsers) => {
  let sum = 0;
  roomMembers.forEach((userId) => {
    if (allUsers[userId].status === "active") {
      sum += 1;
    }
  });

  return sum;
};

const getPrivateRoomTitle = (members, currentUserId, allUsers) => {
  try {
    const otherUserId = members.filter((user) => user !== currentUserId)[0];
    const selectedUser = otherUserId ? otherUserId : currentUserId;

    return `${allUsers[selectedUser].firstName} ${allUsers[selectedUser].lastName}`;
  } catch (error) {
    return "";
  }
};

const getPrivateRoomOtherUserName = (members, currentUserId, allUsers) => {
  const otherUserId = getPrivateRoomOtherUserId(members, currentUserId);

  return allUsers[otherUserId];
};

const getPrivateRoomOtherUserId = (members, currentUserId) => {
  try {
    if (members.length === 1 && members[0] === currentUserId) {
      return currentUserId;
    }

    if (!members || members.length < 2 || !currentUserId) {
      return;
    }
    const otherUserId = members.filter((user) => user !== currentUserId)[0];

    return otherUserId ? otherUserId : currentUserId;
  } catch (error) {
    return null;
  }
};

const getDirectRoomTitle = (roomMembers, allUsersList) => {
  let roomTitle = "";
  roomMembers.forEach((userId) => {
    roomTitle += `${allUsersList[userId]?.firstName}, `;
  });

  return roomTitle.slice(0, roomTitle.length - 2);
};

const startPrivateConversation = (
  item,
  currentUserId,
  allRooms,
  dispatchFunction
) => {
  const sortedArray = sortArray([currentUserId, item._id]);
  const roomName = sortedArray[0] + sortedArray[1];
  const userRooms = Object.values(allRooms);
  const index = userRooms.findIndex((room) => room.roomName === roomName);

  if (index !== -1) {
    const roomData = userRooms[index];
    navigate(routes.MESSAGE_SCREEN, roomData);
  } else {
    dispatchFunction();
  }
};

const isReplyItem = (replyMessageIds, roomId) => {
  const replyMessageData = replyMessageIds.filter(
    (item) => item.roomId === roomId
  );
  if (replyMessageData.length === 0) {
    return false;
  }

  return replyMessageData[0];
};

const getPlaceholder = (
  roomData,
  allUsers,
  currentUserId,
  PLACEHOLDER_TEXT_MAX_LENGTH
) => {
  const roomTitle = getRoomTitle(roomData, allUsers, currentUserId);

  return `Message #${roomTitle}`.length > PLACEHOLDER_TEXT_MAX_LENGTH
    ? `Message #${roomTitle.slice(0, PLACEHOLDER_TEXT_MAX_LENGTH - 3)}...`
    : `Message #${roomTitle}`;
};

export default {
  getRoomTitle,
  getRoomActiveMembersSum,
  getPrivateRoomOtherUserName,
  getPrivateRoomOtherUserId,
  startPrivateConversation,
  isReplyItem,
  getPlaceholder,
};
