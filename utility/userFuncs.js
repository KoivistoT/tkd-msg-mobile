const fullName = (item) => {
  if (!item) return "unknown user";
  if (item.firstName && item.lastName)
    return `${item.firstName} ${item.lastName}`;
  if (item.lastName) return item.lastName;
  if (item.firstName) return item.firstName;
  if (item.displayName) return item.displayName;
  return "unknown user";
};

export default {
  fullName,
};
