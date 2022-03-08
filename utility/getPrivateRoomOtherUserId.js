export default getPrivateRoomOtherUserId = (members, currentUserId) => {
  const otherUserId = members.filter((user) => user !== currentUserId)[0];
  return otherUserId ? otherUserId : currentUserId;
};
