import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";

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

export default {
  getRoomTitle,
  getRoomActiveMembersSum,
  getPrivateRoomOtherUserName,
  getPrivateRoomOtherUserId,
};
