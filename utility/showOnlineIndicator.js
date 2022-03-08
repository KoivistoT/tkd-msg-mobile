import roomFuncs from "./roomFuncs";

export default showOnlineIndicator = (item, usersOnline, currentUserId) => {
  if (Object.keys(usersOnline).length === 0) return;

  return (
    item.type === "private" &&
    usersOnline &&
    usersOnline.includes(
      roomFuncs.getPrivateRoomOtherUserId(item.members, currentUserId)
    )
  );
};
