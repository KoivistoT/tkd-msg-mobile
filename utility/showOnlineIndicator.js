import roomFuncs from "./roomFuncs";

export default (usersOnline, members, currentUserId) => {
  if (Object.keys(usersOnline).length === 0) {
    return;
  }

  return usersOnline.includes(
    roomFuncs.getPrivateRoomOtherUserId(members, currentUserId)
  );
};
