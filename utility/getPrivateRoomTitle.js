export default getPrivateRoomTitle = (members, currentUserId, allUsers) => {
  const otherUserId = members.filter((user) => user !== currentUserId)[0];
  const selectedUser = otherUserId ? otherUserId : currentUserId;
  return `${allUsers[selectedUser].firstName} ${allUsers[selectedUser].lastName}`;
};
