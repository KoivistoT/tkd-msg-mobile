const fullName = (item) => {
  if (!item) return "unknown user";
  if (item.firstName && item.lastName)
    return `${item.firstName} ${item.lastName}`;
  if (item.lastName) return item.lastName;
  if (item.firstName) return item.firstName;
  if (item.displayName) return item.displayName;
  return "unknown user";
};

const displayName = (allUsers, userId) => {
  const displayName = allUsers[userId]?.displayName;
  return displayName ? displayName : "unknown user";
};

export default {
  fullName,
  displayName,
};
