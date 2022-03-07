// import getDirectRoomTitle from "./getDirectRoomTitle"; // näitä ei kai tarvi
// import getPrivateRoomTitle from "./getPrivateRoomTitle"; // näitä ei kai tarvi

export default getRoomTitle = (item, allUsers, currentUserId) => {
  console.log("täällä menee");
  if (allUsers === {} || !allUsers || !item) return;
  if (item.type === "private")
    return getPrivateRoomTitle(item.members, currentUserId, allUsers); //tämäkin voisi olla utility functiosta
  if (item.type === "direct") return getDirectRoomTitle(item.members, allUsers);
  return item.roomName;
};
