import getDirectRoomTitle from "./getDirectRoomTitle";
import getPrivateRoomTitle from "./getPrivateRoomTitle";

export default getRoomTitle = (item, allUsersList, currentUserId) => {
  if (allUsersList.length === 0 || !item) return;
  if (item.type === "private")
    return getPrivateRoomTitle(item.members, currentUserId, allUsersList); //tämäkin voisi olla utility functiosta
  if (item.type === "direct")
    return getDirectRoomTitle(item.members, allUsersList);
  return item.roomName;
};
