export default getRoomActiveMembersSum = (roomMembers, allUsersList) => {
  let sum = 0;
  roomMembers.forEach((userId) => {
    allUsersList[userId].status === "active" ? (sum += 1) : (sum = sum);
  });
  return sum;
};
