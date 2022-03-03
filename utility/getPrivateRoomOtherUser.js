export default getPrivateRoomOtherUser = (members, currentUserId, allUsers) => {
  const otherUserId = members.filter((user) => user !== currentUserId)[0];
  const selectedUser = otherUserId ? otherUserId : currentUserId;
  return allUsers[selectedUser];
};
