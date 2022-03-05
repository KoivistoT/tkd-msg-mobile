import getDirectRoomTitle from "./getDirectRoomTitle"; // näitä ei kai tarvi
import getPrivateRoomTitle from "./getPrivateRoomTitle"; // näitä ei kai tarvi

export default getRoomTitle = (item, allUsersList, currentUserId) => {
  if (!allUsersList || !item) return;
  if (item.type === "private")
    return getPrivateRoomTitle(item.members, currentUserId, allUsersList); //tämäkin voisi olla utility functiosta
  if (item.type === "direct")
    return getDirectRoomTitle(item.members, allUsersList);
  return item.roomName;
};
