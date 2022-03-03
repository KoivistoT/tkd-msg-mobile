export default getDirectRoomTitle = (roomMembers, allUsersList) => {
  let roomTitle = "";
  roomMembers.forEach((userId) => {
    roomTitle += `${allUsersList[userId].firstName}, `;
  });

  const finalTitle = roomTitle.slice(0, roomTitle.length - 2);
  return finalTitle;
};
