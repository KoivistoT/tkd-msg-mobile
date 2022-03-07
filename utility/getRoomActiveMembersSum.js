export default getRoomActiveMembersSum = (roomMembers, allUsers) => {
  let sum = 0;
  roomMembers.forEach((userId) => {
    allUsers[userId].status === "active" ? (sum += 1) : (sum = sum);
  });
  return sum;
};
