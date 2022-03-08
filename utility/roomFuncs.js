import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import sortArray from "./sortArray";

const getRoomTitle = (item, allUsers, currentUserId) => {
  // console.log("täällä menee"); // tämä päivittyy turhaa useasti
  if (allUsers === {} || !allUsers || !item) return;
  if (item.type === "private")
    return getPrivateRoomTitle(item.members, currentUserId, allUsers); //tämäkin voisi olla utility functiosta
  if (item.type === "direct") return getDirectRoomTitle(item.members, allUsers);
  return item.roomName;
};

const getRoomActiveMembersSum = (roomMembers, allUsers) => {
  let sum = 0;
  roomMembers.forEach((userId) => {
    allUsers[userId].status === "active" ? (sum += 1) : (sum = sum);
  });
  return sum;
};

const getPrivateRoomTitle = (members, currentUserId, allUsers) => {
  const otherUserId = members.filter((user) => user !== currentUserId)[0];
  const selectedUser = otherUserId ? otherUserId : currentUserId;
  return `${allUsers[selectedUser].firstName} ${allUsers[selectedUser].lastName}`;
};

const getPrivateRoomOtherUserName = (members, currentUserId, allUsers) => {
  const otherUserId = getPrivateRoomOtherUserId(members, currentUserId);

  return allUsers[otherUserId];
};

const getPrivateRoomOtherUserId = (members, currentUserId) => {
  const otherUserId = members.filter((user) => user !== currentUserId)[0];
  return otherUserId ? otherUserId : currentUserId;
};

const getDirectRoomTitle = (roomMembers, allUsersList) => {
  let roomTitle = "";
  roomMembers.forEach((userId) => {
    roomTitle += `${allUsersList[userId].firstName}, `;
  });

  const finalTitle = roomTitle.slice(0, roomTitle.length - 2);
  return finalTitle;
};

const startPrivateConversation = async (
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
    navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
    // setTimeout(() => {
    //    dispatch(setRoomLoadingToFalse());
    // }, 300); // tämä ei tarpeen, mutta menee sujuvammin
  } else {
    dispatchFunction();
  }
};
const isReplyItem = (replyMessageIds, roomId) => {
  const replyMessageData = replyMessageIds.filter(
    (item) => item.roomId === roomId
  );
  if (replyMessageData.length === 0) return false;
  return replyMessageData[0];
};

export default {
  getRoomTitle,
  getRoomActiveMembersSum,
  getPrivateRoomOtherUserName,
  getPrivateRoomOtherUserId,
  startPrivateConversation,
  isReplyItem,
};
