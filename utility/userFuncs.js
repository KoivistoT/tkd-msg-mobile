const fullName = (item) => {
  if (!item) {
    return "unknown user";
  }
  if (item.firstName && item.lastName) {
    return `${item.firstName} ${item.lastName}`;
  }
  if (item.lastName) {
    return item.lastName;
  }
  if (item.firstName) {
    return item.firstName;
  }
  if (item.displayName) {
    return item.displayName;
  }

  return "unknown user";
};

const displayName = (allUsers, userId) => {
  const currentDisplayName = allUsers[userId]?.displayName;

  return currentDisplayName ? currentDisplayName : "unknown user";
};

const getFullName = (allUsers, userId) => {
  const firstName = allUsers[userId]?.firstName;
  const lastName = allUsers[userId]?.lastName;

  return `${firstName ? firstName : ""} ${lastName ? lastName : ""}`;
};

export default {
  fullName,
  displayName,
  getFullName,
};
