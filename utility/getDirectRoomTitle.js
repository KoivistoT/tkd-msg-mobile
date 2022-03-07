export default getDirectRoomTitle = (roomMembers, allUsers) => {
  let roomTitle = "";
  roomMembers.forEach((userId) => {
    roomTitle += `${allUsers[userId].firstName}, `;
  });

  const finalTitle = roomTitle.slice(0, roomTitle.length - 2);
  return finalTitle;
};
