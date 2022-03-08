import getPrivateRoomOtherUserId from "./getPrivateRoomOtherUserId";

export default getPrivateRoomOtherUserName = (
  members,
  currentUserId,
  allUsers
) => {
  const otherUserId = getPrivateRoomOtherUserId(members, currentUserId);

  return allUsers[otherUserId];
};
